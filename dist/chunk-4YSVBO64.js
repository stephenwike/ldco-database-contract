// src/contract/index.ts
import { createHash } from "crypto";
import { z as z75 } from "zod";

// contract.lock.json
var hash = "cd204146402d84dc66f68bdb6e63edda912e5312fb899ac31430a805ca410fa7";

// package.json
var version = "0.13.1";

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

// src/contract/collections/djfeed/free_access.ts
import { z as z23 } from "zod";
var DjfeedFreeAccessSchema = z23.strictObject({
  _id: objectId,
  email: z23.string(),
  expiresAt: bsonDate.nullable(),
  note: z23.string().nullable(),
  createdAt: bsonDate
});

// src/contract/collections/djfeed/requester_history.ts
import { z as z24 } from "zod";
var DjfeedRequesterHistorySchema = z24.strictObject({
  _id: objectId,
  clientId: z24.string(),
  sessionId: z24.string(),
  ownerId: z24.string(),
  requesterName: z24.string(),
  requests: z24.array(z24.strictObject({
    danceName: z24.string(),
    danceId: z24.string().nullable(),
    status: z24.string(),
    tipCents: z24.number(),
    createdAt: bsonDate
  })),
  sessionDate: bsonDate,
  sessionName: z24.string()
});

// src/contract/collections/djfeed/session_reports.ts
import { z as z25 } from "zod";
var DjfeedSessionReportsSchema = z25.strictObject({
  _id: objectId,
  sessionId: z25.string(),
  actualDurationMs: z25.number(),
  autoClosedAt: bsonDate.nullable(),
  closedAt: bsonDate,
  endsAt: bsonDate,
  extensions: z25.array(z25.unknown()),
  generatedAt: bsonDate,
  ownerId: z25.string(),
  playedTracks: z25.array(z25.strictObject({
    danceName: z25.string(),
    danceId: z25.string().nullable(),
    songName: z25.string(),
    artist: z25.string(),
    difficulty: z25.string(),
    stepsheet: z25.string().optional(),
    danceType: z25.string().nullable(),
    partnerStyle: z25.string().nullable(),
    isSongSwap: z25.boolean().optional(),
    swapSongName: z25.string().nullable().optional(),
    swapArtist: z25.string().nullable().optional(),
    playedAt: bsonDate,
    requesters: z25.array(z25.strictObject({
      clientId: z25.string(),
      requesterName: z25.string(),
      tipCents: z25.number()
    })),
    totalTips: z25.number(),
    requesterCount: z25.number(),
    catalogTrackId: z25.string().nullable().optional()
  })),
  sessionName: z25.string(),
  startedAt: bsonDate,
  stats: z25.strictObject({
    totalDancesPlayed: z25.number(),
    totalRequests: z25.number(),
    totalApproved: z25.number(),
    totalSkipped: z25.number(),
    totalPending: z25.number(),
    approvalRate: z25.number().nullable(),
    totalTipCents: z25.number(),
    uniqueRequesters: z25.number()
  })
});

// src/contract/collections/djfeed/session_transactions.ts
import { z as z26 } from "zod";
var DjfeedSessionTransactionsSchema = z26.strictObject({
  _id: objectId,
  ownerId: z26.string(),
  type: z26.string(),
  sessionId: z26.string(),
  sessionName: z26.string(),
  durationMinutes: z26.number(),
  amountCents: z26.number(),
  stripeSessionId: z26.string(),
  stripePaymentIntentId: z26.string(),
  createdAt: bsonDate
});

// src/contract/collections/djfeed/stripe_events.ts
import { z as z27 } from "zod";
var DjfeedStripeEventsSchema = z27.strictObject({
  _id: z27.string(),
  type: z27.string(),
  receivedAt: bsonDate
});

// src/contract/collections/ldco/choreographers.ts
import { z as z28 } from "zod";
var LdcoChoreographersSchema = z28.strictObject({
  _id: z28.string(),
  name: z28.string(),
  copperknobUrl: z28.string().optional(),
  lastImportedAt: z28.string().optional(),
  associatedUserId: z28.string().optional()
});

// src/contract/collections/ldco/dance_collections.ts
import { z as z29 } from "zod";
var LdcoDanceCollectionsSchema = z29.strictObject({
  _id: z29.string(),
  name: z29.string(),
  danceIds: z29.array(z29.string()),
  createdBy: z29.string(),
  createdAt: bsonDate.nullable(),
  updatedAt: bsonDate.nullable(),
  isPrivate: z29.boolean().optional(),
  archived: z29.boolean().optional(),
  archivedAt: bsonDate.nullable().optional(),
  isArchived: z29.boolean().optional(),
  isCopyable: z29.boolean().optional(),
  pendingDanceIds: z29.array(z29.string()).optional()
});

