create or replace function public.arena_raid(action text, args jsonb)
returns jsonb language plpgsql security definer set search_path=pg_catalog as $$
declare
 uid uuid:=auth.uid(); room arena_private.matches; seat jsonb; slots jsonb;
 own_slot integer; slot_index integer; choice text:=nullif(args->>'pokemon','');
 mode_name text:=args->>'mode'; entries jsonb; player_name text; recipient uuid;
begin
 if uid is null then raise exception 'Sign in to join raids'; end if;
 select name into player_name from arena_private.players where id=uid;
 if player_name is null then raise exception 'Register an online profile first'; end if;
 perform pg_advisory_xact_lock(193482035);
 if action='list' then
  return coalesce((select jsonb_agg(to_jsonb(r) order by r.created) from (
   select m.id,m.mode,p.name as host,m.created,
    (select count(*) from jsonb_array_elements(m.raid_seats) v where v->>'uid' is not null) as players
   from arena_private.matches m join arena_private.players p on p.id=m.host
   where m.raid_seats is not null and m.raid_public and m.field is null and m.result is null
    and m.created>now()-interval '20 minutes'
    and m.mode in ('coop_mega','coop_mega_2','coop_mega_3')
    and exists(select 1 from jsonb_array_elements(m.raid_seats) v where v->>'uid' is null)
   order by m.created limit 100
  ) r),'[]'::jsonb);
 end if;
 if action in ('queue','create','join','join_public') then
  select * into room from arena_private.matches m where m.raid_seats is not null and m.result is null
   and (m.field is not null or m.created>now()-interval '20 minutes')
   and exists(select 1 from jsonb_array_elements(m.raid_seats) s where s->>'uid'=uid::text)
   order by m.created desc limit 1;
  if room.id is null then
   if action='join_public' then
    select * into room from arena_private.matches m where m.id=(args->>'id')::uuid
     and m.raid_public and m.raid_seats is not null and m.field is null and m.result is null
     and m.created>now()-interval '20 minutes';
    if room.id is null then raise exception 'Room unavailable'; end if;
   elsif action='join' then
    select * into room from arena_private.matches m where m.code=upper(trim(args->>'code'))
     and m.raid_seats is not null and m.field is null and m.result is null and m.created>now()-interval '20 minutes';
    if room.id is null then raise exception 'Room unavailable'; end if;
   else
    if mode_name is null or mode_name not in ('coop_mega','coop_mega_2','coop_mega_3')
     then raise exception 'Invalid raid tier'; end if;
    if action='queue' then
     select * into room from arena_private.matches m where m.mode=mode_name and m.raid_public and m.field is null
      and m.raid_seats is not null and m.result is null and m.created>now()-interval '20 minutes'
      and exists(select 1 from jsonb_array_elements(m.raid_seats) v where v->>'uid' is null) order by m.created limit 1;
    end if;
   end if;
   if room.id is null then
    insert into arena_private.matches(host,mode,format,code,raid_seats,raid_public)
    values(uid,mode_name,1,upper(replace(gen_random_uuid()::text,'-','')),
     '[null,null,null,null,null,null]'::jsonb,action='queue' or coalesce(args->>'visibility','private')='public') returning * into room;
   end if;
   select (ordinality-1)::int into slot_index from jsonb_array_elements(room.raid_seats) with ordinality
    where value->>'uid' is null order by (value<>'null'::jsonb),ordinality limit 1;
   if slot_index is null then raise exception 'The raid room is full'; end if;
   room.raid_seats:=jsonb_set(room.raid_seats,array[slot_index::text],
    jsonb_build_object('uid',uid,'name',player_name,'ready',false));
  end if;
 else
  select * into room from arena_private.matches m where m.id=(args->>'id')::uuid and m.raid_seats is not null
   and exists(select 1 from jsonb_array_elements(m.raid_seats) s where s->>'uid'=uid::text);
  if room.id is null then raise exception 'Raid room unavailable'; end if;
 end if;
 select (ordinality-1)::int into own_slot from jsonb_array_elements(room.raid_seats) with ordinality
  where value->>'uid'=uid::text limit 1;

 if action='guildlist' then
  return coalesce((select jsonb_agg(p.name order by p.name)
   from arena_private.players p join arena_private.players me on me.id=uid and me.guild=p.guild
   where p.id<>uid),'[]'::jsonb);
 end if;
 if room.result is null then
  if action='invite' then
   if room.field is not null or not exists(select 1 from jsonb_array_elements(room.raid_seats) v where v->>'uid' is null)
    then raise exception 'This raid has no open seats'; end if;
   select p.id into recipient from arena_private.players p
    where p.name=args->>'name' and p.id<>uid and (
     exists(select 1 from arena_private.players me where me.id=uid and me.guild=p.guild)
     or exists(select 1 from arena_private.friends f where f.accepted and
      ((f.sender=uid and f.recipient=p.id) or (f.recipient=uid and f.sender=p.id))));
   if recipient is null then raise exception 'Choose a friend or guild member'; end if;
   insert into arena_private.invites values(room.id,recipient) on conflict do nothing;
  elsif action='leave' then
   if uid=room.host or room.field is not null then
    perform arena_private.finish_online(room.id,'cancelled');
    room.result:='cancelled';
   else
    room.raid_seats:=jsonb_set(room.raid_seats,array[own_slot::text],'null'::jsonb);
   end if;
  elsif action in ('pick','fill','kick') then
   if room.field is not null then raise exception 'The raid already started'; end if;
   slot_index:=case when action='pick' then own_slot else (args->>'slot')::int end;
   if slot_index is null or slot_index not between 0 and 5 then raise exception 'Choose a valid seat'; end if;
   seat:=room.raid_seats->slot_index;
   if action<>'pick' and (uid<>room.host or slot_index=own_slot) then raise exception 'Only the host manages other seats'; end if;
   if action='kick' then
    if seat->>'uid' is null then raise exception 'Choose another player'; end if;
    seat:='null'::jsonb;
   elsif action='fill' and seat->>'uid' is not null then raise exception 'That seat belongs to a player';
   elsif choice is null and action='fill' then seat:='null'::jsonb;
   elsif choice is null then seat:=seat-'pokemon'-'entries'-'copy_slot'-'copy_data' || jsonb_build_object('ready',false);
   else
    select save_data->'entries' into entries from public.arena_saves where user_id=uid;
    if not coalesce(((entries->>'pokemon-arena-wild-progress')::jsonb->'owned') ? choice,false)
     then raise exception 'Choose an owned Pokémon'; end if;
    if exists(select 1 from jsonb_array_elements(room.raid_seats) with ordinality
     where ordinality<>slot_index+1 and value->>'pokemon'=choice)
    then raise exception 'That Pokémon species already has a seat in this raid'; end if;
    seat:=case when action='fill' then jsonb_build_object('name','Host substitute','substitute',true) else seat end;
    seat:=(seat-'copy_slot'-'copy_data') || jsonb_build_object('pokemon',choice,'entries',entries,'ready',true);
   end if;
   room.raid_seats:=jsonb_set(room.raid_seats,array[slot_index::text],seat);
  elsif action='start' then
   if exists(select 1 from jsonb_array_elements(room.raid_seats) as roster(slot_data)
    where roster.slot_data->>'pokemon' is not null group by roster.slot_data->>'pokemon' having count(*)>1)
   then raise exception 'Remove duplicate Pokémon species before starting the raid'; end if;
   if uid<>room.host then raise exception 'Only the host can start'; end if;
   if room.field is null then
    if exists(select 1 from jsonb_array_elements(room.raid_seats) s where s<>'null'::jsonb and s->>'ready' is distinct from 'true')
     then raise exception 'Wait until all players are ready'; end if;
    room.field:='[]'::jsonb;
    room.next_tick:=clock_timestamp();
   end if;
  end if;
  update arena_private.matches m set raid_seats=room.raid_seats,field=room.field,next_tick=room.next_tick where m.id=room.id;
 end if;
 select jsonb_agg(case when value='null'::jsonb then value else (value-'entries'-'copy_data') ||
  case when value->>'pokemon' is null then '{}'::jsonb else jsonb_build_object('level',
   ((value->'entries'->>'pokemon-arena-wild-progress')::jsonb->'owned'->(value->>'pokemon')->'level')) end
  end order by ordinality) into slots
 from jsonb_array_elements(room.raid_seats) with ordinality;
 return jsonb_build_object('id',room.id,'code',room.code,'public',room.raid_public,'mode',room.mode,'format',1,
  'side',case when uid=room.host then 'host' else 'raid:'||uid::text end,
  'ownSlot',own_slot,'seats',slots,'started',room.field is not null,'result',room.result,'turn',room.turn);
end;
$$;
revoke all on function public.arena_raid(text,jsonb) from public,anon;
grant execute on function public.arena_raid(text,jsonb) to authenticated;
