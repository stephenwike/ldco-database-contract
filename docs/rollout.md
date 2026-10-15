# Live rollout checklist

Everything so far was built and tested against a local copy of live (synced 2026-10-14). This is the order for taking it live. Each migration runs only after the code that depends on it is deployed. Tick items off as you go.

Already live: `copperknob-alert` (pushed 2026-10-14, `18f4237`).

## 0. Prerequisites (one-time)

- [ ] **Rotate the Atlas password** that was pasted into the Copilot chat.
- [ ] **Two Atlas users:** a read-only one for `LIVE_MONGODB_URI` (sync, backups, dry runs) and one that can write, for `LIVE_WRITE_MONGODB_URI` (only used by `db:migrate -- --live apply`). Put both in this repo's `.env.local`.
- [ ] **Package access from Vercel:** apps install `@ldco/database` from `github:stephenwike/ldco-database-contract`. If that repo is private, Vercel needs a GitHub token (set as a git credential in each Vercel project), or publish the package to a registry instead.
- [ ] Pick a quiet time for step 4 (see the venues note).

## 1. Back up and dry-run against live

- [ ] `npm run db:backup-live` writes `backups/<timestamp>/<db>.archive.gz` and a manifest. Applying any migration to live refuses without a backup from the last 24 hours.
- [ ] `npm run db:migrate -- --live status` shows all 12 migrations as pending.
- [ ] `npm run db:migrate -- --live plan <id>` for each migration: read-only. Compare with the local results (`/migrations/<id>` in the UI shows what was recorded locally). Live has changed since the 2026-10-14 copy, so expect slightly larger counts. Investigate anything very different. `0012` stops if live has venues it doesn't know about.

## 2. Publish the contract

- [ ] Push `ldco-database` to `main`. Vercel deploys it.
- [ ] In its Vercel project, set `ADMIN_PASSWORD` (a strong one), `CONTRACT_API_TOKEN` and `MONGODB_URI`. The UI is read-only, so pointing `MONGODB_URI` at live (read-only user) lets you browse production.
- [ ] Check `GET https://<deployment>/api/contract` with `Authorization: Bearer <CONTRACT_API_TOKEN>` returns version 0.12.0.

## 3. Deploy the apps

In each app:
1. `npm install github:stephenwike/ldco-database-contract` (or `pnpm add …` for `line-dance-dj-feed` and `dance-folly-website`). This replaces the local link and adds the dependency.
2. Keep the `prebuild: ldco-db-check` script that local testing added to `package.json`. Commit it together with the dependency, never on its own.
3. In the app's Vercel project, set `LDCO_DATABASE_URL` (the `ldco-database` deployment URL) and `LDCO_DATABASE_TOKEN` (same value as `CONTRACT_API_TOKEN`).
4. Push. A build that fails the contract check doesn't replace the running deployment.

Order:
- [ ] `ldco-auth`: new Google users get string ids. Must be live before `0003`.
- [ ] `line-dance-manager`: shows `songArtists` when a dance has no track. Before `0005`.
- [ ] `line-dance-dj-feed` (branch `feat/dance-favorites`, merge it first): `songArtists` fallback; reads accounts from `ldco.users`. Before `0005` and `0006`.
- [ ] `line-dance-manager-admin` (branch `feature/bulk-dances`, merge it first): string dance ids, no stub tracks, `ldco.users` emails, venues from `ldco.venues`. Before `0001`, `0005`, `0006`, `0012`.
- [ ] `dance-folly-website`: `songArtists` fallback, old DJ code removed, venues from `ldco.venues`. Before `0005`, `0007`, `0012`.

## 4. Migrate live

`npm run db:migrate -- --live apply <id>`. Each run prints a dry run first, asks you to type the host and the migration id, and records itself in that database's `_migrations` ledger. Run them in order, checking the app or the UI after each:

- [ ] `0001` dance ids to strings
- [ ] `0002` `ldco` timestamps to Dates (Mountain Time for offset-less strings)
- [ ] `0003` user ids to strings (after `ldco-auth` is live)
- [ ] `0004` `bld.events.durationMinutes` to number
- [ ] `0005` remove stub tracks (after `line-dance-manager`, `line-dance-dj-feed`, `dance-folly-website`)
- [ ] `0006` retire `djfeed.user_profiles` (after `line-dance-dj-feed`, admin)
- [ ] `0007` merge `bld` DJ history into `djfeed` (after `dance-folly-website`)
- [ ] `0008` assign early-dev DJ owners to Stephen
- [ ] `0009` drop `ldco.event_registrations`
- [ ] `0010` drop `ldco.user_favorite_venues`
- [ ] `0011` delete the two test venue events
- [ ] `0012` merge venues (after admin and `dance-folly-website`). **Run it right after those two deploy:** until it runs, the new code reads venues from `ldco.venues` before the personal site's venues are there, so venue names on `dance-folly-website` show as unknown for those minutes.

Afterwards:
- [ ] `/collections` in the deployed UI shows no violations, and `/relationships` shows no new dangling references.
- [ ] `npm run db:sync-local` to bring the local copy back in line with live.

## If something goes wrong

There is no automatic rollback (decision 11: fix forward). To restore one database from the step-1 backup:

```
docker exec -i ldco-mongo mongorestore --uri="<LIVE_WRITE_MONGODB_URI>" --archive --gzip --drop --nsInclude="<db>.*" < backups/<timestamp>/<db>.archive.gz
```

That replaces every collection in that database with the backed-up copy, so anything written to live since the backup is lost.
