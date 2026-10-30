// src/contract/index.ts
import { createHash } from "crypto";
import { z as z77 } from "zod";

// contract.lock.json
var hash = "3fd6f39cde577749e9bad8cdda367d9802c50b437f29637ea232b48d74efd2cb";
var collections = {
  "bld.event_templates": "1df4e84dea2413051623a8d5118f26507f7dc8767233a154ade9d17b1ca093d9",
  "bld.event_types": "72df6b91d956eccc5eb094833bdd45135f175ac9697e3e878a7da9dd241d0cb2",
  "bld.events": "711e9194c84fcab10eb5019f46ea8cdc88801b15c19ff8632c80d4a7011d3a56",
  "bld.frequencies": "6cdc1d083ffad5e708b7c6ad9bf72bf465b262b5cc998ca3de648fdb269d78b5",
  "bld.lessons": "6f314ff8432dd5551f39f473c20413187668310f206ba5cdb55610a6ccaae3ce",
  "copperknob_alert.processed_items": "c1ea28aeff688c50d4e965e3eb5631a80c23d821ad0deb062ff84801cf2236d9",
  "copperknob_alert.sync_metadata": "cf3046a5ea3e61a870f7d0da53427849e065be5ae0cebc40bea7973258eaa712",
  "copperknob_alert.watch_rules": "c982202f0d34f0af519f27a7b5405b798d1c75a0c321632d0dbe35c8a3323501",
  "djfeed.attendee_notifications": "0e5ab647437b750b07e19e2c584e83b5fcce75dd845eb84318a52cc9348a2f6f",
  "djfeed.beat_balances": "2fc401d0a287f1b3bf38f2af6bebcccfdd52f9a3e27c42d7b3815e57a9924374",
  "djfeed.beat_transactions": "9e5f1d64f6cf9e7cae14c5ddc976b0f877ac24966f90daeec17d1ab9bb019029",
  "djfeed.dancer_favorite_songs": "1d9a7b0f0bb469137f08d31e83b010566ffcfbb89875b4ca31cd662fdd7fcfd0",
  "djfeed.dj_direct_messages": "4eea469be6a2455d63a45355e144e81762fea74ad4ea3eb091dc2efb388a76fb",
  "djfeed.dj_messages": "037b4c3b1fd4fe5f0ac9b9e769b110814e5f40093493f3857c86d58214a091e1",
  "djfeed.dj_notifications": "0c6503899d147930e18ae806eef888fe9ff147a9603f57fc7f2b8b65bd2c1920",
  "djfeed.dj_profiles": "defe2e6528acd546e9df86850ac22dd71bfe8aa0733a55483a36faf68ed4ab5f",
  "djfeed.dj_requester_nicknames": "d030608dcdd9d459d3d5d41e949a1a35bc37fb87636f56ea3d4c3e53ac3e3325",
  "djfeed.dj_requests": "9985004fe37fef2dec14a53de30dd0cd0dda9da30880535b849be3d8f706f063",
  "djfeed.dj_sessions": "a3e3a314e9417f10a0d1f97fc417ae90a6c584991b7cf33e9f560afffd5ca120",
  "djfeed.dj_wallet_locks": "4821dafb6bea19c33eb6c5ca3f7f775d7eb80ceb3e69e9c834b1e0676781f8fb",
  "djfeed.dj_wallet_transactions": "20693a807124448596dd4d65e6b4448dc48fcb761884056baf4081f86e59efa8",
  "djfeed.feed_lessons": "fd3f81ee314714e77a62656c152fac5eac3dec74641571a1ef2240bc002e47e9",
  "djfeed.free_access": "e342ecd04dcc20037b145f842e89fecc65ff9e34778fa5b5ba0b000378ed53dc",
  "djfeed.host_dancers": "7291232634a01d91f97f4a2303baa47700e0db854dfcf448a71d71b82c1da719",
  "djfeed.lesson_checks": "a30485fdd2662ba54bda17c07b618e623fabd0446d505d7614b400d15672937b",
  "djfeed.requester_history": "268b11cd79c20bd567a124a14723ec6885665fe3bf98edadfc82f305de36a553",
  "djfeed.session_attendance": "efe769c9f9b9a8e2fe1b09c436cd7173a12f301f96e0ccccba283fff58ea716a",
  "djfeed.session_reports": "0331e623f3705d65aca905fa43e43106e7f5d909d9b07fa8ffc993f7222e8a29",
  "djfeed.session_transactions": "dacf4f7565c4ebaf419112952955bd57ce9d5d61dca1b581696e10adc658cd9d",
  "djfeed.stripe_events": "931713a25924546920cd89698d1a840ba2e39ece9ccc26ab1a429641e3f0c061",
  "ldco-events.event_registrations": "9ada86c41c046b78f0a94be5383829f356674e8686650315df11cd11dade95c3",
  "ldco-events.events": "9c9659b13669eb75f9d2e2c4845bacb81ae70d93a66d34edfdcb4da567b871da",
  "ldco-lessons.event_instructor_requests": "d6363771f4bb8324dad5e906d2526abf36977d274368ebad1962d6f5506714ed",
  "ldco-lessons.event_instructors": "45081600a6e8384f7079161a4d1e29e599c5ce05d59c122d9a371ce750064d52",
  "ldco-lessons.event_templates": "7bef5133ab79c4239ca5818d458f78af3bc3983922fb71691eb20cc43526da37",
  "ldco-lessons.event_types": "e0c586ad595062353e29eaf45837167fc926a884850017be5e0c2943250a0cdb",
  "ldco-lessons.events": "b4d300d20ffa5f4caf2c4f73884018bc3e1adbe38c004fd44cadbbaf8154e142",
  "ldco-lessons.frequencies": "4945f9e6abe0cc3d4dade2eeb796d5dbde2bb1dd5458f07b28f8f18a700f5b30",
  "ldco-lessons.lessons": "c5ee40a6d65460ef053471f61099865bc733a506d6aa7a8580c067f7838eea40",
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
  "ldco.dances": "2c941ec81b43d68319866f7c55c37538f9759f34bd42cc3ea5763e5c6c931abe",
  "ldco.events": "b53ee78587109ccd2ac3a19a09b1ec3bcb31748cc46041cb9faf8b37a29da85c",
  "ldco.friend_requests": "3c44575c6c295a73d8ace89c24529975b13f0716b5676de2dda31fe5e0020f63",
  "ldco.instructor_venues": "ec684ffe975ca167804e53157f10c03042c72d5b9e2b9a930af89176010481a2",
  "ldco.instructors": "7d6963368134db795f7fe0a2211ea49e55c9d58e196706f031a4ec17fbc5b4a8",
  "ldco.lessons": "077310d7b2505baed4a07a8a45e9b38df1140e738139f9fdade7451650bb241c",
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
  "ldco.venues": "1f5d0832a4c7eceb7b1c1cef310b564793553173644d1d879e606e1c10744423",
  "music_catalog.tracks": "108476379cc40c8264e23aba562c5151a8dc0c3af21498e7ed631a7a300d67fe"
};

