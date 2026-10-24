"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/contract/index.ts
var contract_exports = {};
__export(contract_exports, {
  BldEventTemplatesSchema: () => BldEventTemplatesSchema,
  BldEventTypesSchema: () => BldEventTypesSchema,
  BldEventsSchema: () => BldEventsSchema,
  BldFrequenciesSchema: () => BldFrequenciesSchema,
  BldLessonsSchema: () => BldLessonsSchema,
  CONTRACT_HASH: () => CONTRACT_HASH,
  CONTRACT_VERSION: () => CONTRACT_VERSION,
  CopperknobAlertProcessedItemsSchema: () => CopperknobAlertProcessedItemsSchema,
  CopperknobAlertSyncMetadataSchema: () => CopperknobAlertSyncMetadataSchema,
  CopperknobAlertWatchRulesSchema: () => CopperknobAlertWatchRulesSchema,
  DjfeedAttendeeNotificationsSchema: () => DjfeedAttendeeNotificationsSchema,
  DjfeedBeatBalancesSchema: () => DjfeedBeatBalancesSchema,
  DjfeedBeatTransactionsSchema: () => DjfeedBeatTransactionsSchema,
  DjfeedDancerFavoriteSongsSchema: () => DjfeedDancerFavoriteSongsSchema,
  DjfeedDjDirectMessagesSchema: () => DjfeedDjDirectMessagesSchema,
  DjfeedDjMessagesSchema: () => DjfeedDjMessagesSchema,
  DjfeedDjNotificationsSchema: () => DjfeedDjNotificationsSchema,
  DjfeedDjProfilesSchema: () => DjfeedDjProfilesSchema,
  DjfeedDjRequesterNicknamesSchema: () => DjfeedDjRequesterNicknamesSchema,
  DjfeedDjRequestsSchema: () => DjfeedDjRequestsSchema,
  DjfeedDjSessionsSchema: () => DjfeedDjSessionsSchema,
  DjfeedDjWalletLocksSchema: () => DjfeedDjWalletLocksSchema,
  DjfeedDjWalletTransactionsSchema: () => DjfeedDjWalletTransactionsSchema,
  DjfeedFeedLessonsSchema: () => DjfeedFeedLessonsSchema,
  DjfeedFreeAccessSchema: () => DjfeedFreeAccessSchema,
  DjfeedHostDancersSchema: () => DjfeedHostDancersSchema,
  DjfeedRequesterHistorySchema: () => DjfeedRequesterHistorySchema,
  DjfeedSessionAttendanceSchema: () => DjfeedSessionAttendanceSchema,
  DjfeedSessionReportsSchema: () => DjfeedSessionReportsSchema,
  DjfeedSessionTransactionsSchema: () => DjfeedSessionTransactionsSchema,
  DjfeedStripeEventsSchema: () => DjfeedStripeEventsSchema,
  LdcoChoreographersSchema: () => LdcoChoreographersSchema,
  LdcoDanceCollectionsSchema: () => LdcoDanceCollectionsSchema,
  LdcoDanceTracksSchema: () => LdcoDanceTracksSchema,
  LdcoDancesSchema: () => LdcoDancesSchema,
  LdcoEventsEventRegistrationsSchema: () => LdcoEventsEventRegistrationsSchema,
  LdcoEventsEventsSchema: () => LdcoEventsEventsSchema,
  LdcoEventsSchema: () => LdcoEventsSchema,
  LdcoFriendRequestsSchema: () => LdcoFriendRequestsSchema,
  LdcoInstructorVenuesSchema: () => LdcoInstructorVenuesSchema,
  LdcoInstructorsSchema: () => LdcoInstructorsSchema,
  LdcoLessonsEventInstructorRequestsSchema: () => LdcoLessonsEventInstructorRequestsSchema,
  LdcoLessonsEventInstructorsSchema: () => LdcoLessonsEventInstructorsSchema,
  LdcoLessonsEventTemplatesSchema: () => LdcoLessonsEventTemplatesSchema,
  LdcoLessonsEventTypesSchema: () => LdcoLessonsEventTypesSchema,
  LdcoLessonsEventsSchema: () => LdcoLessonsEventsSchema,
  LdcoLessonsFrequenciesSchema: () => LdcoLessonsFrequenciesSchema,
  LdcoLessonsLessonsSchema: () => LdcoLessonsLessonsSchema,
  LdcoLessonsSchema: () => LdcoLessonsSchema,
  LdcoLoginEventsSchema: () => LdcoLoginEventsSchema,
  LdcoOauthAuthCodesSchema: () => LdcoOauthAuthCodesSchema,
  LdcoPendingDancesSchema: () => LdcoPendingDancesSchema,
  LdcoReviewsChoreographersSchema: () => LdcoReviewsChoreographersSchema,
  LdcoReviewsDancesSchema: () => LdcoReviewsDancesSchema,
  LdcoReviewsJoinChoreographerAppealsSchema: () => LdcoReviewsJoinChoreographerAppealsSchema,
  LdcoReviewsLessonsSchema: () => LdcoReviewsLessonsSchema,
  LdcoReviewsReportsSchema: () => LdcoReviewsReportsSchema,
  LdcoReviewsTracksSchema: () => LdcoReviewsTracksSchema,
  LdcoReviewsVenueUsersSchema: () => LdcoReviewsVenueUsersSchema,
  LdcoReviewsVenuesSchema: () => LdcoReviewsVenuesSchema,
  LdcoReviewsVerifyUserInstructorSchema: () => LdcoReviewsVerifyUserInstructorSchema,
  LdcoTracksSchema: () => LdcoTracksSchema,
  LdcoUserFavoriteDancesSchema: () => LdcoUserFavoriteDancesSchema,
  LdcoUserFlaggedDancesSchema: () => LdcoUserFlaggedDancesSchema,
  LdcoUserFollowCollectionsSchema: () => LdcoUserFollowCollectionsSchema,
  LdcoUserFollowsSchema: () => LdcoUserFollowsSchema,
  LdcoUserFriendsSchema: () => LdcoUserFriendsSchema,
  LdcoUserKnownDancesSchema: () => LdcoUserKnownDancesSchema,
  LdcoUserLessonsSchema: () => LdcoUserLessonsSchema,
  LdcoUserRefreshDancesSchema: () => LdcoUserRefreshDancesSchema,
  LdcoUserVenuesSchema: () => LdcoUserVenuesSchema,
  LdcoUsersSchema: () => LdcoUsersSchema,
  LdcoVenueCheckinsSchema: () => LdcoVenueCheckinsSchema,
  LdcoVenueUsersSchema: () => LdcoVenueUsersSchema,
  LdcoVenuesSchema: () => LdcoVenuesSchema,
  MusicCatalogTracksSchema: () => MusicCatalogTracksSchema,
  collections: () => collections,
  computeContractHash: () => computeContractHash
});
module.exports = __toCommonJS(contract_exports);
var import_node_crypto = require("crypto");
var import_zod76 = require("zod");

