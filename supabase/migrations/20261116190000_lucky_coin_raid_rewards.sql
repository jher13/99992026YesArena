begin;

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
 masters jsonb;
 standard_badges jsonb;
 coin_multiplier integer := 1;
begin
 perform arena_private.require_session();
 perform pg_advisory_xact_lock(hashtextextended(uid::text,802771));
 select save_data,updated_at into saved,revision from public.arena_saves where user_id=uid for update;
 if saved is null or revision is distinct from expected_revision or arena_private.save_issue(saved) is not null
 then return jsonb_build_object('status','conflict'); end if;
 masters:=coalesce((saved->'entries'->>'pokemon-arena-gym-badges/master')::jsonb,'[]');
 standard_badges:=coalesce((saved->'entries'->>'pokemon-arena-gym-badges')::jsonb,'[]');
 if (select count(distinct badge) from jsonb_array_elements_text(masters) as badges(badge)
     where standard_badges ? badge)=68 then
  coin_multiplier:=2;
 end if;
 with awarded as (
  insert into arena_private.raid_reward_ledger(player_id,mode)
  select uid,c.mode from arena_private.mega_raid_first_clears c where c.player_id=uid
  on conflict(player_id,mode) do nothing returning mode
 )
 select coalesce(jsonb_agg(to_jsonb(r)||jsonb_build_object('coins',r.coins*coin_multiplier) order by r.mode),'[]')
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
