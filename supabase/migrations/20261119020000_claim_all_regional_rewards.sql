begin;

create or replace function public.arena_campaign(action text,args jsonb default '{}')
returns jsonb language plpgsql security definer set search_path=pg_catalog as $$
#variable_conflict use_variable
<<campaign>>
declare uid uuid:=auth.uid();saved jsonb;revision timestamptz;expected timestamptz;issue text;request_id uuid;request_hash text;op arena_private.campaign_operations;
 region_name text;master boolean;received integer;key text;reward jsonb;response jsonb;state jsonb;p jsonb;created boolean;token text;contract jsonb;run arena_private.campaign_runs;root integer;today date:=(clock_timestamp() at time zone 'UTC')::date;
begin
 perform arena_private.require_session();if uid is null then raise exception 'Sign in to open account progression.';end if;
 perform pg_advisory_xact_lock(hashtextextended(uid::text,802771));
 select save_data,updated_at into saved,revision from public.arena_saves where user_id=uid for update;
 if saved is null then raise exception 'Sync your progress first.';end if;
 issue:=arena_private.save_issue(saved);if issue is not null then raise exception 'Your save must pass validation before claiming rewards.';end if;
 insert into arena_private.campaign_accounts(user_id) values(uid) on conflict do nothing;created:=found;
 if created then
  -- Credit valid offline receipts once when an account first adopts this release.
  for token in select jsonb_array_elements_text(coalesce(arena_private.market_entry(saved,'pokemon-arena-wild-progress','{}')->'campaign'->'claimed','[]')) loop
   if token like 'standard:%' and arena_private.campaign_complete(saved,substring(token from 10)) or token like 'master:%' and arena_private.campaign_complete(saved,substring(token from 8),true) or exists(select 1 from jsonb_array_elements(arena_private.campaign_contracts(uid,saved)) card where card->>'key'=token) then
    insert into arena_private.campaign_claims(user_id,key) values(uid,token) on conflict do nothing;
   end if;
  end loop;
 end if;
 if action='status' then return arena_private.campaign_status(uid,saved);end if;
 if action not in ('claim_region','claim_all_regions','start_hunt','start_contract','claim_contract') then raise exception 'Unknown progression action.';end if;
 if exists(select 1 from jsonb_object_keys(args) field where field not in ('region','master','root','key','run_id','request_id','expected_revision')) then raise exception 'Unexpected progression argument.';end if;
 request_id:=(args->>'request_id')::uuid;if request_id is null then raise exception 'This transaction needs an identifier.';end if;
 request_hash:=md5(action||(args-'request_id'-'expected_revision')::text);
 select * into op from arena_private.campaign_operations o where o.user_id=uid and o.request_id=campaign.request_id;
 if op.user_id is not null then
  if op.action<>action or op.payload_hash<>request_hash then raise exception 'Transaction identifier was reused for another operation.';end if;
  return op.response||jsonb_build_object('save_data',saved,'updated_at',revision,'replayed',true,'campaign',arena_private.campaign_status(uid,saved));
 end if;
 expected:=(args->>'expected_revision')::timestamptz;
 if expected is distinct from revision then return jsonb_build_object('status','conflict','message','Progress changed. Sync before claiming rewards.');end if;
 if action in ('claim_region','claim_all_regions') then
  if action='claim_region' then
   region_name:=args->>'region';master:=coalesce((args->>'master')::boolean,false);
   if not arena_private.campaign_complete(saved,region_name,master) then raise exception 'Complete this region before claiming its bundle.';end if;
  elsif args-'request_id'-'expected_revision'<>'{}'::jsonb then
   raise exception 'Claim All uses the rewards earned by this account.';
  end if;

  -- Single and bulk claims share the same receipts. Only newly inserted rows pay out.
  with eligible as (
   select r.*,t.is_master from arena_private.campaign_regions r
   cross join (values(false),(true)) t(is_master)
   where (action='claim_all_regions' or (r.region=region_name and t.is_master=master))
    and arena_private.campaign_complete(saved,r.region,t.is_master)
  ), awarded as (
   insert into arena_private.campaign_claims as receipt(user_id,key,reward)
   select uid,(case when b.is_master then 'master:' else 'standard:' end)||b.region,
    jsonb_build_object('coins',b.coins*(case when b.is_master then 2 else 1 end),'vitamins',jsonb_build_object(
     'Rare Candy',case when b.is_master then b.master_candy else b.candy end,
     'EXP Candy 500',case when b.is_master then 2+(b.ordinal-1)/2 else 1+(b.ordinal-1)/3 end))
   from eligible b on conflict do nothing returning receipt.reward as bundle
  )
  select count(*)::integer,jsonb_build_object('coins',coalesce(sum((a.bundle->>'coins')::integer),0),
   'vitamins',jsonb_build_object('Rare Candy',coalesce(sum((a.bundle->'vitamins'->>'Rare Candy')::integer),0),
    'EXP Candy 500',coalesce(sum((a.bundle->'vitamins'->>'EXP Candy 500')::integer),0)))
  into received,reward from awarded a;

  if received>0 then
   saved:=arena_private.campaign_reward(saved,reward);
   response:=jsonb_build_object('claimed_count',received,'reward',reward,'message',
    case when action='claim_region' then region_name||(case when master then ' Master' else '' end)||' rewards received.'
     else format('Claimed %s regional %s.',received,case when received=1 then 'bundle' else 'bundles' end) end);
  else
   response:=jsonb_build_object('claimed_count',0,'message',case when action='claim_region'
    then 'This regional reward was already claimed.' else 'No regional rewards are ready to claim.' end);
  end if;
  state:=arena_private.campaign_status(uid,saved);
  p:=arena_private.market_entry(saved,'pokemon-arena-wild-progress','{}');
  p:=jsonb_set(p,'{campaign}',coalesce(p->'campaign','{}')||jsonb_build_object('claimed',state->'claimed'));
  saved:=arena_private.market_set(saved,'pokemon-arena-wild-progress',p);
 elsif action='start_hunt' then
  root:=(args->>'root')::integer;
  if not arena_private.campaign_complete(saved,'Hoenn') or not arena_private.campaign_complete(saved,args->>'region') then raise exception 'Clear Hoenn and the selected region first.';end if;
  if exists(select 1 from arena_private.campaign_hunts h where h.user_id=uid and h.day=today) then raise exception 'Today’s hunt has already been started.';end if;
  if not exists(select 1 from jsonb_array_elements(arena_private.campaign_hunt_choices(uid,saved,args->>'region')) choice where (choice->>'root')::integer=root) then raise exception 'Choose a family from today’s hunt board.';end if;
  insert into arena_private.campaign_hunts(user_id,day,region,root,remaining) values(uid,today,args->>'region',root,20)
   on conflict(user_id) do update set id=gen_random_uuid(),day=excluded.day,region=excluded.region,root=excluded.root,remaining=20;
  state:=arena_private.campaign_status(uid,saved);p:=arena_private.market_entry(saved,'pokemon-arena-wild-progress','{}');
  p:=jsonb_set(p,'{campaign}',coalesce(p->'campaign','{}')||jsonb_build_object('hunt',(state->'hunt')));
  saved:=arena_private.market_set(saved,'pokemon-arena-wild-progress',p);response:='{"message":"Family hunt started."}';
 elsif action='start_contract' then
  select value into contract from jsonb_array_elements(arena_private.campaign_contracts(uid,saved)) where value->>'key'=args->>'key';
  if contract is null then raise exception 'This contract is locked or has expired.';end if;
  if contract->>'kind'='elite' and jsonb_array_length(arena_private.market_entry(saved,'pokemon-arena-team','[]'))<>6 then raise exception 'Elite contracts require a full six-Pokémon team.';end if;
  key:=contract->>'key';
  if exists(select 1 from arena_private.campaign_claims c where c.user_id=uid and c.key=key) then raise exception 'This contract reward was already claimed.';end if;
  if exists(select 1 from arena_private.campaign_runs r where r.user_id=uid and r.started_at>clock_timestamp()-interval '10 seconds') then raise exception 'Wait 10 seconds before starting another contract.';end if;
  if (select count(*) from arena_private.campaign_runs r where r.user_id=uid and r.started_at>clock_timestamp()-interval '1 minute')>=8 then raise exception 'Too many contract starts. Try again shortly.';end if;
  delete from arena_private.campaign_runs r where r.user_id=uid and r.expires_at<clock_timestamp()-interval '7 days';
  insert into arena_private.campaign_runs(user_id,key,definition,entries) values(uid,key,contract,arena_private.campaign_build_entries(saved)) returning * into run;
  response:=jsonb_build_object('run_id',run.id,'message','Contract team saved.');
 elsif action='claim_contract' then
  select * into run from arena_private.campaign_runs r where r.id=(args->>'run_id')::uuid and r.user_id=uid for update;
  if run.id is null or not run.verified or run.won is distinct from true then raise exception 'Win and verify this contract first.';end if;
  key:=run.key;
  if not exists(select 1 from arena_private.campaign_claims c where c.user_id=uid and c.key=key) then
   if run.expires_at<clock_timestamp() then raise exception 'This contract has expired.';end if;
   if clock_timestamp()<run.started_at+make_interval(secs=>greatest(0,run.duration::double precision-2)) then raise exception 'The contract battle is still in progress.';end if;
  end if;
  reward:=run.definition->'reward';
  insert into arena_private.campaign_claims(user_id,key,reward) values(uid,key,reward) on conflict do nothing;
  if found then saved:=arena_private.campaign_reward(saved,reward);response:=jsonb_build_object('reward',reward,'message','Contract rewards received.');
  else response:='{"message":"This contract reward was already claimed."}';end if;
 end if;
 issue:=coalesce(arena_private.save_issue(saved),arena_private.campaign_save_issue(uid,saved));if issue is not null then raise exception 'Progress validation failed: %',issue;end if;
 revision:=clock_timestamp();update public.arena_saves set save_data=saved,updated_at=revision where user_id=uid;
 response:=coalesce(response,'{}')||jsonb_build_object('status','ok');
 insert into arena_private.campaign_operations(user_id,request_id,action,payload_hash,response) values(uid,request_id,action,request_hash,response);
 return response||jsonb_build_object('save_data',saved,'updated_at',revision,'campaign',coalesce(state,arena_private.campaign_status(uid,saved)));
exception when others then
 if uid is not null then insert into arena_private.market_security_events(user_id,reason,details) values(uid,'campaign_rejection',jsonb_build_object('action',action,'message',left(sqlerrm,500)));end if;
 return jsonb_build_object('status','error','message',case when sqlstate='P0001' then sqlerrm else 'Progression could not sync. Refresh and try again.' end);
end $$;
revoke all on function public.arena_campaign(text,jsonb) from public,anon;
grant execute on function public.arena_campaign(text,jsonb) to authenticated;

commit;
