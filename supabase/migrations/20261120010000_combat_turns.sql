-- The legacy read remains available while the new function is rolling out.
create function public.arena_combat_turn_read(match_id uuid, player_id uuid, verified_session uuid)
returns jsonb language plpgsql security definer set search_path=pg_catalog as $$
declare
 snapshot jsonb;
begin
 -- Locally verified JWTs still need a live user session. Legacy tokens have
 -- already been checked with Supabase Auth by the Edge Function.
 if verified_session is not null and not exists (
  select 1 from auth.sessions s join auth.users u on u.id=s.user_id
  where s.id=verified_session and s.user_id=player_id and u.deleted_at is null
    and (s.not_after is null or s.not_after>now())
    and (u.banned_until is null or u.banned_until<=now())
 ) then
  return jsonb_build_object('session_expired',true);
 end if;

 select jsonb_build_object(
  'id',m.id,'mode',m.mode,'format',m.format,'turn',m.turn,'result',m.result,
  'side',case when player_id=m.host then 'host' when m.raid_seats is not null then 'raid:'||player_id::text else 'guest' end,
  'ready',m.field is not null and (m.raid_seats is not null or (m.host_entries is not null and m.guest_entries is not null)),
  'next_tick',m.next_tick,'server_now',clock_timestamp(),'combat_state',m.combat_state
 ) || case when m.combat_state is null and m.result is null and m.field is not null then
  jsonb_build_object('host',m.host,'host_pick',m.host_pick,'guest_pick',m.guest_pick,
    'host_entries',m.host_entries,'guest_entries',m.guest_entries,'raid_seats',m.raid_seats)
 else '{}'::jsonb end into snapshot
 from arena_private.matches m where m.id=match_id and (
  player_id in(m.host,m.guest) or exists (
   select 1 from jsonb_array_elements(m.raid_seats) as seat where seat->>'uid'=player_id::text
  )
 );
 return snapshot;
end;
$$;
revoke all on function public.arena_combat_turn_read(uuid,uuid,uuid) from public,anon,authenticated;
grant execute on function public.arena_combat_turn_read(uuid,uuid,uuid) to service_role;

-- Advance the checkpoint only by frames actually simulated. Later requests
-- can finish outstanding frames after a slow turn or reconnect.
create or replace function public.arena_combat_commit(match_id uuid, revision int, state jsonb, outcome text, steps int)
returns boolean language plpgsql security definer set search_path=pg_catalog as $$
begin
 update arena_private.matches m set turn=m.turn+1,combat_state=state,
  next_tick=case when m.combat_state is null then clock_timestamp()
   else m.next_tick+steps*interval '1 second'/60 end
 where m.id=match_id and m.turn=revision and m.result is null and m.field is not null;
 if not found then return false; end if;
 if outcome is not null then
  perform arena_private.finish_online(match_id,outcome);
  update arena_private.matches m set combat_state=state where m.id=match_id;
 end if;
 return true;
end;
$$;
revoke all on function public.arena_combat_commit(uuid,int,jsonb,text,int) from public,anon,authenticated;
grant execute on function public.arena_combat_commit(uuid,int,jsonb,text,int) to service_role;
