#!/usr/bin/env node
"use strict";

// src/contract/index.ts
var import_node_crypto = require("crypto");
var import_zod75 = require("zod");

// contract.lock.json
var hash = "cd204146402d84dc66f68bdb6e63edda912e5312fb899ac31430a805ca410fa7";

// package.json
var version = "0.13.1";

// src/contract/collections/bld/event_templates.ts
var import_zod2 = require("zod");

// src/contract/bson.ts
var import_zod = require("zod");
var objectId = import_zod.z.custom((v) => typeof v === "object" && v !== null && v._bsontype === "ObjectId").meta({ bsonType: "objectId" });
var bsonDate = import_zod.z.date().meta({ bsonType: "date" });

// src/contract/collections/bld/event_templates.ts
var BldEventTemplatesSchema = import_zod2.z.strictObject({
  _id: objectId,
  eventTypeId: objectId,
  name: import_zod2.z.string(),
  lessons: import_zod2.z.array(import_zod2.z.strictObject({
    time: import_zod2.z.string(),
    dance: import_zod2.z.string().nullable(),
    level: import_zod2.z.string().nullable(),
    link: import_zod2.z.null()
  })),
  createdAt: bsonDate,
  updatedAt: bsonDate,
  isDefault: import_zod2.z.boolean().optional()
});

// src/contract/collections/bld/event_types.ts
var import_zod3 = require("zod");
var BldEventTypesSchema = import_zod3.z.strictObject({
  _id: objectId,
  title: import_zod3.z.string(),
  level: import_zod3.z.string(),
  price: import_zod3.z.string(),
  defaultStartTime: import_zod3.z.string(),
  defaultDurationMinutes: import_zod3.z.number(),
  isActive: import_zod3.z.boolean(),
  venueId: import_zod3.z.string(),
  updatedAt: bsonDate.optional(),
  endDayOffset: import_zod3.z.number().optional(),
  createdAt: bsonDate.optional()
});

// src/contract/collections/bld/events.ts
var import_zod4 = require("zod");
var BldEventsSchema = import_zod4.z.strictObject({
  _id: objectId,
  date: import_zod4.z.string(),
  eventTypeId: objectId,
  startTime: import_zod4.z.string(),
  durationMinutes: import_zod4.z.number(),
  lessons: import_zod4.z.array(import_zod4.z.strictObject({
    time: import_zod4.z.string(),
    dance: import_zod4.z.string().nullable(),
    level: import_zod4.z.string().nullable(),
    link: import_zod4.z.string().nullable(),
    committed: import_zod4.z.boolean(),
    danceId: import_zod4.z.string().nullable().optional()
  })),
  substitute: import_zod4.z.string().nullable(),
  cancelNote: import_zod4.z.string().nullable(),
  isCancelled: import_zod4.z.boolean(),
  updatedAt: bsonDate.optional(),
  endTime: import_zod4.z.string().optional(),
  endDayOffset: import_zod4.z.number().optional(),
  specialNote: import_zod4.z.string().nullable().optional()
});

// src/contract/collections/bld/frequencies.ts
var import_zod5 = require("zod");
var BldFrequenciesSchema = import_zod5.z.strictObject({
  _id: objectId,
  eventTypeId: objectId,
  kind: import_zod5.z.string(),
  byDay: import_zod5.z.array(import_zod5.z.string()).optional(),
  startTime: import_zod5.z.string(),
  durationMinutes: import_zod5.z.number(),
  startDate: import_zod5.z.string().optional(),
  isActive: import_zod5.z.boolean().optional(),
  updatedAt: bsonDate.optional(),
  weekday: import_zod5.z.string().optional(),
  nth: import_zod5.z.number().optional(),
  endDate: import_zod5.z.string().optional(),
  createdAt: bsonDate.optional()
});

// src/contract/collections/bld/lessons.ts
var import_zod6 = require("zod");
var BldLessonsSchema = import_zod6.z.strictObject({
  _id: objectId,
  danceId: import_zod6.z.string().optional(),
  venue: import_zod6.z.string(),
  date: import_zod6.z.string(),
  danceName: import_zod6.z.string().optional()
});

// src/contract/collections/copperknob_alert/processed_items.ts
var import_zod7 = require("zod");
var CopperknobAlertProcessedItemsSchema = import_zod7.z.strictObject({
  _id: objectId,
  guid: import_zod7.z.string(),
  danceTitle: import_zod7.z.string(),
  details: import_zod7.z.strictObject({
    method: import_zod7.z.string(),
    score: import_zod7.z.number(),
    choreographer: import_zod7.z.string()
  }),
  matchedRule: import_zod7.z.string(),
  processedAt: bsonDate,
  status: import_zod7.z.string(),
  submitUrl: import_zod7.z.string(),
  youtubeUrl: import_zod7.z.null()
});

// src/contract/collections/copperknob_alert/sync_metadata.ts
var import_zod8 = require("zod");
var CopperknobAlertSyncMetadataSchema = import_zod8.z.strictObject({
  _id: objectId,
  key: import_zod8.z.string(),
  lastPublishedCount: import_zod8.z.number(),
  lastRunAt: import_zod8.z.string()
});

// src/contract/collections/copperknob_alert/watch_rules.ts
var import_zod9 = require("zod");
var CopperknobAlertWatchRulesSchema = import_zod9.z.strictObject({
  _id: objectId,
  id: import_zod9.z.string(),
  checkIntervalMinutes: import_zod9.z.number(),
  choreographer: import_zod9.z.string(),
  danceName: import_zod9.z.string(),
  fuzzyThreshold: import_zod9.z.number(),
  lastCheckedAt: import_zod9.z.string()
});

