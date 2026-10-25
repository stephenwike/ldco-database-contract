#!/usr/bin/env node
"use strict";

// src/cli/check.ts
var import_node_fs = require("fs");
var import_node_path = require("path");

// src/contract/index.ts
var import_node_crypto = require("crypto");
var import_zod77 = require("zod");

// contract.lock.json
var hash = "e63af0fcb48c58731ef9484e15398e492c99301d7eecc6720cc2275e73b27c73";
var collections = {
  "bld.event_templates": "1df4e84dea2413051623a8d5118f26507f7dc8767233a154ade9d17b1ca093d9",
  "bld.event_types": "72df6b91d956eccc5eb094833bdd45135f175ac9697e3e878a7da9dd241d0cb2",
  "bld.events": "711e9194c84fcab10eb5019f46ea8cdc88801b15c19ff8632c80d4a7011d3a56",
  "bld.frequencies": "6cdc1d083ffad5e708b7c6ad9bf72bf465b262b5cc998ca3de648fdb269d78b5",
  "bld.lessons": "6f314ff8432dd5551f39f473c20413187668310f206ba5cdb55610a6ccaae3ce",
  "copperknob_alert.processed_items": "c1ea28aeff688c50d4e965e3eb5631a80c23d821ad0deb062ff84801cf2236d9",
  "copperknob_alert.sync_metadata": "cf3046a5ea3e61a870f7d0da53427849e065be5ae0cebc40bea7973258eaa712",
  "copperknob_alert.watch_rules": "c77273c3837d604de8c47556115c9c61986b06418c73e71178b77fcc6103ed46",
  "djfeed.attendee_notifications": "0e5ab647437b750b07e19e2c584e83b5fcce75dd845eb84318a52cc9348a2f6f",
  "djfeed.beat_balances": "2fc401d0a287f1b3bf38f2af6bebcccfdd52f9a3e27c42d7b3815e57a9924374",
  "djfeed.beat_transactions": "9e5f1d64f6cf9e7cae14c5ddc976b0f877ac24966f90daeec17d1ab9bb019029",
  "djfeed.dancer_favorite_songs": "1d9a7b0f0bb469137f08d31e83b010566ffcfbb89875b4ca31cd662fdd7fcfd0",
  "djfeed.dj_direct_messages": "4eea469be6a2455d63a45355e144e81762fea74ad4ea3eb091dc2efb388a76fb",
  "djfeed.dj_messages": "037b4c3b1fd4fe5f0ac9b9e769b110814e5f40093493f3857c86d58214a091e1",
  "djfeed.dj_notifications": "0c6503899d147930e18ae806eef888fe9ff147a9603f57fc7f2b8b65bd2c1920",
  "djfeed.dj_profiles": "defe2e6528acd546e9df86850ac22dd71bfe8aa0733a55483a36faf68ed4ab5f",
  "djfeed.dj_requester_nicknames": "d030608dcdd9d459d3d5d41e949a1a35bc37fb87636f56ea3d4c3e53ac3e3325",
  "djfeed.dj_requests": "f5c3a6ca774163ddc0f26a47ca02241bc23f2f993b3d2322288ef3237a3703d4",
  "djfeed.dj_sessions": "ac6293c81cf3f1340367f297e470cad6e7bb9b5020d649b74fd674fbaaf74c1c",
  "djfeed.dj_wallet_locks": "4821dafb6bea19c33eb6c5ca3f7f775d7eb80ceb3e69e9c834b1e0676781f8fb",
  "djfeed.dj_wallet_transactions": "20693a807124448596dd4d65e6b4448dc48fcb761884056baf4081f86e59efa8",
  "djfeed.feed_lessons": "fd3f81ee314714e77a62656c152fac5eac3dec74641571a1ef2240bc002e47e9",
  "djfeed.free_access": "e342ecd04dcc20037b145f842e89fecc65ff9e34778fa5b5ba0b000378ed53dc",
  "djfeed.host_dancers": "7291232634a01d91f97f4a2303baa47700e0db854dfcf448a71d71b82c1da719",
  "djfeed.lesson_checks": "a30485fdd2662ba54bda17c07b618e623fabd0446d505d7614b400d15672937b",
  "djfeed.requester_history": "268b11cd79c20bd567a124a14723ec6885665fe3bf98edadfc82f305de36a553",
  "djfeed.session_attendance": "efe769c9f9b9a8e2fe1b09c436cd7173a12f301f96e0ccccba283fff58ea716a",
  "djfeed.session_reports": "fdc6625b335ddb78766c86d17e50705b87fe53c94fb5ff7b6796b40806e3003f",
  "djfeed.session_transactions": "dacf4f7565c4ebaf419112952955bd57ce9d5d61dca1b581696e10adc658cd9d",
  "djfeed.stripe_events": "931713a25924546920cd89698d1a840ba2e39ece9ccc26ab1a429641e3f0c061",
  "ldco-events.event_registrations": "9ada86c41c046b78f0a94be5383829f356674e8686650315df11cd11dade95c3",
  "ldco-events.events": "acc2c6ea398d385d7153c0760f3abb44a187c6a864434a2ec20dbfc1ea5e2cf5",
  "ldco-lessons.event_instructor_requests": "d6363771f4bb8324dad5e906d2526abf36977d274368ebad1962d6f5506714ed",
  "ldco-lessons.event_instructors": "c7e861de7b2f8e052c97bb902699b18f689f3dda1a65798fd48d7a20d66863a0",
  "ldco-lessons.event_templates": "9de0adac86f736fd894cefe06072d140d931963bdff82fe37fc9882248d27f08",
  "ldco-lessons.event_types": "db49cdbf82f901b12b321b6bd4737c1127d9b4ab5978b9aa5989add1d04ae6c3",
  "ldco-lessons.events": "49a4c2f9aea9f96d6b3aec0f3e8c99ac98879606628b755189e1667b63cbdb26",
  "ldco-lessons.frequencies": "4945f9e6abe0cc3d4dade2eeb796d5dbde2bb1dd5458f07b28f8f18a700f5b30",
  "ldco-lessons.lessons": "defc8d07b20093434f11eb40bfdc42ded4f1eab49a90a687feca89adee0e5546",
  "ldco-reviews.choreographers": "d255092436491018b8d388e6f95c28dbd566cb53f7485b58dc6712be49386a36",
  "ldco-reviews.dances": "3fc12018ed54816edcccbe68b74dbdadf2f1015bd40c1b8f0ca382f07554ad40",
  "ldco-reviews.join_choreographer_appeals": "2d7e2d6b5e7ae7ae2711a78bf1184166025b019354e2a7d006611dc186fe7dac",
  "ldco-reviews.lessons": "0514026cd1e3d2b588e2809006bb20830db148b4d495a330919d7df32256ac1f",
  "ldco-reviews.reports": "6ef33c1413eaad5e7eb8991042cdd8e8f3c8a4bcc3dc8c94f4c7dfc39d3e8097",
  "ldco-reviews.tracks": "b5bfc5cd42a3b4491df4449d93bcb387a017c0744bdc6fa8afa97c660239741c",
  "ldco-reviews.venue_users": "5218786352621d2bc3667de8f9ad216a19f5e22358f86ca4206eb40145ea14c2",
  "ldco-reviews.venues": "634b383ef897b04ec162216bf69e5c9836a71f95a64facf4657673d50fcd4dcf",
  "ldco-reviews.verify_user_instructor": "aed3857dbd1e8bd61c07c6f147f4250c6fa631f8f712826a40857fb51c5be816",
  "ldco.choreographers": "3704f8f6e16f9af8b612405ff62bd207f0981d4d403326f36526da1cc2e47d08",
  "ldco.dance_collections": "ef290b6abf788b8a58f430be110a74f03846d9497b40418664bef45f8dae4b27",
  "ldco.dance_tracks": "12fe8ff9b34e4b93dad33cf51109aa9b3edcaf118fe6b64aa258912f0218c923",
  "ldco.dances": "d00a95e60c4725e29b629ab8175a0844042dc704dd54378e78e0ebe50e8bc631",
  "ldco.events": "b53ee78587109ccd2ac3a19a09b1ec3bcb31748cc46041cb9faf8b37a29da85c",
  "ldco.friend_requests": "3c44575c6c295a73d8ace89c24529975b13f0716b5676de2dda31fe5e0020f63",
  "ldco.instructor_venues": "ec684ffe975ca167804e53157f10c03042c72d5b9e2b9a930af89176010481a2",
  "ldco.instructors": "7d6963368134db795f7fe0a2211ea49e55c9d58e196706f031a4ec17fbc5b4a8",
  "ldco.lessons": "e9c16365fea27a84b1bc1f8c4f829ae10e3c5b3351a0956b9d45098a72b8bfae",
  "ldco.login_events": "0b042cfdb867f5c2d1f7f5a1d4928fddd10cf4feb5f24fcf2c04f51032d7c8b8",
  "ldco.oauth_auth_codes": "3ee5d77ba237bb289c9fc95d36e513cc99dab113e82480928d05cf3d0781124a",
  "ldco.pending_dances": "0c6d91a61fa844c44ba7fd851e0085c102e35296ec0678c79c2b37c406dac7cd",
  "ldco.tracks": "e1a807f16bc37848389a6aa039e1846d002497c87469e4254013536118776a92",
  "ldco.user_favorite_dances": "85df4bbaea0a539ec187752a7d5dd26ff6967027187f7bf9e829829b88928932",
  "ldco.user_flagged_dances": "9b27f011c93f553a283d306e4233bf3153db09e67e133a1fb1ad2ba821563677",
  "ldco.user_follow_collections": "2bb2ab1b01f667e5bd9d09dca5cf282828016f98224512880e413ebfab2efb81",
  "ldco.user_follows": "0c3d4aa9bcefb66d6f66efbfd5aa29a5c5bcbb7fd36368ce71c7e37038d48d05",
  "ldco.user_friends": "3095ebb3ea3521d22c8393f820a96af869a3596470903e873d7f867e6f4bdca1",
  "ldco.user_known_dances": "387c0d131d0f67b68919cbfa02b24b88545ea03f6ba19157216bbffb241f9ffe",
  "ldco.user_lessons": "cbb72761f781479e3f22a81995d5fa4d7ab4eb9a2a08f93172da9c39c274494f",
  "ldco.user_refresh_dances": "4e88dc0e08f66c43a3f564099e400e92093710ceba239326ea2a688dcdce623f",
  "ldco.user_venues": "733f9467d4f439665facaec04e00f411b8ab51ec615b218e448cfb8183872976",
  "ldco.users": "eda148e9c709ba2ec6a407015c66bf44779160e789182071dd91177f6cdb4dae",
  "ldco.venue_checkins": "e01902219a9d81ea071530cdb453c2af739c872e7651460f429415828ff38ecf",
  "ldco.venue_users": "b365f003bb9f3a13ab89291b2b1906c28c28239d1bb547074fa1192065c83af6",
  "ldco.venues": "f8e876005e0d9aa310600463a0feb7921da9f9b49e3312f233f990f0c532523a",
  "music_catalog.tracks": "108476379cc40c8264e23aba562c5151a8dc0c3af21498e7ed631a7a300d67fe"
};

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