// package.json
var version = "0.19.0";

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
    // declared in src/contract/declared-fields.ts
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
  choreographer: z9.string().optional(),
  // declared in src/contract/declared-fields.ts
  danceName: z9.string(),
  fuzzyThreshold: z9.number(),
  lastCheckedAt: z9.string(),
  notifyWebhookUrl: z9.string().optional()
  // declared in src/contract/declared-fields.ts
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
  migratedFrom: z19.string().optional(),
  lessonPhase: z19.string().nullable().optional()
  // declared in src/contract/declared-fields.ts
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
  durationMinutes: z20.number().nullable().optional(),
  // declared in src/contract/declared-fields.ts
  queueVisibleCount: z20.number().optional(),
  feedTemplateId: z20.string().optional(),
  feedAppliedAt: z20.string().optional(),
  feedAspectRatio: z20.string().optional(),
  requestsEnabled: z20.boolean().optional(),
  suppressedClientIds: z20.array(z20.unknown()).optional(),
  addOns: z20.array(z20.unknown()).optional(),
  migratedFrom: z20.string().optional(),
  shareTimeZone: z20.string().optional(),
  shareToken: z20.string().optional(),
  privateEvent: z20.boolean().optional(),
  linkedTo: z20.strictObject({ kind: z20.enum(["event", "eventType", "venue"]), id: z20.string() }).optional(),
  extensions: z20.array(z20.unknown()).optional()
  // declared in src/contract/declared-fields.ts
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

