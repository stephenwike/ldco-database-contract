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

## 15. Stephen's schedule: on/off decides whether a class is running
In `bld`, an event type is a recurring class at a venue, frequencies say when it repeats, events are its dated occurrences (projected from frequencies or stored), an event's embedded `lessons` are the plan for that night, and committing them writes the permanent history to `bld.lessons` (field notes: [data-model.md](data-model.md#stephens-class-schedule-bld)).

A class is **running** when its event type is switched on and at least one of its frequencies is switched on and hasn't passed an end date. `isActive` missing counts as on. Switching off is the normal way to stop a class; start and end dates are optional. Every place that asks "is this running?" uses the same rule: `dance-folly-website`'s `lib/schedule.js` (current venues, the dance page's venue filter) and its events endpoint. Before 2026-10-15 the current-venues list only checked end dates, which is why Washington Park stayed listed after being switched off.

## 16. The schedule is for every instructor, and lives in `ldco`
Decided 2026-10-15. Stephen's schedule (decision 15) becomes something any instructor in `line-dance-manager` can use. Field notes: [data-model.md](data-model.md#instructor-schedule-ldco-lessons).

**Superseded in part by decision 18 (2026-10-19):** the home (`ldco-lessons`, not `ldco`), the collection and field names (`bld`'s are kept), and where co-instructor requests live. The ownership model, special events, the creator's final say, lessons fitting inside their event, leaving a venue, UTC for dated things and the two lesson systems still stand, under decision 18's names.

- **Home:** `ldco`, next to `instructors`, `venues` and `instructor_venues`. MongoDB's `$lookup` only joins within one database, and an instructor's schedule is found by joining through those collections. The name `bld` (Beyond Line Dance) no longer fits shared data. Collections: `event_types`, `event_instructors`, `event_schedules` (was `frequencies`), `event_dates` (was `events`), `event_templates`, `taught_lessons` (was `lessons`). The names avoid `ldco.events`, `frequencies` and `exceptions` (the venue-owner time blocks). Migration `0013` copies `bld` across; `bld` is dropped by a later migration once the admin and `dance-folly-website` read `ldco`.
- **Ownership is inferred, with one link collection.** Documents don't carry an instructor id. An event type belongs to a venue; `event_instructors` links instructors to event types (many to many); event dates belong to an event type. A venue alone isn't enough, because a venue can have several instructors (12 of 57 do), including two classes at once on two dance floors.
- **Special events** are event dates with no event type. They carry their own `venueId`, `title` and `createdBy`, and are linked to instructors through the same `event_instructors` collection (a row has either `eventTypeId` or `eventDateId`).
- **The creator has final say** over an event type or special event (`createdBy`, and `role: "creator"` on the link). Co-instructors are added by the creator, or ask to join; pending requests live in `ldco-reviews.event_instructors`, mirroring `venue_users` (decision 10), and the creator approves. There is no venue-owner role in the schedule.
- **Two places record an instructor instead of inferring it.** A night's substitute (`substituteName` always; `substituteInstructorId` when they're a registered instructor, picked by autocomplete but never required). And taught history: `taught_lessons.instructorId` and `venueId` are written when a lesson is marked taught, so later changes to who's linked don't rewrite what someone taught. The existing 1,579 history rows were all Stephen's.
- **Lessons have a status:** `planned`, `taught` or `skipped`. "Changed" is editing the planned lesson before marking it taught.
- **Lessons must fit inside their night's times** (the night's own start and end). The check lives in one function so it can be relaxed for edge cases later. 3 of 691 existing lessons fall outside; they're left as they are.
- **Time:** dated things are UTC instants (`startAt`, `endAt`, `taughtAt`) plus the venue's IANA zone, per decision 9; recurring rules and templates keep a local 24-hour `HH:mm`, because a recurrence has to follow the venue's wall clock across daylight saving. `event_dates.date` is the night's local date, the key projected nights are matched on. Every venue gets `timeZone` (all are `America/Denver` today). Events can span several days (special events); apps should confirm before saving one that does.
- **Leaving a venue** removes the instructor from that venue's event types and special events after a confirmation that lists what goes. A class with another instructor keeps running for them; a class left with no instructor, its future nights and its planned lessons are removed. Past nights and `taught_lessons` stay. Venues left with no instructor go to the admin's review list.
- **Two lesson systems run side by side for now.** `ldco.lessons` (recurring weekly lessons, which dancers save through `user_lessons`) is unchanged. Venue pages show both.