// src/contract/collections/djfeed/lesson_checks.ts
var import_zod26 = require("zod");
var DjfeedLessonChecksSchema = import_zod26.z.strictObject({
  _id: import_zod26.z.string(),
  userId: import_zod26.z.string(),
  feedLessonId: import_zod26.z.string(),
  answer: import_zod26.z.enum(["known", "refresh", "not_taken"]),
  answeredAt: bsonDate
});

// src/contract/collections/djfeed/requester_history.ts
var import_zod27 = require("zod");
var DjfeedRequesterHistorySchema = import_zod27.z.strictObject({
  _id: objectId,
  clientId: import_zod27.z.string(),
  sessionId: import_zod27.z.string(),
  ownerId: import_zod27.z.string(),
  requesterName: import_zod27.z.string(),
  requests: import_zod27.z.array(import_zod27.z.strictObject({
    danceName: import_zod27.z.string(),
    danceId: import_zod27.z.string().nullable(),
    status: import_zod27.z.string(),
    tipCents: import_zod27.z.number(),
    createdAt: bsonDate
  })),
  sessionDate: bsonDate,
  sessionName: import_zod27.z.string()
});

// src/contract/collections/djfeed/session_attendance.ts
var import_zod28 = require("zod");
var DjfeedSessionAttendanceSchema = import_zod28.z.strictObject({
  _id: import_zod28.z.string(),
  sessionId: import_zod28.z.string(),
  userId: import_zod28.z.string(),
  firstSeenAt: bsonDate,
  hostId: import_zod28.z.string(),
  lastSeenAt: bsonDate
});