// src/contract/collections/djfeed/lesson_checks.ts
import { z as z26 } from "zod";
var DjfeedLessonChecksSchema = z26.strictObject({
  _id: z26.string(),
  userId: z26.string(),
  feedLessonId: z26.string(),
  answer: z26.enum(["known", "refresh", "not_taken"]),
  answeredAt: bsonDate
});

// src/contract/collections/djfeed/requester_history.ts
import { z as z27 } from "zod";
var DjfeedRequesterHistorySchema = z27.strictObject({
  _id: objectId,
  clientId: z27.string(),
  sessionId: z27.string(),
  ownerId: z27.string(),
  requesterName: z27.string(),
  requests: z27.array(z27.strictObject({
    danceName: z27.string(),
    danceId: z27.string().nullable(),
    status: z27.string(),
    tipCents: z27.number(),
    createdAt: bsonDate
  })),
  sessionDate: bsonDate,
  sessionName: z27.string()
});

// src/contract/collections/djfeed/session_attendance.ts
import { z as z28 } from "zod";
var DjfeedSessionAttendanceSchema = z28.strictObject({
  _id: z28.string(),
  sessionId: z28.string(),
  userId: z28.string(),
  firstSeenAt: bsonDate,
  hostId: z28.string(),
  lastSeenAt: bsonDate
});

// src/contract/collections/djfeed/session_reports.ts
import { z as z29 } from "zod";
var DjfeedSessionReportsSchema = z29.strictObject({
  _id: objectId,
  sessionId: z29.string(),
  actualDurationMs: z29.number(),
  autoClosedAt: bsonDate.nullable(),
  closedAt: bsonDate,
  endsAt: bsonDate,
  extensions: z29.array(z29.unknown()),
  generatedAt: bsonDate,
  ownerId: z29.string(),
  playedTracks: z29.array(z29.strictObject({
    danceName: z29.string(),
    danceId: z29.string().nullable(),
    songName: z29.string(),
    artist: z29.string(),
    difficulty: z29.string(),
    stepsheet: z29.string().optional(),
    danceType: z29.string().nullable(),
    partnerStyle: z29.string().nullable(),
    isSongSwap: z29.boolean().optional(),
    swapSongName: z29.string().nullable().optional(),
    swapArtist: z29.string().nullable().optional(),
    playedAt: bsonDate,
    requesters: z29.array(z29.strictObject({
      clientId: z29.string(),
      requesterName: z29.string(),
      tipCents: z29.number()
    })),
    totalTips: z29.number(),
    requesterCount: z29.number(),
    catalogTrackId: z29.string().nullable().optional(),
    lesson: z29.union([z29.string(), z29.boolean()]).nullable().optional()
    // declared in src/contract/declared-fields.ts
  })),
  sessionName: z29.string(),
  startedAt: bsonDate,
  stats: z29.strictObject({
    totalDancesPlayed: z29.number(),
    totalRequests: z29.number(),
    totalApproved: z29.number(),
    totalSkipped: z29.number(),
    totalPending: z29.number(),
    approvalRate: z29.number().nullable(),
    totalTipCents: z29.number(),
    uniqueRequesters: z29.number()
  })
});

// src/contract/collections/djfeed/session_transactions.ts
import { z as z30 } from "zod";
var DjfeedSessionTransactionsSchema = z30.strictObject({
  _id: objectId,
  ownerId: z30.string(),
  type: z30.string(),
  sessionId: z30.string(),
  sessionName: z30.string(),
  durationMinutes: z30.number(),
  amountCents: z30.number(),
  stripeSessionId: z30.string(),
  stripePaymentIntentId: z30.string(),
  createdAt: bsonDate
});

// src/contract/collections/djfeed/stripe_events.ts
import { z as z31 } from "zod";
var DjfeedStripeEventsSchema = z31.strictObject({
  _id: z31.string(),
  type: z31.string(),
  receivedAt: bsonDate
});

// src/contract/collections/ldco/choreographers.ts
import { z as z32 } from "zod";
var LdcoChoreographersSchema = z32.strictObject({
  _id: z32.string(),
  name: z32.string(),
  copperknobUrl: z32.string().optional(),
  lastImportedAt: z32.string().optional(),
  associatedUserId: z32.string().optional()
});

