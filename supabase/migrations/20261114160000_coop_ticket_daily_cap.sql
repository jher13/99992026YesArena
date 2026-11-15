alter table arena_private.coop_ticket_balances
 add column if not exists earned_day date,
 add column if not exists earned_today integer not null default 0 check (earned_today between 0 and 50);

create or replace function arena_private.record_mega_raid_first_clear()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare
 utc_day date := (statement_timestamp() at time zone 'UTC')::date;
 tier_multiplier integer;
begin
 if new.result = 'coop_win' and old.result is distinct from new.result
    and new.mode in ('coop_mega','coop_mega_2','coop_mega_3') then
  tier_multiplier := case new.mode when 'coop_mega' then 1 when 'coop_mega_2' then 2 else 3 end;
  with players as (
   select distinct (seat->>'uid')::uuid as player_id
   from jsonb_array_elements(new.raid_seats) as seats(seat)
   where seat->>'uid' is not null and seat->>'pokemon' is not null
     and seat->>'substitute' is distinct from 'true'
  ), first_clears as (
   insert into arena_private.mega_raid_first_clears(player_id, mode)
   select player_id, new.mode from players order by player_id
   on conflict do nothing returning player_id
  ), reward as (
   select ((count(*) - 1) * tier_multiplier)::integer as tickets from players
  )
  insert into arena_private.coop_ticket_balances as balances(player_id, balance, earned_day, earned_today)
  select player_id, reward.tickets, utc_day, reward.tickets
  from players cross join reward
  where reward.tickets > 0
    and player_id not in (select player_id from first_clears)
  order by player_id
  on conflict (player_id) do update set
   balance = balances.balance + case when balances.earned_day = excluded.earned_day
    then least(excluded.earned_today, 50 - balances.earned_today)
    else excluded.earned_today end,
   earned_today = case when balances.earned_day = excluded.earned_day
    then least(50, balances.earned_today + excluded.earned_today)
    else excluded.earned_today end,
   earned_day = excluded.earned_day;
 end if;
 return new;
end;
$$;