// src/contract/collections/djfeed/session_reports.ts
var import_zod29 = require("zod");
var DjfeedSessionReportsSchema = import_zod29.z.strictObject({
  _id: objectId,
  sessionId: import_zod29.z.string(),
  actualDurationMs: import_zod29.z.number(),
  autoClosedAt: bsonDate.nullable(),
  closedAt: bsonDate,
  endsAt: bsonDate,
  extensions: import_zod29.z.array(import_zod29.z.unknown()),
  generatedAt: bsonDate,
  ownerId: import_zod29.z.string(),
  playedTracks: import_zod29.z.array(import_zod29.z.strictObject({
    danceName: import_zod29.z.string(),
    danceId: import_zod29.z.string().nullable(),
    songName: import_zod29.z.string(),
    artist: import_zod29.z.string(),
    difficulty: import_zod29.z.string(),
    stepsheet: import_zod29.z.string().optional(),
    danceType: import_zod29.z.string().nullable(),
    partnerStyle: import_zod29.z.string().nullable(),
    isSongSwap: import_zod29.z.boolean().optional(),
    swapSongName: import_zod29.z.string().nullable().optional(),
    swapArtist: import_zod29.z.string().nullable().optional(),
    playedAt: bsonDate,
    requesters: import_zod29.z.array(import_zod29.z.strictObject({
      clientId: import_zod29.z.string(),
      requesterName: import_zod29.z.string(),
      tipCents: import_zod29.z.number()
    })),
    totalTips: import_zod29.z.number(),
    requesterCount: import_zod29.z.number(),
    catalogTrackId: import_zod29.z.string().nullable().optional()
  })),
  sessionName: import_zod29.z.string(),
  startedAt: bsonDate,
  stats: import_zod29.z.strictObject({
    totalDancesPlayed: import_zod29.z.number(),
    totalRequests: import_zod29.z.number(),
    totalApproved: import_zod29.z.number(),
    totalSkipped: import_zod29.z.number(),
    totalPending: import_zod29.z.number(),
    approvalRate: import_zod29.z.number().nullable(),
    totalTipCents: import_zod29.z.number(),
    uniqueRequesters: import_zod29.z.number()
  })
});

// src/contract/collections/djfeed/session_transactions.ts
var import_zod30 = require("zod");
var DjfeedSessionTransactionsSchema = import_zod30.z.strictObject({
  _id: objectId,
  ownerId: import_zod30.z.string(),
  type: import_zod30.z.string(),
  sessionId: import_zod30.z.string(),
  sessionName: import_zod30.z.string(),
  durationMinutes: import_zod30.z.number(),
  amountCents: import_zod30.z.number(),
  stripeSessionId: import_zod30.z.string(),
  stripePaymentIntentId: import_zod30.z.string(),
  createdAt: bsonDate
});

// src/contract/collections/djfeed/stripe_events.ts
var import_zod31 = require("zod");
var DjfeedStripeEventsSchema = import_zod31.z.strictObject({
  _id: import_zod31.z.string(),
  type: import_zod31.z.string(),
  receivedAt: bsonDate
});

// src/contract/collections/ldco/choreographers.ts
var import_zod32 = require("zod");
var LdcoChoreographersSchema = import_zod32.z.strictObject({
  _id: import_zod32.z.string(),
  name: import_zod32.z.string(),
  copperknobUrl: import_zod32.z.string().optional(),
  lastImportedAt: import_zod32.z.string().optional(),
  associatedUserId: import_zod32.z.string().optional()
});