// src/contract/collections/ldco/dance_collections.ts
import { z as z33 } from "zod";
var LdcoDanceCollectionsSchema = z33.strictObject({
  _id: z33.string(),
  name: z33.string(),
  danceIds: z33.array(z33.string()),
  createdBy: z33.string(),
  createdAt: bsonDate.nullable(),
  updatedAt: bsonDate.nullable(),
  isPrivate: z33.boolean().optional(),
  archived: z33.boolean().optional(),
  archivedAt: bsonDate.nullable().optional(),
  isArchived: z33.boolean().optional(),
  isCopyable: z33.boolean().optional(),
  pendingDanceIds: z33.array(z33.string()).optional()
});

// src/contract/collections/ldco/dance_tracks.ts
import { z as z34 } from "zod";
var LdcoDanceTracksSchema = z34.strictObject({
  _id: z34.string(),
  danceId: z34.string(),
  trackId: z34.string(),
  isPrimary: z34.boolean(),
  createdAt: bsonDate
});

// src/contract/collections/ldco/dances.ts
import { z as z35 } from "zod";
var LdcoDancesSchema = z35.strictObject({
  _id: z35.string(),
  difficulty: z35.string(),
  tracks: z35.array(z35.string()),
  primaryTrack: z35.string(),
  danceName: z35.string(),
  choreographers: z35.array(z35.string()),
  stepsheet: z35.string().optional(),
  stepsheetUrls: z35.array(z35.string()).optional(),
  songArtists: z35.array(z35.strictObject({
    song: z35.string(),
    artist: z35.string()
  })).optional(),
  publishedAt: bsonDate.optional(),
  // declared in src/contract/declared-fields.ts
  published: z35.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$/).optional(),
  // declared in src/contract/declared-fields.ts
  publishedSource: z35.enum(["feed", "feed-archive", "sync-time", "id-estimate"]).optional()
  // declared in src/contract/declared-fields.ts
});

// src/contract/collections/ldco/events.ts
import { z as z36 } from "zod";
var LdcoEventsSchema = z36.strictObject({
  _id: z36.string(),
  venueId: z36.string(),
  title: z36.string(),
  description: z36.string(),
  eventDay: z36.string(),
  startTime: z36.string(),
  endTime: z36.string(),
  createdAt: bsonDate,
  updatedAt: bsonDate,
  createdBy: z36.string()
});

// src/contract/collections/ldco/friend_requests.ts
import { z as z37 } from "zod";
var LdcoFriendRequestsSchema = z37.strictObject({
  _id: z37.string(),
  requesterId: z37.string(),
  requesteeId: z37.string(),
  createdAt: bsonDate.optional(),
  timestamp: bsonDate.optional()
});

// src/contract/collections/ldco/instructor_venues.ts
import { z as z38 } from "zod";
var LdcoInstructorVenuesSchema = z38.strictObject({
  _id: z38.string(),
  instructorId: z38.string(),
  venueId: z38.string(),
  createdAt: bsonDate.optional(),
  updatedAt: bsonDate.optional()
});

// src/contract/collections/ldco/instructors.ts
import { z as z39 } from "zod";
var LdcoInstructorsSchema = z39.strictObject({
  _id: z39.string(),
  name: z39.string(),
  associatedUserId: z39.string().optional(),
  userId: z39.string().optional(),
  bio: z39.string().optional()
});

// src/contract/collections/ldco/lessons.ts
import { z as z40 } from "zod";
var LdcoLessonsSchema = z40.strictObject({
  _id: z40.string(),
  lessonday: z40.string(),
  lessonstart: z40.string(),
  instructors: z40.array(z40.string()),
  duration: z40.string(),
  lessoncost: z40.string(),
  notes: z40.string(),
  difficulty: z40.string(),
  venueid: z40.string(),
  verifiedAt: bsonDate.nullable(),
  // declared in src/contract/declared-fields.ts
  verifiedBy: z40.string().nullable()
  // declared in src/contract/declared-fields.ts
});

// src/contract/collections/ldco/login_events.ts
import { z as z41 } from "zod";
var LdcoLoginEventsSchema = z41.strictObject({
  _id: objectId,
  userId: z41.string(),
  email: z41.string(),
  provider: z41.string(),
  app: z41.string(),
  ip: z41.string().optional(),
  userAgent: z41.string().optional(),
  createdAt: bsonDate,
  clientId: z41.string().nullable().optional(),
  debugReturnToCookie: z41.null().optional(),
  source: z41.string().optional()
});