Bug found on the way: the admin's commit step wrote history times with a hardcoded `-07:00`, which is an hour off during daylight time. Migration `0013` reads the wall clock and applies Mountain Time (779 rows corrected).

Added while building it in `line-dance-manager`: `taught_lessons.lessonId` points at the `event_dates` lesson a row came from, so un-marking a lesson removes exactly its row (migrated history has none). A history query must never filter on an empty `lessonId`, which would match every migrated row.

## 17. "Not validated" is a field, not a location
Decided 2026-10-15. Venues, weekly lessons and events are all treated as not validated until an admin, or the instructor who teaches there, confirms them: many are test data, and others are old and at places that have since closed.

- `verifiedAt` (Date, or null for not validated) and `verifiedBy` (user id) on `ldco.venues`, `lessons`, `event_types` and `event_dates`. Migration `0014` added them as null everywhere (68 venues, 107 lessons, 19 event types, 280 event dates locally).
  - Decision 18 moves event types and events to `ldco-lessons` (`event_types`, `events`), where migration `0013` creates them with these fields; migration `0014` now covers only `ldco.venues` and `ldco.lessons`.
- Documents don't move. The older signal (verified = in `ldco`, unverified = in the same-named `ldco-reviews` collection) stays for new submissions waiting for approval; moving everything there would empty `ldco.venues`, break the personal site and the admin, and separate venues from the schedule that joins to them. Apps show something as verified only when it's in `ldco` and has a `verifiedAt`.
- An instructor's own activity is the validation (revised 2026-10-19): linking or creating a venue, creating or editing a weekly lesson they teach, creating or editing a class they created, and planning or editing a night all set `verifiedAt` / `verifiedBy`. There is no standing "confirm" button.
- Only what isn't validated asks for attention: an alert on the instructor dashboard lists their unconfirmed venues, running classes they created, and approved weekly lessons, each with Confirm. Today that's data from before validation existed. Planned: dancers can challenge a venue's validity, which clears its `verifiedAt` so it shows up in that alert; and an admin validation section in `line-dance-manager-admin` (its `docs/TODO.md`) catches venues whose instructors have stopped using the app.
- The contract shows these fields as always null until something is confirmed in the data the contract is inferred from; re-run `contract:infer` after that so `verifiedAt` becomes a nullable Date.
- Instructors don't mark venues closed (decided 2026-10-19; it's beyond their responsibilities). An instructor says where they teach (`instructor_venues`), and "not current" just removes their link. A venue nobody teaches at doesn't appear on `line-dance-manager`'s venues page; it stays in `ldco.venues`, reachable by link and findable by instructors who want to add it. Retiring venues for good is the admin's job.

## 18. Instructor data has its own database: `ldco-lessons`
Decided 2026-10-19. Supersedes decision 16's home, collection names and field formats. Field notes: [data-model.md](data-model.md#instructor-schedule-ldco-lessons).