// src/contract/collections/ldco/dance_tracks.ts
import { z as z30 } from "zod";
var LdcoDanceTracksSchema = z30.strictObject({
  _id: z30.string(),
  danceId: z30.string(),
  trackId: z30.string(),
  isPrimary: z30.boolean(),
  createdAt: bsonDate
});

// src/contract/collections/ldco/dances.ts
import { z as z31 } from "zod";
var LdcoDancesSchema = z31.strictObject({
  _id: z31.string(),
  difficulty: z31.string(),
  tracks: z31.array(z31.string()),
  primaryTrack: z31.string(),
  danceName: z31.string(),
  choreographers: z31.array(z31.string()),
  stepsheet: z31.string().optional(),
  stepsheetUrls: z31.array(z31.string()).optional(),
  songArtists: z31.array(z31.strictObject({
    song: z31.string(),
    artist: z31.string()
  })).optional()
});

// src/contract/collections/ldco/events.ts
import { z as z32 } from "zod";
var LdcoEventsSchema = z32.strictObject({
  _id: z32.string(),
  venueId: z32.string(),
  title: z32.string(),
  description: z32.string(),
  eventDay: z32.string(),
  startTime: z32.string(),
  endTime: z32.string(),
  createdAt: bsonDate,
  updatedAt: bsonDate,
  createdBy: z32.string()
});

// src/contract/collections/ldco/friend_requests.ts
import { z as z33 } from "zod";
var LdcoFriendRequestsSchema = z33.strictObject({
  _id: z33.string(),
  requesterId: z33.string(),
  requesteeId: z33.string(),
  createdAt: bsonDate.optional(),
  timestamp: bsonDate.optional()
});

// src/contract/collections/ldco/host_dancers.ts
import { z as z34 } from "zod";
var LdcoHostDancersSchema = z34.strictObject({
  _id: z34.string(),
  hostId: z34.string(),
  userId: z34.string(),
  firstSeenAt: bsonDate,
  lastSeenAt: bsonDate,
  sessionCount: z34.number(),
  lastSessionId: z34.string()
});

// src/contract/collections/ldco/instructor_venues.ts
import { z as z35 } from "zod";
var LdcoInstructorVenuesSchema = z35.strictObject({
  _id: z35.string(),
  instructorId: z35.string(),
  venueId: z35.string(),
  createdAt: bsonDate.optional(),
  updatedAt: bsonDate.optional()
});

// src/contract/collections/ldco/instructors.ts
import { z as z36 } from "zod";
var LdcoInstructorsSchema = z36.strictObject({
  _id: z36.string(),
  name: z36.string(),
  associatedUserId: z36.string().optional(),
  userId: z36.string().optional(),
  bio: z36.string().optional()
});

// src/contract/collections/ldco/lessons.ts
import { z as z37 } from "zod";
var LdcoLessonsSchema = z37.strictObject({
  _id: z37.string(),
  lessonday: z37.string(),
  lessonstart: z37.string(),
  instructors: z37.array(z37.string()),
  duration: z37.string(),
  lessoncost: z37.string(),
  notes: z37.string(),
  difficulty: z37.string(),
  venueid: z37.string(),
  verifiedAt: z37.null(),
  verifiedBy: z37.null()
});

// src/contract/collections/ldco/login_events.ts
import { z as z38 } from "zod";
var LdcoLoginEventsSchema = z38.strictObject({
  _id: objectId,
  userId: z38.string(),
  email: z38.string(),
  provider: z38.string(),
  app: z38.string(),
  ip: z38.string().optional(),
  userAgent: z38.string().optional(),
  createdAt: bsonDate,
  clientId: z38.string().nullable().optional(),
  debugReturnToCookie: z38.null().optional(),
  source: z38.string().optional()
});

// src/contract/collections/ldco/oauth_auth_codes.ts
import { z as z39 } from "zod";
var LdcoOauthAuthCodesSchema = z39.looseObject({ _id: z39.union([z39.string(), objectId]) });

