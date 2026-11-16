begin;

alter table arena_private.raid_reward_catalog rename column master_balls to ultra_balls;

create or replace function arena_private.save_issue_v1(document jsonb)
returns text language plpgsql immutable set search_path='' as $$
declare
 entries jsonb;
 team jsonb;
 progress jsonb;
 profiles jsonb;
 pokemon jsonb;
 copies jsonb;
 balances jsonb;
 field text;
 payload jsonb;
begin
 if document is null or octet_length(document::text)>4000000 or document->'version' is distinct from '1'::jsonb
 then return 'save_envelope'; end if;
 entries:=document->'entries';
 if jsonb_typeof(entries) is distinct from 'object' then return 'save_entries'; end if;
 foreach field in array array['team','moves','profiles','wild-progress','gym-badges','starter','roguelit-progress','trainer-options','music','sfx'] loop
  if not entries ? ('pokemon-arena-' || field)
     or jsonb_typeof(entries->('pokemon-arena-' || field)) not in ('null','string')
  then return 'save_entries'; end if;
  if field not in ('music','sfx') then
   payload:=(entries->>('pokemon-arena-' || field))::jsonb;
   if payload is not null and jsonb_typeof(payload)<>(case when field in ('team','gym-badges') then 'array' else 'object' end)
   then return 'entry_type'; end if;
  end if;
 end loop;
 team:=coalesce((entries->>'pokemon-arena-team')::jsonb,'[]');
 progress:=coalesce((entries->>'pokemon-arena-wild-progress')::jsonb,'{}');
 profiles:=coalesce((entries->>'pokemon-arena-profiles')::jsonb,'{}');
 if jsonb_array_length(team)>6 or exists(select 1 from jsonb_array_elements(team) t(value)
     where jsonb_typeof(value)<>'string' or length(value #>> '{}') not between 1 and 100)
 or (select count(distinct value) from jsonb_array_elements(team) t(value))<>jsonb_array_length(team)
 then return 'team_limits'; end if;
 if exists(select 1 from jsonb_array_elements_text(team) as member(name)
   where not coalesce((progress->'owned') ? member.name,false)
     and member.name is distinct from ((entries->>'pokemon-arena-starter')::jsonb->>'name'))
 then return 'team_ownership'; end if;
 if exists(select 1 from jsonb_each(profiles) p where not arena_private.profile_valid(p.value))
 then return 'profile_limits'; end if;
 foreach field in array array['coins','capsules','wins'] loop
  if progress ? field and not arena_private.whole_number(progress->field,0,9007199254740991)
   then return 'balance_format'; end if;
 end loop;
 foreach field in array array['items','vitamins','skills'] loop
  balances:=coalesce(progress->field,'{}');
  if jsonb_typeof(balances)<>'object' then return 'balance_format'; end if;
  if exists(select 1 from jsonb_each(balances) b where not arena_private.whole_number(b.value,0,9007199254740991))
   then return 'balance_format'; end if;
 end loop;
 if progress ? 'balls' then
  if jsonb_typeof(progress->'balls')<>'array' then return 'ball_inventory'; end if;
  if jsonb_array_length(progress->'balls') not between 7 and 9
  or exists(select 1 from jsonb_array_elements(progress->'balls') b(value) where not arena_private.whole_number(value,0,9007199254740991))
  then return 'ball_inventory'; end if;
 end if;
 if progress ? 'battlePass' and not arena_private.whole_number(progress->'battlePass'->'xp',0,10000)
 then return 'battle_pass_limits'; end if;
 for pokemon in select value from jsonb_each(coalesce(progress->'owned','{}')) loop
  if not arena_private.whole_number(pokemon->'level',1,100)
     or not arena_private.whole_number(pokemon->'xp',0,9007199254740991)
  then return 'owned_level_limits'; end if;
 end loop;
 for copies in select value from jsonb_each(coalesce(progress->'copies','{}')) loop
  for pokemon in select value from jsonb_array_elements(copies) loop
   if not arena_private.whole_number(pokemon->'level',1,100)
      or not arena_private.whole_number(pokemon->'xp',0,9007199254740991)
      or not arena_private.profile_valid(pokemon->'profile')
   then return 'copy_limits'; end if;
  end loop;
 end loop;
 return null;
exception when data_exception then
 return 'malformed_progress';
end
$$;

create or replace function public.arena_collect_raid_rewards(expected_revision timestamptz)
returns jsonb language plpgsql security definer set search_path='' as $$
declare
 uid uuid := auth.uid();
 saved jsonb;
 revision timestamptz;
 progress jsonb;
 rewards jsonb;
 reward jsonb;
 modes jsonb;
begin
 perform arena_private.require_session();
 perform pg_advisory_xact_lock(hashtextextended(uid::text,802771));
 select save_data,updated_at into saved,revision from public.arena_saves where user_id=uid for update;
 if saved is null or revision is distinct from expected_revision or arena_private.save_issue(saved) is not null
 then return jsonb_build_object('status','conflict'); end if;
 with awarded as (
  insert into arena_private.raid_reward_ledger(player_id,mode)
  select uid,c.mode from arena_private.mega_raid_first_clears c where c.player_id=uid
  on conflict(player_id,mode) do nothing returning mode
 )
 select coalesce(jsonb_agg(to_jsonb(r) order by r.mode),'[]')
 into rewards from awarded a join arena_private.raid_reward_catalog r using(mode);
 if jsonb_array_length(rewards)>0 then
  progress:=(saved->'entries'->>'pokemon-arena-wild-progress')::jsonb;
  if jsonb_typeof(progress->'balls') is distinct from 'array' or jsonb_array_length(progress->'balls') not in (8,9) then
   raise exception 'Sync your latest inventory before claiming raid rewards.';
  end if;
  for reward in select value from jsonb_array_elements(rewards) loop
   progress:=jsonb_set(progress,'{coins}',to_jsonb(coalesce((progress->>'coins')::bigint,0)+(reward->>'coins')::bigint));
   progress:=jsonb_set(progress,'{balls,6}',to_jsonb((progress->'balls'->>6)::bigint+(reward->>'ultra_balls')::bigint));
   progress:=jsonb_set(progress,'{items}',coalesce(progress->'items','{}')||
    jsonb_build_object(reward->>'pvp_item',coalesce((progress->'items'->>(reward->>'pvp_item'))::bigint,0)+1));
  end loop;
  select coalesce(jsonb_agg(mode order by mode),'[]') into modes
  from arena_private.raid_reward_ledger where player_id=uid;
  progress:=jsonb_set(progress,'{megaRaidRewards}',modes);
  saved:=jsonb_set(saved,'{entries,pokemon-arena-wild-progress}',to_jsonb(progress::text));
  revision:=clock_timestamp();
  update public.arena_saves set save_data=saved,updated_at=revision where user_id=uid;
 end if;
 return jsonb_build_object('status','ok','updated_at',revision,'rewards',rewards);
end
$$;

notify pgrst, 'reload schema';
commit;