// src/contract/collections/ldco/oauth_auth_codes.ts
import { z as z42 } from "zod";
var LdcoOauthAuthCodesSchema = z42.looseObject({ _id: z42.union([z42.string(), objectId]) });

// src/contract/collections/ldco/pending_dances.ts
import { z as z43 } from "zod";
var LdcoPendingDancesSchema = z43.strictObject({
  _id: z43.string(),
  danceName: z43.string(),
  songTitle: z43.string(),
  artist: z43.string(),
  choreographer: z43.string(),
  count: z43.null(),
  wall: z43.null(),
  difficulty: z43.string(),
  stepsheetUrl: z43.string().nullable(),
  submittedByUserId: z43.string(),
  submittedAt: bsonDate,
  status: z43.string()
});

// src/contract/collections/ldco/tracks.ts
import { z as z44 } from "zod";
var LdcoTracksSchema = z44.strictObject({
  _id: z44.string(),
  isrc: z44.string().optional(),
  name: z44.string(),
  artists: z44.array(z44.string()),
  uri: z44.string(),
  duration_ms: z44.number(),
  explicit: z44.boolean(),
  preview_url: z44.string().nullable().optional(),
  is_playable: z44.boolean().optional(),
  url: z44.string().optional()
});

// src/contract/collections/ldco/user_favorite_dances.ts
import { z as z45 } from "zod";
var LdcoUserFavoriteDancesSchema = z45.strictObject({
  _id: z45.string(),
  userId: z45.string(),
  danceId: z45.string(),
  createdAt: bsonDate
});

// src/contract/collections/ldco/user_flagged_dances.ts
import { z as z46 } from "zod";
var LdcoUserFlaggedDancesSchema = z46.strictObject({
  _id: z46.string(),
  userId: z46.string(),
  danceId: z46.string(),
  createdAt: bsonDate
});

// src/contract/collections/ldco/user_follow_collections.ts
import { z as z47 } from "zod";
var LdcoUserFollowCollectionsSchema = z47.strictObject({
  _id: z47.string(),
  userId: z47.string(),
  collectionId: z47.string(),
  followedAt: bsonDate
});

// src/contract/collections/ldco/user_follows.ts
import { z as z48 } from "zod";
var LdcoUserFollowsSchema = z48.strictObject({
  _id: z48.string(),
  userId: z48.string(),
  followingId: z48.string(),
  createdAt: bsonDate
});

// src/contract/collections/ldco/user_friends.ts
import { z as z49 } from "zod";
var LdcoUserFriendsSchema = z49.strictObject({
  _id: z49.string(),
  userA: z49.string(),
  userB: z49.string(),
  timestamp: bsonDate
});

// src/contract/collections/ldco/user_known_dances.ts
import { z as z50 } from "zod";
var LdcoUserKnownDancesSchema = z50.strictObject({
  _id: z50.string(),
  userId: z50.string(),
  danceId: z50.string(),
  createdAt: bsonDate
});

// src/contract/collections/ldco/user_lessons.ts
import { z as z51 } from "zod";
var LdcoUserLessonsSchema = z51.strictObject({
  _id: z51.string(),
  userId: z51.string(),
  lessonId: z51.string()
});

// src/contract/collections/ldco/user_refresh_dances.ts
import { z as z52 } from "zod";
var LdcoUserRefreshDancesSchema = z52.strictObject({
  _id: z52.string(),
  userId: z52.string(),
  danceId: z52.string(),
  createdAt: bsonDate
});

// src/contract/collections/ldco/user_venues.ts
import { z as z53 } from "zod";
var LdcoUserVenuesSchema = z53.strictObject({
  _id: z53.string(),
  userId: z53.string(),
  venueId: z53.string()
});

// src/contract/collections/ldco/users.ts
import { z as z54 } from "zod";
var LdcoUsersSchema = z54.strictObject({
  _id: z54.string(),
  name: z54.string(),
  email: z54.string(),
  image: z54.string().optional(),
  emailVerified: z54.null().optional(),
  bio: z54.string().optional(),
  favorites: z54.array(z54.string()).optional(),
  flagged: z54.array(z54.string()).optional(),
  known: z54.array(z54.string()).optional(),
  refresh: z54.array(z54.string()).optional(),
  collections: z54.array(z54.strictObject({
    name: z54.string(),
    danceIds: z54.array(z54.string())
  })).optional(),
  password: z54.string().optional(),
  createdAt: bsonDate.optional(),
  googleId: z54.string().optional()
});