// src/contract/collections/ldco/dance_collections.ts
var import_zod33 = require("zod");
var LdcoDanceCollectionsSchema = import_zod33.z.strictObject({
  _id: import_zod33.z.string(),
  name: import_zod33.z.string(),
  danceIds: import_zod33.z.array(import_zod33.z.string()),
  createdBy: import_zod33.z.string(),
  createdAt: bsonDate.nullable(),
  updatedAt: bsonDate.nullable(),
  isPrivate: import_zod33.z.boolean().optional(),
  archived: import_zod33.z.boolean().optional(),
  archivedAt: bsonDate.nullable().optional(),
  isArchived: import_zod33.z.boolean().optional(),
  isCopyable: import_zod33.z.boolean().optional(),
  pendingDanceIds: import_zod33.z.array(import_zod33.z.string()).optional()
});

// src/contract/collections/ldco/dance_tracks.ts
var import_zod34 = require("zod");
var LdcoDanceTracksSchema = import_zod34.z.strictObject({
  _id: import_zod34.z.string(),
  danceId: import_zod34.z.string(),
  trackId: import_zod34.z.string(),
  isPrimary: import_zod34.z.boolean(),
  createdAt: bsonDate
});

// src/contract/collections/ldco/dances.ts
var import_zod35 = require("zod");
var LdcoDancesSchema = import_zod35.z.strictObject({
  _id: import_zod35.z.string(),
  difficulty: import_zod35.z.string(),
  tracks: import_zod35.z.array(import_zod35.z.string()),
  primaryTrack: import_zod35.z.string(),
  danceName: import_zod35.z.string(),
  choreographers: import_zod35.z.array(import_zod35.z.string()),
  stepsheet: import_zod35.z.string().optional(),
  stepsheetUrls: import_zod35.z.array(import_zod35.z.string()).optional(),
  songArtists: import_zod35.z.array(import_zod35.z.strictObject({
    song: import_zod35.z.string(),
    artist: import_zod35.z.string()
  })).optional()
});

// src/contract/collections/ldco/events.ts
var import_zod36 = require("zod");
var LdcoEventsSchema = import_zod36.z.strictObject({
  _id: import_zod36.z.string(),
  venueId: import_zod36.z.string(),
  title: import_zod36.z.string(),
  description: import_zod36.z.string(),
  eventDay: import_zod36.z.string(),
  startTime: import_zod36.z.string(),
  endTime: import_zod36.z.string(),
  createdAt: bsonDate,
  updatedAt: bsonDate,
  createdBy: import_zod36.z.string()
});

// src/contract/collections/ldco/friend_requests.ts
var import_zod37 = require("zod");
var LdcoFriendRequestsSchema = import_zod37.z.strictObject({
  _id: import_zod37.z.string(),
  requesterId: import_zod37.z.string(),
  requesteeId: import_zod37.z.string(),
  createdAt: bsonDate.optional(),
  timestamp: bsonDate.optional()
});

// src/contract/collections/ldco/instructor_venues.ts
var import_zod38 = require("zod");
var LdcoInstructorVenuesSchema = import_zod38.z.strictObject({
  _id: import_zod38.z.string(),
  instructorId: import_zod38.z.string(),
  venueId: import_zod38.z.string(),
  createdAt: bsonDate.optional(),
  updatedAt: bsonDate.optional()
});

// src/contract/collections/ldco/instructors.ts
var import_zod39 = require("zod");
var LdcoInstructorsSchema = import_zod39.z.strictObject({
  _id: import_zod39.z.string(),
  name: import_zod39.z.string(),
  associatedUserId: import_zod39.z.string().optional(),
  userId: import_zod39.z.string().optional(),
  bio: import_zod39.z.string().optional()
});

// src/contract/collections/ldco/lessons.ts
var import_zod40 = require("zod");
var LdcoLessonsSchema = import_zod40.z.strictObject({
  _id: import_zod40.z.string(),
  lessonday: import_zod40.z.string(),
  lessonstart: import_zod40.z.string(),
  instructors: import_zod40.z.array(import_zod40.z.string()),
  duration: import_zod40.z.string(),
  lessoncost: import_zod40.z.string(),
  notes: import_zod40.z.string(),
  difficulty: import_zod40.z.string(),
  venueid: import_zod40.z.string(),
  verifiedAt: import_zod40.z.null(),
  verifiedBy: import_zod40.z.null()
});

// src/contract/collections/ldco/login_events.ts
var import_zod41 = require("zod");
var LdcoLoginEventsSchema = import_zod41.z.strictObject({
  _id: objectId,
  userId: import_zod41.z.string(),
  email: import_zod41.z.string(),
  provider: import_zod41.z.string(),
  app: import_zod41.z.string(),
  ip: import_zod41.z.string().optional(),
  userAgent: import_zod41.z.string().optional(),
  createdAt: bsonDate,
  clientId: import_zod41.z.string().nullable().optional(),
  debugReturnToCookie: import_zod41.z.null().optional(),
  source: import_zod41.z.string().optional()
});

// src/contract/collections/ldco/oauth_auth_codes.ts
var import_zod42 = require("zod");
var LdcoOauthAuthCodesSchema = import_zod42.z.looseObject({ _id: import_zod42.z.union([import_zod42.z.string(), objectId]) });

// src/contract/collections/ldco/pending_dances.ts
var import_zod43 = require("zod");
var LdcoPendingDancesSchema = import_zod43.z.strictObject({
  _id: import_zod43.z.string(),
  danceName: import_zod43.z.string(),
  songTitle: import_zod43.z.string(),
  artist: import_zod43.z.string(),
  choreographer: import_zod43.z.string(),
  count: import_zod43.z.null(),
  wall: import_zod43.z.null(),
  difficulty: import_zod43.z.string(),
  stepsheetUrl: import_zod43.z.string().nullable(),
  submittedByUserId: import_zod43.z.string(),
  submittedAt: bsonDate,
  status: import_zod43.z.string()
});

