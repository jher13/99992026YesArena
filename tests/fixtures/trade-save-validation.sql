-- Released 0.22.17 / 0.22.18 / 0.22.31 save validators for migration compatibility tests.
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

create or replace function arena_private.save_issue_v1(document jsonb)
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
  if jsonb_array_length(progress->'balls') not between 7 and 9
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
create function arena_private.save_issue(document jsonb)
returns text language plpgsql immutable set search_path='' as $$
declare
 entries jsonb;
 masters jsonb;
 rematches jsonb;
 issue text;
begin
 if document->'version' is distinct from '2'::jsonb then
  return arena_private.save_issue_v1(document);
 end if;
 issue:=arena_private.save_issue_v1(jsonb_set(document,'{version}','1'));
 if issue is not null then return issue; end if;
 entries:=document->'entries';
 if not entries ? 'pokemon-arena-gym-badges/master'
   or not entries ? 'pokemon-arena-gym-badges/clean-records'
   or jsonb_typeof(entries->'pokemon-arena-gym-badges/master') not in ('null','string')
   or jsonb_typeof(entries->'pokemon-arena-gym-badges/clean-records') not in ('null','string')
 then return 'campaign_save_entries'; end if;
 masters:=coalesce((entries->>'pokemon-arena-gym-badges/master')::jsonb,'[]');
 rematches:=coalesce((entries->>'pokemon-arena-gym-badges/clean-records')::jsonb,'{}');
 if jsonb_typeof(masters)<>'array' or jsonb_typeof(rematches)<>'object' then return 'campaign_save_entries'; end if;
 if jsonb_array_length(masters)>100 or exists(select 1 from jsonb_array_elements(masters) a(value) where jsonb_typeof(value)<>'string')
 or (select count(*) from jsonb_each(rematches))>100
 or exists(select 1 from jsonb_each(rematches) where value is distinct from 'true'::jsonb)
 then return 'campaign_save_entries'; end if;
 return null;
exception when data_exception then return 'campaign_save_entries';
end
$$;