// src/contract/collections/ldco/venue_checkins.ts
import { z as z55 } from "zod";
var LdcoVenueCheckinsSchema = z55.strictObject({
  _id: z55.string(),
  userId: z55.string(),
  venueId: z55.string(),
  dateKey: z55.string(),
  status: z55.string()
});

// src/contract/collections/ldco/venue_users.ts
import { z as z56 } from "zod";
var LdcoVenueUsersSchema = z56.strictObject({
  _id: z56.string(),
  userId: z56.string(),
  venueId: z56.string(),
  requestedBy: z56.string()
});

// src/contract/collections/ldco/venues.ts
import { z as z57 } from "zod";
var LdcoVenuesSchema = z57.strictObject({
  _id: z57.string(),
  venuename: z57.string(),
  venueaddress: z57.string(),
  geolocation: z57.array(z57.number()),
  phone: z57.string(),
  website: z57.string(),
  timeZone: z57.string(),
  verifiedAt: bsonDate.nullable(),
  // declared in src/contract/declared-fields.ts
  verifiedBy: z57.string().nullable(),
  // declared in src/contract/declared-fields.ts
  city: z57.string().optional(),
  state: z57.string().optional()
});

// src/contract/collections/ldco-events/event_registrations.ts
import { z as z58 } from "zod";
var LdcoEventsEventRegistrationsSchema = z58.strictObject({
  _id: objectId,
  address: z58.string().nullable(),
  agreedToWaiver: z58.boolean(),
  attendeeStatus: z58.string().optional(),
  createdAt: bsonDate,
  email: z58.string(),
  emails: z58.array(z58.strictObject({
    templateId: z58.string(),
    subject: z58.string(),
    sentAt: z58.string()
  })).optional(),
  event: z58.string(),
  name: z58.string(),
  paidAt: bsonDate.nullable().optional(),
  paymentMethod: z58.string(),
  paymentStatus: z58.string(),
  phone: z58.string().nullable(),
  requestToken: z58.string(),
  waiverSignature: z58.string(),
  waiverSignedAt: z58.string(),
  requests: z58.array(z58.strictObject({
    text: z58.string(),
    danceId: z58.string().nullable()
  })).optional(),
  updatedAt: bsonDate.optional(),
  catering: z58.boolean().optional(),
  stripeSessionId: z58.null().optional()
});

// src/contract/collections/ldco-events/events.ts
import { z as z59 } from "zod";
var LdcoEventsEventsSchema = z59.strictObject({
  _id: objectId,
  slug: z59.string(),
  active: z59.boolean(),
  createdAt: bsonDate,
  shortTitle: z59.string(),
  title: z59.string(),
  // When and where are this special event's (decision 24); the old date / time / venue text was removed by 0019.
  lessonEventId: z59.string()
  // declared in src/contract/declared-fields.ts
});

// src/contract/collections/ldco-lessons/event_instructor_requests.ts
import { z as z60 } from "zod";
var LdcoLessonsEventInstructorRequestsSchema = z60.looseObject({ _id: z60.union([z60.string(), objectId]) });

// src/contract/collections/ldco-lessons/event_instructors.ts
import { z as z61 } from "zod";
var LdcoLessonsEventInstructorsSchema = z61.strictObject({
  _id: z61.string(),
  instructorId: z61.string(),
  eventTypeId: z61.string().optional(),
  // declared in src/contract/declared-fields.ts
  eventId: z61.string().optional(),
  // declared in src/contract/declared-fields.ts
  createdAt: bsonDate,
  role: z61.string()
});

// src/contract/collections/ldco-lessons/event_templates.ts
import { z as z62 } from "zod";
var LdcoLessonsEventTemplatesSchema = z62.strictObject({
  _id: z62.string(),
  createdAt: bsonDate,
  eventTypeId: z62.string(),
  isDefault: z62.boolean(),
  lessons: z62.array(z62.strictObject({
    time: z62.string(),
    dance: z62.string().nullable(),
    level: z62.string().nullable(),
    link: z62.string().nullable()
    // declared in src/contract/declared-fields.ts
  })),
  name: z62.string(),
  updatedAt: bsonDate
});

