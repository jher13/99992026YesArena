begin;

-- Both room types insert here. Use the Online directory's 90-second heartbeat window.
create function arena_private.require_online_invitee()
returns trigger language plpgsql set search_path='' as $$
begin
  perform 1 from arena_private.players p
   where p.id=new.recipient and p.last_seen>clock_timestamp()-interval '90 seconds'
   for share;
  if not found then
    raise exception 'This trainer is no longer online.';
  end if;
  return new;
end
$$;

revoke all on function arena_private.require_online_invitee() from public, anon, authenticated;
create trigger require_online_invitee before insert on arena_private.invites
for each row execute function arena_private.require_online_invitee();

commit;