// contract.lock.json
var hash = "4d2f3e3eee1d5272b2ae94e40993fedd408a8284a80c8dafd5ffd7bbaeac2edb";

// package.json
var version = "0.14.0";

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

// src/contract/collections/djfeed/feed_lessons.ts
var import_zod23 = require("zod");
var DjfeedFeedLessonsSchema = import_zod23.z.strictObject({
  _id: import_zod23.z.string(),
  sessionId: import_zod23.z.string(),
  hostId: import_zod23.z.string(),
  danceId: import_zod23.z.string(),
  startedAt: bsonDate
});

// src/contract/collections/djfeed/free_access.ts
var import_zod24 = require("zod");
var DjfeedFreeAccessSchema = import_zod24.z.strictObject({
  _id: objectId,
  email: import_zod24.z.string(),
  expiresAt: bsonDate.nullable(),
  note: import_zod24.z.string().nullable(),
  createdAt: bsonDate
});

// src/contract/collections/djfeed/host_dancers.ts
var import_zod25 = require("zod");
var DjfeedHostDancersSchema = import_zod25.z.strictObject({
  _id: import_zod25.z.string(),
  hostId: import_zod25.z.string(),
  userId: import_zod25.z.string(),
  firstSeenAt: bsonDate,
  lastSeenAt: bsonDate,
  sessionCount: import_zod25.z.number(),
  lastSessionId: import_zod25.z.string()
});

// src/contract/collections/djfeed/requester_history.ts
var import_zod26 = require("zod");
var DjfeedRequesterHistorySchema = import_zod26.z.strictObject({
  _id: objectId,
  clientId: import_zod26.z.string(),
  sessionId: import_zod26.z.string(),
  ownerId: import_zod26.z.string(),
  requesterName: import_zod26.z.string(),
  requests: import_zod26.z.array(import_zod26.z.strictObject({
    danceName: import_zod26.z.string(),
    danceId: import_zod26.z.string().nullable(),
    status: import_zod26.z.string(),
    tipCents: import_zod26.z.number(),
    createdAt: bsonDate
  })),
  sessionDate: bsonDate,
  sessionName: import_zod26.z.string()
});

// src/contract/collections/djfeed/session_attendance.ts
var import_zod27 = require("zod");
var DjfeedSessionAttendanceSchema = import_zod27.z.strictObject({
  _id: import_zod27.z.string(),
  sessionId: import_zod27.z.string(),
  userId: import_zod27.z.string(),
  firstSeenAt: bsonDate,
  hostId: import_zod27.z.string(),
  lastSeenAt: bsonDate
});