// src/contract/collections/ldco/tracks.ts
var import_zod44 = require("zod");
var LdcoTracksSchema = import_zod44.z.strictObject({
  _id: import_zod44.z.string(),
  isrc: import_zod44.z.string().optional(),
  name: import_zod44.z.string(),
  artists: import_zod44.z.array(import_zod44.z.string()),
  uri: import_zod44.z.string(),
  duration_ms: import_zod44.z.number(),
  explicit: import_zod44.z.boolean(),
  preview_url: import_zod44.z.string().nullable().optional(),
  is_playable: import_zod44.z.boolean().optional(),
  url: import_zod44.z.string().optional()
});

// src/contract/collections/ldco/user_favorite_dances.ts
var import_zod45 = require("zod");
var LdcoUserFavoriteDancesSchema = import_zod45.z.strictObject({
  _id: import_zod45.z.string(),
  userId: import_zod45.z.string(),
  danceId: import_zod45.z.string(),
  createdAt: bsonDate
});

// src/contract/collections/ldco/user_flagged_dances.ts
var import_zod46 = require("zod");
var LdcoUserFlaggedDancesSchema = import_zod46.z.strictObject({
  _id: import_zod46.z.string(),
  userId: import_zod46.z.string(),
  danceId: import_zod46.z.string(),
  createdAt: bsonDate
});

// src/contract/collections/ldco/user_follow_collections.ts
var import_zod47 = require("zod");
var LdcoUserFollowCollectionsSchema = import_zod47.z.strictObject({
  _id: import_zod47.z.string(),
  userId: import_zod47.z.string(),
  collectionId: import_zod47.z.string(),
  followedAt: bsonDate
});

// src/contract/collections/ldco/user_follows.ts
var import_zod48 = require("zod");
var LdcoUserFollowsSchema = import_zod48.z.strictObject({
  _id: import_zod48.z.string(),
  userId: import_zod48.z.string(),
  followingId: import_zod48.z.string(),
  createdAt: bsonDate
});

// src/contract/collections/ldco/user_friends.ts
var import_zod49 = require("zod");
var LdcoUserFriendsSchema = import_zod49.z.strictObject({
  _id: import_zod49.z.string(),
  userA: import_zod49.z.string(),
  userB: import_zod49.z.string(),
  timestamp: bsonDate
});

// src/contract/collections/ldco/user_known_dances.ts
var import_zod50 = require("zod");
var LdcoUserKnownDancesSchema = import_zod50.z.strictObject({
  _id: import_zod50.z.string(),
  userId: import_zod50.z.string(),
  danceId: import_zod50.z.string(),
  createdAt: bsonDate
});

// src/contract/collections/ldco/user_lessons.ts
var import_zod51 = require("zod");
var LdcoUserLessonsSchema = import_zod51.z.strictObject({
  _id: import_zod51.z.string(),
  userId: import_zod51.z.string(),
  lessonId: import_zod51.z.string()
});

// src/contract/collections/ldco/user_refresh_dances.ts
var import_zod52 = require("zod");
var LdcoUserRefreshDancesSchema = import_zod52.z.strictObject({
  _id: import_zod52.z.string(),
  userId: import_zod52.z.string(),
  danceId: import_zod52.z.string(),
  createdAt: bsonDate
});

// src/contract/collections/ldco/user_venues.ts
var import_zod53 = require("zod");
var LdcoUserVenuesSchema = import_zod53.z.strictObject({
  _id: import_zod53.z.string(),
  userId: import_zod53.z.string(),
  venueId: import_zod53.z.string()
});

// src/contract/collections/ldco/users.ts
var import_zod54 = require("zod");
var LdcoUsersSchema = import_zod54.z.strictObject({
  _id: import_zod54.z.string(),
  name: import_zod54.z.string(),
  email: import_zod54.z.string(),
  image: import_zod54.z.string().optional(),
  emailVerified: import_zod54.z.null().optional(),
  bio: import_zod54.z.string().optional(),
  favorites: import_zod54.z.array(import_zod54.z.string()).optional(),
  flagged: import_zod54.z.array(import_zod54.z.string()).optional(),
  known: import_zod54.z.array(import_zod54.z.string()).optional(),
  refresh: import_zod54.z.array(import_zod54.z.string()).optional(),
  collections: import_zod54.z.array(import_zod54.z.strictObject({
    name: import_zod54.z.string(),
    danceIds: import_zod54.z.array(import_zod54.z.string())
  })).optional(),
  password: import_zod54.z.string().optional(),
  createdAt: bsonDate.optional(),
  googleId: import_zod54.z.string().optional()
});

// src/contract/collections/ldco/venue_checkins.ts
var import_zod55 = require("zod");
var LdcoVenueCheckinsSchema = import_zod55.z.strictObject({
  _id: import_zod55.z.string(),
  userId: import_zod55.z.string(),
  venueId: import_zod55.z.string(),
  dateKey: import_zod55.z.string(),
  status: import_zod55.z.string()
});

// src/contract/collections/ldco/venue_users.ts
var import_zod56 = require("zod");
var LdcoVenueUsersSchema = import_zod56.z.strictObject({
  _id: import_zod56.z.string(),
  userId: import_zod56.z.string(),
  venueId: import_zod56.z.string(),
  requestedBy: import_zod56.z.string()
});

