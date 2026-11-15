begin;

create table arena_private.account_sessions (
 user_id uuid primary key references auth.users(id) on delete cascade,
 session_id uuid not null,
 expires_at timestamptz not null
);

create table arena_private.integrity_events (
 id bigint generated always as identity primary key,
 user_id uuid not null references auth.users(id) on delete cascade,
 session_id uuid,
 reason text not null,
 occurred_at timestamptz not null default now()
);
create index integrity_events_user_time on arena_private.integrity_events(user_id, occurred_at desc);
alter table arena_private.account_sessions enable row level security;
alter table arena_private.integrity_events enable row level security;
revoke all on arena_private.account_sessions, arena_private.integrity_events from public, anon, authenticated;

create function arena_private.session_id()
returns uuid language sql stable set search_path='' as $$
 select nullif(auth.jwt()->>'session_id','')::uuid
$$;

create function public.arena_session_active()
returns boolean language sql stable security definer set search_path='' as $$
 select exists (
  select 1 from arena_private.account_sessions l
  join auth.sessions s on s.id=l.session_id and s.user_id=l.user_id
  where l.user_id=auth.uid() and l.session_id=arena_private.session_id() and l.expires_at>now()
 )
$$;

create function public.arena_claim_session()
returns boolean language plpgsql security definer set search_path='' as $$
declare
 uid uuid := auth.uid();
 sid uuid := arena_private.session_id();
begin
 if uid is null or sid is null or not exists(select 1 from auth.sessions where id=sid and user_id=uid)
  then return false; end if;
 insert into arena_private.account_sessions as lease(user_id,session_id,expires_at)
 values(uid,sid,now()+interval '3 minutes')
 on conflict(user_id) do update set session_id=excluded.session_id,expires_at=excluded.expires_at
 where lease.session_id=excluded.session_id or lease.expires_at<=now()
    or not exists(select 1 from auth.sessions where id=lease.session_id and user_id=uid);
 return found;
end
$$;

create function public.arena_release_session()
returns void language sql security definer set search_path='' as $$
 delete from arena_private.account_sessions where user_id=auth.uid() and session_id=arena_private.session_id()
$$;

create function arena_private.require_session()
returns void language plpgsql security definer set search_path='' as $$
begin
 if not public.arena_session_active() then
  raise exception 'Your game session is inactive. Sign in again.' using errcode='42501';
 end if;
end
$$;

create function arena_private.whole_number(value jsonb, minimum numeric, maximum numeric)
returns boolean language sql immutable set search_path='' as $$
 select case when jsonb_typeof(value)='number' then
  (value::text)::numeric between minimum and maximum
  and trunc((value::text)::numeric)=(value::text)::numeric
 else false end
$$;

create function arena_private.profile_valid(profile jsonb)
returns boolean language plpgsql immutable set search_path='' as $$
declare total numeric;
begin
 if jsonb_typeof(profile) is distinct from 'object'
 or not arena_private.whole_number(profile->'pid',0,4294967295)
 or jsonb_typeof(profile->'ivs') is distinct from 'array'
 or jsonb_typeof(profile->'evs') is distinct from 'array' then return false; end if;
 if jsonb_array_length(profile->'ivs')<>6 or jsonb_array_length(profile->'evs')<>6 then return false; end if;
 if exists(select 1 from jsonb_array_elements(profile->'ivs') as iv(value) where not arena_private.whole_number(value,0,31))
 or exists(select 1 from jsonb_array_elements(profile->'evs') as ev(value) where not arena_private.whole_number(value,0,252))
 then return false; end if;
 select sum((value::text)::numeric) into total from jsonb_array_elements(profile->'evs') as ev(value);
 return total<=510;
end
$$;

create function arena_private.save_issue(document jsonb)
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
  if jsonb_array_length(progress->'balls') not between 7 and 8
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

