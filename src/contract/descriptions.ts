// What each collection holds: one document = one what, plus anything non-obvious (who writes it,
// known quirks). Hand-maintained, outside the generated collections/ folder. Collections missing
// from here show "No description yet" in the UI.

export const descriptions: Record<string, string> = {
  // Dance catalog
  "ldco.dances":
    "One line dance: name, difficulty, choreographers, stepsheet link(s) and its song. primaryTrack/tracks point at matched tracks; until a track is matched, the scraped song is kept in songArtists.",
  "ldco.choreographers": "One choreographer. Created by the admin bulk import and copperknob-alert when a dance names someone new.",
  "ldco.tracks": "One matched song (Spotify-shaped: name, artists, uri, isrc, duration). Only real matched tracks; placeholder tracks were removed by migration 0005.",
  "ldco.dance_tracks":
    "Links a dance to a track (isPrimary). A one-time snapshot from July 2025 that nothing reads or writes; its shape is the model for future dance-to-track links.",
  "ldco.pending_dances": "A dance a user submitted in line-dance-manager, waiting for admin approval before it becomes an ldco.dances entry.",
  "music_catalog.tracks":
    "One song from MusicBrainz (title, artist, ISRCs, duration, year), cached when the lookup API finds it. Candidate universal track that dances will link to.",

  // Dancer experience
  "ldco.user_known_dances": "A dancer marked a dance as known.",
  "ldco.user_favorite_dances": "A dancer marked a dance as a favourite.",
  "ldco.user_flagged_dances": "A dance on a dancer's wishlist (shown as \"Wishlist\" in line-dance-manager; \"flagged\" in the data).",
  "ldco.user_refresh_dances": "A dancer marked a dance as needing a refresh.",
  "ldco.dance_collections": "A dancer's named list of dances (danceIds), optionally private, copyable or archived.",
  "ldco.user_follow_collections": "A dancer follows another user's dance collection.",
  "ldco.user_lessons": "A dancer plans to attend a lesson (ldco.lessons).",
  "ldco.user_venues": "A dancer's \"My Venue\" favourite in line-dance-manager. Not the same as an instructor's venues (instructor_venues).",
  "ldco.venue_checkins": "A dancer checked in at a venue on a given day (dateKey).",
  "djfeed.session_attendance": "A signed-in dancer was at a host's live DJ Feed event: first and last seen. Written by the DJ Feed; moved from ldco (decision 20).",
  "djfeed.host_dancers": "Summary of which dancers dance with which host (DJ or instructor): first/last seen and number of events. Written by the DJ Feed; moved from ldco (decision 20).",
  "djfeed.feed_lessons":
    "A dance a host ran as a lesson block at a DJ Feed event (one per dance per event). Written by the DJ Feed. Not the taught history: ldco-lessons.lessons (committed in the admin) is the source of truth; joined by host, dance and local date to find which dancers were at a lesson (decision 20).",
  "djfeed.lesson_checks":
    "A dancer's answer, after a lesson they were at, about a dance on their wishlist (known, refresh or not_taken), per feed lesson so they're asked once. Written by the DJ Feed (decision 20).",
  "djfeed.dancer_favorite_songs": "A dancer's favourite song in the DJ Feed.",

  // Instructing
  "ldco.instructors": "One instructor, optionally linked to a user account (userId).",
  "ldco.instructor_venues": "An instructor teaches at a venue: their \"my venues\" in line-dance-manager's instructor dashboard.",
  "ldco.venues":
    "One venue: name, address, coordinates, phone, website. The single venue list shared by line-dance-manager and the personal site (bld.venues was merged in by migration 0012).",
  "ldco.venue_users": "A user approved as managing a venue (from a venue claim reviewed in ldco-reviews.venue_users).",
  "ldco.lessons": "A recurring weekly lesson in line-dance-manager: day, start time, duration, cost, difficulty, instructors and venue.",
  "ldco.events": "A venue event created from line-dance-manager's venue dashboard. Empty on live so far.",
  "ldco-lessons.event_types":
    "A recurring event at a venue (ldco.venues): title, level, price, default 24-hour local start time and length, on/off switch. createdBy is the instructor with final say (decisions 15, 18).",
  "ldco-lessons.frequencies": "When an event type repeats: weekly on given days (WEEKLY), or the nth weekday of the month (MONTHLY_NTH_WEEKDAY), at a 24-hour local time in the venue's zone. Optional start/end dates and its own on/off switch.",
  "ldco-lessons.events": "One stored event: of an event type, or a special event with its own venue, title and creator. Start/end as UTC instants plus the venue's zone; cancellation, substitute and special notes; the lessons planned or taught that day. Unstored dates are projected from frequencies.",
  "ldco-lessons.lessons": "History: one dance taught, with the instructor, venue and event recorded when it was marked taught, and the venue's name at the time. Moved from bld.lessons.",
  "ldco-lessons.event_templates": "A reusable lesson plan for an event type (24-hour local times), used to prefill an event's lessons.",
  "ldco-lessons.event_instructors": "Who teaches what: an instructor linked to an event type, or to a special event. role is creator or co-instructor (decision 18).",
  "ldco-lessons.event_instructor_requests": "An instructor asking to co-teach an event type or special event, waiting for its creator (not an admin) to approve.",
  "bld.event_types":
    "A recurring class Stephen teaches at a venue (ldco.venues): title, level, price, default time. Switched on or off with isActive; a class is running when it and one of its frequencies are on (decision 15).",
  "bld.frequencies": "When an event type repeats: weekly on given days, or monthly on the nth weekday. Optional start/end dates and its own on/off switch. Running frequencies project events onto the calendar.",
  "bld.events": "One stored, dated occurrence of an event type (generated from frequencies or a one-off), with substitute/cancellation notes and the planned lessons for that night. Unstored future dates are projected from frequencies.",
  "bld.event_templates": "A reusable lesson plan for an event type, used to prefill an event's planned lessons.",
  "bld.lessons": "History: one dance taught at a venue on a date, written when an event's planned lessons are committed in the admin. The venue is stored as its name (text) at the time.",
  "ldco-events.events": "A ticketed special event (e.g. a social) with its own registration page on the personal site.",
  "ldco-events.event_registrations": "One registration for a ticketed event: attendee details, waiver, payment status and song requests.",

  // DJ feed
  "djfeed.dj_sessions": "One DJ event: owner, status (draft, active, closed), timing and feature settings (tipping, fairness, partner dances).",
  "djfeed.dj_requests": "One song request in a DJ session: the dance, song, requester, queue position and play status. Requests from before the app split carry migratedFrom: \"bld\".",
  "djfeed.dj_messages": "A message the DJ shows on the feed during a session.",
  "djfeed.dj_direct_messages": "A private message from the DJ to one dancer.",
  "djfeed.dj_notifications": "A notification for a DJ, e.g. a tip received.",
  "djfeed.attendee_notifications": "A notification for a dancer, e.g. beats gifted by a DJ.",
  "djfeed.dj_profiles": "A DJ's settings: Stripe account, payment links and feed display templates.",
  "djfeed.dj_requester_nicknames": "A nickname a DJ gave a requester, kept across sessions.",
  "djfeed.requester_history": "Everything one requester asked for in one session, kept after the session's requests are cleared.",
  "djfeed.session_reports": "The summary of a finished DJ session: tracks played, duration and stats.",
  "djfeed.beat_balances": "A dancer's current beats balance (the DJ Feed's tipping currency).",
  "djfeed.beat_transactions": "One beats movement for a dancer: a purchase via Stripe or a tip spent on a request.",
  "djfeed.dj_wallet_transactions": "One entry in a DJ's wallet ledger: tips received, payments for sessions, withdrawals. Balances are the sum of these.",
  "djfeed.dj_wallet_locks": "Short-lived lock that stops two wallet updates for the same DJ running at once.",
  "djfeed.session_transactions": "A DJ paying for a session or a session add-on.",
  "djfeed.stripe_events": "A Stripe webhook event already processed, so retries aren't applied twice.",
  "djfeed.free_access": "An email given free DJ Feed access (e.g. beta testers), optionally until a date.",

  // Identity and social
  "ldco.users": "One user account (name, email, profile; bcrypt password hash or Google id). Shared by every app through ldco-auth.",
  "ldco.login_events":
    "One sign-in: who, which app (OAuth client), provider, IP, user agent and time. Written by ldco-auth; this is the sign-in audit trail.",
  "ldco.oauth_auth_codes": "Short-lived OAuth codes ldco-auth issues while an app signs a user in.",
  "ldco.friend_requests": "A pending friend request between two users.",
  "ldco.user_friends": "Two users who are friends.",
  "ldco.user_follows": "A user follows another user.",

  // Copperknob alerts
  "copperknob_alert.watch_rules": "A rule for copperknob's new-dance feed (choreographer and/or dance name, fuzzy match) that sends Stephen a phone alert.",
  "copperknob_alert.processed_items": "A feed item that matched a rule and was alerted, so it isn't alerted twice.",
  "copperknob_alert.sync_metadata": "When the cron last copied new feed dances into ldco.dances, and how many.",

  // Review and moderation
  "ldco-reviews.dances": "Dances waiting for review, plus contract-violating dances quarantined from ldco.dances.",
  "ldco-reviews.tracks": "Tracks waiting for review (line-dance-manager's add-track writes here first).",
  "ldco-reviews.choreographers": "Choreographers waiting for review.",
  "ldco-reviews.venues": "Venues waiting for review.",
  "ldco-reviews.lessons": "Lessons waiting for review before they become ldco.lessons entries.",
  "ldco-reviews.venue_users": "A user's claim to manage a venue, waiting for admin approval.",
  "ldco-reviews.verify_user_instructor": "A user asking to be verified as an instructor, with the admin's resolution.",
  "ldco-reviews.join_choreographer_appeals": "A user asking to be recognised as a choreographer (linked to a choreographer record), waiting for an admin.",
  "ldco-reviews.reports": "A user report about a venue, lesson, instructor or event (issue type, description, suggested fix), waiting for an admin.",
};

export function describe(key: string): string | undefined {
  return descriptions[key];
}