// src/contract/collections/ldco/venues.ts
var import_zod57 = require("zod");
var LdcoVenuesSchema = import_zod57.z.strictObject({
  _id: import_zod57.z.string(),
  venuename: import_zod57.z.string(),
  venueaddress: import_zod57.z.string(),
  geolocation: import_zod57.z.array(import_zod57.z.number()),
  phone: import_zod57.z.string(),
  website: import_zod57.z.string(),
  timeZone: import_zod57.z.string(),
  verifiedAt: import_zod57.z.null(),
  verifiedBy: import_zod57.z.null(),
  city: import_zod57.z.string().optional(),
  state: import_zod57.z.string().optional()
});

// src/contract/collections/ldco-events/event_registrations.ts
var import_zod58 = require("zod");
var LdcoEventsEventRegistrationsSchema = import_zod58.z.strictObject({
  _id: objectId,
  address: import_zod58.z.string().nullable(),
  agreedToWaiver: import_zod58.z.boolean(),
  attendeeStatus: import_zod58.z.string().optional(),
  createdAt: bsonDate,
  email: import_zod58.z.string(),
  emails: import_zod58.z.array(import_zod58.z.strictObject({
    templateId: import_zod58.z.string(),
    subject: import_zod58.z.string(),
    sentAt: import_zod58.z.string()
  })).optional(),
  event: import_zod58.z.string(),
  name: import_zod58.z.string(),
  paidAt: bsonDate.nullable().optional(),
  paymentMethod: import_zod58.z.string(),
  paymentStatus: import_zod58.z.string(),
  phone: import_zod58.z.string().nullable(),
  requestToken: import_zod58.z.string(),
  waiverSignature: import_zod58.z.string(),
  waiverSignedAt: import_zod58.z.string(),
  requests: import_zod58.z.array(import_zod58.z.strictObject({
    text: import_zod58.z.string(),
    danceId: import_zod58.z.string().nullable()
  })).optional(),
  updatedAt: bsonDate.optional(),
  catering: import_zod58.z.boolean().optional(),
  stripeSessionId: import_zod58.z.null().optional()
});

// src/contract/collections/ldco-events/events.ts
var import_zod59 = require("zod");
var LdcoEventsEventsSchema = import_zod59.z.strictObject({
  _id: objectId,
  slug: import_zod59.z.string(),
  active: import_zod59.z.boolean(),
  createdAt: bsonDate,
  date: import_zod59.z.string(),
  dateShort: import_zod59.z.string(),
  shortTitle: import_zod59.z.string(),
  time: import_zod59.z.string(),
  title: import_zod59.z.string(),
  venueAddress: import_zod59.z.string(),
  venueName: import_zod59.z.string()
});

// src/contract/collections/ldco-lessons/event_instructor_requests.ts
var import_zod60 = require("zod");
var LdcoLessonsEventInstructorRequestsSchema = import_zod60.z.looseObject({ _id: import_zod60.z.union([import_zod60.z.string(), objectId]) });

// src/contract/collections/ldco-lessons/event_instructors.ts
var import_zod61 = require("zod");
var LdcoLessonsEventInstructorsSchema = import_zod61.z.strictObject({
  _id: import_zod61.z.string(),
  instructorId: import_zod61.z.string(),
  eventTypeId: import_zod61.z.string(),
  createdAt: bsonDate,
  role: import_zod61.z.string()
});

// src/contract/collections/ldco-lessons/event_templates.ts
var import_zod62 = require("zod");
var LdcoLessonsEventTemplatesSchema = import_zod62.z.strictObject({
  _id: import_zod62.z.string(),
  createdAt: bsonDate,
  eventTypeId: import_zod62.z.string(),
  isDefault: import_zod62.z.boolean(),
  lessons: import_zod62.z.array(import_zod62.z.strictObject({
    time: import_zod62.z.string(),
    dance: import_zod62.z.string().nullable(),
    level: import_zod62.z.string().nullable(),
    link: import_zod62.z.null()
  })),
  name: import_zod62.z.string(),
  updatedAt: bsonDate
});

// src/contract/collections/ldco-lessons/event_types.ts
var import_zod63 = require("zod");
var LdcoLessonsEventTypesSchema = import_zod63.z.strictObject({
  _id: import_zod63.z.string(),
  createdAt: bsonDate,
  createdBy: import_zod63.z.string(),
  defaultDurationMinutes: import_zod63.z.number(),
  defaultStartTime: import_zod63.z.string().nullable(),
  isActive: import_zod63.z.boolean(),
  level: import_zod63.z.string(),
  price: import_zod63.z.string(),
  title: import_zod63.z.string(),
  updatedAt: bsonDate,
  venueId: import_zod63.z.string(),
  verifiedAt: import_zod63.z.null(),
  verifiedBy: import_zod63.z.null()
});

// src/contract/collections/ldco-lessons/events.ts
var import_zod64 = require("zod");
var LdcoLessonsEventsSchema = import_zod64.z.strictObject({
  _id: import_zod64.z.string(),
  cancelNote: import_zod64.z.string().nullable(),
  createdAt: bsonDate,
  date: import_zod64.z.string(),
  endAt: bsonDate,
  eventTypeId: import_zod64.z.string(),
  isCancelled: import_zod64.z.boolean(),
  lessons: import_zod64.z.array(import_zod64.z.strictObject({
    _id: import_zod64.z.string(),
    startAt: bsonDate,
    dance: import_zod64.z.string().nullable(),
    danceId: import_zod64.z.string().nullable(),
    level: import_zod64.z.string().nullable(),
    link: import_zod64.z.string().nullable(),
    committed: import_zod64.z.boolean(),
    skipped: import_zod64.z.boolean()
  })),
  specialNote: import_zod64.z.string().nullable(),
  startAt: bsonDate,
  substitute: import_zod64.z.string().nullable(),
  substituteInstructorId: import_zod64.z.null(),
  timeZone: import_zod64.z.string(),
  updatedAt: bsonDate,
  verifiedAt: import_zod64.z.null(),
  verifiedBy: import_zod64.z.null()
});