- **Scope by database.** Direct instructor operations (what they teach, where, when, with whom) live in `ldco-lessons`, so a dancer-focused app never needs instructor scopes in `ldco`. Dancer-facing apps still **read** `ldco-lessons` (beyondlinedance.com's calendar, venue pages' upcoming events); only instructor features write it. The name says what's in it: it's where lesson data lives.
- **Stays in `ldco`:** `venues`, `instructors` and `instructor_venues` ("which venues I teach at"), because dancer-facing apps use them.
- **`bld`'s published names are kept:** `event_types`, `frequencies`, `events`, `lessons` (the taught history) and `event_templates`, in `ldco-lessons`. In their own database they don't collide with `ldco.events` or `ldco.lessons`, which was why decision 16 renamed them. `bld` is dropped by a later migration once the admin and `dance-folly-website` read `ldco-lessons`.
- **New collections:** `event_instructors` (who teaches which event type or special event; role `creator` or `co-instructor`) and `event_instructor_requests` (requests to co-teach, waiting for the creator). Requests are between instructors, so they're instructor scope and live here, not in `ldco-reviews` (which is for admin review).
- **Field changes from `bld`, each approved:**
  - Ids and references are strings (decision 5); `bld` still had ObjectIds.
  - Dated things are UTC Dates plus the venue's IANA zone (decision 9), for localization later: `events.startAt` / `endAt` replace `startTime` / `endTime` / `endDayOffset` / `durationMinutes`; each event lesson's `startAt` replaces its `time`; `lessons.date` (history) becomes a Date. `events.date` stays the local `YYYY-MM-DD`, which is how a stored event is matched to the date its frequency projects. `events.timeZone` records the zone; `ldco.venues.timeZone` is the source.
  - Recurring rules stay local wall-clock time as 24-hour `HH:mm` (`frequencies.startTime`, `event_types.defaultStartTime`, `event_templates` lesson times): "every Monday at 7 PM" has to stay 7 PM across daylight saving, which a UTC time can't express. `frequencies.kind` keeps `WEEKLY` / `MONTHLY_NTH_WEEKDAY`.
  - `event_types`: + `createdBy` (the instructor with final say), + `verifiedAt` / `verifiedBy` (decision 17). `endDayOffset` (one document) is dropped; the length implies it.
  - `events`: special events have no `eventTypeId` and carry `venueId`, `title` and `createdBy`; multi-day events are just a later `endAt`; + `substituteInstructorId` next to `substitute` (the name, always); each lesson gets an `_id` and a `skipped` flag (`committed` still means taught; neither means planned); + `verifiedAt` / `verifiedBy`.
  - `lessons` (history): + `instructorId`, `venueId`, `eventId`, `lessonId`, recorded when a lesson is marked taught; `venue` keeps the name as text.
- **Joins happen in app code.** MongoDB's `$lookup` doesn't cross databases, which was decision 16's reason for `ldco`. Venue and instructor names are looked up separately, as the admin and the personal site already do; fine at this size.
- **Migrations:** `0013` creates `ldco-lessons` from `bld` (insert-only; `bld` keeps working until the apps switch), and `0014` gives `ldco.venues` a time zone and adds the validation fields to `ldco.venues` and `ldco.lessons`. Both were rewritten on 2026-10-19 before going live; the earlier local versions copied `bld` into `ldco` under decision 16's names and were never published. `db:sync-local` and `db:backup-live` include `ldco-lessons`.
- **Open to change:** UTC times and the other formats can be adjusted if a better approach turns up while the consuming apps move over.

## 19. `bld` stays, for data only Beyond Line Dance uses
Decided 2026-10-21. Supersedes the part of decision 18 that drops `bld` entirely.

- Data isolated to Stephen's instructor website and its tools (beyondlinedance.com / `dance-folly-website`, `beyond-line-dance-webhooks`, the admin's Beyond Line Dance pages) lives in `bld`. Shared instructor data stays in `ldco-lessons`, which every instructor uses.
- First such collection: `bld.social_posts`, the Facebook posts `beyond-line-dance-webhooks` drafts and publishes from Stephen's schedule (lesson plans, the weekly outline, cancellations), reviewed on the admin's Social Posts page. It reads the schedule from `ldco-lessons` filtered to Stephen's instructor id, and writes only to `bld`.
- What's dropped after the apps move is `bld`'s schedule collections (`event_types`, `frequencies`, `events`, `lessons`, `event_templates`), not the database.
- `social_posts` joins the contract (under `bld`) once it has documents to infer from.

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

