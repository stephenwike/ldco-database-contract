// src/contract/index.ts
import { createHash } from "crypto";
import { z as z76 } from "zod";

// contract.lock.json
var hash = "4d2f3e3eee1d5272b2ae94e40993fedd408a8284a80c8dafd5ffd7bbaeac2edb";

// package.json
var version = "0.14.0";

// src/contract/collections/bld/event_templates.ts
import { z as z2 } from "zod";

// src/contract/bson.ts
import { z } from "zod";
var objectId = z.custom((v) => typeof v === "object" && v !== null && v._bsontype === "ObjectId").meta({ bsonType: "objectId" });
var bsonDate = z.date().meta({ bsonType: "date" });

// src/contract/collections/bld/event_templates.ts
var BldEventTemplatesSchema = z2.strictObject({
  _id: objectId,
  eventTypeId: objectId,
  name: z2.string(),
  lessons: z2.array(z2.strictObject({
    time: z2.string(),
    dance: z2.string().nullable(),
    level: z2.string().nullable(),
    link: z2.null()
  })),
  createdAt: bsonDate,
  updatedAt: bsonDate,
  isDefault: z2.boolean().optional()
});

// src/contract/collections/bld/event_types.ts
import { z as z3 } from "zod";
var BldEventTypesSchema = z3.strictObject({
  _id: objectId,
  title: z3.string(),
  level: z3.string(),
  price: z3.string(),
  defaultStartTime: z3.string(),
  defaultDurationMinutes: z3.number(),
  isActive: z3.boolean(),
  venueId: z3.string(),
  updatedAt: bsonDate.optional(),
  endDayOffset: z3.number().optional(),
  createdAt: bsonDate.optional()
});

// src/contract/collections/bld/events.ts
import { z as z4 } from "zod";
var BldEventsSchema = z4.strictObject({
  _id: objectId,
  date: z4.string(),
  eventTypeId: objectId,
  startTime: z4.string(),
  durationMinutes: z4.number(),
  lessons: z4.array(z4.strictObject({
    time: z4.string(),
    dance: z4.string().nullable(),
    level: z4.string().nullable(),
    link: z4.string().nullable(),
    committed: z4.boolean(),
    danceId: z4.string().nullable().optional()
  })),
  substitute: z4.string().nullable(),
  cancelNote: z4.string().nullable(),
  isCancelled: z4.boolean(),
  updatedAt: bsonDate.optional(),
  endTime: z4.string().optional(),
  endDayOffset: z4.number().optional(),
  specialNote: z4.string().nullable().optional()
});

// src/contract/collections/bld/frequencies.ts
import { z as z5 } from "zod";
var BldFrequenciesSchema = z5.strictObject({
  _id: objectId,
  eventTypeId: objectId,
  kind: z5.string(),
  byDay: z5.array(z5.string()).optional(),
  startTime: z5.string(),
  durationMinutes: z5.number(),
  startDate: z5.string().optional(),
  isActive: z5.boolean().optional(),
  updatedAt: bsonDate.optional(),
  weekday: z5.string().optional(),
  nth: z5.number().optional(),
  endDate: z5.string().optional(),
  createdAt: bsonDate.optional()
});

// src/contract/collections/bld/lessons.ts
import { z as z6 } from "zod";
var BldLessonsSchema = z6.strictObject({
  _id: objectId,
  danceId: z6.string().optional(),
  venue: z6.string(),
  date: z6.string(),
  danceName: z6.string().optional()
});

// src/contract/collections/copperknob_alert/processed_items.ts
import { z as z7 } from "zod";
var CopperknobAlertProcessedItemsSchema = z7.strictObject({
  _id: objectId,
  guid: z7.string(),
  danceTitle: z7.string(),
  details: z7.strictObject({
    method: z7.string(),
    score: z7.number(),
    choreographer: z7.string()
  }),
  matchedRule: z7.string(),
  processedAt: bsonDate,
  status: z7.string(),
  submitUrl: z7.string(),
  youtubeUrl: z7.null()
});

// src/contract/collections/copperknob_alert/sync_metadata.ts
import { z as z8 } from "zod";
var CopperknobAlertSyncMetadataSchema = z8.strictObject({
  _id: objectId,
  key: z8.string(),
  lastPublishedCount: z8.number(),
  lastRunAt: z8.string()
});

// src/contract/collections/copperknob_alert/watch_rules.ts
import { z as z9 } from "zod";
var CopperknobAlertWatchRulesSchema = z9.strictObject({
  _id: objectId,
  id: z9.string(),
  checkIntervalMinutes: z9.number(),
  choreographer: z9.string(),
  danceName: z9.string(),
  fuzzyThreshold: z9.number(),
  lastCheckedAt: z9.string()
});

// src/contract/collections/djfeed/attendee_notifications.ts
import { z as z10 } from "zod";
var DjfeedAttendeeNotificationsSchema = z10.strictObject({
  _id: objectId,
  recipientId: z10.string(),
  type: z10.string(),
  fromDjId: z10.string(),
  fromName: z10.string(),
  beats: z10.number(),
  message: z10.string(),
  read: z10.boolean(),
  createdAt: bsonDate
});

// src/contract/collections/djfeed/beat_balances.ts
import { z as z11 } from "zod";
var DjfeedBeatBalancesSchema = z11.strictObject({
  _id: objectId,
  attendeeId: z11.string(),
  beats: z11.number(),
  updatedAt: bsonDate
});

// src/contract/collections/djfeed/beat_transactions.ts
import { z as z12 } from "zod";
var DjfeedBeatTransactionsSchema = z12.strictObject({
  _id: objectId,
  attendeeId: z12.string(),
  type: z12.string(),
  beats: z12.number(),
  amountCents: z12.number().optional(),
  stripePaymentIntentId: z12.string().optional(),
  stripeSessionId: z12.string().optional(),
  createdAt: bsonDate,
  requestId: z12.string().optional(),
  djId: z12.string().optional(),
  fromDjId: z12.string().optional()
});

// src/contract/collections/djfeed/dancer_favorite_songs.ts
import { z as z13 } from "zod";
var DjfeedDancerFavoriteSongsSchema = z13.strictObject({
  _id: z13.string(),
  userId: z13.string(),
  trackId: z13.string(),
  createdAt: bsonDate
});