// src/contract/collections/ldco-lessons/frequencies.ts
var import_zod65 = require("zod");
var LdcoLessonsFrequenciesSchema = import_zod65.z.strictObject({
  _id: import_zod65.z.string(),
  byDay: import_zod65.z.array(import_zod65.z.string()).optional(),
  createdAt: bsonDate,
  durationMinutes: import_zod65.z.number(),
  eventTypeId: import_zod65.z.string(),
  isActive: import_zod65.z.boolean().optional(),
  kind: import_zod65.z.string(),
  startDate: import_zod65.z.string().optional(),
  startTime: import_zod65.z.string(),
  updatedAt: bsonDate,
  endDate: import_zod65.z.string().optional(),
  nth: import_zod65.z.number().optional(),
  weekday: import_zod65.z.string().optional()
});

// src/contract/collections/ldco-lessons/lessons.ts
var import_zod66 = require("zod");
var LdcoLessonsLessonsSchema = import_zod66.z.strictObject({
  _id: import_zod66.z.string(),
  danceId: import_zod66.z.string().optional(),
  date: bsonDate,
  eventId: import_zod66.z.string().nullable(),
  instructorId: import_zod66.z.string(),
  lessonId: import_zod66.z.null(),
  venue: import_zod66.z.string(),
  venueId: import_zod66.z.string(),
  danceName: import_zod66.z.string().optional()
});

// src/contract/collections/ldco-reviews/choreographers.ts
var import_zod67 = require("zod");
var LdcoReviewsChoreographersSchema = import_zod67.z.looseObject({ _id: import_zod67.z.union([import_zod67.z.string(), objectId]) });

// src/contract/collections/ldco-reviews/dances.ts
var import_zod68 = require("zod");
var LdcoReviewsDancesSchema = import_zod68.z.looseObject({ _id: import_zod68.z.union([import_zod68.z.string(), objectId]) });

// src/contract/collections/ldco-reviews/join_choreographer_appeals.ts
var import_zod69 = require("zod");
var LdcoReviewsJoinChoreographerAppealsSchema = import_zod69.z.looseObject({ _id: import_zod69.z.union([import_zod69.z.string(), objectId]) });

// src/contract/collections/ldco-reviews/lessons.ts
var import_zod70 = require("zod");
var LdcoReviewsLessonsSchema = import_zod70.z.strictObject({
  _id: objectId,
  lessonday: import_zod70.z.string(),
  lessonstart: import_zod70.z.string(),
  instructors: import_zod70.z.array(import_zod70.z.string()),
  duration: import_zod70.z.string(),
  lessoncost: import_zod70.z.string(),
  notes: import_zod70.z.string(),
  difficulty: import_zod70.z.string(),
  venueid: import_zod70.z.string()
});

// src/contract/collections/ldco-reviews/reports.ts
var import_zod71 = require("zod");
var LdcoReviewsReportsSchema = import_zod71.z.looseObject({ _id: import_zod71.z.union([import_zod71.z.string(), objectId]) });

// src/contract/collections/ldco-reviews/tracks.ts
var import_zod72 = require("zod");
var LdcoReviewsTracksSchema = import_zod72.z.looseObject({ _id: import_zod72.z.union([import_zod72.z.string(), objectId]) });

// src/contract/collections/ldco-reviews/venue_users.ts
var import_zod73 = require("zod");
var LdcoReviewsVenueUsersSchema = import_zod73.z.strictObject({
  _id: import_zod73.z.string(),
  userId: import_zod73.z.string(),
  venueId: import_zod73.z.string(),
  createdAt: bsonDate,
  requestedBy: import_zod73.z.string()
});

// src/contract/collections/ldco-reviews/venues.ts
var import_zod74 = require("zod");
var LdcoReviewsVenuesSchema = import_zod74.z.strictObject({
  _id: import_zod74.z.string(),
  venuename: import_zod74.z.string(),
  venueaddress: import_zod74.z.string(),
  geolocation: import_zod74.z.array(import_zod74.z.number()),
  phone: import_zod74.z.string(),
  website: import_zod74.z.string(),
  contactName: import_zod74.z.string(),
  contactEmail: import_zod74.z.string(),
  contactPhone: import_zod74.z.string(),
  createdAt: bsonDate,
  timeZone: import_zod74.z.string(),
  verifiedAt: import_zod74.z.null(),
  verifiedBy: import_zod74.z.null()
});

// src/contract/collections/ldco-reviews/verify_user_instructor.ts
var import_zod75 = require("zod");
var LdcoReviewsVerifyUserInstructorSchema = import_zod75.z.strictObject({
  _id: objectId,
  userId: import_zod75.z.string(),
  instructorId: import_zod75.z.string(),
  createdAt: bsonDate,
  resolved: import_zod75.z.boolean(),
  resolution: import_zod75.z.string(),
  resolvedAt: bsonDate,
  resolvedBy: import_zod75.z.string()
});