// src/contract/collections/djfeed/session_reports.ts
var import_zod28 = require("zod");
var DjfeedSessionReportsSchema = import_zod28.z.strictObject({
  _id: objectId,
  sessionId: import_zod28.z.string(),
  actualDurationMs: import_zod28.z.number(),
  autoClosedAt: bsonDate.nullable(),
  closedAt: bsonDate,
  endsAt: bsonDate,
  extensions: import_zod28.z.array(import_zod28.z.unknown()),
  generatedAt: bsonDate,
  ownerId: import_zod28.z.string(),
  playedTracks: import_zod28.z.array(import_zod28.z.strictObject({
    danceName: import_zod28.z.string(),
    danceId: import_zod28.z.string().nullable(),
    songName: import_zod28.z.string(),
    artist: import_zod28.z.string(),
    difficulty: import_zod28.z.string(),
    stepsheet: import_zod28.z.string().optional(),
    danceType: import_zod28.z.string().nullable(),
    partnerStyle: import_zod28.z.string().nullable(),
    isSongSwap: import_zod28.z.boolean().optional(),
    swapSongName: import_zod28.z.string().nullable().optional(),
    swapArtist: import_zod28.z.string().nullable().optional(),
    playedAt: bsonDate,
    requesters: import_zod28.z.array(import_zod28.z.strictObject({
      clientId: import_zod28.z.string(),
      requesterName: import_zod28.z.string(),
      tipCents: import_zod28.z.number()
    })),
    totalTips: import_zod28.z.number(),
    requesterCount: import_zod28.z.number(),
    catalogTrackId: import_zod28.z.string().nullable().optional()
  })),
  sessionName: import_zod28.z.string(),
  startedAt: bsonDate,
  stats: import_zod28.z.strictObject({
    totalDancesPlayed: import_zod28.z.number(),
    totalRequests: import_zod28.z.number(),
    totalApproved: import_zod28.z.number(),
    totalSkipped: import_zod28.z.number(),
    totalPending: import_zod28.z.number(),
    approvalRate: import_zod28.z.number().nullable(),
    totalTipCents: import_zod28.z.number(),
    uniqueRequesters: import_zod28.z.number()
  })
});

// src/contract/collections/djfeed/session_transactions.ts
var import_zod29 = require("zod");
var DjfeedSessionTransactionsSchema = import_zod29.z.strictObject({
  _id: objectId,
  ownerId: import_zod29.z.string(),
  type: import_zod29.z.string(),
  sessionId: import_zod29.z.string(),
  sessionName: import_zod29.z.string(),
  durationMinutes: import_zod29.z.number(),
  amountCents: import_zod29.z.number(),
  stripeSessionId: import_zod29.z.string(),
  stripePaymentIntentId: import_zod29.z.string(),
  createdAt: bsonDate
});

// src/contract/collections/djfeed/stripe_events.ts
var import_zod30 = require("zod");
var DjfeedStripeEventsSchema = import_zod30.z.strictObject({
  _id: import_zod30.z.string(),
  type: import_zod30.z.string(),
  receivedAt: bsonDate
});

// src/contract/collections/ldco/choreographers.ts
var import_zod31 = require("zod");
var LdcoChoreographersSchema = import_zod31.z.strictObject({
  _id: import_zod31.z.string(),
  name: import_zod31.z.string(),
  copperknobUrl: import_zod31.z.string().optional(),
  lastImportedAt: import_zod31.z.string().optional(),
  associatedUserId: import_zod31.z.string().optional()
});

// src/contract/collections/ldco/dance_collections.ts
var import_zod32 = require("zod");
var LdcoDanceCollectionsSchema = import_zod32.z.strictObject({
  _id: import_zod32.z.string(),
  name: import_zod32.z.string(),
  danceIds: import_zod32.z.array(import_zod32.z.string()),
  createdBy: import_zod32.z.string(),
  createdAt: bsonDate.nullable(),
  updatedAt: bsonDate.nullable(),
  isPrivate: import_zod32.z.boolean().optional(),
  archived: import_zod32.z.boolean().optional(),
  archivedAt: bsonDate.nullable().optional(),
  isArchived: import_zod32.z.boolean().optional(),
  isCopyable: import_zod32.z.boolean().optional(),
  pendingDanceIds: import_zod32.z.array(import_zod32.z.string()).optional()
});

// src/contract/collections/ldco/dance_tracks.ts
var import_zod33 = require("zod");
var LdcoDanceTracksSchema = import_zod33.z.strictObject({
  _id: import_zod33.z.string(),
  danceId: import_zod33.z.string(),
  trackId: import_zod33.z.string(),
  isPrimary: import_zod33.z.boolean(),
  createdAt: bsonDate
});