// src/contract/collections/djfeed/attendee_notifications.ts
var import_zod10 = require("zod");
var DjfeedAttendeeNotificationsSchema = import_zod10.z.strictObject({
  _id: objectId,
  recipientId: import_zod10.z.string(),
  type: import_zod10.z.string(),
  fromDjId: import_zod10.z.string(),
  fromName: import_zod10.z.string(),
  beats: import_zod10.z.number(),
  message: import_zod10.z.string(),
  read: import_zod10.z.boolean(),
  createdAt: bsonDate
});

// src/contract/collections/djfeed/beat_balances.ts
var import_zod11 = require("zod");
var DjfeedBeatBalancesSchema = import_zod11.z.strictObject({
  _id: objectId,
  attendeeId: import_zod11.z.string(),
  beats: import_zod11.z.number(),
  updatedAt: bsonDate
});

// src/contract/collections/djfeed/beat_transactions.ts
var import_zod12 = require("zod");
var DjfeedBeatTransactionsSchema = import_zod12.z.strictObject({
  _id: objectId,
  attendeeId: import_zod12.z.string(),
  type: import_zod12.z.string(),
  beats: import_zod12.z.number(),
  amountCents: import_zod12.z.number().optional(),
  stripePaymentIntentId: import_zod12.z.string().optional(),
  stripeSessionId: import_zod12.z.string().optional(),
  createdAt: bsonDate,
  requestId: import_zod12.z.string().optional(),
  djId: import_zod12.z.string().optional(),
  fromDjId: import_zod12.z.string().optional()
});

// src/contract/collections/djfeed/dancer_favorite_songs.ts
var import_zod13 = require("zod");
var DjfeedDancerFavoriteSongsSchema = import_zod13.z.strictObject({
  _id: import_zod13.z.string(),
  userId: import_zod13.z.string(),
  trackId: import_zod13.z.string(),
  createdAt: bsonDate
});

// src/contract/collections/djfeed/dj_direct_messages.ts
var import_zod14 = require("zod");
var DjfeedDjDirectMessagesSchema = import_zod14.z.strictObject({
  _id: objectId,
  senderId: import_zod14.z.string(),
  recipientId: import_zod14.z.string().optional(),
  text: import_zod14.z.string(),
  status: import_zod14.z.string(),
  createdAt: bsonDate,
  expiresAt: bsonDate.nullable(),
  recipientClientId: import_zod14.z.string().optional()
});

// src/contract/collections/djfeed/dj_messages.ts
var import_zod15 = require("zod");
var DjfeedDjMessagesSchema = import_zod15.z.strictObject({
  _id: objectId,
  sessionId: import_zod15.z.string(),
  ownerId: import_zod15.z.string(),
  text: import_zod15.z.string(),
  status: import_zod15.z.string(),
  duration: import_zod15.z.number().nullable(),
  createdAt: bsonDate,
  expiresAt: bsonDate.nullable(),
  updatedAt: bsonDate.optional(),
  sendToAll: import_zod15.z.boolean().optional(),
  migratedFrom: import_zod15.z.string().optional()
});

// src/contract/collections/djfeed/dj_notifications.ts
var import_zod16 = require("zod");
var DjfeedDjNotificationsSchema = import_zod16.z.strictObject({
  _id: objectId,
  ownerId: import_zod16.z.string(),
  type: import_zod16.z.string(),
  amountCents: import_zod16.z.number(),
  senderName: import_zod16.z.string(),
  senderEmail: import_zod16.z.string(),
  read: import_zod16.z.boolean(),
  createdAt: bsonDate
});

// src/contract/collections/djfeed/dj_profiles.ts
var import_zod17 = require("zod");
var DjfeedDjProfilesSchema = import_zod17.z.strictObject({
  _id: objectId,
  ownerId: import_zod17.z.string(),
  createdAt: bsonDate,
  stripeAccountId: import_zod17.z.string(),
  updatedAt: bsonDate,
  paymentLinks: import_zod17.z.array(import_zod17.z.strictObject({
    label: import_zod17.z.string(),
    url: import_zod17.z.string()
  })),
  feedTemplates: import_zod17.z.array(import_zod17.z.strictObject({
    id: import_zod17.z.string(),
    name: import_zod17.z.string(),
    designedFor: import_zod17.z.string(),
    slides: import_zod17.z.array(import_zod17.z.strictObject({
      id: import_zod17.z.string(),
      name: import_zod17.z.string(),
      duration: import_zod17.z.number(),
      grid: import_zod17.z.strictObject({
        cols: import_zod17.z.number(),
        rows: import_zod17.z.number()
      }),
      elements: import_zod17.z.array(import_zod17.z.strictObject({
        id: import_zod17.z.string(),
        type: import_zod17.z.string(),
        col: import_zod17.z.number(),
        row: import_zod17.z.number(),
        colSpan: import_zod17.z.number(),
        rowSpan: import_zod17.z.number(),
        src: import_zod17.z.string().optional()
      }))
    })),
    createdAt: import_zod17.z.string(),
    updatedAt: import_zod17.z.string().optional()
  }))
});

// src/contract/collections/djfeed/dj_requester_nicknames.ts
var import_zod18 = require("zod");
var DjfeedDjRequesterNicknamesSchema = import_zod18.z.strictObject({
  _id: objectId,
  djId: import_zod18.z.string(),
  clientId: import_zod18.z.string(),
  nickname: import_zod18.z.string(),
  updatedAt: bsonDate
});