// src/contract/collections/djfeed/dj_direct_messages.ts
import { z as z14 } from "zod";
var DjfeedDjDirectMessagesSchema = z14.strictObject({
  _id: objectId,
  senderId: z14.string(),
  recipientId: z14.string().optional(),
  text: z14.string(),
  status: z14.string(),
  createdAt: bsonDate,
  expiresAt: bsonDate.nullable(),
  recipientClientId: z14.string().optional()
});

// src/contract/collections/djfeed/dj_messages.ts
import { z as z15 } from "zod";
var DjfeedDjMessagesSchema = z15.strictObject({
  _id: objectId,
  sessionId: z15.string(),
  ownerId: z15.string(),
  text: z15.string(),
  status: z15.string(),
  duration: z15.number().nullable(),
  createdAt: bsonDate,
  expiresAt: bsonDate.nullable(),
  updatedAt: bsonDate.optional(),
  sendToAll: z15.boolean().optional(),
  migratedFrom: z15.string().optional()
});

// src/contract/collections/djfeed/dj_notifications.ts
import { z as z16 } from "zod";
var DjfeedDjNotificationsSchema = z16.strictObject({
  _id: objectId,
  ownerId: z16.string(),
  type: z16.string(),
  amountCents: z16.number(),
  senderName: z16.string(),
  senderEmail: z16.string(),
  read: z16.boolean(),
  createdAt: bsonDate
});

// src/contract/collections/djfeed/dj_profiles.ts
import { z as z17 } from "zod";
var DjfeedDjProfilesSchema = z17.strictObject({
  _id: objectId,
  ownerId: z17.string(),
  createdAt: bsonDate,
  stripeAccountId: z17.string(),
  updatedAt: bsonDate,
  paymentLinks: z17.array(z17.strictObject({
    label: z17.string(),
    url: z17.string()
  })),
  feedTemplates: z17.array(z17.strictObject({
    id: z17.string(),
    name: z17.string(),
    designedFor: z17.string(),
    slides: z17.array(z17.strictObject({
      id: z17.string(),
      name: z17.string(),
      duration: z17.number(),
      grid: z17.strictObject({
        cols: z17.number(),
        rows: z17.number()
      }),
      elements: z17.array(z17.strictObject({
        id: z17.string(),
        type: z17.string(),
        col: z17.number(),
        row: z17.number(),
        colSpan: z17.number(),
        rowSpan: z17.number(),
        src: z17.string().optional()
      }))
    })),
    createdAt: z17.string(),
    updatedAt: z17.string().optional()
  }))
});

// src/contract/collections/djfeed/dj_requester_nicknames.ts
import { z as z18 } from "zod";
var DjfeedDjRequesterNicknamesSchema = z18.strictObject({
  _id: objectId,
  djId: z18.string(),
  clientId: z18.string(),
  nickname: z18.string(),
  updatedAt: bsonDate
});

// src/contract/collections/djfeed/dj_requests.ts
import { z as z19 } from "zod";
var DjfeedDjRequestsSchema = z19.strictObject({
  _id: objectId,
  sessionId: z19.string(),
  ownerId: z19.string(),
  danceId: z19.string().nullable(),
  danceName: z19.string(),
  songName: z19.string(),
  artist: z19.string(),
  difficulty: z19.string(),
  stepsheet: z19.string(),
  duration_ms: z19.number().nullable(),
  spotifyUri: z19.string().nullable().optional(),
  clientId: z19.string(),
  requesterName: z19.string(),
  notes: z19.string(),
  danceType: z19.string().nullable().optional(),
  isSongSwap: z19.boolean().optional(),
  swapSongName: z19.string().nullable().optional(),
  swapArtist: z19.string().nullable().optional(),
  tipCents: z19.number().optional(),
  isRepeat: z19.boolean().optional(),
  status: z19.string(),
  queuePosition: z19.number().nullable(),
  createdAt: bsonDate,
  updatedAt: bsonDate,
  advancedBy: z19.string().optional(),
  playStartedAt: bsonDate.optional(),
  pausedAt: bsonDate.nullable().optional(),
  partnerStyle: z19.string().nullable().optional(),
  partnerGroupId: z19.string().nullable().optional(),
  localTrackKey: z19.string().nullable().optional(),
  catalogTrackId: z19.string().nullable().optional(),
  isrcs: z19.array(z19.string()).optional(),
  tempo: z19.number().nullable().optional(),
  playLengthMs: z19.number().optional(),
  volumeDb: z19.number().optional(),
  migratedFrom: z19.string().optional()
});

// src/contract/collections/djfeed/dj_sessions.ts
import { z as z20 } from "zod";
var DjfeedDjSessionsSchema = z20.strictObject({
  _id: objectId,
  ownerId: z20.string(),
  name: z20.string(),
  slug: z20.string().optional(),
  status: z20.string(),
  plugin: z20.string().optional(),
  startedAt: bsonDate.nullable(),
  endsAt: bsonDate.nullable().optional(),
  closedAt: bsonDate.nullable(),
  partnerDancesEnabled: z20.boolean().optional(),
  weightDecayEnabled: z20.boolean().optional(),
  weightDecayHalfLifeMinutes: z20.number().optional(),
  tippingEnabled: z20.boolean().optional(),
  autoClosedAt: bsonDate.optional(),
  fairnessScoringEnabled: z20.boolean().optional(),
  durationMinutes: z20.number().optional(),
  queueVisibleCount: z20.number().optional(),
  feedTemplateId: z20.string().optional(),
  feedAppliedAt: z20.string().optional(),
  feedAspectRatio: z20.string().optional(),
  requestsEnabled: z20.boolean().optional(),
  suppressedClientIds: z20.array(z20.unknown()).optional(),
  addOns: z20.array(z20.unknown()).optional(),
  migratedFrom: z20.string().optional(),
  shareTimeZone: z20.string().optional(),
  shareToken: z20.string().optional()
});

// src/contract/collections/djfeed/dj_wallet_locks.ts
import { z as z21 } from "zod";
var DjfeedDjWalletLocksSchema = z21.looseObject({ _id: z21.union([z21.string(), objectId]) });