// src/contract/collections/ldco/pending_dances.ts
import { z as z40 } from "zod";
var LdcoPendingDancesSchema = z40.strictObject({
  _id: z40.string(),
  danceName: z40.string(),
  songTitle: z40.string(),
  artist: z40.string(),
  choreographer: z40.string(),
  count: z40.null(),
  wall: z40.null(),
  difficulty: z40.string(),
  stepsheetUrl: z40.string().nullable(),
  submittedByUserId: z40.string(),
  submittedAt: bsonDate,
  status: z40.string()
});

// src/contract/collections/ldco/session_attendance.ts
import { z as z41 } from "zod";
var LdcoSessionAttendanceSchema = z41.strictObject({
  _id: z41.string(),
  sessionId: z41.string(),
  userId: z41.string(),
  firstSeenAt: bsonDate,
  hostId: z41.string(),
  lastSeenAt: bsonDate
});

// src/contract/collections/ldco/tracks.ts
import { z as z42 } from "zod";
var LdcoTracksSchema = z42.strictObject({
  _id: z42.string(),
  isrc: z42.string().optional(),
  name: z42.string(),
  artists: z42.array(z42.string()),
  uri: z42.string(),
  duration_ms: z42.number(),
  explicit: z42.boolean(),
  preview_url: z42.string().nullable().optional(),
  is_playable: z42.boolean().optional(),
  url: z42.string().optional()
});

// src/contract/collections/ldco/user_favorite_dances.ts
import { z as z43 } from "zod";
var LdcoUserFavoriteDancesSchema = z43.strictObject({
  _id: z43.string(),
  userId: z43.string(),
  danceId: z43.string(),
  createdAt: bsonDate
});

// src/contract/collections/ldco/user_flagged_dances.ts
import { z as z44 } from "zod";
var LdcoUserFlaggedDancesSchema = z44.strictObject({
  _id: z44.string(),
  userId: z44.string(),
  danceId: z44.string(),
  createdAt: bsonDate
});

// src/contract/collections/ldco/user_follow_collections.ts
import { z as z45 } from "zod";
var LdcoUserFollowCollectionsSchema = z45.strictObject({
  _id: z45.string(),
  userId: z45.string(),
  collectionId: z45.string(),
  followedAt: bsonDate
});

// src/contract/collections/ldco/user_follows.ts
import { z as z46 } from "zod";
var LdcoUserFollowsSchema = z46.strictObject({
  _id: z46.string(),
  userId: z46.string(),
  followingId: z46.string(),
  createdAt: bsonDate
});

// src/contract/collections/ldco/user_friends.ts
import { z as z47 } from "zod";
var LdcoUserFriendsSchema = z47.strictObject({
  _id: z47.string(),
  userA: z47.string(),
  userB: z47.string(),
  timestamp: bsonDate
});

// src/contract/collections/ldco/user_known_dances.ts
import { z as z48 } from "zod";
var LdcoUserKnownDancesSchema = z48.strictObject({
  _id: z48.string(),
  userId: z48.string(),
  danceId: z48.string(),
  createdAt: bsonDate
});

// src/contract/collections/ldco/user_lessons.ts
import { z as z49 } from "zod";
var LdcoUserLessonsSchema = z49.strictObject({
  _id: z49.string(),
  userId: z49.string(),
  lessonId: z49.string()
});

// src/contract/collections/ldco/user_refresh_dances.ts
import { z as z50 } from "zod";
var LdcoUserRefreshDancesSchema = z50.strictObject({
  _id: z50.string(),
  userId: z50.string(),
  danceId: z50.string(),
  createdAt: bsonDate
});

// src/contract/collections/ldco/user_venues.ts
import { z as z51 } from "zod";
var LdcoUserVenuesSchema = z51.strictObject({
  _id: z51.string(),
  userId: z51.string(),
  venueId: z51.string()
});

// src/contract/collections/ldco/users.ts
import { z as z52 } from "zod";
var LdcoUsersSchema = z52.strictObject({
  _id: z52.string(),
  name: z52.string(),
  email: z52.string(),
  image: z52.string().optional(),
  emailVerified: z52.null().optional(),
  bio: z52.string().optional(),
  favorites: z52.array(z52.string()).optional(),
  flagged: z52.array(z52.string()).optional(),
  known: z52.array(z52.string()).optional(),
  refresh: z52.array(z52.string()).optional(),
  collections: z52.array(z52.strictObject({
    name: z52.string(),
    danceIds: z52.array(z52.string())
  })).optional(),
  password: z52.string().optional(),
  createdAt: bsonDate.optional(),
  googleId: z52.string().optional()
});

