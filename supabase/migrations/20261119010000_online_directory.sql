begin;
create index if not exists arena_players_last_seen_idx on arena_private.players(last_seen) where last_seen is not null;

-- Heartbeats belong to the authenticated game session and always use its registered IGN.
create function public.arena_online_directory(operation text default 'list', display_name text default null)
returns jsonb language plpgsql security definer set search_path=pg_catalog as $$
declare
 viewer uuid:=auth.uid(); cutoff timestamptz:=statement_timestamp()-interval '90 seconds'; response jsonb;
begin
 perform arena_private.require_session();
 if viewer is null then raise exception 'Sign in to view online trainers';end if;
 if operation='leave' then
  update arena_private.players set last_seen=null where id=viewer;
  return '{}'::jsonb;
 end if;
 if operation is null or operation not in ('list','count') then raise exception 'Unknown directory action';end if;
 if not exists(select 1 from arena_private.players p where p.id=viewer) and length(trim(display_name)) between 2 and 24 then
  begin
   perform public.arena_online('profile',jsonb_build_object('name',trim(display_name)));
  exception when unique_violation then
   -- The existing online registration form lets the trainer choose another IGN.
   null;
  end;
 end if;
 update arena_private.players set last_seen=statement_timestamp() where id=viewer
  and (last_seen is null or last_seen<statement_timestamp()-interval '15 seconds');
 if operation='list' then
  select jsonb_build_object('count',count(*),'players',coalesce(jsonb_agg(
   jsonb_build_object('name',p.name,'self',p.id=viewer) order by lower(p.name),p.name),'[]'::jsonb))
  into response from arena_private.players p where p.last_seen>cutoff;
 else
  select jsonb_build_object('count',count(*)) into response from arena_private.players p where p.last_seen>cutoff;
 end if;
 return response;
end $$;
revoke all on function public.arena_online_directory(text,text) from public,anon;
grant execute on function public.arena_online_directory(text,text) to authenticated;

create or replace function public.arena_trainer_card(trainer_name text default null)
returns jsonb language plpgsql stable security definer set search_path=pg_catalog as $$
declare
 viewer uuid := auth.uid();
 is_friend boolean := false; is_online boolean; audience text;
 owner_row arena_private.players%rowtype;
 snapshot jsonb; progress jsonb; card jsonb; career jsonb; campaign jsonb;
 online_info jsonb; details jsonb; registered text[]; standard_badges jsonb; master_badges jsonb;