// src/contract/collections/djfeed/dj_requests.ts
var import_zod19 = require("zod");
var DjfeedDjRequestsSchema = import_zod19.z.strictObject({
  _id: objectId,
  sessionId: import_zod19.z.string(),
  ownerId: import_zod19.z.string(),
  danceId: import_zod19.z.string().nullable(),
  danceName: import_zod19.z.string(),
  songName: import_zod19.z.string(),
  artist: import_zod19.z.string(),
  difficulty: import_zod19.z.string(),
  stepsheet: import_zod19.z.string(),
  duration_ms: import_zod19.z.number().nullable(),
  spotifyUri: import_zod19.z.string().nullable().optional(),
  clientId: import_zod19.z.string(),
  requesterName: import_zod19.z.string(),
  notes: import_zod19.z.string(),
  danceType: import_zod19.z.string().nullable().optional(),
  isSongSwap: import_zod19.z.boolean().optional(),
  swapSongName: import_zod19.z.string().nullable().optional(),
  swapArtist: import_zod19.z.string().nullable().optional(),
  tipCents: import_zod19.z.number().optional(),
  isRepeat: import_zod19.z.boolean().optional(),
  status: import_zod19.z.string(),
  queuePosition: import_zod19.z.number().nullable(),
  createdAt: bsonDate,
  updatedAt: bsonDate,
  advancedBy: import_zod19.z.string().optional(),
  playStartedAt: bsonDate.optional(),
  pausedAt: bsonDate.nullable().optional(),
  partnerStyle: import_zod19.z.string().nullable().optional(),
  partnerGroupId: import_zod19.z.string().nullable().optional(),
  localTrackKey: import_zod19.z.string().nullable().optional(),
  catalogTrackId: import_zod19.z.string().nullable().optional(),
  isrcs: import_zod19.z.array(import_zod19.z.string()).optional(),
  tempo: import_zod19.z.number().nullable().optional(),
  playLengthMs: import_zod19.z.number().optional(),
  volumeDb: import_zod19.z.number().optional(),
  migratedFrom: import_zod19.z.string().optional()
});

// src/contract/collections/djfeed/dj_sessions.ts
var import_zod20 = require("zod");
var DjfeedDjSessionsSchema = import_zod20.z.strictObject({
  _id: objectId,
  ownerId: import_zod20.z.string(),
  name: import_zod20.z.string(),
  slug: import_zod20.z.string().optional(),
  status: import_zod20.z.string(),
  plugin: import_zod20.z.string().optional(),
  startedAt: bsonDate.nullable(),
  endsAt: bsonDate.nullable().optional(),
  closedAt: bsonDate.nullable(),
  partnerDancesEnabled: import_zod20.z.boolean().optional(),
  weightDecayEnabled: import_zod20.z.boolean().optional(),
  weightDecayHalfLifeMinutes: import_zod20.z.number().optional(),
  tippingEnabled: import_zod20.z.boolean().optional(),
  autoClosedAt: bsonDate.optional(),
  fairnessScoringEnabled: import_zod20.z.boolean().optional(),
  durationMinutes: import_zod20.z.number().optional(),
  queueVisibleCount: import_zod20.z.number().optional(),
  feedTemplateId: import_zod20.z.string().optional(),
  feedAppliedAt: import_zod20.z.string().optional(),
  feedAspectRatio: import_zod20.z.string().optional(),
  requestsEnabled: import_zod20.z.boolean().optional(),
  suppressedClientIds: import_zod20.z.array(import_zod20.z.unknown()).optional(),
  addOns: import_zod20.z.array(import_zod20.z.unknown()).optional(),
  migratedFrom: import_zod20.z.string().optional(),
  shareTimeZone: import_zod20.z.string().optional(),
  shareToken: import_zod20.z.string().optional()
});

// src/contract/collections/djfeed/dj_wallet_locks.ts
var import_zod21 = require("zod");
var DjfeedDjWalletLocksSchema = import_zod21.z.looseObject({ _id: import_zod21.z.union([import_zod21.z.string(), objectId]) });

// src/contract/collections/djfeed/dj_wallet_transactions.ts
var import_zod22 = require("zod");
var DjfeedDjWalletTransactionsSchema = import_zod22.z.strictObject({
  _id: objectId,
  ownerId: import_zod22.z.string(),
  type: import_zod22.z.string(),
  amountCents: import_zod22.z.number(),
  requestId: import_zod22.z.string().optional(),
  attendeeId: import_zod22.z.string().nullable().optional(),
  createdAt: bsonDate,
  stripeSessionId: import_zod22.z.string().optional(),
  senderName: import_zod22.z.string().optional(),
  senderEmail: import_zod22.z.string().optional(),
  originalWalletTxId: import_zod22.z.string().optional(),
  note: import_zod22.z.string().optional(),
  recipientId: import_zod22.z.string().optional(),
  recipientEmail: import_zod22.z.string().optional(),
  beats: import_zod22.z.number().optional(),
  sessionId: import_zod22.z.string().optional(),
  durationMinutes: import_zod22.z.number().optional(),
  addOns: import_zod22.z.array(import_zod22.z.unknown()).optional()
});

// src/contract/collections/djfeed/free_access.ts
var import_zod23 = require("zod");
var DjfeedFreeAccessSchema = import_zod23.z.strictObject({
  _id: objectId,
  email: import_zod23.z.string(),
  expiresAt: bsonDate.nullable(),
  note: import_zod23.z.string().nullable(),
  createdAt: bsonDate
});

// src/contract/collections/djfeed/requester_history.ts
var import_zod24 = require("zod");
var DjfeedRequesterHistorySchema = import_zod24.z.strictObject({
  _id: objectId,
  clientId: import_zod24.z.string(),
  sessionId: import_zod24.z.string(),
  ownerId: import_zod24.z.string(),
  requesterName: import_zod24.z.string(),
  requests: import_zod24.z.array(import_zod24.z.strictObject({
    danceName: import_zod24.z.string(),
    danceId: import_zod24.z.string().nullable(),
    status: import_zod24.z.string(),
    tipCents: import_zod24.z.number(),
    createdAt: bsonDate
  })),
  sessionDate: bsonDate,
  sessionName: import_zod24.z.string()
});