// src/contract/collections/ldco/venue_checkins.ts
import { z as z53 } from "zod";
var LdcoVenueCheckinsSchema = z53.strictObject({
  _id: z53.string(),
  userId: z53.string(),
  venueId: z53.string(),
  dateKey: z53.string(),
  status: z53.string()
});

// src/contract/collections/ldco/venue_users.ts
import { z as z54 } from "zod";
var LdcoVenueUsersSchema = z54.strictObject({
  _id: z54.string(),
  userId: z54.string(),
  venueId: z54.string(),
  requestedBy: z54.string()
});

// src/contract/collections/ldco/venues.ts
import { z as z55 } from "zod";
var LdcoVenuesSchema = z55.strictObject({
  _id: z55.string(),
  venuename: z55.string(),
  venueaddress: z55.string(),
  geolocation: z55.array(z55.number()),
  phone: z55.string(),
  website: z55.string(),
  timeZone: z55.string(),
  verifiedAt: z55.null(),
  verifiedBy: z55.null(),
  city: z55.string().optional(),
  state: z55.string().optional()
});

// src/contract/collections/ldco-events/event_registrations.ts
import { z as z56 } from "zod";
var LdcoEventsEventRegistrationsSchema = z56.strictObject({
  _id: objectId,
  address: z56.string().nullable(),
  agreedToWaiver: z56.boolean(),
  attendeeStatus: z56.string().optional(),
  createdAt: bsonDate,
  email: z56.string(),
  emails: z56.array(z56.strictObject({
    templateId: z56.string(),
    subject: z56.string(),
    sentAt: z56.string()
  })).optional(),
  event: z56.string(),
  name: z56.string(),
  paidAt: bsonDate.nullable().optional(),
  paymentMethod: z56.string(),
  paymentStatus: z56.string(),
  phone: z56.string().nullable(),
  requestToken: z56.string(),
  waiverSignature: z56.string(),
  waiverSignedAt: z56.string(),
  requests: z56.array(z56.strictObject({
    text: z56.string(),
    danceId: z56.string().nullable()
  })).optional(),
  updatedAt: bsonDate.optional(),
  catering: z56.boolean().optional(),
  stripeSessionId: z56.null().optional()
});

// src/contract/collections/ldco-events/events.ts
import { z as z57 } from "zod";
var LdcoEventsEventsSchema = z57.strictObject({
  _id: objectId,
  slug: z57.string(),
  active: z57.boolean(),
  createdAt: bsonDate,
  date: z57.string(),
  dateShort: z57.string(),
  shortTitle: z57.string(),
  time: z57.string(),
  title: z57.string(),
  venueAddress: z57.string(),
  venueName: z57.string()
});

// src/contract/collections/ldco-lessons/event_instructor_requests.ts
import { z as z58 } from "zod";
var LdcoLessonsEventInstructorRequestsSchema = z58.looseObject({ _id: z58.union([z58.string(), objectId]) });

// src/contract/collections/ldco-lessons/event_instructors.ts
import { z as z59 } from "zod";
var LdcoLessonsEventInstructorsSchema = z59.strictObject({
  _id: z59.string(),
  instructorId: z59.string(),
  eventTypeId: z59.string(),
  createdAt: bsonDate,
  role: z59.string()
});

// src/contract/collections/ldco-lessons/event_templates.ts
import { z as z60 } from "zod";
var LdcoLessonsEventTemplatesSchema = z60.strictObject({
  _id: z60.string(),
  createdAt: bsonDate,
  eventTypeId: z60.string(),
  isDefault: z60.boolean(),
  lessons: z60.array(z60.strictObject({
    time: z60.string(),
    dance: z60.string().nullable(),
    level: z60.string().nullable(),
    link: z60.null()
  })),
  name: z60.string(),
  updatedAt: bsonDate
});

// src/contract/collections/ldco-lessons/event_types.ts
import { z as z61 } from "zod";
var LdcoLessonsEventTypesSchema = z61.strictObject({
  _id: z61.string(),
  createdAt: bsonDate,
  createdBy: z61.string(),
  defaultDurationMinutes: z61.number(),
  defaultStartTime: z61.string().nullable(),
  isActive: z61.boolean(),
  level: z61.string(),
  price: z61.string(),
  title: z61.string(),
  updatedAt: bsonDate,
  venueId: z61.string(),
  verifiedAt: z61.null(),
  verifiedBy: z61.null()
});

