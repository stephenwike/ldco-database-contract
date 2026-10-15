# Database layout by purpose (draft)

Decision 14: collections are grouped by purpose, not by app, and duplicate collections are not kept. This draft is built from the local copy of live (2026-10-14; document counts in brackets). Nothing has moved yet. Items marked **?** are open.

## Purposes

### 1. Dance catalog: dances, songs, choreographers
What exists in the line-dance world, independent of any user.
- `ldco.dances` (2,293), `ldco.choreographers` (688), `ldco.tracks` (1,401 after removing 785 stubs), `ldco.dance_tracks` (797), `ldco.pending_dances` (2)
- `music_catalog.tracks` (34,137). Direction (not final, needs careful planning): dances reference a `music_catalog` id instead of a Spotify track, and per-service collections (Spotify, Apple Music, YouTube, ...) map a catalog id to that service's URL. Tracks missing from MusicBrainz are an edge case still to solve. See future consideration B in [decisions.md](decisions.md).

### 2. Dancer experience
A dancer's own relationship to dances, lessons, venues and instructors.
- Dance library: `ldco.user_known_dances` (1,790), `user_favorite_dances` (548), `user_flagged_dances` (484), `user_refresh_dances` (513), `dance_collections` (63), `user_follow_collections` (2)
- Lessons and venues: `ldco.user_lessons` (6, lessons they plan to attend), `user_venues` (13), `venue_checkins` (24), `session_attendance` (144), `host_dancers` (18)
- **?** `djfeed.dancer_favorite_songs` (1): here, or in the DJ feed?

### 3. Instructing: venues, lessons, schedules, events
An instructor managing where and what they teach.
- `ldco`: `instructors` (45), `instructor_venues` (69), `venues` (57), `venue_users` (1, approved venue claims), `lessons` (107, recurring weekly lessons)
- `bld`: `venues` (17), `events` (280, dated class occurrences with the dances taught), `event_types` (19), `event_templates` (8), `frequencies` (7), `lessons` (1,577, dance taught at a venue on a date). Written by `line-dance-manager-admin`'s `/api/admin/bld/*` routes (formerly `beyondlinedance-companion`).
- Ticketed events: `ldco-events.events` (2), `ldco-events.event_registrations` (47). Written by `dance-folly-website` and the admin registrations pages.