// src/contract/collections/djfeed/session_reports.ts
var import_zod25 = require("zod");
var DjfeedSessionReportsSchema = import_zod25.z.strictObject({
  _id: objectId,
  sessionId: import_zod25.z.string(),
  actualDurationMs: import_zod25.z.number(),
  autoClosedAt: bsonDate.nullable(),
  closedAt: bsonDate,
  endsAt: bsonDate,
  extensions: import_zod25.z.array(import_zod25.z.unknown()),
  generatedAt: bsonDate,
  ownerId: import_zod25.z.string(),
  playedTracks: import_zod25.z.array(import_zod25.z.strictObject({
    danceName: import_zod25.z.string(),
    danceId: import_zod25.z.string().nullable(),
    songName: import_zod25.z.string(),
    artist: import_zod25.z.string(),
    difficulty: import_zod25.z.string(),
    stepsheet: import_zod25.z.string().optional(),
    danceType: import_zod25.z.string().nullable(),
    partnerStyle: import_zod25.z.string().nullable(),
    isSongSwap: import_zod25.z.boolean().optional(),
    swapSongName: import_zod25.z.string().nullable().optional(),
    swapArtist: import_zod25.z.string().nullable().optional(),
    playedAt: bsonDate,
    requesters: import_zod25.z.array(import_zod25.z.strictObject({
      clientId: import_zod25.z.string(),
      requesterName: import_zod25.z.string(),
      tipCents: import_zod25.z.number()
    })),
    totalTips: import_zod25.z.number(),
    requesterCount: import_zod25.z.number(),
    catalogTrackId: import_zod25.z.string().nullable().optional()
  })),
  sessionName: import_zod25.z.string(),
  startedAt: bsonDate,
  stats: import_zod25.z.strictObject({
    totalDancesPlayed: import_zod25.z.number(),
    totalRequests: import_zod25.z.number(),
    totalApproved: import_zod25.z.number(),
    totalSkipped: import_zod25.z.number(),
    totalPending: import_zod25.z.number(),
    approvalRate: import_zod25.z.number().nullable(),
    totalTipCents: import_zod25.z.number(),
    uniqueRequesters: import_zod25.z.number()
  })
});

// src/contract/collections/djfeed/session_transactions.ts
var import_zod26 = require("zod");
var DjfeedSessionTransactionsSchema = import_zod26.z.strictObject({
  _id: objectId,
  ownerId: import_zod26.z.string(),
  type: import_zod26.z.string(),
  sessionId: import_zod26.z.string(),
  sessionName: import_zod26.z.string(),
  durationMinutes: import_zod26.z.number(),
  amountCents: import_zod26.z.number(),
  stripeSessionId: import_zod26.z.string(),
  stripePaymentIntentId: import_zod26.z.string(),
  createdAt: bsonDate
});

// src/contract/collections/djfeed/stripe_events.ts
var import_zod27 = require("zod");
var DjfeedStripeEventsSchema = import_zod27.z.strictObject({
  _id: import_zod27.z.string(),
  type: import_zod27.z.string(),
  receivedAt: bsonDate
});

// src/contract/collections/ldco/choreographers.ts
var import_zod28 = require("zod");
var LdcoChoreographersSchema = import_zod28.z.strictObject({
  _id: import_zod28.z.string(),
  name: import_zod28.z.string(),
  copperknobUrl: import_zod28.z.string().optional(),
  lastImportedAt: import_zod28.z.string().optional(),
  associatedUserId: import_zod28.z.string().optional()
});

// src/contract/collections/ldco/dance_collections.ts
var import_zod29 = require("zod");
var LdcoDanceCollectionsSchema = import_zod29.z.strictObject({
  _id: import_zod29.z.string(),
  name: import_zod29.z.string(),
  danceIds: import_zod29.z.array(import_zod29.z.string()),
  createdBy: import_zod29.z.string(),
  createdAt: bsonDate.nullable(),
  updatedAt: bsonDate.nullable(),
  isPrivate: import_zod29.z.boolean().optional(),
  archived: import_zod29.z.boolean().optional(),
  archivedAt: bsonDate.nullable().optional(),
  isArchived: import_zod29.z.boolean().optional(),
  isCopyable: import_zod29.z.boolean().optional(),
  pendingDanceIds: import_zod29.z.array(import_zod29.z.string()).optional()
});

// src/contract/collections/ldco/dance_tracks.ts
var import_zod30 = require("zod");
var LdcoDanceTracksSchema = import_zod30.z.strictObject({
  _id: import_zod30.z.string(),
  danceId: import_zod30.z.string(),
  trackId: import_zod30.z.string(),
  isPrimary: import_zod30.z.boolean(),
  createdAt: bsonDate
});

// src/contract/collections/ldco/dances.ts
var import_zod31 = require("zod");
var LdcoDancesSchema = import_zod31.z.strictObject({
  _id: import_zod31.z.string(),
  difficulty: import_zod31.z.string(),
  tracks: import_zod31.z.array(import_zod31.z.string()),
  primaryTrack: import_zod31.z.string(),
  danceName: import_zod31.z.string(),
  choreographers: import_zod31.z.array(import_zod31.z.string()),
  stepsheet: import_zod31.z.string().optional(),
  stepsheetUrls: import_zod31.z.array(import_zod31.z.string()).optional(),
  songArtists: import_zod31.z.array(import_zod31.z.strictObject({
    song: import_zod31.z.string(),
    artist: import_zod31.z.string()
  })).optional()
});

// src/contract/collections/ldco/events.ts
var import_zod32 = require("zod");
var LdcoEventsSchema = import_zod32.z.strictObject({
  _id: import_zod32.z.string(),
  venueId: import_zod32.z.string(),
  title: import_zod32.z.string(),
  description: import_zod32.z.string(),
  eventDay: import_zod32.z.string(),
  startTime: import_zod32.z.string(),
  endTime: import_zod32.z.string(),
  createdAt: bsonDate,
  updatedAt: bsonDate,
  createdBy: import_zod32.z.string()
});