// src/contract/collections/ldco/dances.ts
var import_zod34 = require("zod");
var LdcoDancesSchema = import_zod34.z.strictObject({
  _id: import_zod34.z.string(),
  difficulty: import_zod34.z.string(),
  tracks: import_zod34.z.array(import_zod34.z.string()),
  primaryTrack: import_zod34.z.string(),
  danceName: import_zod34.z.string(),
  choreographers: import_zod34.z.array(import_zod34.z.string()),
  stepsheet: import_zod34.z.string().optional(),
  stepsheetUrls: import_zod34.z.array(import_zod34.z.string()).optional(),
  songArtists: import_zod34.z.array(import_zod34.z.strictObject({
    song: import_zod34.z.string(),
    artist: import_zod34.z.string()
  })).optional()
});

// src/contract/collections/ldco/events.ts
var import_zod35 = require("zod");
var LdcoEventsSchema = import_zod35.z.strictObject({
  _id: import_zod35.z.string(),
  venueId: import_zod35.z.string(),
  title: import_zod35.z.string(),
  description: import_zod35.z.string(),
  eventDay: import_zod35.z.string(),
  startTime: import_zod35.z.string(),
  endTime: import_zod35.z.string(),
  createdAt: bsonDate,
  updatedAt: bsonDate,
  createdBy: import_zod35.z.string()
});

// src/contract/collections/ldco/friend_requests.ts
var import_zod36 = require("zod");
var LdcoFriendRequestsSchema = import_zod36.z.strictObject({
  _id: import_zod36.z.string(),
  requesterId: import_zod36.z.string(),
  requesteeId: import_zod36.z.string(),
  createdAt: bsonDate.optional(),
  timestamp: bsonDate.optional()
});

// src/contract/collections/ldco/instructor_venues.ts
var import_zod37 = require("zod");
var LdcoInstructorVenuesSchema = import_zod37.z.strictObject({
  _id: import_zod37.z.string(),
  instructorId: import_zod37.z.string(),
  venueId: import_zod37.z.string(),
  createdAt: bsonDate.optional(),
  updatedAt: bsonDate.optional()
});

// src/contract/collections/ldco/instructors.ts
var import_zod38 = require("zod");
var LdcoInstructorsSchema = import_zod38.z.strictObject({
  _id: import_zod38.z.string(),
  name: import_zod38.z.string(),
  associatedUserId: import_zod38.z.string().optional(),
  userId: import_zod38.z.string().optional(),
  bio: import_zod38.z.string().optional()
});

// src/contract/collections/ldco/lessons.ts
var import_zod39 = require("zod");
var LdcoLessonsSchema = import_zod39.z.strictObject({
  _id: import_zod39.z.string(),
  lessonday: import_zod39.z.string(),
  lessonstart: import_zod39.z.string(),
  instructors: import_zod39.z.array(import_zod39.z.string()),
  duration: import_zod39.z.string(),
  lessoncost: import_zod39.z.string(),
  notes: import_zod39.z.string(),
  difficulty: import_zod39.z.string(),
  venueid: import_zod39.z.string(),
  verifiedAt: import_zod39.z.null(),
  verifiedBy: import_zod39.z.null()
});

// src/contract/collections/ldco/login_events.ts
var import_zod40 = require("zod");
var LdcoLoginEventsSchema = import_zod40.z.strictObject({
  _id: objectId,
  userId: import_zod40.z.string(),
  email: import_zod40.z.string(),
  provider: import_zod40.z.string(),
  app: import_zod40.z.string(),
  ip: import_zod40.z.string().optional(),
  userAgent: import_zod40.z.string().optional(),
  createdAt: bsonDate,
  clientId: import_zod40.z.string().nullable().optional(),
  debugReturnToCookie: import_zod40.z.null().optional(),
  source: import_zod40.z.string().optional()
});

// src/contract/collections/ldco/oauth_auth_codes.ts
var import_zod41 = require("zod");
var LdcoOauthAuthCodesSchema = import_zod41.z.looseObject({ _id: import_zod41.z.union([import_zod41.z.string(), objectId]) });

// src/contract/collections/ldco/pending_dances.ts
var import_zod42 = require("zod");
var LdcoPendingDancesSchema = import_zod42.z.strictObject({
  _id: import_zod42.z.string(),
  danceName: import_zod42.z.string(),
  songTitle: import_zod42.z.string(),
  artist: import_zod42.z.string(),
  choreographer: import_zod42.z.string(),
  count: import_zod42.z.null(),
  wall: import_zod42.z.null(),
  difficulty: import_zod42.z.string(),
  stepsheetUrl: import_zod42.z.string().nullable(),
  submittedByUserId: import_zod42.z.string(),
  submittedAt: bsonDate,
  status: import_zod42.z.string()
});