// src/contract/collections/ldco-lessons/event_types.ts
import { z as z63 } from "zod";
var LdcoLessonsEventTypesSchema = z63.strictObject({
  _id: z63.string(),
  createdAt: bsonDate,
  createdBy: z63.string(),
  defaultDurationMinutes: z63.number(),
  defaultStartTime: z63.string().nullable(),
  isActive: z63.boolean(),
  level: z63.string(),
  price: z63.string(),
  title: z63.string(),
  updatedAt: bsonDate,
  venueId: z63.string(),
  verifiedAt: bsonDate.nullable(),
  // declared in src/contract/declared-fields.ts
  verifiedBy: z63.string().nullable()
  // declared in src/contract/declared-fields.ts
});

// src/contract/collections/ldco-lessons/events.ts
import { z as z64 } from "zod";
var LdcoLessonsEventsSchema = z64.strictObject({
  _id: z64.string(),
  cancelNote: z64.string().nullable(),
  createdAt: bsonDate,
  date: z64.string(),
  endAt: bsonDate,
  eventTypeId: z64.string().nullable().optional(),
  // declared in src/contract/declared-fields.ts
  isCancelled: z64.boolean(),
  lessons: z64.array(z64.strictObject({
    _id: z64.string(),
    startAt: bsonDate,
    dance: z64.string().nullable(),
    danceId: z64.string().nullable(),
    level: z64.string().nullable(),
    link: z64.string().nullable(),
    committed: z64.boolean(),
    skipped: z64.boolean()
  })),
  specialNote: z64.string().nullable(),
  startAt: bsonDate,
  substitute: z64.string().nullable(),
  substituteInstructorId: z64.string().nullable(),
  // declared in src/contract/declared-fields.ts
  timeZone: z64.string(),
  updatedAt: bsonDate,
  verifiedAt: bsonDate.nullable(),
  // declared in src/contract/declared-fields.ts
  verifiedBy: z64.string().nullable(),
  // declared in src/contract/declared-fields.ts
  title: z64.string().optional(),
  // declared in src/contract/declared-fields.ts
  venueId: z64.string().optional(),
  // declared in src/contract/declared-fields.ts
  createdBy: z64.string().optional()
  // declared in src/contract/declared-fields.ts
});

// src/contract/collections/ldco-lessons/frequencies.ts
import { z as z65 } from "zod";
var LdcoLessonsFrequenciesSchema = z65.strictObject({
  _id: z65.string(),
  byDay: z65.array(z65.string()).optional(),
  createdAt: bsonDate,
  durationMinutes: z65.number(),
  eventTypeId: z65.string(),
  isActive: z65.boolean().optional(),
  kind: z65.string(),
  startDate: z65.string().optional(),
  startTime: z65.string(),
  updatedAt: bsonDate,
  endDate: z65.string().optional(),
  nth: z65.number().optional(),
  weekday: z65.string().optional()
});

// src/contract/collections/ldco-lessons/lessons.ts
import { z as z66 } from "zod";
var LdcoLessonsLessonsSchema = z66.strictObject({
  _id: z66.string(),
  danceId: z66.string().optional(),
  date: bsonDate,
  eventId: z66.string().nullable(),
  instructorId: z66.string(),
  lessonId: z66.string().nullable(),
  // declared in src/contract/declared-fields.ts
  venue: z66.string(),
  venueId: z66.string(),
  danceName: z66.string().optional()
});

// src/contract/collections/ldco-reviews/choreographers.ts
import { z as z67 } from "zod";
var LdcoReviewsChoreographersSchema = z67.looseObject({ _id: z67.union([z67.string(), objectId]) });

// src/contract/collections/ldco-reviews/dances.ts
import { z as z68 } from "zod";
var LdcoReviewsDancesSchema = z68.looseObject({ _id: z68.union([z68.string(), objectId]) });

// src/contract/collections/ldco-reviews/join_choreographer_appeals.ts
import { z as z69 } from "zod";
var LdcoReviewsJoinChoreographerAppealsSchema = z69.looseObject({ _id: z69.union([z69.string(), objectId]) });

