# Live rollout checklist

**Status (2026-10-15): steps 0–4 done. Remaining: step 5, rotating the shared Atlas password.**

Everything so far was built and tested against a local copy of live (synced 2026-10-14). This is the order for taking it live. Each migration runs only after the code that depends on it is deployed. Tick items off as you go.

Already live: `copperknob-alert` (pushed 2026-10-14, `18f4237`).

## 0. Prerequisites (one-time)

- [x] **Two new Atlas users** for this repo: a read-only one for `LIVE_MONGODB_URI` (sync, backups, dry runs) and one that can write, for `LIVE_WRITE_MONGODB_URI` (only used by `db:migrate -- --live apply`). Put both in this repo's `.env.local`. Adding users doesn't affect the existing one the apps use, so nothing breaks.
- [x] **Package access from Vercel:** apps install `@ldco/database` from `github:stephenwike/ldco-database-contract`. If that repo is private, Vercel needs a GitHub token (set as a git credential in each Vercel project), or publish the package to a registry instead.
- [x] Pick a quiet time for step 4 (see the venues note).

## 1. Back up and dry-run against live

- [x] `npm run db:backup-live` writes `backups/<timestamp>/<db>.archive.gz` and a manifest. Applying any migration to live refuses without a backup from the last 24 hours.
- [x] `npm run db:migrate:live status` shows all 12 migrations as pending.
- [x] `npm run db:migrate:live plan <id>` for each migration: read-only. Compare with the local results (`/migrations/<id>` in the UI shows what was recorded locally). Live has changed since the 2026-10-14 copy, so expect slightly larger counts. Investigate anything very different. `0012` stops if live has venues it doesn't know about.

### Results (2026-10-15)

Backup `backups/2026-10-15T15-00-24-502Z` taken; the `ldco` archive was test-restored into a scratch database (10,409 documents, 0 failures). Live dry runs, compared with the local copy:

| Migration | Live dry run | Notes |
|---|---|---|
| `0001` | 884 dances to convert | One more than locally (a dance created after the local copy). |
| `0002` | 1,034 timestamps | Same as locally. |
| `0003` | 254 documents | Same. |
| `0004` | 1 duration | Same. |
| `0005` | 785 stubs, 809 dances, 13 need `songArtists` | Same. |
| `0006` | 19 of 40 profiles add a login event | Same. |
| `0007` | merge 27 / 1,765 / 9; archive 0 / 0 / 0; drop 1 token | Live has no `bld` beats or wallet collections: those existed only in the old local data. Nothing to archive. |
| `0008` | 97 fields | Lower than locally (1,924) because `0007` hasn't merged the `bld` history yet. Run `plan` again after `0007`: it should be about 1,924. |
| `0009` | 33 rows, all in `ldco-events` | Same. |
| `0010` | empty | Same. |
| `0011` | 0 of 2 test events | The test events existed only in the old local data. No-op on live. |
| `0012` | 17 venues: 5 matched, 11 added, 1 merged, 0 unknown; 19 event types | Same. |

Collections in the contract but not yet on live (`ldco.events`, `ldco.venue_users`, `ldco-reviews.venue_users`, `djfeed.dancer_favorite_songs`, `djfeed.dj_requester_nicknames`) belong to features live hasn't used yet; their schemas come from a few local test documents.

## 2. Publish the contract

- [x] Push `ldco-database` to `main`. Vercel deploys it to **https://ldco-database-contract.vercel.app** (pushed 2026-10-15, `42a9159`).
- [x] In its Vercel project, set `ADMIN_PASSWORD` (a strong one), `CONTRACT_API_TOKEN` and `MONGODB_URI`. The UI is read-only, so pointing `MONGODB_URI` at live (read-only user) lets you browse production.
- [x] Check `GET https://ldco-database-contract.vercel.app/api/contract` with `Authorization: Bearer <CONTRACT_API_TOKEN>` returns version 0.12.0.

## 3. Deploy the apps

In each app:
1. `npm install github:stephenwike/ldco-database-contract` (or `pnpm add …` for `line-dance-dj-feed` and `dance-folly-website`). This replaces the local link and adds the dependency.
2. Keep the `prebuild: ldco-db-check` script that local testing added to `package.json`. Commit it together with the dependency, never on its own.
3. Nothing to set in Vercel. Since 2026-10-21 `ldco-db-check` defaults to `https://ldco-database-contract.vercel.app` and reads the public `/api/contract/version` (version and hash only), so no `LDCO_DATABASE_URL` or token is needed. Before that, builds failed with "LDCO_DATABASE_URL is not set" wherever the variable wasn't supplied (found when rollout 2 pushed the first feature branches).
4. Push. A build that fails the contract check doesn't replace the running deployment.

