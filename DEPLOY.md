# Release PokeArena

## Before deploying

From the repository root, run `node tests/release-smoke.cjs`. It checks the version manifest, both HTML builds, migration filenames, save validation, and core game flows. Use `--balance` to print the seeded Tactics balance report.

## Backend and client deployment

1. Keep timestamped SQL files in `supabase/migrations/` and add new migrations with unique timestamps. If arena combat rules changed in `index.html`, run `python3 build-online-engine.py` and include the generated engine changes.
2. Apply pending migrations with `supabase db push --remote --yes` on the linked project, then deploy the `arena-combat` Edge Function. The **Deploy PokeArena backend** workflow performs both steps in order when backend changes reach main. It requires `SUPABASE_ACCESS_TOKEN` and `SUPABASE_DB_PASSWORD`.
3. Publish matching client files and `version.json` to GitHub Pages. For a backend-dependent release, wait for the backend deployment to succeed first. Keep the existing `assets/` directory.

## Two-account raid check

- Open the release URL in two separate browser profiles. Sign in with two accounts, create and join a co-op room, then select Pokémon and ready up.
- Take one browser offline during ready-up. Restore the connection and check that seats and ready states repopulate.
- Start a raid. Disconnect one browser during combat, then reconnect and verify the timer, boss HP, and player state agree on both clients. After repeated failures, exercise **Request fresh snapshot**.
- Repeat around the result screen. Verify that each account sees the same result and that reopening or retrying the result grants rewards only once.
- In Settings, download a local backup, preview it, and restore it on a test profile. Check that the restored data survives a reload. For an online profile, check that a newer cloud revision prompts for a choice.

## Save integrity and account sessions

Deploy the save-integrity migration and the updated arena-combat function together with client 0.22.17. The migration relies on the existing `public.arena_saves` table with a unique `user_id`. Older clients can't sign into the updated game until they refresh. Existing cloud records remain in place, and team validation runs before competitive use.

Review rejected save submissions from the SQL Editor using an administrator account. Treat flags as review signals because a damaged save can also fail validation.

```sql
select user_id, reason, occurred_at
from arena_private.integrity_events
order by occurred_at desc
limit 100;
```

Run `tests/save-integrity.sql` after applying migrations to a test database. Then sign in with one account in two isolated browser profiles. Verify that the second profile is blocked, the first can still sync and play, and the second can enter after the first signs out. Repeat by closing the first browser and waiting three minutes. Verify offline backup import and signed-in recovery from the last accepted cloud save.

Server checks validate game limits and ownership consistency within the save. They do not verify the origin of every in-range value earned in local game modes.

## Campaign backups and verified rewards in 0.22.18

Apply `20261115190000_campaign_save_and_reward_ledger.sql` before publishing the client, and deploy the regenerated arena-combat engine. Version 2 backups add Master clears and clean rematches. Version 1 imports preserve Campaign records they do not contain.

On a test project, clear each Mega Raid tier, collect rewards twice, and verify the server adds the payout only once. First-clear rewards also authorize one PvP held item per tier in order, Leftovers, Muscle Band, and Wise Glasses. Previously paid clears are credited when both the old save and the server's clear records agree. Verify an unverified held item is excluded at battle start. Client-run modes still sync ordinary inventory and do not establish the provenance of all in-range progress.

## Equal PvP loaner gear in 0.22.19

Deploy the regenerated arena-combat engine with the client. The engine now uses the shared loaner list for ranked, unranked, and Free Fight. The 0.22.18 raid ledger still pays first-clear rewards. PvP gear uses the loaner selections in the locked team saves.

On staging, start a PvP match between accounts with different raid histories. Each can select one Leftovers, one Muscle Band, and one Wise Glasses per team. Confirm that the pre-match preview and server battle items agree. Open the wild encounter's manual ball picker with Auto Capture on and verify the ball inventory stays unchanged until you make a choice. Reload pending account progress once with the same cloud revision and once with a newer cloud revision to exercise both recovery paths.