// src/contract/collections/djfeed/dj_wallet_transactions.ts
import { z as z22 } from "zod";
var DjfeedDjWalletTransactionsSchema = z22.strictObject({
  _id: objectId,
  ownerId: z22.string(),
  type: z22.string(),
  amountCents: z22.number(),
  requestId: z22.string().optional(),
  attendeeId: z22.string().nullable().optional(),
  createdAt: bsonDate,
  stripeSessionId: z22.string().optional(),
  senderName: z22.string().optional(),
  senderEmail: z22.string().optional(),
  originalWalletTxId: z22.string().optional(),
  note: z22.string().optional(),
  recipientId: z22.string().optional(),
  recipientEmail: z22.string().optional(),
  beats: z22.number().optional(),
  sessionId: z22.string().optional(),
  durationMinutes: z22.number().optional(),
  addOns: z22.array(z22.unknown()).optional()
});

// src/contract/collections/djfeed/feed_lessons.ts
import { z as z23 } from "zod";
var DjfeedFeedLessonsSchema = z23.strictObject({
  _id: z23.string(),
  sessionId: z23.string(),
  hostId: z23.string(),
  danceId: z23.string(),
  startedAt: bsonDate
});

// src/contract/collections/djfeed/free_access.ts
import { z as z24 } from "zod";
var DjfeedFreeAccessSchema = z24.strictObject({
  _id: objectId,
  email: z24.string(),
  expiresAt: bsonDate.nullable(),
  note: z24.string().nullable(),
  createdAt: bsonDate
});

// src/contract/collections/djfeed/host_dancers.ts
import { z as z25 } from "zod";
var DjfeedHostDancersSchema = z25.strictObject({
  _id: z25.string(),
  hostId: z25.string(),
  userId: z25.string(),
  firstSeenAt: bsonDate,
  lastSeenAt: bsonDate,
  sessionCount: z25.number(),
  lastSessionId: z25.string()
});

// src/contract/collections/djfeed/requester_history.ts
import { z as z26 } from "zod";
var DjfeedRequesterHistorySchema = z26.strictObject({
  _id: objectId,
  clientId: z26.string(),
  sessionId: z26.string(),
  ownerId: z26.string(),
  requesterName: z26.string(),
  requests: z26.array(z26.strictObject({
    danceName: z26.string(),
    danceId: z26.string().nullable(),
    status: z26.string(),
    tipCents: z26.number(),
    createdAt: bsonDate
  })),
  sessionDate: bsonDate,
  sessionName: z26.string()
});

// src/contract/collections/djfeed/session_attendance.ts
import { z as z27 } from "zod";
var DjfeedSessionAttendanceSchema = z27.strictObject({
  _id: z27.string(),
  sessionId: z27.string(),
  userId: z27.string(),
  firstSeenAt: bsonDate,
  hostId: z27.string(),
  lastSeenAt: bsonDate
});

// src/contract/collections/djfeed/session_reports.ts
import { z as z28 } from "zod";
var DjfeedSessionReportsSchema = z28.strictObject({
  _id: objectId,
  sessionId: z28.string(),
  actualDurationMs: z28.number(),
  autoClosedAt: bsonDate.nullable(),
  closedAt: bsonDate,
  endsAt: bsonDate,
  extensions: z28.array(z28.unknown()),
  generatedAt: bsonDate,
  ownerId: z28.string(),
  playedTracks: z28.array(z28.strictObject({
    danceName: z28.string(),
    danceId: z28.string().nullable(),
    songName: z28.string(),
    artist: z28.string(),
    difficulty: z28.string(),
    stepsheet: z28.string().optional(),
    danceType: z28.string().nullable(),
    partnerStyle: z28.string().nullable(),
    isSongSwap: z28.boolean().optional(),
    swapSongName: z28.string().nullable().optional(),
    swapArtist: z28.string().nullable().optional(),
    playedAt: bsonDate,
    requesters: z28.array(z28.strictObject({
      clientId: z28.string(),
      requesterName: z28.string(),
      tipCents: z28.number()
    })),
    totalTips: z28.number(),
    requesterCount: z28.number(),
    catalogTrackId: z28.string().nullable().optional()
  })),
  sessionName: z28.string(),
  startedAt: bsonDate,
  stats: z28.strictObject({
    totalDancesPlayed: z28.number(),
    totalRequests: z28.number(),
    totalApproved: z28.number(),
    totalSkipped: z28.number(),
    totalPending: z28.number(),
    approvalRate: z28.number().nullable(),
    totalTipCents: z28.number(),
    uniqueRequesters: z28.number()
  })
});

// src/contract/collections/djfeed/session_transactions.ts
import { z as z29 } from "zod";
var DjfeedSessionTransactionsSchema = z29.strictObject({
  _id: objectId,
  ownerId: z29.string(),
  type: z29.string(),
  sessionId: z29.string(),
  sessionName: z29.string(),
  durationMinutes: z29.number(),
  amountCents: z29.number(),
  stripeSessionId: z29.string(),
  stripePaymentIntentId: z29.string(),
  createdAt: bsonDate
});

// src/contract/collections/djfeed/stripe_events.ts
import { z as z30 } from "zod";
var DjfeedStripeEventsSchema = z30.strictObject({
  _id: z30.string(),
  type: z30.string(),
  receivedAt: bsonDate
});

// src/contract/collections/ldco/choreographers.ts
import { z as z31 } from "zod";
var LdcoChoreographersSchema = z31.strictObject({
  _id: z31.string(),
  name: z31.string(),
  copperknobUrl: z31.string().optional(),
  lastImportedAt: z31.string().optional(),
  associatedUserId: z31.string().optional()
});

// src/contract/collections/ldco/dance_collections.ts
import { z as z32 } from "zod";
var LdcoDanceCollectionsSchema = z32.strictObject({
  _id: z32.string(),
  name: z32.string(),
  danceIds: z32.array(z32.string()),
  createdBy: z32.string(),
  createdAt: bsonDate.nullable(),
  updatedAt: bsonDate.nullable(),
  isPrivate: z32.boolean().optional(),
  archived: z32.boolean().optional(),
  archivedAt: bsonDate.nullable().optional(),
  isArchived: z32.boolean().optional(),
  isCopyable: z32.boolean().optional(),
  pendingDanceIds: z32.array(z32.string()).optional()
});