Order:
- [x] `ldco-auth`: new Google users get string ids. Must be live before `0003`.
- [x] `line-dance-manager`: shows `songArtists` when a dance has no track. Before `0005`.
- [x] `line-dance-dj-feed` (branch `feat/dance-favorites`, merge it first): `songArtists` fallback; reads accounts from `ldco.users`. Before `0005` and `0006`.
- [x] `line-dance-manager-admin` (branch `feature/bulk-dances`, merge it first): string dance ids, no stub tracks, `ldco.users` emails, venues from `ldco.venues`. Before `0001`, `0005`, `0006`, `0012`.
- [x] `dance-folly-website`: `songArtists` fallback, old DJ code removed, venues from `ldco.venues`. Before `0005`, `0007`, `0012`.

## 4. Migrate live

Done 2026-10-15, 17:05–17:23 UTC (`0012` first, to close the venue gap on the personal site). Every result matched the dry runs; afterwards all 66 collections validated with 0 violations on live, the dangling references were only the known pre-existing ones, and the local copy was re-synced.

Use `npm run db:migrate:live …`, not `npm run db:migrate -- --live …`: in PowerShell npm drops the `--`, so `--live` never reaches the script and it silently runs against the local database.

`npm run db:migrate:live apply <id>`. Each run prints a dry run first, asks you to type the host and the migration id, and records itself in that database's `_migrations` ledger. Run them in order, checking the app or the UI after each:

- [x] `0001` dance ids to strings
- [x] `0002` `ldco` timestamps to Dates (Mountain Time for offset-less strings)
- [x] `0003` user ids to strings (after `ldco-auth` is live)
- [x] `0004` `bld.events.durationMinutes` to number
- [x] `0005` remove stub tracks (after `line-dance-manager`, `line-dance-dj-feed`, `dance-folly-website`)
- [x] `0006` retire `djfeed.user_profiles` (after `line-dance-dj-feed`, admin)
- [x] `0007` merge `bld` DJ history into `djfeed` (after `dance-folly-website`)
- [x] `0008` assign early-dev DJ owners to Stephen
- [x] `0009` drop `ldco.event_registrations`
- [x] `0010` drop `ldco.user_favorite_venues`
- [x] `0011` delete the two test venue events
- [x] `0012` merge venues (after admin and `dance-folly-website`). **Run it right after those two deploy:** until it runs, the new code reads venues from `ldco.venues` before the personal site's venues are there, so venue names on `dance-folly-website` show as unknown for those minutes.

Afterwards:
- [x] `/collections` in the deployed UI shows no violations, and `/relationships` shows no new dangling references.
- [x] `npm run db:sync-local` to bring the local copy back in line with live.

## 5. Rotate the shared password (last)

The Atlas password of the user every app shares was pasted into the Copilot chat, so rotate it once everything above is done. Rotating it breaks every app until each has the new value, so do it in one sitting:
- [ ] Rotate the password in Atlas.
- [ ] Update `MONGODB_URI` in each app's Vercel project (all six, plus this repo's if it uses that user) and its local `.env.local`, then redeploy each. A redeploy is needed for Vercel to pick up the new value.
- [ ] Check each app signs in and loads data.

Optionally, give each app its own Atlas user at this point instead of one shared password, so a future rotation only affects one app.

# Rollout 2: `ldco-lessons` (decisions 16 to 19, contract 0.13.0)

**Status (2026-10-21): built and tested against the local copy; nothing pushed, nothing run on live.** Branches, all local and unpushed:

| Repo | Branch | What |
|---|---|---|
| `ldco-database` | `feature/ldco-lessons` | Contract 0.13.0, migrations `0013` / `0014`, decisions 16 to 19 |
| `line-dance-manager` | `feature/instructor-dashboard-redesign` | Instructor dashboard and schedule on `ldco-lessons` |
| `line-dance-manager-admin` | `feature/bld-to-ldco-lessons` (worktree `../line-dance-manager-admin-lessons`) | BLD pages read and write `ldco-lessons` |
| `dance-folly-website` | `feature/ldco-lessons` | Site reads `ldco-lessons`, same API responses as before |

Tested locally: the site's `getevents` / `getvenues` / `getdances` and the admin's read routes return the same output from `ldco-lessons` as the old code does from `bld`; the admin's write paths (17 checks) and the dashboard (27 + 8 + 6 + 5 checks) pass; data written by the admin shows identically in the dashboard and on the site.

## 0. Before starting

- [x] Commit the in-progress admin work on admin `main` (pushed 2026-10-21, `85b4c43`). `feature/bld-to-ldco-lessons` is rebased onto it and uses its `getLessonsDb`; merge it in step 5.
- [x] Decide when `beyond-line-dance-webhooks` and the admin's Social Posts move to `bld.social_posts` (decision 19). They can go live before or after this rollout; they only read the schedule. (2026-10-21: the admin's Social Posts reads `bld` from `f65c48f`; the webhooks app is changed locally but not yet committed or deployed.)
- [x] Check the Atlas user the apps share can read and write a new database, `ldco-lessons` (a role scoped to named databases would need it added). (confirmed 2026-10-21.)
- [x] Pick a quiet time: between step 4 and step 5, anything changed in the admin's BLD pages goes to `bld` and has to be copied again. (2026-10-21, ~21:10–22:40 UTC.)