// src/contract/collections/ldco/tracks.ts
var import_zod43 = require("zod");
var LdcoTracksSchema = import_zod43.z.strictObject({
  _id: import_zod43.z.string(),
  isrc: import_zod43.z.string().optional(),
  name: import_zod43.z.string(),
  artists: import_zod43.z.array(import_zod43.z.string()),
  uri: import_zod43.z.string(),
  duration_ms: import_zod43.z.number(),
  explicit: import_zod43.z.boolean(),
  preview_url: import_zod43.z.string().nullable().optional(),
  is_playable: import_zod43.z.boolean().optional(),
  url: import_zod43.z.string().optional()
});

// src/contract/collections/ldco/user_favorite_dances.ts
var import_zod44 = require("zod");
var LdcoUserFavoriteDancesSchema = import_zod44.z.strictObject({
  _id: import_zod44.z.string(),
  userId: import_zod44.z.string(),
  danceId: import_zod44.z.string(),
  createdAt: bsonDate
});

// src/contract/collections/ldco/user_flagged_dances.ts
var import_zod45 = require("zod");
var LdcoUserFlaggedDancesSchema = import_zod45.z.strictObject({
  _id: import_zod45.z.string(),
  userId: import_zod45.z.string(),
  danceId: import_zod45.z.string(),
  createdAt: bsonDate
});

// src/contract/collections/ldco/user_follow_collections.ts
var import_zod46 = require("zod");
var LdcoUserFollowCollectionsSchema = import_zod46.z.strictObject({
  _id: import_zod46.z.string(),
  userId: import_zod46.z.string(),
  collectionId: import_zod46.z.string(),
  followedAt: bsonDate
});

// src/contract/collections/ldco/user_follows.ts
var import_zod47 = require("zod");
var LdcoUserFollowsSchema = import_zod47.z.strictObject({
  _id: import_zod47.z.string(),
  userId: import_zod47.z.string(),
  followingId: import_zod47.z.string(),
  createdAt: bsonDate
});

// src/contract/collections/ldco/user_friends.ts
var import_zod48 = require("zod");
var LdcoUserFriendsSchema = import_zod48.z.strictObject({
  _id: import_zod48.z.string(),
  userA: import_zod48.z.string(),
  userB: import_zod48.z.string(),
  timestamp: bsonDate
});

// src/contract/collections/ldco/user_known_dances.ts
var import_zod49 = require("zod");
var LdcoUserKnownDancesSchema = import_zod49.z.strictObject({
  _id: import_zod49.z.string(),
  userId: import_zod49.z.string(),
  danceId: import_zod49.z.string(),
  createdAt: bsonDate
});

// src/contract/collections/ldco/user_lessons.ts
var import_zod50 = require("zod");
var LdcoUserLessonsSchema = import_zod50.z.strictObject({
  _id: import_zod50.z.string(),
  userId: import_zod50.z.string(),
  lessonId: import_zod50.z.string()
});

// src/contract/collections/ldco/user_refresh_dances.ts
var import_zod51 = require("zod");
var LdcoUserRefreshDancesSchema = import_zod51.z.strictObject({
  _id: import_zod51.z.string(),
  userId: import_zod51.z.string(),
  danceId: import_zod51.z.string(),
  createdAt: bsonDate
});

// src/contract/collections/ldco/user_venues.ts
var import_zod52 = require("zod");
var LdcoUserVenuesSchema = import_zod52.z.strictObject({
  _id: import_zod52.z.string(),
  userId: import_zod52.z.string(),
  venueId: import_zod52.z.string()
});

// src/contract/collections/ldco/users.ts
var import_zod53 = require("zod");
var LdcoUsersSchema = import_zod53.z.strictObject({
  _id: import_zod53.z.string(),
  name: import_zod53.z.string(),
  email: import_zod53.z.string(),
  image: import_zod53.z.string().optional(),
  emailVerified: import_zod53.z.null().optional(),
  bio: import_zod53.z.string().optional(),
  favorites: import_zod53.z.array(import_zod53.z.string()).optional(),
  flagged: import_zod53.z.array(import_zod53.z.string()).optional(),
  known: import_zod53.z.array(import_zod53.z.string()).optional(),
  refresh: import_zod53.z.array(import_zod53.z.string()).optional(),
  collections: import_zod53.z.array(import_zod53.z.strictObject({
    name: import_zod53.z.string(),
    danceIds: import_zod53.z.array(import_zod53.z.string())
  })).optional(),
  password: import_zod53.z.string().optional(),
  createdAt: bsonDate.optional(),
  googleId: import_zod53.z.string().optional()
});

// src/contract/collections/ldco/venue_checkins.ts
var import_zod54 = require("zod");
var LdcoVenueCheckinsSchema = import_zod54.z.strictObject({
  _id: import_zod54.z.string(),
  userId: import_zod54.z.string(),
  venueId: import_zod54.z.string(),
  dateKey: import_zod54.z.string(),
  status: import_zod54.z.string()
});

