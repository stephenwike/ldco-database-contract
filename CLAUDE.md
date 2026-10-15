# ldco-database

Contract package (`@ldco/database`) and admin UI for the shared LDCO MongoDB. Decisions, open questions and the todo list live in [docs/decisions.md](docs/decisions.md); per-collection field notes in [docs/data-model.md](docs/data-model.md). Read decisions.md before changing the contract or data.

## Commands
- `npm run dev` / `npx next start -p 3100` — UI and `GET /api/contract`. Needs `ADMIN_PASSWORD`. Pages: `/collections` (by purpose or database, with schema, references and violations per collection), `/relationships`, `/migrations` (status and read-only dry runs; applying stays in the CLI).
- Purposes: `src/contract/purposes.ts` maps each collection to its purpose (decision 14). Add new collections there, or they show as "Unassigned".
- `npm run contract:infer` — regenerates `src/contract/collections/<db>/<name>.ts` from the local DB. Generated files are overwritten, so don't hand-edit them; put reasoning in `docs/data-model.md`. An empty collection keeps its last real schema rather than becoming a placeholder.
- `npm run contract:lock` after any schema change plus a `package.json` version bump; `prebuild` verifies the lock.
- `npm run db:migrate -- status | plan <id> | apply <id>` — migrations in `src/migrations/files/`, registered in `src/migrations/index.ts`. Refuses unless `MONGODB_URI` is localhost.
- `npm run db:migrate -- quarantine-plan [<db>.<collection>] | quarantine <db>.<collection>` — moves contract violations to `ldco-reviews` (decision 10). Local-only too.
- `npm run db:backup-live` — gzip archives of every live database in `backups/` (gitignored). Read-only on live.
- `npm run db:migrate -- --live status | plan <id> | apply <id>` — against live. `apply` needs `LIVE_WRITE_MONGODB_URI`, a backup under 24 hours old and typed confirmation. Follow [docs/rollout.md](docs/rollout.md).
- `npm run db:sync-local` — copies live into the local Docker `ldco-mongo` container (read-only on live). In PowerShell, `-- --yes` isn't passed through; use `'sync' | npm run db:sync-local`.
- `npm run package:build` rebuilds `dist/` (the package apps install: contract plus the `ldco-db-check` / `ldco-db-init` CLIs). `dist/` is committed so apps install without running a build (pnpm 10 / newer npm block install scripts from git dependencies); `prebuild` fails if it's stale, so rebuild and commit it with any contract or CLI change.
- `npm run typecheck`

## Ground rules
- Local Docker Mongo is `ldco-mongo` (compose file in `../line-dance-manager`, pinned to `mongo:8.0` to match live).
- `LIVE_MONGODB_URI` is for reading live in the sync only. Never write to live, push, or tag without asking: pushing to `main` deploys to Vercel and publishes the contract to every app's build check.
- `_id`s and references are strings; timestamps are BSON Dates (legacy offset-less strings are Mountain Time).
- The UI masks private fields by name (`src/server/mask.ts`). Add new sensitive field names there.
