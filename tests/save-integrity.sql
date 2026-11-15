-- Run against a test database after applying migrations.
do $$
declare
 payload jsonb;
 issue text;
 valid_profile jsonb := '{"pid":0,"ivs":[0,0,0,0,0,0],"evs":[0,0,0,0,0,0]}';
begin
 payload:='{"version":1,"entries":{"pokemon-arena-team":"[\"Pikachu\"]","pokemon-arena-moves":null,"pokemon-arena-profiles":null,"pokemon-arena-wild-progress":"{\"owned\":{\"Pikachu\":{\"level\":1,\"xp\":0}}}","pokemon-arena-gym-badges":null,"pokemon-arena-starter":null,"pokemon-arena-roguelit-progress":null,"pokemon-arena-trainer-options":null,"pokemon-arena-music":null,"pokemon-arena-sfx":null}}';
 issue:=arena_private.save_issue(payload);
 if issue is not null then raise exception 'Valid save was rejected: %',issue; end if;
 if arena_private.save_issue(jsonb_set(payload,'{entries,pokemon-arena-wild-progress}',to_jsonb('{"owned":{"Pikachu":{"level":101,"xp":0}}}'::text)))
    is distinct from 'owned_level_limits' then raise exception 'Above-cap level passed'; end if;
 if arena_private.save_issue(jsonb_set(payload,'{entries,pokemon-arena-team}',to_jsonb('["Squirtle"]'::text)))
    is distinct from 'team_ownership' then raise exception 'Unowned team member passed'; end if;
 if not arena_private.profile_valid(valid_profile)
    or arena_private.profile_valid(jsonb_set(valid_profile,'{ivs,0}','32'))
    or arena_private.profile_valid(jsonb_set(valid_profile,'{evs}','[252,252,7,0,0,0]'))
    then raise exception 'Profile limits failed'; end if;
 if has_table_privilege('authenticated','public.arena_saves','INSERT')
    or has_table_privilege('authenticated','public.arena_saves','UPDATE')
    or has_table_privilege('authenticated','arena_private.integrity_events','SELECT')
    then raise exception 'Unsafe table grants'; end if;
end
$$;

-- Version 2 adds both optional-on-import Campaign fields.
do $$
declare
 keys text[] := array['team','moves','profiles','wild-progress','gym-badges','starter','roguelit-progress','trainer-options','music','sfx','gym-badges/master','gym-badges/clean-records'];
 entries jsonb;
 payload jsonb;
begin
 select jsonb_object_agg('pokemon-arena-'||key,'null'::jsonb) into entries from unnest(keys) as k(key);
 payload:=jsonb_build_object('version',2,'entries',entries||
  jsonb_build_object('pokemon-arena-gym-badges/master','["brock"]','pokemon-arena-gym-badges/clean-records','{"misty":true}'));
 if arena_private.save_issue(payload) is not null then raise exception 'Valid Campaign backup rejected'; end if;
 if arena_private.save_issue(jsonb_set(payload,'{entries,pokemon-arena-gym-badges/clean-records}',to_jsonb('[]'::text)))
    is distinct from 'campaign_save_entries' then raise exception 'Malformed clean-rematch records accepted'; end if;
 if has_table_privilege('authenticated','arena_private.raid_reward_ledger','INSERT')
 then raise exception 'Player can insert raid rewards'; end if;
end
$$;
