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
The bulk dance import tool in `line-dance-manager-admin` loads scraped copperknob data. The old single-dance flow matched each dance to a Spotify track, which can't be done in bulk. So `dances.songArtists` (`[{ song, artist }]`) keeps the scraped song info on the dance, so it isn't lost after the scrape. A future process will associate the dance with a real track and set `primaryTrack`. Field notes: [data-model.md](data-model.md#dances).
## 8. All databases are in scope
The contract covers every database (`ldco`, `djfeed`, `bld`, `copperknob_alert`, `ldco-events`, `ldco-reviews`, `music_catalog`). It is MVP / pre-beta with a single developer, and everything needs to be proven consistent before scaling. Revisit privileged database access when other admins join.

## 9. Timestamps are BSON Dates
Use BSON `Date`, not strings. A BSON Date is a UTC instant and does not store a time zone; where local time matters (for example a venue's schedule), store the IANA zone name next to it rather than relying on an offset. Mixed string/Date fields (`createdAt` in the `user_*` dance collections and `dance_collections`) get a migration. Caveat: legacy strings such as `2025-07-25T07:45:30.919713` carry no offset. They were all written in Mountain Time (MST/MDT), so migration `0002` interprets offset-less strings as `America/Denver` (DST-aware) and stores the resulting UTC instant. Strings that already carry an offset or `Z` are taken as exact. In the repeated fall-back hour a wall-clock time is ambiguous and one of the two instants is chosen.

## 10. Contract violations move to `ldco-reviews`
Documents that violate the contract can be moved to a same-named collection in `ldco-reviews`, which was created for this. Apps may break when records move; that is accepted during the MVP and fixed quickly. The migration runner needs a quarantine step for this (see Todo).

## 11. No rollback strategy and no data scrubbing yet
Accepted risk while there is one developer: fix forward. Blue-green databases are a later option. The runner stays local-only until then. Production copies are not anonymised after `db:sync-local`. Note: the synced data contains emails, IP addresses and user agents (`login_events`), bcrypt password hashes (41 users) and Stripe/wallet records in `djfeed`, so it is personal data on the local machine. The UI shows only ids and validation messages, not field values.

## 12. Build-time contract check is mandatory for every app
Each app calls `/api/contract` at build time and fails the build on a version mismatch; that failure is the signal to align the contract. Every app must use it going forward. Distribution is a git dependency for now; a private npm registry (for example GitHub Packages) or a config fetched from an API are both acceptable later.

## 13. What the UI is for right now
Browse collections, see relationships between them, and catch misaligned data. Transform and migration UI is lower priority than that.
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
4. Migrate apps one at a time, then deprecate `primaryTrack` and the Spotify-shaped `tracks`.

Each step keeps the old fields working, which is what the contract version check is for. Open: how a dance is linked while its track is not yet in MusicBrainz (a `manual:` entry, or leaving `catalogTrackId` unset until it is).

Decided for now: the `music_catalog` lookup API stays where it is. Moving it to a controlled home is a todo (see Todo).

## Open questions
- Stub tracks from the bulk import: how to recognise one (empty `uri`), whether `primaryTrack` may be empty (41 dances are), and what to do with the 1 dangling `primaryTrack`.
- Which `line-dance-manager-admin` features move here (deferred).

## Todo

### Data fixes
- Fix `ldco-auth` so new Google sign-ups get a string `_id`: `authOptions.ts` calls `users.insertOne` without an `_id`, so MongoDB assigns an ObjectId and the drift returns. Use `new ObjectId().toHexString()`, as `register/route.ts` already does. The same check applies to any app inserting into the `user_*` dance collections.
- Migrations `0001` to `0003` (dance ids, `ldco` timestamps, user ids) are applied to the local database only; they still need running against live once a backup approach exists.
- Migrate `bld.events.durationMinutes` to number (1 of 280 is a string). Done locally: `0002` converted `createdAt` / `updatedAt` strings in `ldco` to Dates (not yet applied to live).
- Other string timestamps outside `ldco` (for example `copperknob_alert` `lastRunAt` / `lastCheckedAt`, `djfeed` `feedAppliedAt`, `event_registrations` `sentAt` / `waiverSignedAt`, `ldco.choreographers.lastImportedAt`) still follow the old string convention. Decide per app whether to convert, since the apps write and read them as strings.
- Review the generated schemas, especially the placeholders for empty collections (`djfeed.dj_wallet_locks`, `ldco.oauth_auth_codes`, `ldco.user_favorite_venues`, all of `ldco-reviews`), and re-run `contract:infer` once they have data.

### Features
- Relationship view: built at `/relationships` (inferred from value overlap with other collections' `_id`s). Still to do: review the dangling references it reports, and consider curated relationship definitions for cases it can't infer.
- Quarantine step in the migration runner: move contract-violating documents to `ldco-reviews` (decision 10).
- Make the mandatory check (decision 12) easy to adopt: for example a command that adds the prebuild step to an app's `package.json`.
- UI for migration status, plan and apply (CLI exists: `npm run db:migrate`).
- Replace the shared-password login with a standard solution (for example `ldco-auth`).
- Allow migrations against live once a backup/rollback approach exists.

### Rollout
- Commit and merge to `main` to publish contract 0.3.0; set `ADMIN_PASSWORD`, `MONGODB_URI` and `CONTRACT_API_TOKEN` in Vercel (keep `MONGODB_URI` off live unless intended).
- Add `@ldco/database` and the `ldco-db-check` prebuild step to every app, with `LDCO_DATABASE_URL` and `LDCO_DATABASE_TOKEN` set in each Vercel project. Apps: `line-dance-manager`, `line-dance-manager-admin`, `line-dance-dj-feed`, `copperknob-alert`, `ldco-auth`, and `dance-folly-website` (the "line-dance-follow" app). `dance-folly-website` is a Next 14 / mongodb 6.20 app that uses `bld` (`dj_sessions`, `dj_requests`, `spotify_tokens`), `ldco-events` and `ldco`, and it already reads `ldco-reviews.dances` for stepsheet lookups, so quarantining dances there (decision 10) does not hide them from it.
- Decide how Vercel installs the package from a private GitHub repo (access token or a registry).
- Align `mongodb` driver versions across the apps (currently 6.18 to 7.7).

### Later
- Move the `music_catalog` lookup API (MusicBrainz search that records new tracks) to a controlled place, and decide whether it writes through this contract. Not urgent.
- Universal track plan (decision A/B above), if pursued.
- Revisit privileged database access, backups and anonymisation when other admins or users are involved.