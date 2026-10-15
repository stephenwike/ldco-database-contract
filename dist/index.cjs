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
  DjfeedFreeAccessSchema: () => DjfeedFreeAccessSchema,
  DjfeedRequesterHistorySchema: () => DjfeedRequesterHistorySchema,
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
  LdcoHostDancersSchema: () => LdcoHostDancersSchema,
  LdcoInstructorVenuesSchema: () => LdcoInstructorVenuesSchema,
  LdcoInstructorsSchema: () => LdcoInstructorsSchema,
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
  LdcoSessionAttendanceSchema: () => LdcoSessionAttendanceSchema,
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
var import_zod68 = require("zod");

// contract.lock.json
var contract_lock_default = {
  version: "0.12.0",
  hash: "693d089c553a10a253ff312cd8b7cf60a4ce2897c9bffc715069eba9bcd6f713"
};

// package.json
var package_default = {
  name: "@ldco/database",
  version: "0.12.0",
  private: false,
  type: "module",
  description: "Single source of truth for the shared LDCO MongoDB contract, plus the API that publishes the latest version.",
  main: "./dist/index.cjs",
  module: "./dist/index.js",
  types: "./dist/index.d.ts",
  exports: {
    ".": {
      types: "./dist/index.d.ts",
      import: "./dist/index.js",
      require: "./dist/index.cjs"
    }
  },
  bin: {
    "ldco-db-check": "./dist/cli/check.js",
    "ldco-db-init": "./dist/cli/init.js"
  },
  files: [
    "dist"
  ],
  scripts: {
    dev: "next dev",
    prebuild: "tsx scripts/contract-lock.ts --verify && tsx scripts/verify-dist.ts",
    build: "next build",
    start: "next start",
    "package:build": "tsup",
    "contract:lock": "tsx scripts/contract-lock.ts --write",
    "contract:verify": "tsx scripts/contract-lock.ts --verify",
    "db:sync-local": "tsx --env-file-if-exists=.env.local scripts/sync-from-live.ts",
    "db:backup-live": "tsx --env-file-if-exists=.env.local scripts/backup-live.ts",
    "db:migrate": "tsx --env-file-if-exists=.env.local scripts/migrate.ts",
    "contract:infer": "tsx --env-file-if-exists=.env.local scripts/infer-contract.ts",
    typecheck: "tsc --noEmit"
  },
  dependencies: {
    mongodb: "^7.7.0",
    zod: "^4.1.0"
  },
  devDependencies: {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    next: "^16.1.4",
    react: "^19.0.0",
    "react-dom": "^19.0.0",
    tsup: "^8.5.0",
    tsx: "^4.20.0",
    typescript: "^5.9.0"
  }
};

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
  migratedFrom: import_zod20.z.string().optional()
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
    requesterCount: import_zod25.z.number()
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
  venueId: import_zod35.z.string()
});