// src/contract/collections/ldco/venue_users.ts
var import_zod55 = require("zod");
var LdcoVenueUsersSchema = import_zod55.z.strictObject({
  _id: import_zod55.z.string(),
  userId: import_zod55.z.string(),
  venueId: import_zod55.z.string(),
  requestedBy: import_zod55.z.string()
});

// src/contract/collections/ldco/venues.ts
var import_zod56 = require("zod");
var LdcoVenuesSchema = import_zod56.z.strictObject({
  _id: import_zod56.z.string(),
  venuename: import_zod56.z.string(),
  venueaddress: import_zod56.z.string(),
  geolocation: import_zod56.z.array(import_zod56.z.number()),
  phone: import_zod56.z.string(),
  website: import_zod56.z.string(),
  timeZone: import_zod56.z.string(),
  verifiedAt: import_zod56.z.null(),
  verifiedBy: import_zod56.z.null(),
  city: import_zod56.z.string().optional(),
  state: import_zod56.z.string().optional()
});

// src/contract/collections/ldco-events/event_registrations.ts
var import_zod57 = require("zod");
var LdcoEventsEventRegistrationsSchema = import_zod57.z.strictObject({
  _id: objectId,
  address: import_zod57.z.string().nullable(),
  agreedToWaiver: import_zod57.z.boolean(),
  attendeeStatus: import_zod57.z.string().optional(),
  createdAt: bsonDate,
  email: import_zod57.z.string(),
  emails: import_zod57.z.array(import_zod57.z.strictObject({
    templateId: import_zod57.z.string(),
    subject: import_zod57.z.string(),
    sentAt: import_zod57.z.string()
  })).optional(),
  event: import_zod57.z.string(),
  name: import_zod57.z.string(),
  paidAt: bsonDate.nullable().optional(),
  paymentMethod: import_zod57.z.string(),
  paymentStatus: import_zod57.z.string(),
  phone: import_zod57.z.string().nullable(),
  requestToken: import_zod57.z.string(),
  waiverSignature: import_zod57.z.string(),
  waiverSignedAt: import_zod57.z.string(),
  requests: import_zod57.z.array(import_zod57.z.strictObject({
    text: import_zod57.z.string(),
    danceId: import_zod57.z.string().nullable()
  })).optional(),
  updatedAt: bsonDate.optional(),
  catering: import_zod57.z.boolean().optional(),
  stripeSessionId: import_zod57.z.null().optional()
});

// src/contract/collections/ldco-events/events.ts
var import_zod58 = require("zod");
var LdcoEventsEventsSchema = import_zod58.z.strictObject({
  _id: objectId,
  slug: import_zod58.z.string(),
  active: import_zod58.z.boolean(),
  createdAt: bsonDate,
  date: import_zod58.z.string(),
  dateShort: import_zod58.z.string(),
  shortTitle: import_zod58.z.string(),
  time: import_zod58.z.string(),
  title: import_zod58.z.string(),
  venueAddress: import_zod58.z.string(),
  venueName: import_zod58.z.string()
});

// src/contract/collections/ldco-lessons/event_instructor_requests.ts
var import_zod59 = require("zod");
var LdcoLessonsEventInstructorRequestsSchema = import_zod59.z.looseObject({ _id: import_zod59.z.union([import_zod59.z.string(), objectId]) });

// src/contract/collections/ldco-lessons/event_instructors.ts
var import_zod60 = require("zod");
var LdcoLessonsEventInstructorsSchema = import_zod60.z.strictObject({
  _id: import_zod60.z.string(),
  instructorId: import_zod60.z.string(),
  eventTypeId: import_zod60.z.string(),
  createdAt: bsonDate,
  role: import_zod60.z.string()
});

// src/contract/collections/ldco-lessons/event_templates.ts
var import_zod61 = require("zod");
var LdcoLessonsEventTemplatesSchema = import_zod61.z.strictObject({
  _id: import_zod61.z.string(),
  createdAt: bsonDate,
  eventTypeId: import_zod61.z.string(),
  isDefault: import_zod61.z.boolean(),
  lessons: import_zod61.z.array(import_zod61.z.strictObject({
    time: import_zod61.z.string(),
    dance: import_zod61.z.string().nullable(),
    level: import_zod61.z.string().nullable(),
    link: import_zod61.z.null()
  })),
  name: import_zod61.z.string(),
  updatedAt: bsonDate
});