// src/contract/collections/ldco-lessons/events.ts
import { z as z62 } from "zod";
var LdcoLessonsEventsSchema = z62.strictObject({
  _id: z62.string(),
  cancelNote: z62.string().nullable(),
  createdAt: bsonDate,
  date: z62.string(),
  endAt: bsonDate,
  eventTypeId: z62.string(),
  isCancelled: z62.boolean(),
  lessons: z62.array(z62.strictObject({
    _id: z62.string(),
    startAt: bsonDate,
    dance: z62.string().nullable(),
    danceId: z62.string().nullable(),
    level: z62.string().nullable(),
    link: z62.string().nullable(),
    committed: z62.boolean(),
    skipped: z62.boolean()
  })),
  specialNote: z62.string().nullable(),
  startAt: bsonDate,
  substitute: z62.string().nullable(),
  substituteInstructorId: z62.null(),
  timeZone: z62.string(),
  updatedAt: bsonDate,
  verifiedAt: z62.null(),
  verifiedBy: z62.null()
});

// src/contract/collections/ldco-lessons/frequencies.ts
import { z as z63 } from "zod";
var LdcoLessonsFrequenciesSchema = z63.strictObject({
  _id: z63.string(),
  byDay: z63.array(z63.string()).optional(),
  createdAt: bsonDate,
  durationMinutes: z63.number(),
  eventTypeId: z63.string(),
  isActive: z63.boolean().optional(),
  kind: z63.string(),
  startDate: z63.string().optional(),
  startTime: z63.string(),
  updatedAt: bsonDate,
  endDate: z63.string().optional(),
  nth: z63.number().optional(),
  weekday: z63.string().optional()
});

// src/contract/collections/ldco-lessons/lessons.ts
import { z as z64 } from "zod";
var LdcoLessonsLessonsSchema = z64.strictObject({
  _id: z64.string(),
  danceId: z64.string().optional(),
  date: bsonDate,
  eventId: z64.string().nullable(),
  instructorId: z64.string(),
  lessonId: z64.null(),
  venue: z64.string(),
  venueId: z64.string(),
  danceName: z64.string().optional()
});

// src/contract/collections/ldco-reviews/choreographers.ts
import { z as z65 } from "zod";
var LdcoReviewsChoreographersSchema = z65.looseObject({ _id: z65.union([z65.string(), objectId]) });

// src/contract/collections/ldco-reviews/dances.ts
import { z as z66 } from "zod";
var LdcoReviewsDancesSchema = z66.looseObject({ _id: z66.union([z66.string(), objectId]) });

// src/contract/collections/ldco-reviews/join_choreographer_appeals.ts
import { z as z67 } from "zod";
var LdcoReviewsJoinChoreographerAppealsSchema = z67.looseObject({ _id: z67.union([z67.string(), objectId]) });

// src/contract/collections/ldco-reviews/lessons.ts
import { z as z68 } from "zod";
var LdcoReviewsLessonsSchema = z68.strictObject({
  _id: objectId,
  lessonday: z68.string(),
  lessonstart: z68.string(),
  instructors: z68.array(z68.string()),
  duration: z68.string(),
  lessoncost: z68.string(),
  notes: z68.string(),
  difficulty: z68.string(),
  venueid: z68.string()
});

// src/contract/collections/ldco-reviews/reports.ts
import { z as z69 } from "zod";
var LdcoReviewsReportsSchema = z69.looseObject({ _id: z69.union([z69.string(), objectId]) });

// src/contract/collections/ldco-reviews/tracks.ts
import { z as z70 } from "zod";
var LdcoReviewsTracksSchema = z70.looseObject({ _id: z70.union([z70.string(), objectId]) });

// src/contract/collections/ldco-reviews/venue_users.ts
import { z as z71 } from "zod";
var LdcoReviewsVenueUsersSchema = z71.strictObject({
  _id: z71.string(),
  userId: z71.string(),
  venueId: z71.string(),
  createdAt: bsonDate,
  requestedBy: z71.string()
});

// src/contract/collections/ldco-reviews/venues.ts
import { z as z72 } from "zod";
var LdcoReviewsVenuesSchema = z72.strictObject({
  _id: z72.string(),
  venuename: z72.string(),
  venueaddress: z72.string(),
  geolocation: z72.array(z72.number()),
  phone: z72.string(),
  website: z72.string(),
  contactName: z72.string(),
  contactEmail: z72.string(),
  contactPhone: z72.string(),
  createdAt: bsonDate,
  timeZone: z72.string(),
  verifiedAt: z72.null(),
  verifiedBy: z72.null()
});