create function public.arena_write_save(payload jsonb, expected_revision timestamptz)
returns jsonb language plpgsql security definer set search_path='' as $$
declare
 uid uuid := auth.uid();
 revision timestamptz;
 issue text;
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
 select updated_at into revision from public.arena_saves where user_id=uid for update;
 if revision is distinct from expected_revision then return jsonb_build_object('status','conflict'); end if;
 revision:=clock_timestamp();
 insert into public.arena_saves(user_id,save_data,updated_at) values(uid,payload,revision)
 on conflict(user_id) do update set save_data=excluded.save_data,updated_at=excluded.updated_at;
 return jsonb_build_object('status','ok','updated_at',revision);
end
$$;

-- Only the RPC can create or modify an authenticated player's cloud save.
revoke insert, update, delete, truncate on public.arena_saves from public, anon, authenticated;
alter table public.arena_saves enable row level security;
create policy arena_authenticated_save_session on public.arena_saves as restrictive for select to authenticated
 using (user_id=auth.uid() and (select public.arena_session_active()));

create function arena_private.require_valid_save()
returns void language plpgsql security definer set search_path='' as $$
declare payload jsonb;
begin
 select save_data into payload from public.arena_saves where user_id=auth.uid();
 if arena_private.save_issue(payload) is not null then
  raise exception 'Save and sync a valid team before playing online.' using errcode='42501';
 end if;
end
$$;

alter function public.arena_online(text,jsonb) set schema arena_private;
alter function public.arena_raid(text,jsonb) set schema arena_private;
alter function public.arena_raid_chat(uuid,text) set schema arena_private;
alter function public.arena_mega_raid_clears() set schema arena_private;
alter function public.arena_coop_ticket_balance() set schema arena_private;
revoke all on function arena_private.arena_online(text,jsonb),arena_private.arena_raid(text,jsonb),
 arena_private.arena_raid_chat(uuid,text),arena_private.arena_mega_raid_clears(),
 arena_private.arena_coop_ticket_balance() from public,anon,authenticated;

create function public.arena_online(action text,args jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path='' as $$
begin
 perform arena_private.require_session();
 if action='lock' then perform arena_private.require_valid_save(); end if;
 return arena_private.arena_online(action,args);
end
$$;

create function public.arena_raid(action text,args jsonb)
returns jsonb language plpgsql security definer set search_path='' as $$
begin
 perform arena_private.require_session();
 if action in ('pick','fill') then perform arena_private.require_valid_save(); end if;
 return arena_private.arena_raid(action,args);
end
$$;

create function public.arena_raid_chat(room_id uuid,message text default null)
returns jsonb language plpgsql security definer set search_path='' as $$
begin
 perform arena_private.require_session();
 return arena_private.arena_raid_chat(room_id,message);
end
$$;

create function public.arena_mega_raid_clears()
returns text[] language plpgsql security definer set search_path='' as $$
begin
 perform arena_private.require_session();
 return arena_private.arena_mega_raid_clears();
end
$$;

create function public.arena_coop_ticket_balance()
returns bigint language plpgsql security definer set search_path='' as $$
begin
 perform arena_private.require_session();
 return arena_private.arena_coop_ticket_balance();
end
$$;

create policy arena_live_session_required on realtime.messages as restrictive for select to authenticated
 using (extension is distinct from 'broadcast' or realtime.topic() not like 'arena:%' or (select public.arena_session_active()));

revoke all on function public.arena_session_active(),public.arena_claim_session(),
 public.arena_release_session(),public.arena_write_save(jsonb,timestamptz),
 public.arena_online(text,jsonb),public.arena_raid(text,jsonb),
 public.arena_raid_chat(uuid,text),public.arena_mega_raid_clears(),
 public.arena_coop_ticket_balance() from public,anon;
grant execute on function public.arena_session_active(),public.arena_claim_session(),
 public.arena_release_session(),public.arena_write_save(jsonb,timestamptz),
 public.arena_online(text,jsonb),public.arena_raid(text,jsonb),
 public.arena_raid_chat(uuid,text),public.arena_mega_raid_clears(),
 public.arena_coop_ticket_balance() to authenticated;
notify pgrst, 'reload schema';
commit;