// src/contract/collections/ldco-lessons/event_types.ts
var import_zod62 = require("zod");
var LdcoLessonsEventTypesSchema = import_zod62.z.strictObject({
  _id: import_zod62.z.string(),
  createdAt: bsonDate,
  createdBy: import_zod62.z.string(),
  defaultDurationMinutes: import_zod62.z.number(),
  defaultStartTime: import_zod62.z.string().nullable(),
  isActive: import_zod62.z.boolean(),
  level: import_zod62.z.string(),
  price: import_zod62.z.string(),
  title: import_zod62.z.string(),
  updatedAt: bsonDate,
  venueId: import_zod62.z.string(),
  verifiedAt: import_zod62.z.null(),
  verifiedBy: import_zod62.z.null()
});

// src/contract/collections/ldco-lessons/events.ts
var import_zod63 = require("zod");
var LdcoLessonsEventsSchema = import_zod63.z.strictObject({
  _id: import_zod63.z.string(),
  cancelNote: import_zod63.z.string().nullable(),
  createdAt: bsonDate,
  date: import_zod63.z.string(),
  endAt: bsonDate,
  eventTypeId: import_zod63.z.string(),
  isCancelled: import_zod63.z.boolean(),
  lessons: import_zod63.z.array(import_zod63.z.strictObject({
    _id: import_zod63.z.string(),
    startAt: bsonDate,
    dance: import_zod63.z.string().nullable(),
    danceId: import_zod63.z.string().nullable(),
    level: import_zod63.z.string().nullable(),
    link: import_zod63.z.string().nullable(),
    committed: import_zod63.z.boolean(),
    skipped: import_zod63.z.boolean()
  })),
  specialNote: import_zod63.z.string().nullable(),
  startAt: bsonDate,
  substitute: import_zod63.z.string().nullable(),
  substituteInstructorId: import_zod63.z.null(),
  timeZone: import_zod63.z.string(),
  updatedAt: bsonDate,
  verifiedAt: import_zod63.z.null(),
  verifiedBy: import_zod63.z.null()
});

// src/contract/collections/ldco-lessons/frequencies.ts
var import_zod64 = require("zod");
var LdcoLessonsFrequenciesSchema = import_zod64.z.strictObject({
  _id: import_zod64.z.string(),
  byDay: import_zod64.z.array(import_zod64.z.string()).optional(),
  createdAt: bsonDate,
  durationMinutes: import_zod64.z.number(),
  eventTypeId: import_zod64.z.string(),
  isActive: import_zod64.z.boolean().optional(),
  kind: import_zod64.z.string(),
  startDate: import_zod64.z.string().optional(),
  startTime: import_zod64.z.string(),
  updatedAt: bsonDate,
  endDate: import_zod64.z.string().optional(),
  nth: import_zod64.z.number().optional(),
  weekday: import_zod64.z.string().optional()
});

// src/contract/collections/ldco-lessons/lessons.ts
var import_zod65 = require("zod");
var LdcoLessonsLessonsSchema = import_zod65.z.strictObject({
  _id: import_zod65.z.string(),
  danceId: import_zod65.z.string().optional(),
  date: bsonDate,
  eventId: import_zod65.z.string().nullable(),
  instructorId: import_zod65.z.string(),
  lessonId: import_zod65.z.null(),
  venue: import_zod65.z.string(),
  venueId: import_zod65.z.string(),
  danceName: import_zod65.z.string().optional()
});

// src/contract/collections/ldco-reviews/choreographers.ts
var import_zod66 = require("zod");
var LdcoReviewsChoreographersSchema = import_zod66.z.looseObject({ _id: import_zod66.z.union([import_zod66.z.string(), objectId]) });

// src/contract/collections/ldco-reviews/dances.ts
var import_zod67 = require("zod");
var LdcoReviewsDancesSchema = import_zod67.z.looseObject({ _id: import_zod67.z.union([import_zod67.z.string(), objectId]) });

// src/contract/collections/ldco-reviews/join_choreographer_appeals.ts
var import_zod68 = require("zod");
var LdcoReviewsJoinChoreographerAppealsSchema = import_zod68.z.looseObject({ _id: import_zod68.z.union([import_zod68.z.string(), objectId]) });

// src/contract/collections/ldco-reviews/lessons.ts
var import_zod69 = require("zod");
var LdcoReviewsLessonsSchema = import_zod69.z.strictObject({
  _id: objectId,
  lessonday: import_zod69.z.string(),
  lessonstart: import_zod69.z.string(),
  instructors: import_zod69.z.array(import_zod69.z.string()),
  duration: import_zod69.z.string(),
  lessoncost: import_zod69.z.string(),
  notes: import_zod69.z.string(),
  difficulty: import_zod69.z.string(),
  venueid: import_zod69.z.string()
});

// src/contract/collections/ldco-reviews/reports.ts
var import_zod70 = require("zod");
var LdcoReviewsReportsSchema = import_zod70.z.looseObject({ _id: import_zod70.z.union([import_zod70.z.string(), objectId]) });

