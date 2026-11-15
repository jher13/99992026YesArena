create table if not exists arena_private.raid_chat (
 id bigint generated always as identity primary key,
 match_id uuid not null references arena_private.matches(id) on delete cascade,
 sender text not null,
 body text not null check (char_length(body) between 1 and 240)
);
create index if not exists raid_chat_match_messages on arena_private.raid_chat(match_id,id desc);

create or replace function public.arena_raid_chat(room_id uuid, message text default null)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare sender_name text;
begin
 select seat->>'name' into sender_name
 from arena_private.matches m cross join lateral jsonb_array_elements(m.raid_seats) seats(seat)
 where m.id=room_id and m.result is null and m.field is null and seat->>'uid'=auth.uid()::text;
 if sender_name is null then raise exception 'Join the raid room to use its chat'; end if;
 if message is not null then
  insert into arena_private.raid_chat(match_id,sender,body)
  values(room_id,sender_name,btrim(message));
  delete from arena_private.raid_chat c where c.match_id=room_id and c.id in (
   select id from arena_private.raid_chat where match_id=room_id order by id desc offset 50
  );
 end if;
 return (select coalesce(jsonb_agg(to_jsonb(c) order by c.id),'[]'::jsonb)
  from (select id,sender,body from arena_private.raid_chat where match_id=room_id order by id desc limit 50) c);
end;
$$;
revoke all on function public.arena_raid_chat(uuid,text) from public,anon;
grant execute on function public.arena_raid_chat(uuid,text) to authenticated;