// src/contract/collections/ldco/dance_tracks.ts
import { z as z33 } from "zod";
var LdcoDanceTracksSchema = z33.strictObject({
  _id: z33.string(),
  danceId: z33.string(),
  trackId: z33.string(),
  isPrimary: z33.boolean(),
  createdAt: bsonDate
});

// src/contract/collections/ldco/dances.ts
import { z as z34 } from "zod";
var LdcoDancesSchema = z34.strictObject({
  _id: z34.string(),
  difficulty: z34.string(),
  tracks: z34.array(z34.string()),
  primaryTrack: z34.string(),
  danceName: z34.string(),
  choreographers: z34.array(z34.string()),
  stepsheet: z34.string().optional(),
  stepsheetUrls: z34.array(z34.string()).optional(),
  songArtists: z34.array(z34.strictObject({
    song: z34.string(),
    artist: z34.string()
  })).optional()
});

// src/contract/collections/ldco/events.ts
import { z as z35 } from "zod";
var LdcoEventsSchema = z35.strictObject({
  _id: z35.string(),
  venueId: z35.string(),
  title: z35.string(),
  description: z35.string(),
  eventDay: z35.string(),
  startTime: z35.string(),
  endTime: z35.string(),
  createdAt: bsonDate,
  updatedAt: bsonDate,
  createdBy: z35.string()
});

// src/contract/collections/ldco/friend_requests.ts
import { z as z36 } from "zod";
var LdcoFriendRequestsSchema = z36.strictObject({
  _id: z36.string(),
  requesterId: z36.string(),
  requesteeId: z36.string(),
  createdAt: bsonDate.optional(),
  timestamp: bsonDate.optional()
});

// src/contract/collections/ldco/instructor_venues.ts
import { z as z37 } from "zod";
var LdcoInstructorVenuesSchema = z37.strictObject({
  _id: z37.string(),
  instructorId: z37.string(),
  venueId: z37.string(),
  createdAt: bsonDate.optional(),
  updatedAt: bsonDate.optional()
});

// src/contract/collections/ldco/instructors.ts
import { z as z38 } from "zod";
var LdcoInstructorsSchema = z38.strictObject({
  _id: z38.string(),
  name: z38.string(),
  associatedUserId: z38.string().optional(),
  userId: z38.string().optional(),
  bio: z38.string().optional()
});

// src/contract/collections/ldco/lessons.ts
import { z as z39 } from "zod";
var LdcoLessonsSchema = z39.strictObject({
  _id: z39.string(),
  lessonday: z39.string(),
  lessonstart: z39.string(),
  instructors: z39.array(z39.string()),
  duration: z39.string(),
  lessoncost: z39.string(),
  notes: z39.string(),
  difficulty: z39.string(),
  venueid: z39.string(),
  verifiedAt: z39.null(),
  verifiedBy: z39.null()
});

// src/contract/collections/ldco/login_events.ts
import { z as z40 } from "zod";
var LdcoLoginEventsSchema = z40.strictObject({
  _id: objectId,
  userId: z40.string(),
  email: z40.string(),
  provider: z40.string(),
  app: z40.string(),
  ip: z40.string().optional(),
  userAgent: z40.string().optional(),
  createdAt: bsonDate,
  clientId: z40.string().nullable().optional(),
  debugReturnToCookie: z40.null().optional(),
  source: z40.string().optional()
});

// src/contract/collections/ldco/oauth_auth_codes.ts
import { z as z41 } from "zod";
var LdcoOauthAuthCodesSchema = z41.looseObject({ _id: z41.union([z41.string(), objectId]) });

// src/contract/collections/ldco/pending_dances.ts
import { z as z42 } from "zod";
var LdcoPendingDancesSchema = z42.strictObject({
  _id: z42.string(),
  danceName: z42.string(),
  songTitle: z42.string(),
  artist: z42.string(),
  choreographer: z42.string(),
  count: z42.null(),
  wall: z42.null(),
  difficulty: z42.string(),
  stepsheetUrl: z42.string().nullable(),
  submittedByUserId: z42.string(),
  submittedAt: bsonDate,
  status: z42.string()
});

// src/contract/collections/ldco/tracks.ts
import { z as z43 } from "zod";
var LdcoTracksSchema = z43.strictObject({
  _id: z43.string(),
  isrc: z43.string().optional(),
  name: z43.string(),
  artists: z43.array(z43.string()),
  uri: z43.string(),
  duration_ms: z43.number(),
  explicit: z43.boolean(),
  preview_url: z43.string().nullable().optional(),
  is_playable: z43.boolean().optional(),
  url: z43.string().optional()
});

// src/contract/collections/ldco/user_favorite_dances.ts
import { z as z44 } from "zod";
var LdcoUserFavoriteDancesSchema = z44.strictObject({
  _id: z44.string(),
  userId: z44.string(),
  danceId: z44.string(),
  createdAt: bsonDate
});

// src/contract/collections/ldco/user_flagged_dances.ts
import { z as z45 } from "zod";
var LdcoUserFlaggedDancesSchema = z45.strictObject({
  _id: z45.string(),
  userId: z45.string(),
  danceId: z45.string(),
  createdAt: bsonDate
});

// src/contract/collections/ldco/user_follow_collections.ts
import { z as z46 } from "zod";
var LdcoUserFollowCollectionsSchema = z46.strictObject({
  _id: z46.string(),
  userId: z46.string(),
  collectionId: z46.string(),
  followedAt: bsonDate
});

// src/contract/collections/ldco/user_follows.ts
import { z as z47 } from "zod";
var LdcoUserFollowsSchema = z47.strictObject({
  _id: z47.string(),
  userId: z47.string(),
  followingId: z47.string(),
  createdAt: bsonDate
});

// src/contract/collections/ldco/user_friends.ts
import { z as z48 } from "zod";
var LdcoUserFriendsSchema = z48.strictObject({
  _id: z48.string(),
  userA: z48.string(),
  userB: z48.string(),
  timestamp: bsonDate
});

// src/contract/collections/ldco/user_known_dances.ts
import { z as z49 } from "zod";
var LdcoUserKnownDancesSchema = z49.strictObject({
  _id: z49.string(),
  userId: z49.string(),
  danceId: z49.string(),
  createdAt: bsonDate
});