// src/contract/collections/ldco-reviews/lessons.ts
import { z as z70 } from "zod";
var LdcoReviewsLessonsSchema = z70.strictObject({
  _id: objectId,
  lessonday: z70.string(),
  lessonstart: z70.string(),
  instructors: z70.array(z70.string()),
  duration: z70.string(),
  lessoncost: z70.string(),
  notes: z70.string(),
  difficulty: z70.string(),
  venueid: z70.string()
});

// src/contract/collections/ldco-reviews/reports.ts
import { z as z71 } from "zod";
var LdcoReviewsReportsSchema = z71.looseObject({ _id: z71.union([z71.string(), objectId]) });

// src/contract/collections/ldco-reviews/tracks.ts
import { z as z72 } from "zod";
var LdcoReviewsTracksSchema = z72.looseObject({ _id: z72.union([z72.string(), objectId]) });

// src/contract/collections/ldco-reviews/venue_users.ts
import { z as z73 } from "zod";
var LdcoReviewsVenueUsersSchema = z73.strictObject({
  _id: z73.string(),
  userId: z73.string(),
  venueId: z73.string(),
  createdAt: bsonDate,
  requestedBy: z73.string()
});

// src/contract/collections/ldco-reviews/venues.ts
import { z as z74 } from "zod";
var LdcoReviewsVenuesSchema = z74.strictObject({
  _id: z74.string(),
  venuename: z74.string(),
  venueaddress: z74.string(),
  geolocation: z74.array(z74.number()),
  phone: z74.string(),
  website: z74.string(),
  contactName: z74.string(),
  contactEmail: z74.string(),
  contactPhone: z74.string(),
  createdAt: bsonDate,
  timeZone: z74.string(),
  verifiedAt: z74.null(),
  verifiedBy: z74.null()
});

// src/contract/collections/ldco-reviews/verify_user_instructor.ts
import { z as z75 } from "zod";
var LdcoReviewsVerifyUserInstructorSchema = z75.strictObject({
  _id: objectId,
  userId: z75.string(),
  instructorId: z75.string(),
  createdAt: bsonDate,
  resolved: z75.boolean(),
  resolution: z75.string(),
  resolvedAt: bsonDate,
  resolvedBy: z75.string()
});

// src/contract/collections/music_catalog/tracks.ts
import { z as z76 } from "zod";
var MusicCatalogTracksSchema = z76.strictObject({
  _id: z76.string(),
  artist: z76.string(),
  createdAt: bsonDate,
  disambiguation: z76.string(),
  durationMs: z76.number().nullable(),
  isrcs: z76.array(z76.string()),
  nArtist: z76.string(),
  nTitle: z76.string(),
  rank: z76.number(),
  rankedAt: bsonDate.optional(),
  source: z76.string(),
  sourceId: z76.string(),
  title: z76.string(),
  updatedAt: bsonDate,
  variantKey: z76.string(),
  words: z76.array(z76.string()),
  year: z76.number().nullable()
});

// src/contract/collections/index.ts
var collections2 = {
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
  "djfeed.lesson_checks": { database: "djfeed", name: "lesson_checks", schema: DjfeedLessonChecksSchema },
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
function computeContractHash() {
  const description = Object.entries(collections2).sort(([a], [b]) => a.localeCompare(b)).map(([key, c]) => [key, c.database, c.name, z77.toJSONSchema(c.schema, { unrepresentable: "any" })]);
  return createHash("sha256").update(JSON.stringify(description)).digest("hex");
}
function computeCollectionHashes() {
  return Object.fromEntries(
    Object.entries(collections2).sort(([a], [b]) => a.localeCompare(b)).map(([key, c]) => [
      key,
      createHash("sha256").update(JSON.stringify([key, c.database, c.name, z77.toJSONSchema(c.schema, { unrepresentable: "any" })])).digest("hex")
    ])
  );
}
var CONTRACT_HASH = hash;
var COLLECTION_HASHES = collections;

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
  DjfeedLessonChecksSchema,
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
  collections2 as collections,
  inScope,
  unmatchedEntries,
  scopeFromPackageJson,
  CONTRACT_VERSION,
  computeContractHash,
  computeCollectionHashes,
  CONTRACT_HASH,
  COLLECTION_HASHES
};