### 4. DJ feed: sessions, requests, reports, beats
- `djfeed`: `dj_sessions` (106), `dj_requests` (5,658), `dj_messages` (87), `dj_direct_messages` (11), `dj_notifications` (8), `attendee_notifications` (13), `dj_profiles` (2), `dj_requester_nicknames` (2), `requester_history` (1,173), `session_reports` (91), `spotify_tokens` (per-DJ Spotify login; none in the local copy yet)
- Beats (the DJ feed's money system): attendees buy beats through Stripe and spend them on tips; DJs get paid into a wallet and can withdraw. `beat_balances` (22), `beat_transactions` (493), `dj_wallet_transactions` (691), `dj_wallet_locks` (0), `session_transactions` (3), `stripe_events` (13), `free_access` (10). Part of the DJ feed unless another app starts charging.

### 5. Identity and social
- `ldco`: `users` (80), `login_events` (340), `oauth_auth_codes` (0), `friend_requests` (12), `user_friends` (12), `user_follows` (4)

### 6. Copperknob alerts
A webhook on copperknob's RSS feed that sends a phone notification when a watch rule matches.
- `copperknob_alert`: `watch_rules` (3), `processed_items` (3), `sync_metadata` (1)
- It also owns a cron job that turns feed items into dances, so it **writes to the dance catalog** (`ldco.dances`, `ldco.choreographers`). Those writes must follow the catalog's rules (decision 7: no `primaryTrack` yet, so keep the scraped song info in `songArtists`).

### 7. Review and moderation
Things waiting for a human decision. Same-named collections here mirror the main ones by design (for example a venue claim lives in `ldco-reviews.venue_users` until approved into `ldco.venue_users`).
- `ldco-reviews`: `lessons` (16), `venue_users` (1), `verify_user_instructor` (1), `join_choreographer_appeals`, `dances`, `tracks`, `choreographers`, `venues`, `reports` (empty), plus quarantined documents (decision 10).

## Duplicate investigation (2026-10-14)

| Suspect | Finding | Proposed action |
|---|---|---|
| `djfeed.user_profiles` vs `ldco.users` | **Done (local, 2026-10-14).** It was a copy of name and email refreshed at DJ Feed sign-in, not an audit: the real audit is `ldco.login_events`, written by ldco-auth for every sign-in (user, app, OAuth client, provider, IP, user agent, time). Migration `0006` backfilled the 19 DJ Feed sign-ins only `user_profiles` knew about into `login_events` (marked `source: "djfeed.user_profiles"`) and dropped the collection. `line-dance-dj-feed` and the admin's feed-transactions page now read names and emails from `ldco.users`. | Done locally. On live, run `0006` only after the DJ Feed is deployed without the sign-in upsert, or the collection comes back. |
| `bld` DJ and beats collections vs `djfeed` | `bld` is the DJ feed's original home inside `dance-folly-website`, before the app split (its DJ code was last changed 2026-05-14, "updated code before major app split"). `bld` data runs 2026-05-02 to 2026-06-23 and `djfeed` from 2026-06-08 on. Same shapes; `djfeed` has newer fields. No shared ids. | **Decided: merge** into `djfeed` so no history is lost (if it causes no issues: ids don't collide; `bld` documents lack newer fields such as `ownerId` on requests, so check that the DJ feed tolerates them). Then delete the DJ code from `dance-folly-website` and drop the `bld` copies. Check first that the old DJ pages are unreachable. |
| `bld.spotify_tokens` (1) | Belongs to the old `dance-folly-website` DJ feature (2026-05-26). `line-dance-dj-feed` keeps its own per-DJ `djfeed.spotify_tokens`. Not related to `spike-spotify-integration` (a 2024 tool for finding missing tracks; it doesn't use this collection). Holds a live refresh token. | Delete with the old DJ code. |
| `ldco.event_registrations` (33) vs `ldco-events.event_registrations` (47) | All 33 were copied to `ldco-events` by the admin's one-time `/api/admin/migrate/events` route, whose own comment says to delete it once confirmed. The `ldco` copy is a leftover. | Drop `ldco.event_registrations` and delete the migration route. |
| Three collections called `events` | Different things with the same name: `ldco.events` (2, venue events in `line-dance-manager`; one is titled "gfd", likely test data), `bld.events` (280, class occurrences), `ldco-events.events` (2, ticketed events). | Not duplicates. Rename for clarity when moving to purpose databases; check whether `ldco.events` is real data. |
| `ldco.venues` (57) vs `bld.venues` (17) | The same concept in different shapes (`venuename`/`venueaddress`/`geolocation` vs `name`/`address`/`city`/`state`). Only 3 of 17 names match exactly, so more may match loosely. `bld.lessons` refers to venues by free text ("Barnum Rec Center - Tuesdays"), not by id. `ldco.venues` serves `line-dance-manager`; `bld.venues` serves Stephen's personal instructor website. The intent is to set everything up once in `line-dance-manager` and have the personal site use it. | Merge into one venues collection, but only after the contract works for both apps. Needs a way to mark which venues are "my venues" for the personal site (for example through `instructor_venues`, linking Stephen's instructor record to venues). Plan carefully. |
| `ldco.lessons` (107) vs `bld.lessons` (1,577) | Different concepts with the same name: a recurring weekly lesson vs a record of which dance was taught where and when. `bld.events` also embeds `lessons`, so `bld.lessons` may duplicate it. | **?** Check whether `bld.lessons` duplicates `bld.events.lessons`; rename one of them. |
| `ldco.user_favorite_venues` (0) vs `ldco.user_venues` (13) | `user_favorite_venues` is empty, and no app code references it. Favouriting a venue is a planned `line-dance-manager` feature, and `user_venues` (`userId`, `venueId`) may be where it ended up. | **?** Check what `user_venues` means in `line-dance-manager`. If it is favourites, drop `user_favorite_venues` and possibly rename `user_venues`; if not, keep the empty collection for the feature. |
| `ldco.dance_tracks` (797) vs `ldco.dances.tracks` | A join collection (`danceId`, `trackId`, `isPrimary`) holding the same links as `dances.primaryTrack` / `dances.tracks`. | **?** Check which apps read it; likely retire in favour of the fields on the dance (or the reverse, as part of the universal-track plan). |
| `ldco.venue_users` vs `ldco-reviews.venue_users` | By design (pending vs approved claim). | Keep. |