// src/contract/collections/ldco/user_lessons.ts
import { z as z50 } from "zod";
var LdcoUserLessonsSchema = z50.strictObject({
  _id: z50.string(),
  userId: z50.string(),
  lessonId: z50.string()
});

// src/contract/collections/ldco/user_refresh_dances.ts
import { z as z51 } from "zod";
var LdcoUserRefreshDancesSchema = z51.strictObject({
  _id: z51.string(),
  userId: z51.string(),
  danceId: z51.string(),
  createdAt: bsonDate
});

// src/contract/collections/ldco/user_venues.ts
import { z as z52 } from "zod";
var LdcoUserVenuesSchema = z52.strictObject({
  _id: z52.string(),
  userId: z52.string(),
  venueId: z52.string()
});

// src/contract/collections/ldco/users.ts
import { z as z53 } from "zod";
var LdcoUsersSchema = z53.strictObject({
  _id: z53.string(),
  name: z53.string(),
  email: z53.string(),
  image: z53.string().optional(),
  emailVerified: z53.null().optional(),
  bio: z53.string().optional(),
  favorites: z53.array(z53.string()).optional(),
  flagged: z53.array(z53.string()).optional(),
  known: z53.array(z53.string()).optional(),
  refresh: z53.array(z53.string()).optional(),
  collections: z53.array(z53.strictObject({
    name: z53.string(),
    danceIds: z53.array(z53.string())
  })).optional(),
  password: z53.string().optional(),
  createdAt: bsonDate.optional(),
  googleId: z53.string().optional()
});

// src/contract/collections/ldco/venue_checkins.ts
import { z as z54 } from "zod";
var LdcoVenueCheckinsSchema = z54.strictObject({
  _id: z54.string(),
  userId: z54.string(),
  venueId: z54.string(),
  dateKey: z54.string(),
  status: z54.string()
});

// src/contract/collections/ldco/venue_users.ts
import { z as z55 } from "zod";
var LdcoVenueUsersSchema = z55.strictObject({
  _id: z55.string(),
  userId: z55.string(),
  venueId: z55.string(),
  requestedBy: z55.string()
});

// src/contract/collections/ldco/venues.ts
import { z as z56 } from "zod";
var LdcoVenuesSchema = z56.strictObject({
  _id: z56.string(),
  venuename: z56.string(),
  venueaddress: z56.string(),
  geolocation: z56.array(z56.number()),
  phone: z56.string(),
  website: z56.string(),
  timeZone: z56.string(),
  verifiedAt: z56.null(),
  verifiedBy: z56.null(),
  city: z56.string().optional(),
  state: z56.string().optional()
});

// src/contract/collections/ldco-events/event_registrations.ts
import { z as z57 } from "zod";
var LdcoEventsEventRegistrationsSchema = z57.strictObject({
  _id: objectId,
  address: z57.string().nullable(),
  agreedToWaiver: z57.boolean(),
  attendeeStatus: z57.string().optional(),
  createdAt: bsonDate,
  email: z57.string(),
  emails: z57.array(z57.strictObject({
    templateId: z57.string(),
    subject: z57.string(),
    sentAt: z57.string()
  })).optional(),
  event: z57.string(),
  name: z57.string(),
  paidAt: bsonDate.nullable().optional(),
  paymentMethod: z57.string(),
  paymentStatus: z57.string(),
  phone: z57.string().nullable(),
  requestToken: z57.string(),
  waiverSignature: z57.string(),
  waiverSignedAt: z57.string(),
  requests: z57.array(z57.strictObject({
    text: z57.string(),
    danceId: z57.string().nullable()
  })).optional(),
  updatedAt: bsonDate.optional(),
  catering: z57.boolean().optional(),
  stripeSessionId: z57.null().optional()
});

// src/contract/collections/ldco-events/events.ts
import { z as z58 } from "zod";
var LdcoEventsEventsSchema = z58.strictObject({
  _id: objectId,
  slug: z58.string(),
  active: z58.boolean(),
  createdAt: bsonDate,
  date: z58.string(),
  dateShort: z58.string(),
  shortTitle: z58.string(),
  time: z58.string(),
  title: z58.string(),
  venueAddress: z58.string(),
  venueName: z58.string()
});

// src/contract/collections/ldco-lessons/event_instructor_requests.ts
import { z as z59 } from "zod";
var LdcoLessonsEventInstructorRequestsSchema = z59.looseObject({ _id: z59.union([z59.string(), objectId]) });

// src/contract/collections/ldco-lessons/event_instructors.ts
import { z as z60 } from "zod";
var LdcoLessonsEventInstructorsSchema = z60.strictObject({
  _id: z60.string(),
  instructorId: z60.string(),
  eventTypeId: z60.string(),
  createdAt: bsonDate,
  role: z60.string()
});

// src/contract/collections/ldco-lessons/event_templates.ts
import { z as z61 } from "zod";
var LdcoLessonsEventTemplatesSchema = z61.strictObject({
  _id: z61.string(),
  createdAt: bsonDate,
  eventTypeId: z61.string(),
  isDefault: z61.boolean(),
  lessons: z61.array(z61.strictObject({
    time: z61.string(),
    dance: z61.string().nullable(),
    level: z61.string().nullable(),
    link: z61.null()
  })),
  name: z61.string(),
  updatedAt: bsonDate
});

// src/contract/collections/ldco-lessons/event_types.ts
import { z as z62 } from "zod";
var LdcoLessonsEventTypesSchema = z62.strictObject({
  _id: z62.string(),
  createdAt: bsonDate,
  createdBy: z62.string(),
  defaultDurationMinutes: z62.number(),
  defaultStartTime: z62.string().nullable(),
  isActive: z62.boolean(),
  level: z62.string(),
  price: z62.string(),
  title: z62.string(),
  updatedAt: bsonDate,
  venueId: z62.string(),
  verifiedAt: z62.null(),
  verifiedBy: z62.null()
});

