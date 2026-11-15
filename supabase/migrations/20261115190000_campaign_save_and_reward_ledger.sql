begin;

alter function arena_private.save_issue(jsonb) rename to save_issue_v1;
create function arena_private.save_issue(document jsonb)
returns text language plpgsql immutable set search_path='' as $$
declare
 entries jsonb;
 masters jsonb;
 rematches jsonb;
 issue text;
begin
 if document->'version' is distinct from '2'::jsonb then
  return arena_private.save_issue_v1(document);
 end if;
 issue:=arena_private.save_issue_v1(jsonb_set(document,'{version}','1'));
 if issue is not null then return issue; end if;
 entries:=document->'entries';
 if not entries ? 'pokemon-arena-gym-badges/master'
   or not entries ? 'pokemon-arena-gym-badges/clean-records'
   or jsonb_typeof(entries->'pokemon-arena-gym-badges/master') not in ('null','string')
   or jsonb_typeof(entries->'pokemon-arena-gym-badges/clean-records') not in ('null','string')
 then return 'campaign_save_entries'; end if;
 masters:=coalesce((entries->>'pokemon-arena-gym-badges/master')::jsonb,'[]');
 rematches:=coalesce((entries->>'pokemon-arena-gym-badges/clean-records')::jsonb,'{}');
 if jsonb_typeof(masters)<>'array' or jsonb_typeof(rematches)<>'object' then return 'campaign_save_entries'; end if;
 if jsonb_array_length(masters)>100 or exists(select 1 from jsonb_array_elements(masters) a(value) where jsonb_typeof(value)<>'string')
 or (select count(*) from jsonb_each(rematches))>100
 or exists(select 1 from jsonb_each(rematches) where value is distinct from 'true'::jsonb)
 then return 'campaign_save_entries'; end if;
 return null;
exception when data_exception then return 'campaign_save_entries';
end
$$;

create table arena_private.raid_reward_catalog (
 mode text primary key,
 coins integer not null,
 master_balls integer not null,
 pvp_item text not null
);
insert into arena_private.raid_reward_catalog values
 ('coop_mega',25000,2,'Leftovers'),
 ('coop_mega_2',65000,5,'Muscle Band'),
 ('coop_mega_3',100000,10,'Wise Glasses');

create table arena_private.raid_reward_ledger (
 player_id uuid not null references auth.users(id) on delete cascade,
 mode text not null references arena_private.raid_reward_catalog(mode),
 claimed_at timestamptz not null default now(),
 migrated boolean not null default false,
 primary key(player_id,mode)
);

alter table arena_private.raid_reward_catalog enable row level security;
alter table arena_private.raid_reward_ledger enable row level security;
revoke all on arena_private.raid_reward_catalog,arena_private.raid_reward_ledger from public,anon,authenticated;

-- Only reconcile previously paid rewards that also have a server-confirmed clear.
with valid_saves as materialized (
 select user_id,(save_data->'entries'->>'pokemon-arena-wild-progress')::jsonb->'megaRaidRewards' as paid
 from public.arena_saves where arena_private.save_issue(save_data) is null
)
insert into arena_private.raid_reward_ledger(player_id,mode,migrated)
select c.player_id,c.mode,true
from arena_private.mega_raid_first_clears c join valid_saves s on s.user_id=c.player_id
where jsonb_typeof(s.paid)='array' and s.paid ? c.mode;

create or replace function public.arena_write_save(payload jsonb, expected_revision timestamptz)
returns jsonb language plpgsql security definer set search_path='' as $$
declare
 uid uuid := auth.uid();
 revision timestamptz;
 previous jsonb;
 issue text;
 progress jsonb;
 modes jsonb;
