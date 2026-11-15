create table if not exists arena_private.coop_ticket_balances (
 player_id uuid primary key references auth.users(id) on delete cascade,
 balance bigint not null check (balance >= 0)
);

create or replace function arena_private.record_mega_raid_first_clear()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
 if new.result = 'coop_win' and old.result is distinct from new.result
    and new.mode in ('coop_mega','coop_mega_2','coop_mega_3') then
  with players as (
   select distinct (seat->>'uid')::uuid as player_id
   from jsonb_array_elements(new.raid_seats) as seats(seat)
   where seat->>'uid' is not null and seat->>'pokemon' is not null
     and seat->>'substitute' is distinct from 'true'
  ), first_clears as (
   insert into arena_private.mega_raid_first_clears(player_id, mode)
   select player_id, new.mode from players order by player_id
   on conflict do nothing returning player_id
  )
  insert into arena_private.coop_ticket_balances as balances(player_id, balance)
  select player_id, (select count(*) - 1 from players)
  from players
  where (select count(*) from players) > 1
    and player_id not in (select player_id from first_clears)
  order by player_id
  on conflict (player_id) do update set balance = balances.balance + excluded.balance;
 end if;
 return new;
end;
$$;

create or replace function public.arena_coop_ticket_balance()
returns bigint language sql stable security definer set search_path = ''
as $$
 select coalesce((select balance from arena_private.coop_ticket_balances where player_id = auth.uid()),0)
$$;
revoke all on function public.arena_coop_ticket_balance() from public;
grant execute on function public.arena_coop_ticket_balance() to authenticated;