// src/contract/collections/ldco-lessons/events.ts
import { z as z63 } from "zod";
var LdcoLessonsEventsSchema = z63.strictObject({
  _id: z63.string(),
  cancelNote: z63.string().nullable(),
  createdAt: bsonDate,
  date: z63.string(),
  endAt: bsonDate,
  eventTypeId: z63.string(),
  isCancelled: z63.boolean(),
  lessons: z63.array(z63.strictObject({
    _id: z63.string(),
    startAt: bsonDate,
    dance: z63.string().nullable(),
    danceId: z63.string().nullable(),
    level: z63.string().nullable(),
    link: z63.string().nullable(),
    committed: z63.boolean(),
    skipped: z63.boolean()
  })),
  specialNote: z63.string().nullable(),
  startAt: bsonDate,
  substitute: z63.string().nullable(),
  substituteInstructorId: z63.null(),
  timeZone: z63.string(),
  updatedAt: bsonDate,
  verifiedAt: z63.null(),
  verifiedBy: z63.null()
});

// src/contract/collections/ldco-lessons/frequencies.ts
import { z as z64 } from "zod";
var LdcoLessonsFrequenciesSchema = z64.strictObject({
  _id: z64.string(),
  byDay: z64.array(z64.string()).optional(),
  createdAt: bsonDate,
  durationMinutes: z64.number(),
  eventTypeId: z64.string(),
  isActive: z64.boolean().optional(),
  kind: z64.string(),
  startDate: z64.string().optional(),
  startTime: z64.string(),
  updatedAt: bsonDate,
  endDate: z64.string().optional(),
  nth: z64.number().optional(),
  weekday: z64.string().optional()
});

// src/contract/collections/ldco-lessons/lessons.ts
import { z as z65 } from "zod";
var LdcoLessonsLessonsSchema = z65.strictObject({
  _id: z65.string(),
  danceId: z65.string().optional(),
  date: bsonDate,
  eventId: z65.string().nullable(),
  instructorId: z65.string(),
  lessonId: z65.null(),
  venue: z65.string(),
  venueId: z65.string(),
  danceName: z65.string().optional()
});

// src/contract/collections/ldco-reviews/choreographers.ts
import { z as z66 } from "zod";
var LdcoReviewsChoreographersSchema = z66.looseObject({ _id: z66.union([z66.string(), objectId]) });

// src/contract/collections/ldco-reviews/dances.ts
import { z as z67 } from "zod";
var LdcoReviewsDancesSchema = z67.looseObject({ _id: z67.union([z67.string(), objectId]) });

// src/contract/collections/ldco-reviews/join_choreographer_appeals.ts
import { z as z68 } from "zod";
var LdcoReviewsJoinChoreographerAppealsSchema = z68.looseObject({ _id: z68.union([z68.string(), objectId]) });

// src/contract/collections/ldco-reviews/lessons.ts
import { z as z69 } from "zod";
var LdcoReviewsLessonsSchema = z69.strictObject({
  _id: objectId,
  lessonday: z69.string(),
  lessonstart: z69.string(),
  instructors: z69.array(z69.string()),
  duration: z69.string(),
  lessoncost: z69.string(),
  notes: z69.string(),
  difficulty: z69.string(),
  venueid: z69.string()
});

// src/contract/collections/ldco-reviews/reports.ts
import { z as z70 } from "zod";
var LdcoReviewsReportsSchema = z70.looseObject({ _id: z70.union([z70.string(), objectId]) });

// src/contract/collections/ldco-reviews/tracks.ts
import { z as z71 } from "zod";
var LdcoReviewsTracksSchema = z71.looseObject({ _id: z71.union([z71.string(), objectId]) });

// src/contract/collections/ldco-reviews/venue_users.ts
import { z as z72 } from "zod";
var LdcoReviewsVenueUsersSchema = z72.strictObject({
  _id: z72.string(),
  userId: z72.string(),
  venueId: z72.string(),
  createdAt: bsonDate,
  requestedBy: z72.string()
});

// src/contract/collections/ldco-reviews/venues.ts
import { z as z73 } from "zod";
var LdcoReviewsVenuesSchema = z73.strictObject({
  _id: z73.string(),
  venuename: z73.string(),
  venueaddress: z73.string(),
  geolocation: z73.array(z73.number()),
  phone: z73.string(),
  website: z73.string(),
  contactName: z73.string(),
  contactEmail: z73.string(),
  contactPhone: z73.string(),
  createdAt: bsonDate,
  timeZone: z73.string(),
  verifiedAt: z73.null(),
  verifiedBy: z73.null()
});

// src/contract/collections/ldco-reviews/verify_user_instructor.ts
import { z as z74 } from "zod";
var LdcoReviewsVerifyUserInstructorSchema = z74.strictObject({
  _id: objectId,
  userId: z74.string(),
  instructorId: z74.string(),
  createdAt: bsonDate,
  resolved: z74.boolean(),
  resolution: z74.string(),
  resolvedAt: bsonDate,
  resolvedBy: z74.string()
});

// src/contract/collections/music_catalog/tracks.ts
import { z as z75 } from "zod";
var MusicCatalogTracksSchema = z75.strictObject({
  _id: z75.string(),
  artist: z75.string(),
  createdAt: bsonDate,
  disambiguation: z75.string(),
  durationMs: z75.number().nullable(),
  isrcs: z75.array(z75.string()),
  nArtist: z75.string(),
  nTitle: z75.string(),
  rank: z75.number(),
  rankedAt: bsonDate.optional(),
  source: z75.string(),
  sourceId: z75.string(),
  title: z75.string(),
  updatedAt: bsonDate,
  variantKey: z75.string(),
  words: z75.array(z75.string()),
  year: z75.number().nullable()
});

