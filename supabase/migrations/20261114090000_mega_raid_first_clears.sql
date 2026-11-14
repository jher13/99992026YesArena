create table if not exists arena_private.mega_raid_first_clears (
 player_id uuid not null references auth.users(id) on delete cascade,
 mode text not null check (mode in ('coop_mega','coop_mega_2','coop_mega_3')),
 primary key (player_id, mode)
);

create or replace function arena_private.record_mega_raid_first_clear()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
 if new.result = 'coop_win' and old.result is distinct from new.result
    and new.mode in ('coop_mega','coop_mega_2','coop_mega_3') then
  insert into arena_private.mega_raid_first_clears(player_id, mode)
  select (seat->>'uid')::uuid, new.mode
  from jsonb_array_elements(new.raid_seats) as seats(seat)
  where seat->>'uid' is not null and seat->>'pokemon' is not null
    and seat->>'substitute' is distinct from 'true'
  on conflict do nothing;
 end if;
 return new;
end;
$$;

drop trigger if exists record_mega_raid_first_clear on arena_private.matches;
create trigger record_mega_raid_first_clear
 after update of result on arena_private.matches
 for each row execute function arena_private.record_mega_raid_first_clear();

create or replace function public.arena_mega_raid_clears()
returns text[] language sql stable security definer set search_path = ''
as $$
 select coalesce(array_agg(mode order by mode), array[]::text[])
 from arena_private.mega_raid_first_clears where player_id = auth.uid()
$$;
revoke all on function public.arena_mega_raid_clears() from public;
grant execute on function public.arena_mega_raid_clears() to authenticated;