// src/contract/collections/ldco/friend_requests.ts
var import_zod33 = require("zod");
var LdcoFriendRequestsSchema = import_zod33.z.strictObject({
  _id: import_zod33.z.string(),
  requesterId: import_zod33.z.string(),
  requesteeId: import_zod33.z.string(),
  createdAt: bsonDate.optional(),
  timestamp: bsonDate.optional()
});

// src/contract/collections/ldco/host_dancers.ts
var import_zod34 = require("zod");
var LdcoHostDancersSchema = import_zod34.z.strictObject({
  _id: import_zod34.z.string(),
  hostId: import_zod34.z.string(),
  userId: import_zod34.z.string(),
  firstSeenAt: bsonDate,
  lastSeenAt: bsonDate,
  sessionCount: import_zod34.z.number(),
  lastSessionId: import_zod34.z.string()
});

// src/contract/collections/ldco/instructor_venues.ts
var import_zod35 = require("zod");
var LdcoInstructorVenuesSchema = import_zod35.z.strictObject({
  _id: import_zod35.z.string(),
  instructorId: import_zod35.z.string(),
  venueId: import_zod35.z.string(),
  createdAt: bsonDate.optional(),
  updatedAt: bsonDate.optional()
});

// src/contract/collections/ldco/instructors.ts
var import_zod36 = require("zod");
var LdcoInstructorsSchema = import_zod36.z.strictObject({
  _id: import_zod36.z.string(),
  name: import_zod36.z.string(),
  associatedUserId: import_zod36.z.string().optional(),
  userId: import_zod36.z.string().optional(),
  bio: import_zod36.z.string().optional()
});

// src/contract/collections/ldco/lessons.ts
var import_zod37 = require("zod");
var LdcoLessonsSchema = import_zod37.z.strictObject({
  _id: import_zod37.z.string(),
  lessonday: import_zod37.z.string(),
  lessonstart: import_zod37.z.string(),
  instructors: import_zod37.z.array(import_zod37.z.string()),
  duration: import_zod37.z.string(),
  lessoncost: import_zod37.z.string(),
  notes: import_zod37.z.string(),
  difficulty: import_zod37.z.string(),
  venueid: import_zod37.z.string(),
  verifiedAt: import_zod37.z.null(),
  verifiedBy: import_zod37.z.null()
});

// src/contract/collections/ldco/login_events.ts
var import_zod38 = require("zod");
var LdcoLoginEventsSchema = import_zod38.z.strictObject({
  _id: objectId,
  userId: import_zod38.z.string(),
  email: import_zod38.z.string(),
  provider: import_zod38.z.string(),
  app: import_zod38.z.string(),
  ip: import_zod38.z.string().optional(),
  userAgent: import_zod38.z.string().optional(),
  createdAt: bsonDate,
  clientId: import_zod38.z.string().nullable().optional(),
  debugReturnToCookie: import_zod38.z.null().optional(),
  source: import_zod38.z.string().optional()
});

// src/contract/collections/ldco/oauth_auth_codes.ts
var import_zod39 = require("zod");
var LdcoOauthAuthCodesSchema = import_zod39.z.looseObject({ _id: import_zod39.z.union([import_zod39.z.string(), objectId]) });

// src/contract/collections/ldco/pending_dances.ts
var import_zod40 = require("zod");
var LdcoPendingDancesSchema = import_zod40.z.strictObject({
  _id: import_zod40.z.string(),
  danceName: import_zod40.z.string(),
  songTitle: import_zod40.z.string(),
  artist: import_zod40.z.string(),
  choreographer: import_zod40.z.string(),
  count: import_zod40.z.null(),
  wall: import_zod40.z.null(),
  difficulty: import_zod40.z.string(),
  stepsheetUrl: import_zod40.z.string().nullable(),
  submittedByUserId: import_zod40.z.string(),
  submittedAt: bsonDate,
  status: import_zod40.z.string()
});

// src/contract/collections/ldco/session_attendance.ts
var import_zod41 = require("zod");
var LdcoSessionAttendanceSchema = import_zod41.z.strictObject({
  _id: import_zod41.z.string(),
  sessionId: import_zod41.z.string(),
  userId: import_zod41.z.string(),
  firstSeenAt: bsonDate,
  hostId: import_zod41.z.string(),
  lastSeenAt: bsonDate
});

// src/contract/collections/ldco/tracks.ts
var import_zod42 = require("zod");
var LdcoTracksSchema = import_zod42.z.strictObject({
  _id: import_zod42.z.string(),
  isrc: import_zod42.z.string().optional(),
  name: import_zod42.z.string(),
  artists: import_zod42.z.array(import_zod42.z.string()),
  uri: import_zod42.z.string(),
  duration_ms: import_zod42.z.number(),
  explicit: import_zod42.z.boolean(),
  preview_url: import_zod42.z.string().nullable().optional(),
  is_playable: import_zod42.z.boolean().optional(),
  url: import_zod42.z.string().optional()
});

// src/contract/collections/ldco/user_favorite_dances.ts
var import_zod43 = require("zod");
var LdcoUserFavoriteDancesSchema = import_zod43.z.strictObject({
  _id: import_zod43.z.string(),
  userId: import_zod43.z.string(),
  danceId: import_zod43.z.string(),
  createdAt: bsonDate
});

// src/contract/collections/ldco/user_flagged_dances.ts
var import_zod44 = require("zod");
var LdcoUserFlaggedDancesSchema = import_zod44.z.strictObject({
  _id: import_zod44.z.string(),
  userId: import_zod44.z.string(),
  danceId: import_zod44.z.string(),
  createdAt: bsonDate
});

