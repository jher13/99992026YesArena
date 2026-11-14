create or replace function public.arena_can_receive_snapshot(topic text)
returns boolean language sql stable security definer set search_path=pg_catalog as $$
 select exists (
  select 1 from arena_private.matches m
  where m.id=case when topic ~ '^arena:[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}:(host|guest)$'
   then nullif(split_part(topic, ':', 2), '')::uuid end
  and topic='arena:' || m.id::text || ':' ||
   case when m.host=auth.uid() then 'host' when m.guest=auth.uid() then 'guest' end
 );
$$;
revoke all on function public.arena_can_receive_snapshot(text) from public, anon;
grant execute on function public.arena_can_receive_snapshot(text) to authenticated;

create policy "Arena players receive their own snapshots"
on realtime.messages for select to authenticated
using (extension='broadcast' and public.arena_can_receive_snapshot((select realtime.topic())));