// src/contract/collections/index.ts
var collections = {
  "bld.event_templates": { database: "bld", name: "event_templates", schema: BldEventTemplatesSchema },
  "bld.event_types": { database: "bld", name: "event_types", schema: BldEventTypesSchema },
  "bld.events": { database: "bld", name: "events", schema: BldEventsSchema },
  "bld.frequencies": { database: "bld", name: "frequencies", schema: BldFrequenciesSchema },
  "bld.lessons": { database: "bld", name: "lessons", schema: BldLessonsSchema },
  "copperknob_alert.processed_items": { database: "copperknob_alert", name: "processed_items", schema: CopperknobAlertProcessedItemsSchema },
  "copperknob_alert.sync_metadata": { database: "copperknob_alert", name: "sync_metadata", schema: CopperknobAlertSyncMetadataSchema },
  "copperknob_alert.watch_rules": { database: "copperknob_alert", name: "watch_rules", schema: CopperknobAlertWatchRulesSchema },
  "djfeed.attendee_notifications": { database: "djfeed", name: "attendee_notifications", schema: DjfeedAttendeeNotificationsSchema },
  "djfeed.beat_balances": { database: "djfeed", name: "beat_balances", schema: DjfeedBeatBalancesSchema },
  "djfeed.beat_transactions": { database: "djfeed", name: "beat_transactions", schema: DjfeedBeatTransactionsSchema },
  "djfeed.dancer_favorite_songs": { database: "djfeed", name: "dancer_favorite_songs", schema: DjfeedDancerFavoriteSongsSchema },
  "djfeed.dj_direct_messages": { database: "djfeed", name: "dj_direct_messages", schema: DjfeedDjDirectMessagesSchema },
  "djfeed.dj_messages": { database: "djfeed", name: "dj_messages", schema: DjfeedDjMessagesSchema },
  "djfeed.dj_notifications": { database: "djfeed", name: "dj_notifications", schema: DjfeedDjNotificationsSchema },
  "djfeed.dj_profiles": { database: "djfeed", name: "dj_profiles", schema: DjfeedDjProfilesSchema },
  "djfeed.dj_requester_nicknames": { database: "djfeed", name: "dj_requester_nicknames", schema: DjfeedDjRequesterNicknamesSchema },
  "djfeed.dj_requests": { database: "djfeed", name: "dj_requests", schema: DjfeedDjRequestsSchema },
  "djfeed.dj_sessions": { database: "djfeed", name: "dj_sessions", schema: DjfeedDjSessionsSchema },
  "djfeed.dj_wallet_locks": { database: "djfeed", name: "dj_wallet_locks", schema: DjfeedDjWalletLocksSchema },
  "djfeed.dj_wallet_transactions": { database: "djfeed", name: "dj_wallet_transactions", schema: DjfeedDjWalletTransactionsSchema },
  "djfeed.feed_lessons": { database: "djfeed", name: "feed_lessons", schema: DjfeedFeedLessonsSchema },
  "djfeed.free_access": { database: "djfeed", name: "free_access", schema: DjfeedFreeAccessSchema },
  "djfeed.host_dancers": { database: "djfeed", name: "host_dancers", schema: DjfeedHostDancersSchema },
  "djfeed.requester_history": { database: "djfeed", name: "requester_history", schema: DjfeedRequesterHistorySchema },
  "djfeed.session_attendance": { database: "djfeed", name: "session_attendance", schema: DjfeedSessionAttendanceSchema },
  "djfeed.session_reports": { database: "djfeed", name: "session_reports", schema: DjfeedSessionReportsSchema },
  "djfeed.session_transactions": { database: "djfeed", name: "session_transactions", schema: DjfeedSessionTransactionsSchema },
  "djfeed.stripe_events": { database: "djfeed", name: "stripe_events", schema: DjfeedStripeEventsSchema },
  "ldco.choreographers": { database: "ldco", name: "choreographers", schema: LdcoChoreographersSchema },
  "ldco.dance_collections": { database: "ldco", name: "dance_collections", schema: LdcoDanceCollectionsSchema },
  "ldco.dance_tracks": { database: "ldco", name: "dance_tracks", schema: LdcoDanceTracksSchema },
  "ldco.dances": { database: "ldco", name: "dances", schema: LdcoDancesSchema },
  "ldco.events": { database: "ldco", name: "events", schema: LdcoEventsSchema },
  "ldco.friend_requests": { database: "ldco", name: "friend_requests", schema: LdcoFriendRequestsSchema },
  "ldco.instructor_venues": { database: "ldco", name: "instructor_venues", schema: LdcoInstructorVenuesSchema },
  "ldco.instructors": { database: "ldco", name: "instructors", schema: LdcoInstructorsSchema },
  "ldco.lessons": { database: "ldco", name: "lessons", schema: LdcoLessonsSchema },
  "ldco.login_events": { database: "ldco", name: "login_events", schema: LdcoLoginEventsSchema },
  "ldco.oauth_auth_codes": { database: "ldco", name: "oauth_auth_codes", schema: LdcoOauthAuthCodesSchema },
  "ldco.pending_dances": { database: "ldco", name: "pending_dances", schema: LdcoPendingDancesSchema },
  "ldco.tracks": { database: "ldco", name: "tracks", schema: LdcoTracksSchema },
  "ldco.user_favorite_dances": { database: "ldco", name: "user_favorite_dances", schema: LdcoUserFavoriteDancesSchema },
  "ldco.user_flagged_dances": { database: "ldco", name: "user_flagged_dances", schema: LdcoUserFlaggedDancesSchema },
  "ldco.user_follow_collections": { database: "ldco", name: "user_follow_collections", schema: LdcoUserFollowCollectionsSchema },
  "ldco.user_follows": { database: "ldco", name: "user_follows", schema: LdcoUserFollowsSchema },
  "ldco.user_friends": { database: "ldco", name: "user_friends", schema: LdcoUserFriendsSchema },
  "ldco.user_known_dances": { database: "ldco", name: "user_known_dances", schema: LdcoUserKnownDancesSchema },
  "ldco.user_lessons": { database: "ldco", name: "user_lessons", schema: LdcoUserLessonsSchema },
  "ldco.user_refresh_dances": { database: "ldco", name: "user_refresh_dances", schema: LdcoUserRefreshDancesSchema },
  "ldco.user_venues": { database: "ldco", name: "user_venues", schema: LdcoUserVenuesSchema },
  "ldco.users": { database: "ldco", name: "users", schema: LdcoUsersSchema },
  "ldco.venue_checkins": { database: "ldco", name: "venue_checkins", schema: LdcoVenueCheckinsSchema },
  "ldco.venue_users": { database: "ldco", name: "venue_users", schema: LdcoVenueUsersSchema },
  "ldco.venues": { database: "ldco", name: "venues", schema: LdcoVenuesSchema },
  "ldco-events.event_registrations": { database: "ldco-events", name: "event_registrations", schema: LdcoEventsEventRegistrationsSchema },
  "ldco-events.events": { database: "ldco-events", name: "events", schema: LdcoEventsEventsSchema },
  "ldco-lessons.event_instructor_requests": { database: "ldco-lessons", name: "event_instructor_requests", schema: LdcoLessonsEventInstructorRequestsSchema },
  "ldco-lessons.event_instructors": { database: "ldco-lessons", name: "event_instructors", schema: LdcoLessonsEventInstructorsSchema },
  "ldco-lessons.event_templates": { database: "ldco-lessons", name: "event_templates", schema: LdcoLessonsEventTemplatesSchema },
  "ldco-lessons.event_types": { database: "ldco-lessons", name: "event_types", schema: LdcoLessonsEventTypesSchema },
  "ldco-lessons.events": { database: "ldco-lessons", name: "events", schema: LdcoLessonsEventsSchema },
  "ldco-lessons.frequencies": { database: "ldco-lessons", name: "frequencies", schema: LdcoLessonsFrequenciesSchema },
  "ldco-lessons.lessons": { database: "ldco-lessons", name: "lessons", schema: LdcoLessonsLessonsSchema },
  "ldco-reviews.choreographers": { database: "ldco-reviews", name: "choreographers", schema: LdcoReviewsChoreographersSchema },
  "ldco-reviews.dances": { database: "ldco-reviews", name: "dances", schema: LdcoReviewsDancesSchema },
  "ldco-reviews.join_choreographer_appeals": { database: "ldco-reviews", name: "join_choreographer_appeals", schema: LdcoReviewsJoinChoreographerAppealsSchema },
  "ldco-reviews.lessons": { database: "ldco-reviews", name: "lessons", schema: LdcoReviewsLessonsSchema },
  "ldco-reviews.reports": { database: "ldco-reviews", name: "reports", schema: LdcoReviewsReportsSchema },
  "ldco-reviews.tracks": { database: "ldco-reviews", name: "tracks", schema: LdcoReviewsTracksSchema },
  "ldco-reviews.venue_users": { database: "ldco-reviews", name: "venue_users", schema: LdcoReviewsVenueUsersSchema },
  "ldco-reviews.venues": { database: "ldco-reviews", name: "venues", schema: LdcoReviewsVenuesSchema },
  "ldco-reviews.verify_user_instructor": { database: "ldco-reviews", name: "verify_user_instructor", schema: LdcoReviewsVerifyUserInstructorSchema },
  "music_catalog.tracks": { database: "music_catalog", name: "tracks", schema: MusicCatalogTracksSchema }
};