// src/contract/collections/ldco/user_follow_collections.ts
var import_zod45 = require("zod");
var LdcoUserFollowCollectionsSchema = import_zod45.z.strictObject({
  _id: import_zod45.z.string(),
  userId: import_zod45.z.string(),
  collectionId: import_zod45.z.string(),
  followedAt: bsonDate
});

// src/contract/collections/ldco/user_follows.ts
var import_zod46 = require("zod");
var LdcoUserFollowsSchema = import_zod46.z.strictObject({
  _id: import_zod46.z.string(),
  userId: import_zod46.z.string(),
  followingId: import_zod46.z.string(),
  createdAt: bsonDate
});

// src/contract/collections/ldco/user_friends.ts
var import_zod47 = require("zod");
var LdcoUserFriendsSchema = import_zod47.z.strictObject({
  _id: import_zod47.z.string(),
  userA: import_zod47.z.string(),
  userB: import_zod47.z.string(),
  timestamp: bsonDate
});

// src/contract/collections/ldco/user_known_dances.ts
var import_zod48 = require("zod");
var LdcoUserKnownDancesSchema = import_zod48.z.strictObject({
  _id: import_zod48.z.string(),
  userId: import_zod48.z.string(),
  danceId: import_zod48.z.string(),
  createdAt: bsonDate
});

// src/contract/collections/ldco/user_lessons.ts
var import_zod49 = require("zod");
var LdcoUserLessonsSchema = import_zod49.z.strictObject({
  _id: import_zod49.z.string(),
  userId: import_zod49.z.string(),
  lessonId: import_zod49.z.string()
});

// src/contract/collections/ldco/user_refresh_dances.ts
var import_zod50 = require("zod");
var LdcoUserRefreshDancesSchema = import_zod50.z.strictObject({
  _id: import_zod50.z.string(),
  userId: import_zod50.z.string(),
  danceId: import_zod50.z.string(),
  createdAt: bsonDate
});

// src/contract/collections/ldco/user_venues.ts
var import_zod51 = require("zod");
var LdcoUserVenuesSchema = import_zod51.z.strictObject({
  _id: import_zod51.z.string(),
  userId: import_zod51.z.string(),
  venueId: import_zod51.z.string()
});

// src/contract/collections/ldco/users.ts
var import_zod52 = require("zod");
var LdcoUsersSchema = import_zod52.z.strictObject({
  _id: import_zod52.z.string(),
  name: import_zod52.z.string(),
  email: import_zod52.z.string(),
  image: import_zod52.z.string().optional(),
  emailVerified: import_zod52.z.null().optional(),
  bio: import_zod52.z.string().optional(),
  favorites: import_zod52.z.array(import_zod52.z.string()).optional(),
  flagged: import_zod52.z.array(import_zod52.z.string()).optional(),
  known: import_zod52.z.array(import_zod52.z.string()).optional(),
  refresh: import_zod52.z.array(import_zod52.z.string()).optional(),
  collections: import_zod52.z.array(import_zod52.z.strictObject({
    name: import_zod52.z.string(),
    danceIds: import_zod52.z.array(import_zod52.z.string())
  })).optional(),
  password: import_zod52.z.string().optional(),
  createdAt: bsonDate.optional(),
  googleId: import_zod52.z.string().optional()
});

// src/contract/collections/ldco/venue_checkins.ts
var import_zod53 = require("zod");
var LdcoVenueCheckinsSchema = import_zod53.z.strictObject({
  _id: import_zod53.z.string(),
  userId: import_zod53.z.string(),
  venueId: import_zod53.z.string(),
  dateKey: import_zod53.z.string(),
  status: import_zod53.z.string()
});

// src/contract/collections/ldco/venue_users.ts
var import_zod54 = require("zod");
var LdcoVenueUsersSchema = import_zod54.z.strictObject({
  _id: import_zod54.z.string(),
  userId: import_zod54.z.string(),
  venueId: import_zod54.z.string(),
  requestedBy: import_zod54.z.string()
});

// src/contract/collections/ldco/venues.ts
var import_zod55 = require("zod");
var LdcoVenuesSchema = import_zod55.z.strictObject({
  _id: import_zod55.z.string(),
  venuename: import_zod55.z.string(),
  venueaddress: import_zod55.z.string(),
  geolocation: import_zod55.z.array(import_zod55.z.number()),
  phone: import_zod55.z.string(),
  website: import_zod55.z.string(),
  timeZone: import_zod55.z.string(),
  verifiedAt: import_zod55.z.null(),
  verifiedBy: import_zod55.z.null(),
  city: import_zod55.z.string().optional(),
  state: import_zod55.z.string().optional()
});

// src/contract/collections/ldco-events/event_registrations.ts
var import_zod56 = require("zod");
var LdcoEventsEventRegistrationsSchema = import_zod56.z.strictObject({
  _id: objectId,
  address: import_zod56.z.string().nullable(),
  agreedToWaiver: import_zod56.z.boolean(),
  attendeeStatus: import_zod56.z.string().optional(),
  createdAt: bsonDate,
  email: import_zod56.z.string(),
  emails: import_zod56.z.array(import_zod56.z.strictObject({
    templateId: import_zod56.z.string(),
    subject: import_zod56.z.string(),
    sentAt: import_zod56.z.string()
  })).optional(),
  event: import_zod56.z.string(),
  name: import_zod56.z.string(),
  paidAt: bsonDate.nullable().optional(),
  paymentMethod: import_zod56.z.string(),
  paymentStatus: import_zod56.z.string(),
  phone: import_zod56.z.string().nullable(),
  requestToken: import_zod56.z.string(),
  waiverSignature: import_zod56.z.string(),
  waiverSignedAt: import_zod56.z.string(),
  requests: import_zod56.z.array(import_zod56.z.strictObject({
    text: import_zod56.z.string(),
    danceId: import_zod56.z.string().nullable()
  })).optional(),
  updatedAt: bsonDate.optional(),
  catering: import_zod56.z.boolean().optional(),
  stripeSessionId: import_zod56.z.null().optional()
});