// src/contract/collections/ldco-reviews/tracks.ts
var import_zod71 = require("zod");
var LdcoReviewsTracksSchema = import_zod71.z.looseObject({ _id: import_zod71.z.union([import_zod71.z.string(), objectId]) });

// src/contract/collections/ldco-reviews/venue_users.ts
var import_zod72 = require("zod");
var LdcoReviewsVenueUsersSchema = import_zod72.z.strictObject({
  _id: import_zod72.z.string(),
  userId: import_zod72.z.string(),
  venueId: import_zod72.z.string(),
  createdAt: bsonDate,
  requestedBy: import_zod72.z.string()
});

// src/contract/collections/ldco-reviews/venues.ts
var import_zod73 = require("zod");
var LdcoReviewsVenuesSchema = import_zod73.z.strictObject({
  _id: import_zod73.z.string(),
  venuename: import_zod73.z.string(),
  venueaddress: import_zod73.z.string(),
  geolocation: import_zod73.z.array(import_zod73.z.number()),
  phone: import_zod73.z.string(),
  website: import_zod73.z.string(),
  contactName: import_zod73.z.string(),
  contactEmail: import_zod73.z.string(),
  contactPhone: import_zod73.z.string(),
  createdAt: bsonDate,
  timeZone: import_zod73.z.string(),
  verifiedAt: import_zod73.z.null(),
  verifiedBy: import_zod73.z.null()
});

// src/contract/collections/ldco-reviews/verify_user_instructor.ts
var import_zod74 = require("zod");
var LdcoReviewsVerifyUserInstructorSchema = import_zod74.z.strictObject({
  _id: objectId,
  userId: import_zod74.z.string(),
  instructorId: import_zod74.z.string(),
  createdAt: bsonDate,
  resolved: import_zod74.z.boolean(),
  resolution: import_zod74.z.string(),
  resolvedAt: bsonDate,
  resolvedBy: import_zod74.z.string()
});

// src/contract/collections/music_catalog/tracks.ts
var import_zod75 = require("zod");
var MusicCatalogTracksSchema = import_zod75.z.strictObject({
  _id: import_zod75.z.string(),
  artist: import_zod75.z.string(),
  createdAt: bsonDate,
  disambiguation: import_zod75.z.string(),
  durationMs: import_zod75.z.number().nullable(),
  isrcs: import_zod75.z.array(import_zod75.z.string()),
  nArtist: import_zod75.z.string(),
  nTitle: import_zod75.z.string(),
  rank: import_zod75.z.number(),
  rankedAt: bsonDate.optional(),
  source: import_zod75.z.string(),
  sourceId: import_zod75.z.string(),
  title: import_zod75.z.string(),
  updatedAt: bsonDate,
  variantKey: import_zod75.z.string(),
  words: import_zod75.z.array(import_zod75.z.string()),
  year: import_zod75.z.number().nullable()
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
  const description = Object.entries(collections).sort(([a], [b]) => a.localeCompare(b)).map(([key, c]) => [key, c.database, c.name, import_zod76.z.toJSONSchema(c.schema, { unrepresentable: "any" })]);
  return (0, import_node_crypto.createHash)("sha256").update(JSON.stringify(description)).digest("hex");
}
var CONTRACT_HASH = hash;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BldEventTemplatesSchema,
  BldEventTypesSchema,
  BldEventsSchema,
  BldFrequenciesSchema,
  BldLessonsSchema,
  CONTRACT_HASH,
  CONTRACT_VERSION,
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
  LdcoEventsEventRegistrationsSchema,
  LdcoEventsEventsSchema,
  LdcoEventsSchema,
  LdcoFriendRequestsSchema,
  LdcoInstructorVenuesSchema,
  LdcoInstructorsSchema,
  LdcoLessonsEventInstructorRequestsSchema,
  LdcoLessonsEventInstructorsSchema,
  LdcoLessonsEventTemplatesSchema,
  LdcoLessonsEventTypesSchema,
  LdcoLessonsEventsSchema,
  LdcoLessonsFrequenciesSchema,
  LdcoLessonsLessonsSchema,
  LdcoLessonsSchema,
  LdcoLoginEventsSchema,
  LdcoOauthAuthCodesSchema,
  LdcoPendingDancesSchema,
  LdcoReviewsChoreographersSchema,
  LdcoReviewsDancesSchema,
  LdcoReviewsJoinChoreographerAppealsSchema,
  LdcoReviewsLessonsSchema,
  LdcoReviewsReportsSchema,
  LdcoReviewsTracksSchema,
  LdcoReviewsVenueUsersSchema,
  LdcoReviewsVenuesSchema,
  LdcoReviewsVerifyUserInstructorSchema,
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
  MusicCatalogTracksSchema,
  collections,
  computeContractHash
});