// src/contract/collections/ldco/instructors.ts
var import_zod36 = require("zod");
var LdcoInstructorsSchema = import_zod36.z.strictObject({
  _id: import_zod36.z.string(),
  name: import_zod36.z.string(),
  associatedUserId: import_zod36.z.string().optional(),
  userId: import_zod36.z.string().optional()
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
  venueid: import_zod37.z.string()
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

// src/contract/collections/ldco-reviews/choreographers.ts
var import_zod58 = require("zod");
var LdcoReviewsChoreographersSchema = import_zod58.z.looseObject({ _id: import_zod58.z.union([import_zod58.z.string(), objectId]) });

// src/contract/collections/ldco-reviews/dances.ts
var import_zod59 = require("zod");
var LdcoReviewsDancesSchema = import_zod59.z.looseObject({ _id: import_zod59.z.union([import_zod59.z.string(), objectId]) });

// src/contract/collections/ldco-reviews/join_choreographer_appeals.ts
var import_zod60 = require("zod");
var LdcoReviewsJoinChoreographerAppealsSchema = import_zod60.z.looseObject({ _id: import_zod60.z.union([import_zod60.z.string(), objectId]) });

// src/contract/collections/ldco-reviews/lessons.ts
var import_zod61 = require("zod");
var LdcoReviewsLessonsSchema = import_zod61.z.strictObject({
  _id: objectId,
  lessonday: import_zod61.z.string(),
  lessonstart: import_zod61.z.string(),
  instructors: import_zod61.z.array(import_zod61.z.string()),
  duration: import_zod61.z.string(),
  lessoncost: import_zod61.z.string(),
  notes: import_zod61.z.string(),
  difficulty: import_zod61.z.string(),
  venueid: import_zod61.z.string()
});

// src/contract/collections/ldco-reviews/reports.ts
var import_zod62 = require("zod");
var LdcoReviewsReportsSchema = import_zod62.z.looseObject({ _id: import_zod62.z.union([import_zod62.z.string(), objectId]) });

// src/contract/collections/ldco-reviews/tracks.ts
var import_zod63 = require("zod");
var LdcoReviewsTracksSchema = import_zod63.z.looseObject({ _id: import_zod63.z.union([import_zod63.z.string(), objectId]) });

// src/contract/collections/ldco-reviews/venue_users.ts
var import_zod64 = require("zod");
var LdcoReviewsVenueUsersSchema = import_zod64.z.strictObject({
  _id: import_zod64.z.string(),
  userId: import_zod64.z.string(),
  venueId: import_zod64.z.string(),
  createdAt: bsonDate,
  requestedBy: import_zod64.z.string()
});

// src/contract/collections/ldco-reviews/venues.ts
var import_zod65 = require("zod");
var LdcoReviewsVenuesSchema = import_zod65.z.looseObject({ _id: import_zod65.z.union([import_zod65.z.string(), objectId]) });

// src/contract/collections/ldco-reviews/verify_user_instructor.ts
var import_zod66 = require("zod");
var LdcoReviewsVerifyUserInstructorSchema = import_zod66.z.strictObject({
  _id: objectId,
  userId: import_zod66.z.string(),
  instructorId: import_zod66.z.string(),
  createdAt: bsonDate,
  resolved: import_zod66.z.boolean(),
  resolution: import_zod66.z.string(),
  resolvedAt: bsonDate,
  resolvedBy: import_zod66.z.string()
});

// src/contract/collections/music_catalog/tracks.ts
var import_zod67 = require("zod");
var MusicCatalogTracksSchema = import_zod67.z.strictObject({
  _id: import_zod67.z.string(),
  artist: import_zod67.z.string(),
  createdAt: bsonDate,
  disambiguation: import_zod67.z.string(),
  durationMs: import_zod67.z.number().nullable(),
  isrcs: import_zod67.z.array(import_zod67.z.string()),
  nArtist: import_zod67.z.string(),
  nTitle: import_zod67.z.string(),
  rank: import_zod67.z.number(),
  rankedAt: bsonDate.optional(),
  source: import_zod67.z.string(),
  sourceId: import_zod67.z.string(),
  title: import_zod67.z.string(),
  updatedAt: bsonDate,
  variantKey: import_zod67.z.string(),
  words: import_zod67.z.array(import_zod67.z.string()),
  year: import_zod67.z.number().nullable()
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
var CONTRACT_VERSION = package_default.version;
function computeContractHash() {
  const description = Object.entries(collections).sort(([a], [b]) => a.localeCompare(b)).map(([key, c]) => [key, c.database, c.name, import_zod68.z.toJSONSchema(c.schema, { unrepresentable: "any" })]);
  return (0, import_node_crypto.createHash)("sha256").update(JSON.stringify(description)).digest("hex");
}
var CONTRACT_HASH = contract_lock_default.hash;
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
  DjfeedFreeAccessSchema,
  DjfeedRequesterHistorySchema,
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
  LdcoHostDancersSchema,
  LdcoInstructorVenuesSchema,
  LdcoInstructorsSchema,
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
  MusicCatalogTracksSchema,
  collections,
  computeContractHash
});