// src/contract/collections/ldco-events/events.ts
var import_zod57 = require("zod");
var LdcoEventsEventsSchema = import_zod57.z.strictObject({
  _id: objectId,
  slug: import_zod57.z.string(),
  active: import_zod57.z.boolean(),
  createdAt: bsonDate,
  date: import_zod57.z.string(),
  dateShort: import_zod57.z.string(),
  shortTitle: import_zod57.z.string(),
  time: import_zod57.z.string(),
  title: import_zod57.z.string(),
  venueAddress: import_zod57.z.string(),
  venueName: import_zod57.z.string()
});

// src/contract/collections/ldco-lessons/event_instructor_requests.ts
var import_zod58 = require("zod");
var LdcoLessonsEventInstructorRequestsSchema = import_zod58.z.looseObject({ _id: import_zod58.z.union([import_zod58.z.string(), objectId]) });

// src/contract/collections/ldco-lessons/event_instructors.ts
var import_zod59 = require("zod");
var LdcoLessonsEventInstructorsSchema = import_zod59.z.strictObject({
  _id: import_zod59.z.string(),
  instructorId: import_zod59.z.string(),
  eventTypeId: import_zod59.z.string(),
  createdAt: bsonDate,
  role: import_zod59.z.string()
});

// src/contract/collections/ldco-lessons/event_templates.ts
var import_zod60 = require("zod");
var LdcoLessonsEventTemplatesSchema = import_zod60.z.strictObject({
  _id: import_zod60.z.string(),
  createdAt: bsonDate,
  eventTypeId: import_zod60.z.string(),
  isDefault: import_zod60.z.boolean(),
  lessons: import_zod60.z.array(import_zod60.z.strictObject({
    time: import_zod60.z.string(),
    dance: import_zod60.z.string().nullable(),
    level: import_zod60.z.string().nullable(),
    link: import_zod60.z.null()
  })),
  name: import_zod60.z.string(),
  updatedAt: bsonDate
});

// src/contract/collections/ldco-lessons/event_types.ts
var import_zod61 = require("zod");
var LdcoLessonsEventTypesSchema = import_zod61.z.strictObject({
  _id: import_zod61.z.string(),
  createdAt: bsonDate,
  createdBy: import_zod61.z.string(),
  defaultDurationMinutes: import_zod61.z.number(),
  defaultStartTime: import_zod61.z.string().nullable(),
  isActive: import_zod61.z.boolean(),
  level: import_zod61.z.string(),
  price: import_zod61.z.string(),
  title: import_zod61.z.string(),
  updatedAt: bsonDate,
  venueId: import_zod61.z.string(),
  verifiedAt: import_zod61.z.null(),
  verifiedBy: import_zod61.z.null()
});

// src/contract/collections/ldco-lessons/events.ts
var import_zod62 = require("zod");
var LdcoLessonsEventsSchema = import_zod62.z.strictObject({
  _id: import_zod62.z.string(),
  cancelNote: import_zod62.z.string().nullable(),
  createdAt: bsonDate,
  date: import_zod62.z.string(),
  endAt: bsonDate,
  eventTypeId: import_zod62.z.string(),
  isCancelled: import_zod62.z.boolean(),
  lessons: import_zod62.z.array(import_zod62.z.strictObject({
    _id: import_zod62.z.string(),
    startAt: bsonDate,
    dance: import_zod62.z.string().nullable(),
    danceId: import_zod62.z.string().nullable(),
    level: import_zod62.z.string().nullable(),
    link: import_zod62.z.string().nullable(),
    committed: import_zod62.z.boolean(),
    skipped: import_zod62.z.boolean()
  })),
  specialNote: import_zod62.z.string().nullable(),
  startAt: bsonDate,
  substitute: import_zod62.z.string().nullable(),
  substituteInstructorId: import_zod62.z.null(),
  timeZone: import_zod62.z.string(),
  updatedAt: bsonDate,
  verifiedAt: import_zod62.z.null(),
  verifiedBy: import_zod62.z.null()
});

// src/contract/collections/ldco-lessons/frequencies.ts
var import_zod63 = require("zod");
var LdcoLessonsFrequenciesSchema = import_zod63.z.strictObject({
  _id: import_zod63.z.string(),
  byDay: import_zod63.z.array(import_zod63.z.string()).optional(),
  createdAt: bsonDate,
  durationMinutes: import_zod63.z.number(),
  eventTypeId: import_zod63.z.string(),
  isActive: import_zod63.z.boolean().optional(),
  kind: import_zod63.z.string(),
  startDate: import_zod63.z.string().optional(),
  startTime: import_zod63.z.string(),
  updatedAt: bsonDate,
  endDate: import_zod63.z.string().optional(),
  nth: import_zod63.z.number().optional(),
  weekday: import_zod63.z.string().optional()
});

// src/contract/collections/ldco-lessons/lessons.ts
var import_zod64 = require("zod");
var LdcoLessonsLessonsSchema = import_zod64.z.strictObject({
  _id: import_zod64.z.string(),
  danceId: import_zod64.z.string().optional(),
  date: bsonDate,
  eventId: import_zod64.z.string().nullable(),
  instructorId: import_zod64.z.string(),
  lessonId: import_zod64.z.null(),
  venue: import_zod64.z.string(),
  venueId: import_zod64.z.string(),
  danceName: import_zod64.z.string().optional()
});

// src/contract/collections/ldco-reviews/choreographers.ts
var import_zod65 = require("zod");
var LdcoReviewsChoreographersSchema = import_zod65.z.looseObject({ _id: import_zod65.z.union([import_zod65.z.string(), objectId]) });

