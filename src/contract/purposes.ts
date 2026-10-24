// Which purpose each collection serves (decision 14: databases are organised by purpose, not by app).
// Hand-maintained, outside the generated collections/ folder. Reasoning and open questions live in
// docs/database-layout.md. Collections missing from here show up as "Unassigned" in the UI.

export interface Purpose {
  id: string;
  name: string;
  description: string;
  collections: string[];
  notes?: string[];
}

export const purposes: Purpose[] = [
  {
    id: "catalog",
    name: "Dance catalog",
    description: "Dances, songs and choreographers: what exists in the line-dance world, independent of any user.",
    collections: [
      "ldco.dances",
      "ldco.choreographers",
      "ldco.tracks",
      "ldco.dance_tracks",
      "ldco.pending_dances",
      "music_catalog.tracks",
    ],
    notes: [
      "Planned: dances link to music_catalog tracks, with per-service (Spotify, Apple Music, …) link collections.",
      "dance_tracks is a stale snapshot, but its shape is the model for that link.",
    ],
  },
  {
    id: "dancer",
    name: "Dancer experience",
    description: "A dancer's own relationship to dances, lessons, venues and instructors.",
    collections: [
      "ldco.user_known_dances",
      "ldco.user_favorite_dances",
      "ldco.user_flagged_dances",
      "ldco.user_refresh_dances",
      "ldco.dance_collections",
      "ldco.user_follow_collections",
      "ldco.user_lessons",
      "ldco.user_venues",
      "ldco.venue_checkins",
      "djfeed.session_attendance",
      "djfeed.host_dancers",
      "djfeed.feed_lessons",
      "djfeed.lesson_checks",
      "djfeed.dancer_favorite_songs",
    ],
    notes: ["user_venues is the dancer's \"My Venue\" favourite, distinct from an instructor's own venues."],
  },
  {
    id: "instructing",
    name: "Instructing",
    description: "An instructor managing venues, lessons, schedules and events.",
    collections: [
      "ldco.instructors",
      "ldco.instructor_venues",
      "ldco.venues",
      "ldco.venue_users",
      "ldco.lessons",
      "ldco.events",
      "ldco-lessons.event_types",
      "ldco-lessons.frequencies",
      "ldco-lessons.events",
      "ldco-lessons.lessons",
      "ldco-lessons.event_templates",
      "ldco-lessons.event_instructors",
      "ldco-lessons.event_instructor_requests",
      "bld.events",
      "bld.event_types",
      "bld.event_templates",
      "bld.frequencies",
      "bld.lessons",
      "ldco-events.events",
      "ldco-events.event_registrations",
    ],
    notes: [
      "ldco.venues is the one venue list; bld (Stephen's schedule) points at it from event_types.venueId. An instructor's own venues are instructor_venues.",
      "Three different collections are called events (venue events, class occurrences, ticketed events).",
      "Decision 18: ldco-lessons is the instructors' own database (event types, frequencies, events, lessons, who teaches what). It replaces bld's schedule collections, which stay until the admin and the personal site read ldco-lessons; bld itself stays for Beyond Line Dance-only data (decision 19). Dancer-facing apps read it; only instructor features write it.",
      "Venues, instructors and instructor_venues stay in ldco, so dancer-facing apps don't need instructor scopes.",
    ],
  },
  {
    id: "djfeed",
    name: "DJ feed",
    description: "DJ sessions, song requests, messages and reports, plus beats (the DJ feed's tipping and wallet money).",
    collections: [
      "djfeed.dj_sessions",
      "djfeed.dj_requests",
      "djfeed.dj_messages",
      "djfeed.dj_direct_messages",
      "djfeed.dj_notifications",
      "djfeed.attendee_notifications",
      "djfeed.dj_profiles",
      "djfeed.dj_requester_nicknames",
      "djfeed.requester_history",
      "djfeed.session_reports",
      "djfeed.beat_balances",
      "djfeed.beat_transactions",
      "djfeed.dj_wallet_transactions",
      "djfeed.dj_wallet_locks",
      "djfeed.session_transactions",
      "djfeed.stripe_events",
      "djfeed.free_access",
    ],
  },
  {
    id: "identity",
    name: "Identity and social",
    description: "Who a user is, how they signed in (login_events is the sign-in audit), and who they know.",
    collections: [
      "ldco.users",
      "ldco.login_events",
      "ldco.oauth_auth_codes",
      "ldco.friend_requests",
      "ldco.user_friends",
      "ldco.user_follows",
    ],
  },
  {
    id: "copperknob",
    name: "Copperknob alerts",
    description: "Watches copperknob's RSS feed and sends phone alerts; its cron also adds new dances to the catalog.",
    collections: ["copperknob_alert.watch_rules", "copperknob_alert.processed_items", "copperknob_alert.sync_metadata"],
  },
  {
    id: "reviews",
    name: "Review and moderation",
    description: "Things waiting for a human decision, including documents quarantined for violating the contract.",
    collections: [
      "ldco-reviews.dances",
      "ldco-reviews.tracks",
      "ldco-reviews.choreographers",
      "ldco-reviews.venues",
      "ldco-reviews.lessons",
      "ldco-reviews.venue_users",
      "ldco-reviews.verify_user_instructor",
      "ldco-reviews.join_choreographer_appeals",
      "ldco-reviews.reports",
    ],
  },
];

const byCollection = new Map(purposes.flatMap((p) => p.collections.map((c) => [c, p] as const)));

export function purposeOf(key: string): Purpose | undefined {
  return byCollection.get(key);
}