begin
 perform arena_private.require_session();
 if viewer is null then raise exception 'Sign in to view trainer cards'; end if;
 if trainer_name is null then
  select p.* into owner_row from arena_private.players p where p.id=viewer;
 else
  select p.* into owner_row from arena_private.players p where p.name=trainer_name;
 end if;
 if owner_row.id is null then return '{}'::jsonb; end if;
 if trainer_name is not null then
  is_online:=coalesce(owner_row.last_seen>statement_timestamp()-interval '90 seconds',false);
  if owner_row.id<>viewer then
   select exists(select 1 from arena_private.friends f where f.accepted and
    ((f.sender=viewer and f.recipient=owner_row.id) or (f.sender=owner_row.id and f.recipient=viewer))) into is_friend;
   if not is_online and not is_friend then return '{}'::jsonb;end if;
  end if;
  select s.save_data into snapshot from public.arena_saves s where s.user_id=owner_row.id;
  progress:=arena_private.market_entry(snapshot,'pokemon-arena-wild-progress','{}');
  card:=coalesce(progress->'trainerCard','{}');
  audience:=case when card->>'audience' in ('online','friends','self') then card->>'audience'
   when card->'share'='true'::jsonb then 'friends' when card->'share'='false'::jsonb then 'self' else 'online' end;
  if owner_row.id<>viewer and (snapshot is null or not (
    (is_online and audience='online') or (is_friend and audience in ('friends','online')))) then
   if not is_online then return '{}'::jsonb;end if;
   return jsonb_build_object('profile',jsonb_build_object('publicOnly',true,'name',owner_row.name,
    'style',jsonb_build_object('scene',left(card->>'scene',12),'look',left(card->>'look',12),'accent',left(card->>'accent',12)),
    'laurel',coalesce(progress->'campaign'->'laurel'='true'::jsonb,false) and arena_private.campaign_complete(snapshot,'Kalos')),
    'online',jsonb_build_object('wins',owner_row.wins,'losses',owner_row.losses,'rating',owner_row.rating,'coop',owner_row.coop,'guild',owner_row.guild));
  end if;
 end if;

 with wins as (
  select m.mode,m.combat_state->'clock' as seconds,
   case when jsonb_typeof(m.raid_seats)='array' then
    (select count(distinct seat->>'uid') from jsonb_array_elements(m.raid_seats) seat
     where seat->>'pokemon' is not null and seat->>'substitute' is distinct from 'true')
    else case when m.guest is not null and m.guest<>m.host then 2 else 1 end end as humans
  from arena_private.matches m where m.result='coop_win' and
   (case when jsonb_typeof(m.raid_seats)='array' then exists (
     select 1 from jsonb_array_elements(m.raid_seats) seat where seat->>'uid'=owner_row.id::text
      and seat->>'pokemon' is not null and seat->>'substitute' is distinct from 'true')
    else owner_row.id in (m.host,m.guest) end)
 ), clears as (
  select c.mode from arena_private.mega_raid_first_clears c where c.player_id=owner_row.id
  union select w.mode from wins w where w.mode in ('coop_mega','coop_mega_2','coop_mega_3','coop_mega_master','coop_mega_2_master','coop_mega_3_master')
 )
 select jsonb_build_object('name',owner_row.name,'wins',owner_row.wins,'losses',owner_row.losses,'coop',owner_row.coop,
  'raids',coalesce((select jsonb_agg(mode order by mode) from clears),'[]'),
  'bestGroupMs',(select min(case when jsonb_typeof(seconds)='number' and seconds>'0'::jsonb then round((seconds::text)::numeric*1000) end) from wins where humans>=2))
 into online_info;
 if trainer_name is null then return jsonb_build_object('online',online_info); end if;

 campaign:=coalesce(progress->'campaign','{}');career:=coalesce(progress->'trainerRecords','{}');
 select coalesce(jsonb_agg(b order by r.ordinal,pos) filter(where arena_private.market_entry(snapshot,'pokemon-arena-gym-badges','[]')?b),'[]'),
        coalesce(jsonb_agg(b order by r.ordinal,pos) filter(where arena_private.market_entry(snapshot,'pokemon-arena-gym-badges/master','[]')?b),'[]')
 into standard_badges,master_badges from arena_private.campaign_regions r cross join lateral unnest(r.badges) with ordinality badges(b,pos);
 select coalesce(array_agg(distinct n),'{}') into registered from (
   select jsonb_array_elements_text(coalesce(progress->'registered','[]')) n
   union select jsonb_object_keys(coalesce(progress->'owned','{}')) n) names;

 with caught as materialized (
  select c.dex,c.national_dex,f.rare from arena_private.market_species c left join arena_private.campaign_families f using(dex)
  where c.name=any(registered)
 ), individuals as materialized (
  select r.name,c.national_dex,c.dex,f.rare,r.slot,(r.pokemon->>'level')::integer as level,
   coalesce(r.pokemon->'profile'->'shiny'='true'::jsonb,false) as shiny
  from arena_private.market_pokemon_rows(snapshot) r join arena_private.market_species c on c.name=r.name
  left join arena_private.campaign_families f using(dex)
 ), owned as (
  select name, bool_or(shiny) shiny, coalesce(max(level) filter(where shiny),max(level)) level from individuals group by name
 ), suggestions as (
  select value as name,ordinality as seq from jsonb_array_elements_text(coalesce(progress->'favorites','[]')) with ordinality
  union all select value,10000+ordinality from jsonb_array_elements_text(arena_private.market_entry(snapshot,'pokemon-arena-team','[]')) with ordinality
 ), slots as (
  select p.name,p.pos from jsonb_array_elements_text(case when jsonb_typeof(card->'featured')='array' then card->'featured' else '[]' end)
    with ordinality p(name,pos) where pos<=3
  union all select s.name,row_number() over(order by min(s.seq)) from suggestions s join owned o using(name)
   where jsonb_typeof(card->'featured') is distinct from 'array' group by s.name
 ), cards as (
  select slots.pos,jsonb_build_object('name',o.name,'shiny',o.shiny,'level',o.level) value from slots join owned o using(name)
   where pos<=3 and pos=(select min(s.pos) from slots s where s.name=slots.name)
 )
 select jsonb_build_object(
  'registered',(select count(distinct national_dex) from caught),'forms',(select count(*) from caught where dex<>national_dex),
  'legends',(select count(distinct national_dex) from caught where rare),
  'individuals',(select count(*) from individuals),'highest',coalesce((select max(level) from individuals),0),
  'shinies',(select count(distinct national_dex) from individuals where shiny),
  'shinyLegends',coalesce((select jsonb_agg(name order by name) from (select distinct name from individuals where shiny and rare) q),'[]'),
  'regionCounts',(select jsonb_agg(n order by g) from (select g.g,count(distinct c.national_dex) n from generate_series(1,9) g(g)
   left join arena_private.market_species base on base.dex=base.national_dex and base.generation=g.g
   left join caught c on c.national_dex=base.dex group by g.g) q),
  'featured',(select jsonb_agg(c.value order by i) from generate_series(1,3) i left join cards c on c.pos=i))
 into details;

 details:=details||jsonb_build_object('name',owner_row.name,'standard',standard_badges,'master',master_badges,
  'wildWins',case when jsonb_typeof(progress->'wins')='number' then progress->'wins' else '0' end,
  'rogueBest',coalesce(arena_private.market_entry(snapshot,'pokemon-arena-roguelit-progress','{}')->'best','0'),
  'records',jsonb_build_object('trainerWins',case when jsonb_typeof(career->'trainerWins')='number' then career->'trainerWins' end,
   'knockouts',case when jsonb_typeof(career->'knockouts')='number' then career->'knockouts' end,
   'bestTrainerMs',case when jsonb_typeof(career->'bestTrainerMs')='number' then career->'bestTrainerMs' end),
  'title',left(campaign->>'title',32),'laurel',coalesce(campaign->'laurel'='true'::jsonb,false),
  'style',jsonb_build_object('scene',left(card->>'scene',12),'accent',left(card->>'accent',12),'look',left(card->>'look',12)));
 return jsonb_build_object('online',online_info,'profile',details);
end $$;
revoke all on function public.arena_trainer_card(text) from public,anon;
grant execute on function public.arena_trainer_card(text) to authenticated;
commit;