// src/contract/collections/ldco-reviews/verify_user_instructor.ts
import { z as z73 } from "zod";
var LdcoReviewsVerifyUserInstructorSchema = z73.strictObject({
  _id: objectId,
  userId: z73.string(),
  instructorId: z73.string(),
  createdAt: bsonDate,
  resolved: z73.boolean(),
  resolution: z73.string(),
  resolvedAt: bsonDate,
  resolvedBy: z73.string()
});

// src/contract/collections/music_catalog/tracks.ts
import { z as z74 } from "zod";
var MusicCatalogTracksSchema = z74.strictObject({
  _id: z74.string(),
  artist: z74.string(),
  createdAt: bsonDate,
  disambiguation: z74.string(),
  durationMs: z74.number().nullable(),
  isrcs: z74.array(z74.string()),
  nArtist: z74.string(),
  nTitle: z74.string(),
  rank: z74.number(),
  rankedAt: bsonDate.optional(),
  source: z74.string(),
  sourceId: z74.string(),
  title: z74.string(),
  updatedAt: bsonDate,
  variantKey: z74.string(),
  words: z74.array(z74.string()),
  year: z74.number().nullable()
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
  "djfeed.free_access": { database: "djfeed", name: "free_access", schema: DjfeedFreeAccessSchema },
  "djfeed.requester_history": { database: "djfeed", name: "requester_history", schema: DjfeedRequesterHistorySchema },
  "djfeed.session_reports": { database: "djfeed", name: "session_reports", schema: DjfeedSessionReportsSchema },
  "djfeed.session_transactions": { database: "djfeed", name: "session_transactions", schema: DjfeedSessionTransactionsSchema },
  "djfeed.stripe_events": { database: "djfeed", name: "stripe_events", schema: DjfeedStripeEventsSchema },
  "ldco.choreographers": { database: "ldco", name: "choreographers", schema: LdcoChoreographersSchema },
  "ldco.dance_collections": { database: "ldco", name: "dance_collections", schema: LdcoDanceCollectionsSchema },
  "ldco.dance_tracks": { database: "ldco", name: "dance_tracks", schema: LdcoDanceTracksSchema },
  "ldco.dances": { database: "ldco", name: "dances", schema: LdcoDancesSchema },
  "ldco.events": { database: "ldco", name: "events", schema: LdcoEventsSchema },
  "ldco.friend_requests": { database: "ldco", name: "friend_requests", schema: LdcoFriendRequestsSchema },
  "ldco.host_dancers": { database: "ldco", name: "host_dancers", schema: LdcoHostDancersSchema },
  "ldco.instructor_venues": { database: "ldco", name: "instructor_venues", schema: LdcoInstructorVenuesSchema },
  "ldco.instructors": { database: "ldco", name: "instructors", schema: LdcoInstructorsSchema },
  "ldco.lessons": { database: "ldco", name: "lessons", schema: LdcoLessonsSchema },
  "ldco.login_events": { database: "ldco", name: "login_events", schema: LdcoLoginEventsSchema },
  "ldco.oauth_auth_codes": { database: "ldco", name: "oauth_auth_codes", schema: LdcoOauthAuthCodesSchema },
  "ldco.pending_dances": { database: "ldco", name: "pending_dances", schema: LdcoPendingDancesSchema },
  "ldco.session_attendance": { database: "ldco", name: "session_attendance", schema: LdcoSessionAttendanceSchema },
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
  const description = Object.entries(collections).sort(([a], [b]) => a.localeCompare(b)).map(([key, c]) => [key, c.database, c.name, z75.toJSONSchema(c.schema, { unrepresentable: "any" })]);
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
  DjfeedFreeAccessSchema,
  DjfeedRequesterHistorySchema,
  DjfeedSessionReportsSchema,
  DjfeedSessionTransactionsSchema,
  DjfeedStripeEventsSchema,
  LdcoChoreographersSchema,
  LdcoDanceCollectionsSchema,
  LdcoDanceTracksSchema,
  LdcoDancesSchema,
  LdcoEventsSchema,
  LdcoFriendRequestsSchema,
  LdcoHostDancersSchema,
  LdcoInstructorVenuesSchema,
  LdcoInstructorsSchema,
  LdcoLessonsSchema,
  LdcoLoginEventsSchema,
  LdcoOauthAuthCodesSchema,
  LdcoPendingDancesSchema,
  LdcoSessionAttendanceSchema,
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