## 1. Back up and dry-run

- [x] `npm run db:backup-live` (now includes `ldco-lessons`, empty until step 4). Taken 2026-10-21: `backups/2026-10-21T20-42-15-237Z`.
- [x] `npm run db:migrate:live plan 0013-create-ldco-lessons-from-bld`. Live has changed since the local copy (2026-10-15): expect more events and history rows. It reports **problems** if a history row names a venue label it doesn't know; add the label to `HISTORY_VENUES` in the migration before applying (apply refuses while there are problems).
- [x] `npm run db:migrate:live plan 0014-ldco-venue-time-zone-and-validation`.

Results (2026-10-21), compared with the local copy (2026-10-15):

| Migration | Live dry run | Notes |
|---|---|---|
| `0013` | 19 event types, 7 frequencies, 286 events (708 lessons, 672 taught), 8 templates, 1,594 history rows; 794 times corrected, 800 linked to an event; 0 problems | 6 more events and 15 more history rows than locally; no unknown venue labels. |
| `0014` | 68 venues get a time zone; 68 venues and 107 lessons marked not validated | Same as locally. |

## 2. Publish the contract

- [x] Merge `feature/ldco-lessons` into `main` and push. Vercel deploys 0.13.0 to `/api/contract`. (2026-10-21, `365f527`; `/api/contract` reports 0.13.0.)
- [x] Every app's next build now fails its contract check until it's updated (done 2026-10-21: `line-dance-manager`, the admin and `dance-folly-website` on their feature branches; `line-dance-dj-feed` and `copperknob-alert` on `chore/contract-0.13.0`; each passes `ldco-db-check`. `ldco-auth` and `beyond-line-dance-webhooks` don't commit a lockfile, so their next Vercel install picks up 0.13.0 by itself): in each of the seven apps (`line-dance-manager`, `line-dance-manager-admin`, `dance-folly-website`, `line-dance-dj-feed`, `copperknob-alert`, `ldco-auth`, `beyond-line-dance-webhooks`) run `npm install github:stephenwike/ldco-database-contract` (`pnpm add …` for the pnpm apps) and commit the lockfile. Running deployments are unaffected until they rebuild.

## 3. Push the app branches (don't deploy yet)

- [x] Push and open PRs for the three app branches above, so they're ready to merge in one sitting. Vercel preview builds need the 0.13.0 dependency from step 2. (pushed 2026-10-21; PRs not opened, there's no `gh` CLI. Preview builds first failed on "LDCO_DATABASE_URL is not set", fixed in `f4ad3cd`: the check needs no env vars.)

## 4. Migrate live

- [x] `npm run db:migrate:live apply 0013-create-ldco-lessons-from-bld` (insert-only; `bld` keeps working). (2026-10-21; live counts match the dry run.)
- [x] `npm run db:migrate:live apply 0014-ldco-venue-time-zone-and-validation`. (2026-10-21; all 68 venues and 107 lessons have the new fields.)
- [ ] Check `/collections` shows `ldco-lessons` with no violations.

## 5. Deploy, right after step 4

- [x] Merge and deploy `line-dance-manager-admin`, `dance-folly-website` and `line-dance-manager`. (2026-10-21, fast-forward pushes: admin `f65c48f`, `dance-folly-website` `568f342`, `line-dance-manager` `10c20e4`; also `line-dance-dj-feed` `365f9b5`, `copperknob-alert` `927d5ec`.)
- [x] If anything was changed in the admin's BLD pages since step 4, re-run `apply 0013` (it copies new documents; edits to already-copied ones have to be redone in the admin). (nothing was changed; not needed.)
- [ ] Check: beyondlinedance.com's calendar and current venues, a dance page's venue filter, the admin's Plan Lesson and Commit Lessons pages, and the instructor dashboard's Schedule tab all show the same classes and dates.
- [x] `npm run db:sync-local`. (2026-10-21, right after step 4.)

## 6. Afterwards

- [ ] A migration dropping `bld`'s schedule collections (`event_types`, `frequencies`, `events`, `lessons`, `event_templates`); `bld` itself stays (decision 19).
- [ ] Re-run `contract:infer` once special events, registered substitutes, confirmed documents, history `lessonId`s and co-instructor requests exist on live, and add `bld.social_posts` once it has documents.
- [ ] Rollout 1's step 5 (rotate the shared Atlas password) is still open.

## If something goes wrong

There is no automatic rollback (decision 11: fix forward). To restore one database from the step-1 backup:

```
docker exec -i ldco-mongo mongorestore --uri="<LIVE_WRITE_MONGODB_URI>" --archive --gzip --drop --nsInclude="<db>.*" < backups/<timestamp>/<db>.archive.gz
```

That replaces every collection in that database with the backed-up copy, so anything written to live since the backup is lost.