// src/contract/index.ts
var CONTRACT_VERSION = version;
function computeContractHash() {
  const description = Object.entries(collections).sort(([a], [b]) => a.localeCompare(b)).map(([key, c]) => [key, c.database, c.name, z76.toJSONSchema(c.schema, { unrepresentable: "any" })]);
  return createHash("sha256").update(JSON.stringify(description)).digest("hex");
}
var CONTRACT_HASH = hash;

export {
  BldEventTemplatesSchema,
  BldEventTypesSchema,
  BldEventsSchema,
  BldFrequenciesSchema,
  BldLessonsSchema,
  CopperknobAlertProcessedItemsSchema,
  CopperknobAlertSyncMetadataSchema,
  CopperknobAlertWatchRulesSchema,
  DjfeedAttendeeNotificationsSchema,
  DjfeedBeatBalancesSchema,
  DjfeedBeatTransactionsSchema,
  DjfeedDancerFavoriteSongsSchema,
  DjfeedDjDirectMessagesSchema,
  DjfeedDjMessagesSchema,
  DjfeedDjNotificationsSchema,
  DjfeedDjProfilesSchema,
  DjfeedDjRequesterNicknamesSchema,
  DjfeedDjRequestsSchema,
  DjfeedDjSessionsSchema,
  DjfeedDjWalletLocksSchema,
  DjfeedDjWalletTransactionsSchema,
  DjfeedFeedLessonsSchema,
  DjfeedFreeAccessSchema,
  DjfeedHostDancersSchema,
  DjfeedRequesterHistorySchema,
  DjfeedSessionAttendanceSchema,
  DjfeedSessionReportsSchema,
  DjfeedSessionTransactionsSchema,
  DjfeedStripeEventsSchema,
  LdcoChoreographersSchema,
  LdcoDanceCollectionsSchema,
  LdcoDanceTracksSchema,
  LdcoDancesSchema,
  LdcoEventsSchema,
  LdcoFriendRequestsSchema,
  LdcoInstructorVenuesSchema,
  LdcoInstructorsSchema,
  LdcoLessonsSchema,
  LdcoLoginEventsSchema,
  LdcoOauthAuthCodesSchema,
  LdcoPendingDancesSchema,
  LdcoTracksSchema,
  LdcoUserFavoriteDancesSchema,
  LdcoUserFlaggedDancesSchema,
  LdcoUserFollowCollectionsSchema,
  LdcoUserFollowsSchema,
  LdcoUserFriendsSchema,
  LdcoUserKnownDancesSchema,
  LdcoUserLessonsSchema,
  LdcoUserRefreshDancesSchema,
  LdcoUserVenuesSchema,
  LdcoUsersSchema,
  LdcoVenueCheckinsSchema,
  LdcoVenueUsersSchema,
  LdcoVenuesSchema,
  LdcoEventsEventRegistrationsSchema,
  LdcoEventsEventsSchema,
  LdcoLessonsEventInstructorRequestsSchema,
  LdcoLessonsEventInstructorsSchema,
  LdcoLessonsEventTemplatesSchema,
  LdcoLessonsEventTypesSchema,
  LdcoLessonsEventsSchema,
  LdcoLessonsFrequenciesSchema,
  LdcoLessonsLessonsSchema,
  LdcoReviewsChoreographersSchema,
  LdcoReviewsDancesSchema,
  LdcoReviewsJoinChoreographerAppealsSchema,
  LdcoReviewsLessonsSchema,
  LdcoReviewsReportsSchema,
  LdcoReviewsTracksSchema,
  LdcoReviewsVenueUsersSchema,
  LdcoReviewsVenuesSchema,
  LdcoReviewsVerifyUserInstructorSchema,
  MusicCatalogTracksSchema,
  collections,
  CONTRACT_VERSION,
  computeContractHash,
  CONTRACT_HASH
};