// src/contract/collections/music_catalog/tracks.ts
var import_zod76 = require("zod");
var MusicCatalogTracksSchema = import_zod76.z.strictObject({
  _id: import_zod76.z.string(),
  artist: import_zod76.z.string(),
  createdAt: bsonDate,
  disambiguation: import_zod76.z.string(),
  durationMs: import_zod76.z.number().nullable(),
  isrcs: import_zod76.z.array(import_zod76.z.string()),
  nArtist: import_zod76.z.string(),
  nTitle: import_zod76.z.string(),
  rank: import_zod76.z.number(),
  rankedAt: bsonDate.optional(),
  source: import_zod76.z.string(),
  sourceId: import_zod76.z.string(),
  title: import_zod76.z.string(),
  updatedAt: bsonDate,
  variantKey: import_zod76.z.string(),
  words: import_zod76.z.array(import_zod76.z.string()),
  year: import_zod76.z.number().nullable()
});

// src/contract/scope.ts
function inScope(key, scope) {
  const [database] = key.split(".", 1);
  return scope.some((entry) => entry === "*" || entry === key || entry === `${database}.*`);
}
function unmatchedEntries(scope, keys) {
  return scope.filter((entry) => !keys.some((key) => inScope(key, [entry])));
}
function scopeFromPackageJson(pkg) {
  const uses = pkg?.ldco?.uses;
  if (uses === void 0) return void 0;
  if (!Array.isArray(uses) || !uses.every((u) => typeof u === "string" && u.length > 0)) {
    throw new Error('"ldco.uses" in package.json must be a list of strings like "djfeed.*" or "ldco.dances".');
  }
  return uses;
}

// src/contract/index.ts
var CONTRACT_VERSION = version;
var CONTRACT_HASH = hash;
var COLLECTION_HASHES = collections;

// src/cli/check.ts
var DEFAULT_URL = "https://ldco-database-contract.vercel.app";
var baseUrl = (process.env.LDCO_DATABASE_URL || DEFAULT_URL).replace(/\/+$/, "");
var UPDATE = "Update with: npm install github:stephenwike/ldco-database-contract (installs main, the latest contract)";
function fail(message) {
  console.error(`
[ldco-db-check] ${message}
`);
  process.exit(1);
}
function readScope() {
  let pkg;
  try {
    pkg = JSON.parse((0, import_node_fs.readFileSync)((0, import_node_path.join)(process.cwd(), "package.json"), "utf8"));
  } catch {
    return void 0;
  }
  try {
    return scopeFromPackageJson(pkg);
  } catch (err) {
    fail(err.message);
  }
}
function checkWhole(latest, scoped = false) {
  if (latest.version !== CONTRACT_VERSION || latest.hash !== CONTRACT_HASH) {
    const hint = scoped ? "" : `This app declares no scope, so any contract change requires an update. Add "ldco": { "uses": [...] }
to package.json (npx ldco-db-scope suggests one) to only be held to the collections it uses.
`;
    fail(`Database contract is out of date.
  installed: ${CONTRACT_VERSION}
  latest:    ${latest.version}
${hint}${UPDATE}`);
  }
  console.log(`[ldco-db-check] Contract ${CONTRACT_VERSION} is current.`);
}
function checkScope(latest, scope) {
  const installed = COLLECTION_HASHES;
  const inScopeInstalled = Object.keys(installed).filter((key) => inScope(key, scope));
  const changed = inScopeInstalled.filter((key) => key in latest.collections && latest.collections[key] !== installed[key]);
  const removed = inScopeInstalled.filter((key) => !(key in latest.collections));
  const added = Object.keys(latest.collections).filter((key) => inScope(key, scope) && !(key in installed));
  for (const entry of unmatchedEntries(scope, [...Object.keys(installed), ...Object.keys(latest.collections)])) {
    console.warn(`[ldco-db-check] Scope entry "${entry}" matches no collection in the contract (typo, or removed?).`);
  }
  if (changed.length || removed.length) {
    fail(
      `Database contract changed for collections this app uses.
  installed: ${CONTRACT_VERSION}
  latest:    ${latest.version}
` + changed.map((k) => `  changed: ${k}
`).join("") + removed.map((k) => `  removed: ${k}
`).join("") + UPDATE
    );
  }
  const note = added.length ? ` New in scope since ${CONTRACT_VERSION}: ${added.join(", ")} (not yet used, so not required).` : "";
  const versions = latest.version === CONTRACT_VERSION ? CONTRACT_VERSION : `${CONTRACT_VERSION} (latest ${latest.version})`;
  console.log(`[ldco-db-check] Contract ${versions}: no changes in this app's scope (${inScopeInstalled.length} collections).${note}`);
}
async function main() {
  if (process.env.LDCO_DATABASE_SKIP_CHECK === "1") {
    console.warn("[ldco-db-check] Skipped (LDCO_DATABASE_SKIP_CHECK=1).");
    return;
  }
  const scope = readScope();
  let latest;
  try {
    const res = await fetch(`${baseUrl}/api/contract/version`, { signal: AbortSignal.timeout(1e4) });
    if (!res.ok) fail(`Contract API responded ${res.status} ${res.statusText}.`);
    latest = await res.json();
  } catch (err) {
    fail(`Could not reach the contract API at ${baseUrl}: ${err.message}`);
  }
  if (!scope) return checkWhole(latest);
  if (!latest.collections) {
    console.warn("[ldco-db-check] The contract API doesn't publish per-collection hashes yet; checking the whole contract.");
    return checkWhole(latest, true);
  }
  checkScope(latest, scope);
}
main();
