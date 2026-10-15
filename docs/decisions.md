# Design decisions

Log of decisions for the shared LDCO database. Add new entries at the bottom; do not rewrite history, supersede instead.

## 1. This project owns the data contract
Zod schemas in `src/contract/` are the single source of truth for shared collections. Apps consume them via `@ldco/database` instead of keeping local copies of entity types.

## 2. Contract version gates app builds
The version is `package.json`'s `version`; a schema hash is also compared. Apps run `ldco-db-check` as `prebuild` against `GET /api/contract` and fail when out of date or when the API is unreachable (fail closed; `LDCO_DATABASE_SKIP_CHECK=1` bypasses locally). This repo's own `prebuild` fails if schemas change without a version bump and `npm run contract:lock`.

## 3. Deployment: merge to `main`
Vercel is linked to the GitHub repo. Merging to `main` deploys, which publishes the new "latest" contract version to consumers' build checks.

## 4. Scope of this project
- Define and guardrail shared data (schemas, validation, versioning).
- Record design decisions (this file).
- UI to manage and transform data, including migrations. Responsibilities will move here from `line-dance-manager-admin` where this is the better fit.

## 5. Documents reference each other by string ids
`_id` is a string everywhere (dances had 883 ObjectId ids; migration `0001` converts them). Collections reference dances by hex/string `danceId`. Fields that are legitimately absent in real data (`isrc`, `duration_ms`, `explicit`, `stepsheet`) are optional in the contract (v0.2.0) rather than backfilled.

## 6. Migrations are code, dry-run first, local-only for now
Files in `src/migrations/files/`, registered in order in `src/migrations/index.ts`. Each has a read-only `plan` and an idempotent `apply`; applied ids are recorded in `<db>._migrations`. `npm run db:migrate -- status | plan <id> | apply <id>`. The runner refuses to apply unless `MONGODB_URI` is localhost until backups and review are in place.
## 7. Bulk-imported dances carry `songArtists` until a track is matched
The bulk dance import tool in `line-dance-manager-admin` loads scraped copperknob data. The old single-dance flow matched each dance to a Spotify track, which can't be done in bulk. So `dances.songArtists` (`[{ song, artist }]`) keeps the scraped song info on the dance, so it isn't lost after the scrape. A future process will associate the dance with a real track and set `primaryTrack`. This rule applies to every importer, including `copperknob-alert`'s cron job, which turns copperknob feed items into dances. A dance that already has a `primaryTrack` doesn't need `songArtists`.