### Instructor schedule (decisions 16 to 19)
- Migrations `0013` (create `ldco-lessons` from `bld`) and `0014` (`ldco` venue time zone and validation fields) are applied locally only. On live, `0013` runs before the apps that read `ldco-lessons` deploy; it's insert-only, so `bld` keeps working meanwhile.
- Point `line-dance-manager-admin`'s `/api/admin/bld/*` routes and `dance-folly-website` (`lib/schedule.js`, `getevents`, `getvenues`, `getdances`) at `ldco-lessons`, filtered to Stephen's instructor id through `event_instructors`, and adapt them to decision 18's formats (UTC `startAt` / `endAt`, 24-hour frequency times, string ids). Anything written to `bld` between `0013` and that deploy has to be re-copied, so do both in one sitting. Then add a migration that drops `bld`'s schedule collections (decision 19 keeps the database).
- The admin's commit step stops hardcoding `-07:00` when it writes `ldco-lessons.lessons` (a UTC `date`).
- `ldco.venues.timeZone` is now on every venue. Apps that create venues (`line-dance-manager`'s add-venue, the admin) must set it (`America/Denver` until venues outside Colorado exist).
- Students for the new events: student counts and dance requests in `line-dance-manager` come from dancers saving a weekly lesson (`user_lessons` → `ldco.lessons`). Dancers need a way to save an event type (or an event) before the Students tab reflects events in `ldco-lessons`.
- Re-run `contract:infer` once special events, event-level instructor links, registered substitutes, confirmed (`verifiedAt`) documents, history `lessonId`s and co-instructor requests exist (see the list in [data-model.md](data-model.md#instructor-schedule-ldco-lessons)).
- On live, every app that creates venues or weekly lessons must write `verifiedAt: null` / `verifiedBy: null` (and venues a `timeZone`), or new documents violate the contract: `line-dance-manager` does; the admin's venue create and its approval of `ldco-reviews` venues and lessons into `ldco` don't yet.
- Each app that reads or writes `ldco-lessons` needs it in its database access (the shared Atlas user, or per-app users after the password rotation in [rollout.md](rollout.md)).
- `beyond-line-dance-webhooks` and the admin's Social Posts routes store posts in `bld.social_posts` (decision 19), not `ldco-lessons`; both currently point at `ldco-lessons` and need switching. Add `bld.social_posts` to the contract, purposes and descriptions once it has documents.
- `line-dance-manager`'s instructor dashboard (branch `feature/instructor-dashboard-redesign`, uncommitted) reads and writes `ldco-lessons` with decision 18's names (`core/db/ldcoLessons.ts`), tested against the local copy. Its API responses keep their own field names (`danceName`, a lesson `status` worked out from `committed` / `skipped`, `substituteName`), mapped at the edge.

### Retire `beyondlinedance-companion`
It was absorbed into `line-dance-manager-admin` and is not part of the rollout. It still has code that reads and writes `bld`, `ldco` and `ldco-reviews` (last commit 2026-06-02).
- Check that every feature has an equivalent in `line-dance-manager-admin`. Candidates from its code include lesson plans, frequencies, one-off events, event generation, lesson overview and the `/api/occurrences` and `/api/dances` endpoints.
- Confirm it is fully removed from Vercel (project deleted, or at least no deployments and no `MONGODB_URI`), so nothing keeps writing to the shared databases.

### Later
- Move the `music_catalog` lookup API (MusicBrainz search that records new tracks) to a controlled place, and decide whether it writes through this contract. Not urgent.
- Universal track plan (decision A/B above), if pursued.
- Revisit privileged database access, backups and anonymisation when other admins or users are involved.