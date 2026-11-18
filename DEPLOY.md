# Update to 0.22.69

Apply this changed-files patch over **0.22.68**. Keep the complete `assets`
directory and replace the included files at their original paths. The new atlas
files and expanded `pokemon-icons.png` are required for offline rendering.

This update includes all 1,025 National Dex species and 58 regional forms.
Existing Pokémon retain their save IDs. Regional forms use separate internal
IDs while displaying the original National Dex number. All available PMDCollab
animations and offline fallback icons are included; there are no runtime image
requests to third-party sprite servers.

The new migration is
`supabase/migrations/20261118030000_complete_pokedex.sql`. Push all included
files to `main` and let the existing Supabase deployment workflow finish. It
extends the shared species and family-hunt catalogs, preserves auction escrow
and account session checks, and deploys the regenerated combat engine.

The new roster-specific checks are available with `npm run test:roster`.
Source import tools are `scripts/expand-roster.py` followed by
`scripts/import-roster-sprites.py`; these are development tools, not runtime
requirements. Source attribution is in `assets/roster-sprite-credits.json`.

Copy the ZIP contents into the existing PokeArena repository, preserving the
directory paths. This is a changed-files patch; keep all other files and assets.

The Trading Hub needs the new database migration as well as the client files.
The included `.github/workflows/deploy-supabase.yml` installs the pinned test
dependency, checks Hub transactions and update safety, applies pending database
migrations, and deploys the Arena combat function when pushed to `main`.
It uses the existing `SUPABASE_ACCESS_TOKEN` and `SUPABASE_DB_PASSWORD` repository
secrets. Wait for that workflow to succeed before testing the Hub online.

For a manual backend deployment from the existing complete repository:

```sh
supabase link --project-ref ckgcuhaiuwlccyaxewbv
supabase db push --remote --yes
supabase functions deploy arena-combat --project-ref ckgcuhaiuwlccyaxewbv --no-verify-jwt
```

The Trading Hub foundation migration is `supabase/migrations/20261118010000_trading_hub.sql`.
It preserves existing account session checks, save validation, and reward ledgers.
Auctions escrow the selected individual and bids reserve coins. Completed trades,
expired listings, and outbid refunds are delivered safely from the main menu;
offline completions keep persistent notifications. Timed auctions settle on the
next Hub or notification request, or every minute if the project enables pg_cron.

Deploy `trade-hub.js` alongside `cloud.js`, `multiplayer.js`, `index.html`, and
`version.json`. Both the main client and local-test page reference the new script.
Automatic updates wait until an automatic Pokébattle or Trainer battle session
has ended, including repeat countdowns, captures, and evolution dialogs.

Run checks locally:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm test
```

`npm run test:trade` runs the client checks and real PostgreSQL migration tests
without production accounts or credentials. PostgreSQL tests use an isolated,
in-memory PGlite database with the released save validators.

After editing the inline battle engine, regenerate its deployed copy with
`python3 build-online-engine.py`.