// src/contract/collections/ldco-reviews/dances.ts
var import_zod66 = require("zod");
var LdcoReviewsDancesSchema = import_zod66.z.looseObject({ _id: import_zod66.z.union([import_zod66.z.string(), objectId]) });

// src/contract/collections/ldco-reviews/join_choreographer_appeals.ts
var import_zod67 = require("zod");
var LdcoReviewsJoinChoreographerAppealsSchema = import_zod67.z.looseObject({ _id: import_zod67.z.union([import_zod67.z.string(), objectId]) });

// src/contract/collections/ldco-reviews/lessons.ts
var import_zod68 = require("zod");
var LdcoReviewsLessonsSchema = import_zod68.z.strictObject({
  _id: objectId,
  lessonday: import_zod68.z.string(),
  lessonstart: import_zod68.z.string(),
  instructors: import_zod68.z.array(import_zod68.z.string()),
  duration: import_zod68.z.string(),
  lessoncost: import_zod68.z.string(),
  notes: import_zod68.z.string(),
  difficulty: import_zod68.z.string(),
  venueid: import_zod68.z.string()
});

// src/contract/collections/ldco-reviews/reports.ts
var import_zod69 = require("zod");
var LdcoReviewsReportsSchema = import_zod69.z.looseObject({ _id: import_zod69.z.union([import_zod69.z.string(), objectId]) });

// src/contract/collections/ldco-reviews/tracks.ts
var import_zod70 = require("zod");
var LdcoReviewsTracksSchema = import_zod70.z.looseObject({ _id: import_zod70.z.union([import_zod70.z.string(), objectId]) });

// src/contract/collections/ldco-reviews/venue_users.ts
var import_zod71 = require("zod");
var LdcoReviewsVenueUsersSchema = import_zod71.z.strictObject({
  _id: import_zod71.z.string(),
  userId: import_zod71.z.string(),
  venueId: import_zod71.z.string(),
  createdAt: bsonDate,
  requestedBy: import_zod71.z.string()
});

// src/contract/collections/ldco-reviews/venues.ts
var import_zod72 = require("zod");
var LdcoReviewsVenuesSchema = import_zod72.z.strictObject({
  _id: import_zod72.z.string(),
  venuename: import_zod72.z.string(),
  venueaddress: import_zod72.z.string(),
  geolocation: import_zod72.z.array(import_zod72.z.number()),
  phone: import_zod72.z.string(),
  website: import_zod72.z.string(),
  contactName: import_zod72.z.string(),
  contactEmail: import_zod72.z.string(),
  contactPhone: import_zod72.z.string(),
  createdAt: bsonDate,
  timeZone: import_zod72.z.string(),
  verifiedAt: import_zod72.z.null(),
  verifiedBy: import_zod72.z.null()
});

// src/contract/collections/ldco-reviews/verify_user_instructor.ts
var import_zod73 = require("zod");
var LdcoReviewsVerifyUserInstructorSchema = import_zod73.z.strictObject({
  _id: objectId,
  userId: import_zod73.z.string(),
  instructorId: import_zod73.z.string(),
  createdAt: bsonDate,
  resolved: import_zod73.z.boolean(),
  resolution: import_zod73.z.string(),
  resolvedAt: bsonDate,
  resolvedBy: import_zod73.z.string()
});

// src/contract/collections/music_catalog/tracks.ts
var import_zod74 = require("zod");
var MusicCatalogTracksSchema = import_zod74.z.strictObject({
  _id: import_zod74.z.string(),
  artist: import_zod74.z.string(),
  createdAt: bsonDate,
  disambiguation: import_zod74.z.string(),
  durationMs: import_zod74.z.number().nullable(),
  isrcs: import_zod74.z.array(import_zod74.z.string()),
  nArtist: import_zod74.z.string(),
  nTitle: import_zod74.z.string(),
  rank: import_zod74.z.number(),
  rankedAt: bsonDate.optional(),
  source: import_zod74.z.string(),
  sourceId: import_zod74.z.string(),
  title: import_zod74.z.string(),
  updatedAt: bsonDate,
  variantKey: import_zod74.z.string(),
  words: import_zod74.z.array(import_zod74.z.string()),
  year: import_zod74.z.number().nullable()
});

// src/contract/index.ts
var CONTRACT_VERSION = version;
var CONTRACT_HASH = hash;

// src/cli/check.ts
var DEFAULT_URL = "https://ldco-database-contract.vercel.app";
var baseUrl = (process.env.LDCO_DATABASE_URL || DEFAULT_URL).replace(/\/+$/, "");
function fail(message) {
  console.error(`
[ldco-db-check] ${message}
`);
  process.exit(1);
}
async function main() {
  if (process.env.LDCO_DATABASE_SKIP_CHECK === "1") {
    console.warn("[ldco-db-check] Skipped (LDCO_DATABASE_SKIP_CHECK=1).");
    return;
  }
  let latest;
  try {
    const res = await fetch(`${baseUrl}/api/contract/version`, { signal: AbortSignal.timeout(1e4) });
    if (!res.ok) fail(`Contract API responded ${res.status} ${res.statusText}.`);
    latest = await res.json();
  } catch (err) {
    fail(`Could not reach the contract API at ${baseUrl}: ${err.message}`);
  }
  if (latest.version !== CONTRACT_VERSION || latest.hash !== CONTRACT_HASH) {
    fail(
      `Database contract is out of date.
  installed: ${CONTRACT_VERSION}
  latest:    ${latest.version}
Update with: npm install github:stephenwike/ldco-database-contract (installs main, the latest contract)`
    );
  }
  console.log(`[ldco-db-check] Contract ${CONTRACT_VERSION} is current.`);
}
main();