begin
 perform arena_private.require_session();
 perform pg_advisory_xact_lock(hashtextextended(uid::text,802771));
 issue:=arena_private.save_issue(payload);
 if issue is not null then
  insert into arena_private.integrity_events(user_id,session_id,reason)
  select uid,arena_private.session_id(),issue where not exists(
   select 1 from arena_private.integrity_events where user_id=uid and reason=issue
    and occurred_at>now()-interval '5 minutes');
  return jsonb_build_object('status','rejected');
 end if;
 select updated_at,save_data into revision,previous from public.arena_saves where user_id=uid for update;
 if revision is distinct from expected_revision then return jsonb_build_object('status','conflict'); end if;
 if payload->'version'='1'::jsonb and previous->'version'='2'::jsonb then
  payload:=jsonb_set(payload,'{version}','2');
  payload:=jsonb_set(payload,'{entries,pokemon-arena-gym-badges/master}',previous->'entries'->'pokemon-arena-gym-badges/master');
  payload:=jsonb_set(payload,'{entries,pokemon-arena-gym-badges/clean-records}',previous->'entries'->'pokemon-arena-gym-badges/clean-records');
 end if;
 progress:=(payload->'entries'->>'pokemon-arena-wild-progress')::jsonb;
 if progress is not null then
  select coalesce(jsonb_agg(mode order by mode),'[]') into modes from arena_private.raid_reward_ledger where player_id=uid;
  progress:=jsonb_set(progress,'{megaRaidRewards}',modes);
  payload:=jsonb_set(payload,'{entries,pokemon-arena-wild-progress}',to_jsonb(progress::text));
 end if;
 revision:=clock_timestamp();
 insert into public.arena_saves(user_id,save_data,updated_at) values(uid,payload,revision)
 on conflict(user_id) do update set save_data=excluded.save_data,updated_at=excluded.updated_at;
 return jsonb_build_object('status','ok','updated_at',revision);
end
$$;

create or replace function arena_private.require_valid_save()
returns void language plpgsql security definer set search_path='' as $$
declare payload jsonb;
begin
 select save_data into payload from public.arena_saves where user_id=auth.uid();
 if arena_private.save_issue(payload) is not null then
  raise exception 'Save and sync a valid team before playing online.' using errcode='42501';
 end if;
end
$$;

create function public.arena_collect_raid_rewards(expected_revision timestamptz)
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
  if jsonb_typeof(progress->'balls') is distinct from 'array' or jsonb_array_length(progress->'balls')<>8 then
   raise exception 'Sync your latest inventory before claiming raid rewards.';
  end if;
  for reward in select value from jsonb_array_elements(rewards) loop
   progress:=jsonb_set(progress,'{coins}',to_jsonb(coalesce((progress->>'coins')::bigint,0)+(reward->>'coins')::bigint));
   progress:=jsonb_set(progress,'{balls,7}',to_jsonb((progress->'balls'->>7)::bigint+(reward->>'master_balls')::bigint));
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

create function arena_private.pvp_item_entitlements(uid uuid)
returns jsonb language sql stable set search_path='' as $$
 select coalesce(jsonb_object_agg(pvp_item,quantity),'{}')
 from (
  select catalog.pvp_item,count(*) as quantity
  from arena_private.raid_reward_ledger ledger
  join arena_private.raid_reward_catalog catalog using(mode)
  where ledger.player_id=uid group by catalog.pvp_item
 ) gear
$$;

create or replace function public.arena_combat_read(match_id uuid, player_id uuid)
returns jsonb language sql security definer set search_path=pg_catalog as $$
 select to_jsonb(m) || jsonb_build_object('server_now',clock_timestamp()) ||
  case when m.combat_state is null and m.mode in ('ranked','unranked','free_fight') then jsonb_build_object(
    'host_pvp_items',arena_private.pvp_item_entitlements(m.host),
    'guest_pvp_items',arena_private.pvp_item_entitlements(m.guest)) else '{}'::jsonb end
 from arena_private.matches m where m.id=match_id and (
  player_id in(m.host,m.guest) or exists(
   select 1 from jsonb_array_elements(m.raid_seats) seat where seat->>'uid'=player_id::text
  ));
$$;

revoke all on function public.arena_collect_raid_rewards(timestamptz) from public,anon;
grant execute on function public.arena_collect_raid_rewards(timestamptz) to authenticated;
notify pgrst, 'reload schema';
commit;