No placeholder tracks (2026-10-14): an importer never creates a track document for an unmatched song. Earlier imports created 785 "stub" tracks (empty `uri`) and pointed `primaryTrack` at them; migration `0005` copies their song info into `songArtists` and deletes them. A `tracks` document is only created for a matched (Spotify) track, and a typed-in song in the admin goes to `songArtists`. Apps that show a dance's song fall back to `songArtists[0]` when there is no `primaryTrack` (`line-dance-manager` converters, `expandDancesByIds` and venue dances; the `dances` endpoint in `line-dance-dj-feed` and `dance-folly-website`; `dance-folly-website`'s dance list). Field notes: [data-model.md](data-model.md#dances).
## 8. All databases are in scope
The contract covers every database (`ldco`, `djfeed`, `bld`, `copperknob_alert`, `ldco-events`, `ldco-reviews`, `music_catalog`). It is MVP / pre-beta with a single developer, and everything needs to be proven consistent before scaling. Revisit privileged database access when other admins join.

## 9. Timestamps are BSON Dates
Use BSON `Date`, not strings. A BSON Date is a UTC instant and does not store a time zone; where local time matters (for example a venue's schedule), store the IANA zone name next to it rather than relying on an offset. Mixed string/Date fields (`createdAt` in the `user_*` dance collections and `dance_collections`) get a migration. Caveat: legacy strings such as `2025-07-25T07:45:30.919713` carry no offset. They were all written in Mountain Time (MST/MDT), so migration `0002` interprets offset-less strings as `America/Denver` (DST-aware) and stores the resulting UTC instant. Strings that already carry an offset or `Z` are taken as exact. In the repeated fall-back hour a wall-clock time is ambiguous and one of the two instants is chosen.

## 10. Contract violations move to `ldco-reviews`
Documents that violate the contract can be moved to a same-named collection in `ldco-reviews`, which was created for this. Apps may break when records move; that is accepted during the MVP and fixed quickly. Implemented as `npm run db:migrate -- quarantine-plan [<db>.<collection>]` and `quarantine <db>.<collection>` (local-only, like migrations). `ldco` documents go to the same-named collection; other databases reuse collection names (`bld.dj_requests` and `djfeed.dj_requests`), so they go to `ldco-reviews.<db>__<name>`. Documents move unchanged, and the reason is recorded in `ldco-reviews._quarantine` (`source`, `target`, `docId`, `issues`, `quarantinedAt`). This keeps the review collections, which apps also use as review queues, in their own shape. A document whose `_id` already exists in the target is reported as a conflict and not moved. Each document is inserted into the target before it is deleted from the source.

## 11. No rollback strategy and no data scrubbing yet
Accepted risk while there is one developer: fix forward. Blue-green databases are a later option. The runner stays local-only until then. Production copies are not anonymised after `db:sync-local`. Note: the synced data contains emails, IP addresses and user agents (`login_events`), bcrypt password hashes (41 users) and Stripe/wallet records in `djfeed`, so it is personal data on the local machine. The UI's document viewer shows field values, but masks private fields by name (`src/server/mask.ts`: password, secret, token, email, phone, signature, userAgent, googleId, ip).

## 12. Build-time contract check is mandatory for every app
Each app calls `/api/contract` at build time and fails the build on a version mismatch; that failure is the signal to align the contract. Every app must use it going forward. Distribution is a git dependency for now; a private npm registry (for example GitHub Packages) or a config fetched from an API are both acceptable later.

## 13. What the UI is for right now
Browse collections, see relationships between them, and catch misaligned data. Transform and migration UI is lower priority than that.

## 14. Collections move to the right databases, and each database is scoped to its apps
The current database layout is partly accidental: collections were sometimes created in the wrong database (often by AI-generated code), so the layout doesn't reflect ownership. For example, `bld` and `djfeed` both hold the same six DJ collections with different data. Neither database is canonical by design. Part of this effort is to decide which database each collection belongs in, move it there (merging duplicates), and scope each database to the web applications that should use it. The contract and the relationship view are the tools for this. Moving a collection is a breaking change for the apps that use it, so moves are staged through the contract version check like any other change.

Databases are organised by **purpose**, not by app, because apps share data. For example, one purpose is tracking dances, songs and choreographers; another is the DJ feed (sessions, requests, reports); another is an instructor managing venues, lessons, dates and events. Each purpose gets one home, and apps are scoped to the purposes they serve. The working draft is in [database-layout.md](database-layout.md).

Sign-in audit: "which user signed in to which app, and when" lives in `ldco.login_events`, written by ldco-auth for every sign-in. Apps read a user's name and email from `ldco.users` and don't keep their own copies.

## Future considerations (not decided)

### A. Should `ObjectId` come back?
Context: ids became strings because ObjectId caused TypeScript problems in earlier versions of the apps. The data is mostly strings already (all references such as `danceId` and `userId` are hex strings), and the remaining ObjectId `_id`s are drift (users, `user_*` dance collections).

What ObjectId offers:
- Compact storage (12 bytes versus 24 characters), so smaller documents and indexes. Negligible at this data size.
- A creation timestamp embedded in the id and roughly time-ordered ids.
- A distinct type, so an id can't be confused with an arbitrary string at the database level.

What it costs: it does not survive JSON or the Next.js server/client boundary, so every API edge needs converting, and that is where the earlier TypeScript problems came from. Many ids here are not ObjectIds anyway (Spotify ids in `tracks`, UUIDs for instructors), so strings stay necessary.

Leaning: keep strings. The two real benefits can be kept without switching: create new ids with `new ObjectId().toHexString()` (keeps uniqueness and the time-ordered prefix), and give the contract a branded `Id` type for TypeScript safety. Revisit only if storage size or database-level type safety becomes a real problem.

### B. Replace Spotify ids with a universal track
Context: `dances.primaryTrack` and `tracks` point at Spotify-shaped tracks, which ties the data to one provider (decision 7 already shows the cost: bulk imports can't match Spotify, so stubs are created).

Idea: use a provider-neutral track as the core record, and attach per-provider links (Spotify, Apple Music, YouTube, ...) to it. `music_catalog.tracks` is the candidate. It is a growing cache of MusicBrainz: an API searches MusicBrainz when no local track matches, then records the result so later lookups are reliable. It has 34,137 documents (all `source: "musicbrainz"`) with `title`, `artist`, `isrcs`, `durationMs`, `year`, `source` / `sourceId`, and normalised `nTitle` / `nArtist` / `variantKey` fields. Ids are source-prefixed (`musicbrainz:<mbid>`). Dances would reference a catalog track id, and a separate collection (for example `track_links`: `trackId`, `provider`, `providerId`, `url`) would hold the provider mappings.

Missing tracks: MusicBrainz occasionally lacks a track. `source` is already generic, so a manual entry can live in the same collection with `source: "manual"` and an id like `manual:<uuid>`. Readers must not assume `source` is `musicbrainz`. If the track later appears in MusicBrainz, the manual entry can be merged by recording the mapping rather than rewriting dance references.

It is a large, breaking change, so it needs staging:
1. Add the provider-link collection and define the universal track in the contract. Nothing breaks.
2. Backfill: match existing `ldco.tracks` to catalog tracks and record the Spotify links. Do not rely on ISRC alone: 28,619 of the 34,137 catalog tracks (about 84%) have no ISRC, so matching has to fall back to normalised title and artist (`nTitle`, `nArtist`, `variantKey`) and needs human review for ambiguous cases. Unmatched tracks stay as they are.
3. Add an optional `catalogTrackId` to dances alongside `primaryTrack`; apps read the new field and fall back to the old one.
   Alternative worth weighing here: instead of a single field, a link collection such as the existing (stale) `ldco.dance_tracks` (`danceId`, `trackId`, `isPrimary`) pointing at catalog tracks. It allows several songs per dance with one marked primary, which a single field can't. See the `dance_tracks` row in [database-layout.md](database-layout.md#duplicate-investigation-2026-10-14).
4. Migrate apps one at a time, then deprecate `primaryTrack` and the Spotify-shaped `tracks`.

Each step keeps the old fields working, which is what the contract version check is for. Open: how a dance is linked while its track is not yet in MusicBrainz (a `manual:` entry, or leaving `catalogTrackId` unset until it is).

Decided for now: the `music_catalog` lookup API stays where it is. Moving it to a controlled home is a todo (see Todo).

## Open questions
- Stub tracks from the bulk import: how to recognise one (empty `uri`), whether `primaryTrack` may be empty (41 dances are), and what to do with the 1 dangling `primaryTrack`.
- Which `line-dance-manager-admin` features move here (deferred).
- `bld` and `djfeed` both contain the same six DJ collections (`beat_balances`, `beat_transactions`, `dj_messages`, `dj_requests`, `dj_sessions`, `dj_wallet_transactions`) with no ids in common (for example `dj_requests`: 1,765 in `bld`, 5,658 in `djfeed`). `dance-folly-website` writes to `bld` and `line-dance-dj-feed` to `djfeed`. Per decision 14 neither is canonical by design; where they end up is part of the database layout work.

## Todo

### Data fixes
- Done and pushed (`copperknob-alert` 18f4237, 2026-10-14): its cron now inserts dances with a string `_id`, stores the feed's `Music:` line in `songArtists` (backfilled on existing dances only when they have neither `songArtists` nor a `primaryTrack`), and matches existing dances by stepsheet URL or by name plus a shared choreographer (name alone was overwriting different dances that share a name). Alternate URLs go to `stepsheetUrls`, as in the admin bulk import.
- Done locally (uncommitted in `line-dance-manager-admin`, alongside other in-progress work there): new dances from `dances` (create), `dances/bulk-import` and pending-dance approval get a string `_id`, and `dances/backfill-tracks` finds dances by string id, falling back to ObjectId for dances not yet migrated on live. The admin also no longer creates stub tracks: `bulk-import` stores only `songArtists`, `backfill-tracks` only scrapes song info into `songArtists`, typed-in songs in create, approve and edit go to `songArtists`, and `lib/tracks.ts` (the stub helper) is deleted.
- 21 dances (older copperknob imports) have neither a `primaryTrack` nor `songArtists`; the admin's backfill page can scrape them.
- Fix `ldco-auth` so new Google sign-ups get a string `_id`: `authOptions.ts` calls `users.insertOne` without an `_id`, so MongoDB assigns an ObjectId and the drift returns. Use `new ObjectId().toHexString()`, as `register/route.ts` already does. The same check applies to any app inserting into the `user_*` dance collections.
- Migrations `0001` to `0012` (dance ids, `ldco` timestamps, user ids, event duration, stub tracks, `user_profiles`, `bld` DJ history, early-dev DJ owners, `ldco.event_registrations`, `user_favorite_venues`, test venue events, venues merge) are applied to the local database only; they still need running against live once a backup approach exists.
- Done locally (not yet applied to live): `0002` converted `createdAt` / `updatedAt` strings in `ldco` to Dates; `0004` converted the one string `bld.events.durationMinutes` (`"180"`) to a number. Contract 0.6.0 has no mixed-type fields left.
- Other string timestamps outside `ldco` (for example `copperknob_alert` `lastRunAt` / `lastCheckedAt`, `djfeed` `feedAppliedAt`, `event_registrations` `sentAt` / `waiverSignedAt`, `ldco.choreographers.lastImportedAt`) still follow the old string convention. Decide per app whether to convert, since the apps write and read them as strings.
- Review the generated schemas, especially the placeholders for empty collections (`djfeed.dj_wallet_locks`, `ldco.oauth_auth_codes`, `ldco.user_favorite_venues`, all of `ldco-reviews`), and re-run `contract:infer` once they have data.

### Features
- Relationship view: built at `/relationships` (inferred from value overlap with other collections' `_id`s). Still to do: review the dangling references it reports, and consider curated relationship definitions for cases it can't infer. `beat_transactions.requestId` / `dj_wallet_transactions.requestId` show 233 of 392 dangling, probably by design (`line-dance-dj-feed`'s `reportLogic.js` deletes `dj_requests` when a session ends); confirm and exclude if so.
- UI for migration status, plan and apply (CLI exists: `npm run db:migrate`).
- Replace the shared-password login with a standard solution (for example `ldco-auth`).
- Allow migrations against live once a backup/rollback approach exists.

### Rollout
Plan: nothing goes live until all six apps are tested locally, then everything is pushed to `main` together. Live data is only ever read (by `db:sync-local`) until then.

Local test per app: in this repo `npx tsup` and `npm link`; in the app `npm link @ldco/database`, `npx ldco-db-init`, set `LDCO_DATABASE_URL=http://localhost:3100` and `LDCO_DATABASE_TOKEN`, run this repo with `npx next start -p 3100`, then `npm run build`. `npm link` leaves the app's dependencies untouched, but `ldco-db-init` edits its `package.json` (the `prebuild` script).

The step-by-step checklist is [rollout.md](rollout.md). Release order matters even for a same-day push: (1) push this repo and confirm `/api/contract` is live on Vercel with its environment variables; (2) in each app replace the link with `npm install github:stephenwike/ldco-database-contract` and push; (3) run migrations `0001` to `0005` against live. `0005` deletes the stub tracks, so it must run only after `line-dance-manager`, `line-dance-dj-feed` and `dance-folly-website` are deployed with the `songArtists` fallback, or 809 dances lose their song in those apps. `0006` drops `djfeed.user_profiles`, so it must run after `line-dance-dj-feed` and `line-dance-manager-admin` are deployed reading `ldco.users`. `0007` drops `bld`'s DJ collections, so it must run after `dance-folly-website` is deployed without its old DJ code. `0012` drops `bld.venues`, so it must run after `line-dance-manager-admin` and `dance-folly-website` are deployed reading `ldco.venues`. only after taking a backup, and before apps that rely on string ids go live. A failed app build does not replace its running production deployment.
- Merge to `main` to publish the contract (0.12.0 as of 2026-10-15; commits are local only, unpushed on purpose); set `ADMIN_PASSWORD`, `MONGODB_URI` and `CONTRACT_API_TOKEN` in Vercel (keep `MONGODB_URI` off live unless intended).
- Add `@ldco/database` and the `ldco-db-check` prebuild step to every app (`npx ldco-db-init` adds the prebuild script), with `LDCO_DATABASE_URL` and `LDCO_DATABASE_TOKEN` set in each Vercel project. Apps: `line-dance-manager`, `line-dance-manager-admin`, `line-dance-dj-feed`, `copperknob-alert`, `ldco-auth`, and `dance-folly-website` (the "line-dance-follow" app). `dance-folly-website` is a Next 14 / mongodb 6.20 app that uses `bld` (`dj_sessions`, `dj_requests`, `spotify_tokens`), `ldco-events` and `ldco`, and it already reads `ldco-reviews.dances` for stepsheet lookups, so quarantining dances there (decision 10) does not hide them from it.
- Decide how Vercel installs the package from a private GitHub repo (access token or a registry).
- Align `mongodb` driver versions across the apps (currently 6.18 to 7.7).

### Database layout (decision 14)
- Map which app reads and writes each collection (scan all six apps' code).
- Settle the purpose map in [database-layout.md](database-layout.md) (draft exists), then decide which apps may use each purpose.
- Plan the moves and merges (starting with the duplicated DJ collections in `bld` / `djfeed`) as migrations, staged through the contract version check.
- Remove the duplicates found in the investigation (table in [database-layout.md](database-layout.md#duplicate-investigation-2026-10-14)): (done locally: `djfeed.user_profiles` retired in favour of `ldco.login_events` and `ldco.users`), (done locally: `bld`'s DJ history merged into `djfeed`, its test-mode payments archived, `bld.spotify_tokens` dropped and the old DJ code removed from `dance-folly-website`), (done locally: `ldco.event_registrations` and `user_favorite_venues` dropped, early-dev DJ owners assigned to Stephen), (done locally: `ldco.venues` / `bld.venues` merged by migration `0012`, with "my venues" as `instructor_venues`).

### Retire `beyondlinedance-companion`
It was absorbed into `line-dance-manager-admin` and is not part of the rollout. It still has code that reads and writes `bld`, `ldco` and `ldco-reviews` (last commit 2026-06-02).
- Check that every feature has an equivalent in `line-dance-manager-admin`. Candidates from its code include lesson plans, frequencies, one-off events, event generation, lesson overview and the `/api/occurrences` and `/api/dances` endpoints.
- Confirm it is fully removed from Vercel (project deleted, or at least no deployments and no `MONGODB_URI`), so nothing keeps writing to the shared databases.

### Later
- Move the `music_catalog` lookup API (MusicBrainz search that records new tracks) to a controlled place, and decide whether it writes through this contract. Not urgent.
- Universal track plan (decision A/B above), if pursued.
- Revisit privileged database access, backups and anonymisation when other admins or users are involved.