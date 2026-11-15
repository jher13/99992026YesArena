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
