// src/contract/index.ts
import { createHash } from "crypto";
import { z as z93 } from "zod";

// contract.lock.json
var hash = "4eb5a5820ba2917541fbdc3243eeffe4fefd320d7188496c8767259508041650";
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
  "djfeed.dj_requests": "b86608cb532ae50037df0896f038ac97921f390a7cc638ce19335fe50db8cead",
  "djfeed.dj_sessions": "6a40f170c30fc1250374d243efc5f509e9775662250c0a36982d87f1d7b43b0d",
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
  "ldco-events.events": "a48198e6c3fbd7e99ecdf21799b009af7bd68e1a40891b28bac0443bc4d3c879",
  "ldco-lessons.event_instructor_requests": "d6363771f4bb8324dad5e906d2526abf36977d274368ebad1962d6f5506714ed",
  "ldco-lessons.event_instructors": "45081600a6e8384f7079161a4d1e29e599c5ce05d59c122d9a371ce750064d52",
  "ldco-lessons.event_templates": "7bef5133ab79c4239ca5818d458f78af3bc3983922fb71691eb20cc43526da37",
  "ldco-lessons.event_types": "e0c586ad595062353e29eaf45837167fc926a884850017be5e0c2943250a0cdb",
  "ldco-lessons.events": "b4d300d20ffa5f4caf2c4f73884018bc3e1adbe38c004fd44cadbbaf8154e142",
  "ldco-lessons.frequencies": "4945f9e6abe0cc3d4dade2eeb796d5dbde2bb1dd5458f07b28f8f18a700f5b30",
  "ldco-lessons.lessons": "c5ee40a6d65460ef053471f61099865bc733a506d6aa7a8580c067f7838eea40",
  "ldco-reviews.choreographers": "d255092436491018b8d388e6f95c28dbd566cb53f7485b58dc6712be49386a36",
  "ldco-reviews.dances": "07399d77c9700b53707156a69901895f57372384773c4ea40aeff3f515777e0c",
  "ldco-reviews.instructor_venues": "892bea61c07a150d9b787c5d110de5e55a386800fc9ae7aa1aa9f58086008c3e",
  "ldco-reviews.instructors": "8876ab9d4adaeacc36436ae657c887ba598e2ea7466b6741ae0fb53d1c6c302c",
  "ldco-reviews.join_choreographer_appeals": "2d7e2d6b5e7ae7ae2711a78bf1184166025b019354e2a7d006611dc186fe7dac",
  "ldco-reviews.lessons": "0514026cd1e3d2b588e2809006bb20830db148b4d495a330919d7df32256ac1f",
  "ldco-reviews.reports": "6ef33c1413eaad5e7eb8991042cdd8e8f3c8a4bcc3dc8c94f4c7dfc39d3e8097",
  "ldco-reviews.tracks": "b5bfc5cd42a3b4491df4449d93bcb387a017c0744bdc6fa8afa97c660239741c",
  "ldco-reviews.venue_users": "5218786352621d2bc3667de8f9ad216a19f5e22358f86ca4206eb40145ea14c2",
  "ldco-reviews.venues": "8cbdfc8b7c83f70ce60d35dd9c79a34c510817949a161c1f19fc915a71e9eedb",
  "ldco-reviews.verify_user_instructor": "52310d3cfb3dcfdbcf398c14fea2ed3dbb491799a3d07e67aa79f9ce130ff644",
  "ldco.choreographers": "3704f8f6e16f9af8b612405ff62bd207f0981d4d403326f36526da1cc2e47d08",
  "ldco.dance_collections": "ef290b6abf788b8a58f430be110a74f03846d9497b40418664bef45f8dae4b27",
  "ldco.dance_tracks": "12fe8ff9b34e4b93dad33cf51109aa9b3edcaf118fe6b64aa258912f0218c923",
  "ldco.dances": "2c941ec81b43d68319866f7c55c37538f9759f34bd42cc3ea5763e5c6c931abe",
  "ldco.events": "b53ee78587109ccd2ac3a19a09b1ec3bcb31748cc46041cb9faf8b37a29da85c",
  "ldco.friend_requests": "3c44575c6c295a73d8ace89c24529975b13f0716b5676de2dda31fe5e0020f63",
  "ldco.instructor_venues": "ec684ffe975ca167804e53157f10c03042c72d5b9e2b9a930af89176010481a2",
  "ldco.instructors": "080fbeedfd14d3f24c02ac0d0d8b6a71b7a23f6e6b49601b2aef07ff0662fa14",
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
  "linedance.choreographer_pair_reviews": "f4a5a062392595a16cafd7ddb6398599534bdc95a671f21da487127c593ca834",
  "linedance.choreographers": "194a2295bd42e37b354c312827e18104415585dff8b7da1ea7577d45cf4ba813",
  "linedance.dance_merge_undos": "41911849363d2c41afbd7565cb7f75f1b9099de098a40e0798547c01f5425016",
  "linedance.dance_merges": "fe00ca2afd2d80fd3bbe5d66d5b3a1d1b69e5cadc7bc7f5e7ba99554df79e73e",
  "linedance.dances": "ffd4e1e654c5a3d285929b2a32981c4d2fc35d449a91e432678e4d1c432eb297",
  "linedance.levels": "b0e939a24c1bab3d9d233167091fbdb851332187b8fd124f75c3b7d67e62665e",
  "linedance.merge_candidates": "f2bb23540ba08f826865c7b99f72b6549bd70bc507a45c32cec928912c2f4937",
  "linedance.recordings": "18afb02682c760404a890e3316c39a789585fae6e8ad6697f20c16ec4e83d397",
  "linedance.track_aliases": "f52da50e3753b6f4c5565f8c38406f7b4c054f37a878203262e950bfd6bdee12",
  "linedance.track_links": "5592654f7029fcc168dd61790e8a6f9df82f4e56619d061c53e30a32f9abf8fe",
  "linedance.track_merge_candidates": "eda1026ea6ea36fa2a21641d68fe1233ebdffda28196aabf4f5f61fed5185eef",
  "linedance.track_merge_undos": "a7fe1d95bd677c7fdbd0b50b580a8d515ea10d3b9ca55381ab6127a6c7ab84a3",
  "linedance.track_merges": "7fff2a310850f251c0c63d71d151c5f2bd9ea6e4d44137735d7bfef7a707cf5c",
  "linedance.tracks": "3e0e045f10ca7e34ab432a6e73cfb97e20e63ae4bbdd4bcfb19152be08028641",
  "music_catalog.tracks": "108476379cc40c8264e23aba562c5151a8dc0c3af21498e7ed631a7a300d67fe"
};

// package.json
var version = "0.27.0";

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
  lessonPhase: z19.string().nullable().optional(),
  // declared in src/contract/declared-fields.ts
  copyOf: z19.string().optional()
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
  // declared in src/contract/declared-fields.ts
  linkedTo: z20.strictObject({ kind: z20.enum(["event", "eventType", "venue"]), id: z20.string() }).optional(),
  // declared in src/contract/declared-fields.ts
  allowDuplicates: z20.boolean().optional(),
  // declared in src/contract/declared-fields.ts
  directTipsEnabled: z20.boolean().optional(),
  // declared in src/contract/declared-fields.ts
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
  bio: z39.string().optional(),
  // declared in src/contract/declared-fields.ts
  image: z39.string().optional(),
  // declared in src/contract/declared-fields.ts
  createdAt: bsonDate.optional(),
  // declared in src/contract/declared-fields.ts
  updatedAt: bsonDate.optional()
  // declared in src/contract/declared-fields.ts
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
  lessonEventId: z59.string(),
  // declared in src/contract/declared-fields.ts
  guaranteedList: z59.array(z59.strictObject({ key: z59.string(), danceId: z59.string().nullable(), displayName: z59.string(), count: z59.number(), requestors: z59.array(z59.string()), difficulty: z59.string().nullable(), songName: z59.string().nullable(), songArtist: z59.string().nullable(), durationMs: z59.number().nullable(), weightedScore: z59.number().optional() })).nullable().optional(),
  // declared in src/contract/declared-fields.ts
  playlistFinalized: z59.boolean().optional()
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
var LdcoReviewsDancesSchema = z68.strictObject({
  _id: z68.string(),
  // declared in src/contract/declared-fields.ts
  danceName: z68.string(),
  // declared in src/contract/declared-fields.ts
  choreographers: z68.array(z68.string()),
  // declared in src/contract/declared-fields.ts
  difficulty: z68.string(),
  // declared in src/contract/declared-fields.ts
  stepsheet: z68.string().optional(),
  // declared in src/contract/declared-fields.ts
  stepsheetUrls: z68.array(z68.string()).optional(),
  // declared in src/contract/declared-fields.ts
  primaryTrack: z68.string(),
  // declared in src/contract/declared-fields.ts
  tracks: z68.array(z68.string()),
  // declared in src/contract/declared-fields.ts
  songArtists: z68.array(z68.strictObject({ song: z68.string(), artist: z68.string() })).optional(),
  // declared in src/contract/declared-fields.ts
  reviewKind: z68.enum(["unpublished"]).optional(),
  // declared in src/contract/declared-fields.ts
  unresolvedChoreographers: z68.array(z68.string()).optional(),
  // declared in src/contract/declared-fields.ts
  sourceEvent: z68.string().optional(),
  // declared in src/contract/declared-fields.ts
  createdBy: z68.string().optional(),
  // declared in src/contract/declared-fields.ts
  createdAt: bsonDate.optional()
  // declared in src/contract/declared-fields.ts
});

// src/contract/collections/ldco-reviews/instructor_venues.ts
import { z as z69 } from "zod";
var LdcoReviewsInstructorVenuesSchema = z69.strictObject({
  _id: z69.string(),
  // declared in src/contract/declared-fields.ts
  instructorId: z69.string(),
  // declared in src/contract/declared-fields.ts
  venueId: z69.string(),
  // declared in src/contract/declared-fields.ts
  createdAt: bsonDate,
  // declared in src/contract/declared-fields.ts
  updatedAt: bsonDate
  // declared in src/contract/declared-fields.ts
});

// src/contract/collections/ldco-reviews/instructors.ts
import { z as z70 } from "zod";
var LdcoReviewsInstructorsSchema = z70.strictObject({
  _id: z70.string(),
  // declared in src/contract/declared-fields.ts
  name: z70.string(),
  // declared in src/contract/declared-fields.ts
  bio: z70.string(),
  // declared in src/contract/declared-fields.ts
  image: z70.string(),
  // declared in src/contract/declared-fields.ts
  userId: z70.string(),
  // declared in src/contract/declared-fields.ts
  createdAt: bsonDate,
  // declared in src/contract/declared-fields.ts
  updatedAt: bsonDate
  // declared in src/contract/declared-fields.ts
});

// src/contract/collections/ldco-reviews/join_choreographer_appeals.ts
import { z as z71 } from "zod";
var LdcoReviewsJoinChoreographerAppealsSchema = z71.looseObject({ _id: z71.union([z71.string(), objectId]) });

// src/contract/collections/ldco-reviews/lessons.ts
import { z as z72 } from "zod";
var LdcoReviewsLessonsSchema = z72.strictObject({
  _id: objectId,
  lessonday: z72.string(),
  lessonstart: z72.string(),
  instructors: z72.array(z72.string()),
  duration: z72.string(),
  lessoncost: z72.string(),
  notes: z72.string(),
  difficulty: z72.string(),
  venueid: z72.string()
});

// src/contract/collections/ldco-reviews/reports.ts
import { z as z73 } from "zod";
var LdcoReviewsReportsSchema = z73.looseObject({ _id: z73.union([z73.string(), objectId]) });

// src/contract/collections/ldco-reviews/tracks.ts
import { z as z74 } from "zod";
var LdcoReviewsTracksSchema = z74.looseObject({ _id: z74.union([z74.string(), objectId]) });

// src/contract/collections/ldco-reviews/venue_users.ts
import { z as z75 } from "zod";
var LdcoReviewsVenueUsersSchema = z75.strictObject({
  _id: z75.string(),
  userId: z75.string(),
  venueId: z75.string(),
  createdAt: bsonDate,
  requestedBy: z75.string()
});

// src/contract/collections/ldco-reviews/venues.ts
import { z as z76 } from "zod";
var LdcoReviewsVenuesSchema = z76.strictObject({
  _id: z76.string(),
  venuename: z76.string(),
  venueaddress: z76.string(),
  geolocation: z76.array(z76.number()),
  phone: z76.string(),
  website: z76.string(),
  contactName: z76.string(),
  contactEmail: z76.string(),
  contactPhone: z76.string(),
  createdAt: bsonDate,
  timeZone: z76.string(),
  verifiedAt: z76.null(),
  verifiedBy: z76.null(),
  submittedBy: z76.string().optional()
  // declared in src/contract/declared-fields.ts
});

// src/contract/collections/ldco-reviews/verify_user_instructor.ts
import { z as z77 } from "zod";
var LdcoReviewsVerifyUserInstructorSchema = z77.strictObject({
  _id: z77.union([z77.string(), objectId]),
  // declared in src/contract/declared-fields.ts
  userId: z77.string(),
  instructorId: z77.string(),
  createdAt: bsonDate,
  resolved: z77.boolean(),
  resolution: z77.enum(["approve", "deny"]).optional(),
  // declared in src/contract/declared-fields.ts
  resolvedAt: bsonDate.optional(),
  // declared in src/contract/declared-fields.ts
  resolvedBy: z77.string().optional(),
  // declared in src/contract/declared-fields.ts
  kind: z77.enum(["claim", "new-profile"]).optional(),
  // declared in src/contract/declared-fields.ts
  provisionalInstructorId: z77.string().optional(),
  // declared in src/contract/declared-fields.ts
  requestedName: z77.string().optional(),
  // declared in src/contract/declared-fields.ts
  note: z77.string().optional()
  // declared in src/contract/declared-fields.ts
});

// src/contract/collections/linedance/choreographer_pair_reviews.ts
import { z as z78 } from "zod";
var LinedanceChoreographerPairReviewsSchema = z78.looseObject({ _id: z78.union([z78.string(), objectId]) });

// src/contract/collections/linedance/choreographers.ts
import { z as z79 } from "zod";
var LinedanceChoreographersSchema = z79.strictObject({
  _id: z79.string(),
  name: z79.string(),
  nameKey: z79.string(),
  aliases: z79.array(z79.string()),
  countries: z79.array(z79.string()),
  nameWords: z79.array(z79.string()).optional(),
  // declared in src/contract/declared-fields.ts
  ldcoIds: z79.array(z79.string()).optional(),
  mergedAt: bsonDate.optional(),
  mergedInto: z79.string().optional(),
  splitInto: z79.array(z79.string()).optional()
});

// src/contract/collections/linedance/dance_merge_undos.ts
import { z as z80 } from "zod";
var LinedanceDanceMergeUndosSchema = z80.looseObject({ _id: z80.union([z80.string(), objectId]) });

// src/contract/collections/linedance/dance_merges.ts
import { z as z81 } from "zod";
var LinedanceDanceMergesSchema = z81.strictObject({
  _id: z81.string(),
  into: z81.string(),
  rule: z81.string(),
  doc: z81.record(z81.string(), z81.unknown()),
  // declared in src/contract/declared-fields.ts
  at: bsonDate,
  by: z81.string().optional(),
  // declared in src/contract/declared-fields.ts
  candidateId: z81.string().optional(),
  // declared in src/contract/declared-fields.ts
  gained: z81.strictObject({ stepsheets: z81.array(z81.string()), ids: z81.array(z81.string()), filled: z81.record(z81.string(), z81.unknown()), before: z81.record(z81.string(), z81.unknown()) }).optional()
  // declared in src/contract/declared-fields.ts
});

// src/contract/collections/linedance/dances.ts
import { z as z82 } from "zod";
var LinedanceDancesSchema = z82.strictObject({
  _id: z82.string(),
  danceName: z82.string(),
  nameKey: z82.string(),
  count: z82.number().nullable(),
  wall: z82.number().nullable(),
  levels: z82.array(z82.string()),
  levelQualifier: z82.enum(["easy", "high", "low"]).nullable(),
  // declared in src/contract/declared-fields.ts
  phrased: z82.boolean(),
  danceType: z82.enum(["line", "partner", "contra", "circle", "chair"]),
  // declared in src/contract/declared-fields.ts
  levelRaw: z82.string().nullable(),
  choreographerIds: z82.array(z82.string()),
  credit: z82.string().nullable(),
  songArtists: z82.array(z82.strictObject({
    song: z82.string(),
    artist: z82.string()
  })),
  musicRaw: z82.string().nullable(),
  bpm: z82.number().nullable().optional(),
  introCounts: z82.number().nullable().optional(),
  hasTags: z82.boolean().nullable().optional(),
  hasRestarts: z82.boolean().nullable().optional(),
  hasBridge: z82.boolean().nullable().optional(),
  choreographedIn: z82.string().nullable().optional(),
  published: z82.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$/).nullable(),
  // declared in src/contract/declared-fields.ts
  publishedSource: z82.enum(["feed", "feed-archive", "sync-time", "id-estimate", "id-neighbours"]).nullable(),
  // declared in src/contract/declared-fields.ts
  stepsheets: z82.array(z82.strictObject({
    url: z82.string(),
    lang: z82.string().nullable(),
    title: z82.string().optional()
  })),
  tracks: z82.array(z82.strictObject({ trackId: z82.string(), versionNote: z82.string().optional(), recordingId: z82.string().optional() })).optional(),
  // declared in src/contract/declared-fields.ts
  notStated: z82.array(z82.string()).optional(),
  publishedBy: z82.string().optional(),
  rank: z82.number().optional(),
  // declared in src/contract/declared-fields.ts
  rankSignals: z82.strictObject({ usage: z82.number(), views: z82.number(), languages: z82.number(), recency: z82.number(), gaps: z82.number() }).optional(),
  // declared in src/contract/declared-fields.ts
  nameWords: z82.array(z82.string()).optional(),
  // declared in src/contract/declared-fields.ts
  dateKey: z82.string().nullable().optional(),
  year: z82.number().nullable().optional(),
  yearFrom: z82.enum(["choreographed", "published"]).nullable().optional(),
  // declared in src/contract/declared-fields.ts
  editedAt: bsonDate.optional(),
  editedBy: z82.string().optional(),
  editedFields: z82.array(z82.string()).optional(),
  mergedFrom: z82.array(z82.string()).optional(),
  ldcoIds: z82.array(z82.string()).optional(),
  unpublished: z82.boolean().optional(),
  unpublishedSource: z82.strictObject({
    event: z82.string(),
    createdBy: z82.string(),
    createdAt: bsonDate
  }).optional(),
  addedFrom: z82.strictObject({
    pendingDanceId: z82.string(),
    submittedByUserId: z82.string(),
    submittedAt: bsonDate
  }).optional(),
  createdAt: bsonDate.optional()
});

// src/contract/collections/linedance/levels.ts
import { z as z83 } from "zod";
var LinedanceLevelsSchema = z83.strictObject({
  _id: z83.string(),
  name: z83.string(),
  rank: z83.number(),
  aliases: z83.array(z83.string())
});

// src/contract/collections/linedance/merge_candidates.ts
import { z as z84 } from "zod";
var LinedanceMergeCandidatesSchema = z84.strictObject({
  _id: z84.string(),
  danceIds: z84.array(z84.string()),
  reason: z84.string(),
  confidence: z84.null(),
  status: z84.string(),
  resolvedAt: bsonDate.optional(),
  resolvedBy: z84.string().optional()
});

// src/contract/collections/linedance/recordings.ts
import { z as z85 } from "zod";
var LinedanceRecordingsSchema = z85.strictObject({
  _id: z85.string(),
  artist: z85.string(),
  createdAt: bsonDate,
  disambiguation: z85.string(),
  durationMs: z85.number().nullable(),
  fetchedAt: bsonDate,
  isrcs: z85.array(z85.string()),
  releaseCount: z85.number(),
  source: z85.string(),
  sourceId: z85.string(),
  title: z85.string(),
  version: z85.string(),
  year: z85.number().nullable()
});

// src/contract/collections/linedance/track_aliases.ts
import { z as z86 } from "zod";
var LinedanceTrackAliasesSchema = z86.strictObject({
  _id: z86.string(),
  createdAt: bsonDate,
  source: z86.string(),
  trackId: z86.string()
});

// src/contract/collections/linedance/track_links.ts
import { z as z87 } from "zod";
var LinedanceTrackLinksSchema = z87.strictObject({
  _id: z87.string(),
  checkedAt: bsonDate.nullable(),
  // declared in src/contract/declared-fields.ts
  confidence: z87.enum(["high", "probable"]),
  // declared in src/contract/declared-fields.ts
  createdAt: bsonDate,
  matchedBy: z87.string(),
  provider: z87.enum(["spotify", "apple"]),
  // declared in src/contract/declared-fields.ts
  providerId: z87.string(),
  recordingId: z87.string().nullable(),
  source: z87.string(),
  trackId: z87.string(),
  updatedAt: bsonDate,
  url: z87.string(),
  confirmedBy: z87.array(z87.string()).optional(),
  kind: z87.string().optional(),
  rank: z87.number().optional(),
  movedFrom: z87.string().optional()
  // declared in src/contract/declared-fields.ts
});

// src/contract/collections/linedance/track_merge_candidates.ts
import { z as z88 } from "zod";
var LinedanceTrackMergeCandidatesSchema = z88.strictObject({
  _id: z88.string(),
  createdAt: bsonDate,
  reason: z88.string(),
  status: z88.string(),
  trackIds: z88.array(z88.string()),
  updatedAt: bsonDate
});

// src/contract/collections/linedance/track_merge_undos.ts
import { z as z89 } from "zod";
var LinedanceTrackMergeUndosSchema = z89.looseObject({ _id: z89.union([z89.string(), objectId]) });

// src/contract/collections/linedance/track_merges.ts
import { z as z90 } from "zod";
var LinedanceTrackMergesSchema = z90.strictObject({
  _id: z90.string(),
  at: bsonDate,
  into: z90.string(),
  key: z90.string().nullable(),
  // declared in src/contract/declared-fields.ts
  reason: z90.string(),
  by: z90.string().optional(),
  // declared in src/contract/declared-fields.ts
  movedDances: z90.array(z90.string()).optional()
  // declared in src/contract/declared-fields.ts
});

// src/contract/collections/linedance/tracks.ts
import { z as z91 } from "zod";
var LinedanceTracksSchema = z91.strictObject({
  _id: z91.string(),
  artist: z91.string(),
  createdAt: bsonDate,
  danceCount: z91.number().optional(),
  key: z91.string(),
  matchStatus: z91.string().optional(),
  recordingConfidence: z91.string().optional(),
  recordingId: z91.string().nullable().optional(),
  songMatch: z91.string().nullable().optional(),
  title: z91.string(),
  updatedAt: bsonDate,
  versions: z91.array(z91.string()).optional(),
  mergedInto: z91.string().optional()
});

// src/contract/collections/music_catalog/tracks.ts
import { z as z92 } from "zod";
var MusicCatalogTracksSchema = z92.strictObject({
  _id: z92.string(),
  artist: z92.string(),
  createdAt: bsonDate,
  disambiguation: z92.string(),
  durationMs: z92.number().nullable(),
  isrcs: z92.array(z92.string()),
  nArtist: z92.string(),
  nTitle: z92.string(),
  rank: z92.number(),
  rankedAt: bsonDate.optional(),
  source: z92.string(),
  sourceId: z92.string(),
  title: z92.string(),
  updatedAt: bsonDate,
  variantKey: z92.string(),
  words: z92.array(z92.string()),
  year: z92.number().nullable()
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
  "ldco-reviews.instructor_venues": { database: "ldco-reviews", name: "instructor_venues", schema: LdcoReviewsInstructorVenuesSchema },
  "ldco-reviews.instructors": { database: "ldco-reviews", name: "instructors", schema: LdcoReviewsInstructorsSchema },
  "ldco-reviews.join_choreographer_appeals": { database: "ldco-reviews", name: "join_choreographer_appeals", schema: LdcoReviewsJoinChoreographerAppealsSchema },
  "ldco-reviews.lessons": { database: "ldco-reviews", name: "lessons", schema: LdcoReviewsLessonsSchema },
  "ldco-reviews.reports": { database: "ldco-reviews", name: "reports", schema: LdcoReviewsReportsSchema },
  "ldco-reviews.tracks": { database: "ldco-reviews", name: "tracks", schema: LdcoReviewsTracksSchema },
  "ldco-reviews.venue_users": { database: "ldco-reviews", name: "venue_users", schema: LdcoReviewsVenueUsersSchema },
  "ldco-reviews.venues": { database: "ldco-reviews", name: "venues", schema: LdcoReviewsVenuesSchema },
  "ldco-reviews.verify_user_instructor": { database: "ldco-reviews", name: "verify_user_instructor", schema: LdcoReviewsVerifyUserInstructorSchema },
  "linedance.choreographer_pair_reviews": { database: "linedance", name: "choreographer_pair_reviews", schema: LinedanceChoreographerPairReviewsSchema },
  "linedance.choreographers": { database: "linedance", name: "choreographers", schema: LinedanceChoreographersSchema },
  "linedance.dance_merge_undos": { database: "linedance", name: "dance_merge_undos", schema: LinedanceDanceMergeUndosSchema },
  "linedance.dance_merges": { database: "linedance", name: "dance_merges", schema: LinedanceDanceMergesSchema },
  "linedance.dances": { database: "linedance", name: "dances", schema: LinedanceDancesSchema },
  "linedance.levels": { database: "linedance", name: "levels", schema: LinedanceLevelsSchema },
  "linedance.merge_candidates": { database: "linedance", name: "merge_candidates", schema: LinedanceMergeCandidatesSchema },
  "linedance.recordings": { database: "linedance", name: "recordings", schema: LinedanceRecordingsSchema },
  "linedance.track_aliases": { database: "linedance", name: "track_aliases", schema: LinedanceTrackAliasesSchema },
  "linedance.track_links": { database: "linedance", name: "track_links", schema: LinedanceTrackLinksSchema },
  "linedance.track_merge_candidates": { database: "linedance", name: "track_merge_candidates", schema: LinedanceTrackMergeCandidatesSchema },
  "linedance.track_merge_undos": { database: "linedance", name: "track_merge_undos", schema: LinedanceTrackMergeUndosSchema },
  "linedance.track_merges": { database: "linedance", name: "track_merges", schema: LinedanceTrackMergesSchema },
  "linedance.tracks": { database: "linedance", name: "tracks", schema: LinedanceTracksSchema },
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

// src/catalogue/keys.ts
var keyOf = (s) => String(s ?? "").normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/&/g, " and ").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
function nameKeyOf(name) {
  const latin = String(name ?? "").replace(
    /[([]([^)\]]*)[)\]]/g,
    (all, inner) => /[^\p{Script=Latin}\p{N}\p{P}\p{S}\p{Z}]/u.test(inner) ? " " : all
  );
  return keyOf(latin) || keyOf(name);
}
var nameWordsOf = (nameKey) => [...new Set(String(nameKey ?? "").split(" ").filter(Boolean))];

// src/catalogue/resolve.ts
var byAnyId = (ids) => ({ $or: [{ _id: { $in: ids } }, { ldcoIds: { $in: ids } }] });
function matchIds(ids, docs) {
  const own = new Map(docs.map((d) => [String(d._id), d]));
  const old = /* @__PURE__ */ new Map();
  for (const d of docs) for (const x of d.ldcoIds ?? []) if (!old.has(String(x))) old.set(String(x), d);
  return new Map(ids.map((id) => [id, own.get(id) ?? old.get(id) ?? null]));
}
var unique = (ids) => [...new Set(ids.filter((x) => typeof x === "string" && x))];
async function resolveDances(db, ids, projection) {
  const want = unique(ids);
  if (!want.length) return /* @__PURE__ */ new Map();
  const docs = await db.collection("dances").find(byAnyId(want), projection ? { projection: { ...projection, ldcoIds: 1 } } : {}).toArray();
  return matchIds(want, docs);
}
async function resolveChoreographers(db, ids, projection) {
  const want = unique(ids);
  if (!want.length) return /* @__PURE__ */ new Map();
  const people = db.collection("choreographers");
  const proj = projection ? { projection: { ...projection, ldcoIds: 1, mergedInto: 1 } } : {};
  const out = matchIds(want, await people.find(byAnyId(want), proj).toArray());
  for (let hop = 0; hop < 5; hop++) {
    const next = unique([...out.values()].map((d) => d?.mergedInto ?? "").filter(Boolean));
    if (!next.length) break;
    const kept = new Map((await people.find({ _id: { $in: next } }, proj).toArray()).map((d) => [String(d._id), d]));
    for (const [id, d] of out) if (d?.mergedInto) out.set(id, kept.get(String(d.mergedInto)) ?? null);
  }
  return out;
}

// src/catalogue/search.ts
var SEARCH_PAGE_SIZE = 50;
var TIER_LIMIT = 2e3;
var esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
var MATCH_POINTS = { id: 1e3, name: 300, start: 200, word: 150, choreographer: 100, song: 80 };
var LISTED_DANCES = { unpublished: { $ne: true } };
var wordStarts = (w) => ({ $or: [{ nameWords: new RegExp(`^${esc(w)}`) }, { nameWords: null, nameKey: new RegExp(`(^| )${esc(w)}`) }] });
async function searchDances(db, options = {}) {
  const { q: q2 = "", filter = {}, page: rawPage = 0, pageSize = SEARCH_PAGE_SIZE, projection, trace } = options;
  const points = { ...MATCH_POINTS, ...options.matchPoints };
  const dances = db.collection("dances");
  const note = (t) => trace?.push(t);
  const text = q2.trim();
  const page = Math.max(0, Math.floor(rawPage));
  const skip = page * pageSize;
  const sort = { rank: -1, nameKey: 1 };
  let ids = [];
  let total = 0;
  let more = false;
  const kindOf = /* @__PURE__ */ new Map();
  if (!text) {
    note({ label: "count", collection: "dances", kind: "count", filter });
    note({ label: "page by rank", collection: "dances", kind: "find", filter, sort, skip, limit: pageSize, projection: { _id: 1 } });
    const [n, docs2] = await Promise.all([
      dances.countDocuments(filter),
      dances.find(filter, { projection: { _id: 1 } }).sort(sort).skip(skip).limit(pageSize).toArray()
    ]);
    total = n;
    ids = docs2.map((d) => String(d._id));
  } else {
    const kinds = [];
    if (/^https?:\/\//i.test(text)) kinds.push(["id", { "stepsheets.url": text }]);
    else if (/^[0-9a-f]{24}$/i.test(text)) kinds.push(["id", { $or: [{ _id: text }, { ldcoIds: text }] }]);
    else {
      const key = nameKeyOf(text);
      if (key) {
        const words = key.split(" ").filter(Boolean);
        kinds.push(["name", { nameKey: key }]);
        kinds.push(["start", { nameKey: new RegExp(`^${esc(key)}`) }]);
        kinds.push(["word", words.length > 1 ? { $and: words.map(wordStarts) } : wordStarts(key)]);
        const pk = keyOf(text);
        const peopleFilter = { mergedInto: { $exists: false }, ...pk.includes(" ") ? { nameKey: new RegExp(`(^| )${esc(pk)}`), ...wordStarts(pk.split(" ")[0]) } : wordStarts(pk) };
        note({ label: "choreographers named", collection: "choreographers", kind: "find", filter: peopleFilter, limit: 300, projection: { _id: 1 } });
        const people2 = await db.collection("choreographers").find(peopleFilter, { projection: { _id: 1 } }).limit(300).toArray();
        if (people2.length) kinds.push(["choreographer", { choreographerIds: { $in: people2.map((p) => String(p._id)) } }]);
        const trackFilter = { key: new RegExp(`^${esc(pk)}`) };
        note({ label: "songs titled", collection: "tracks", kind: "find", filter: trackFilter, limit: 1e3, projection: { _id: 1 } });
        const tracks = await db.collection("tracks").find(trackFilter, { projection: { _id: 1 } }).limit(1e3).toArray();
        if (tracks.length) kinds.push(["song", { "tracks.trackId": { $in: tracks.map((t) => String(t._id)) } }]);
      }
    }
    const score = /* @__PURE__ */ new Map();
    for (const [kind, match] of kinds) {
      const hint = kind === "name" || kind === "start" ? { nameKey: 1 } : void 0;
      const q22 = { $and: [match, filter] };
      note({ label: `match: ${kind}`, collection: "dances", kind: "find", filter: q22, sort, limit: TIER_LIMIT, projection: { _id: 1, rank: 1 }, hint });
      let cursor = dances.find(q22, { projection: { _id: 1, rank: 1 } });
      if (hint) cursor = cursor.hint(hint);
      const found = await cursor.sort(sort).limit(TIER_LIMIT).toArray();
      if (found.length === TIER_LIMIT) more = true;
      for (const d of found) {
        const id = String(d._id);
        const scored = points[kind] + (d.rank ?? 0);
        if ((score.get(id) ?? -1) < scored) {
          score.set(id, scored);
          kindOf.set(id, kind);
        }
      }
    }
    const ranked = [...score].sort((a, b) => b[1] - a[1]).map(([id]) => id);
    total = ranked.length;
    ids = ranked.slice(skip, skip + pageSize);
  }
  note({ label: "the page's dances", collection: "dances", kind: "find", filter: { _id: { $in: ids } }, projection });
  const docs = new Map(
    (await dances.find({ _id: { $in: ids } }, projection ? { projection: { ...projection, choreographerIds: 1 } } : {}).toArray()).map((d) => [String(d._id), d])
  );
  const list = ids.map((id) => docs.get(id)).filter((d) => !!d);
  const people = [...new Set(list.flatMap((d) => d.choreographerIds ?? []))];
  note({ label: "their choreographers' names", collection: "choreographers", kind: "find", filter: { _id: { $in: people } }, projection: { name: 1 } });
  const names = people.length ? Object.fromEntries((await db.collection("choreographers").find({ _id: { $in: people } }, { projection: { name: 1 } }).toArray()).map((c) => [String(c._id), String(c.name)])) : {};
  return { total, more, page, pageSize, choreographers: names, dances: list.map((d) => ({ ...d, match: kindOf.get(String(d._id)) ?? null })) };
}

// src/catalogue/edit.ts
var LEVEL_QUALIFIERS = ["easy", "high", "low"];
var DANCE_TYPES = ["line", "partner", "contra", "circle", "chair"];
var PUBLISHED = /^\d{4}(-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?)?$/;
var CHOREOGRAPHED = /^\d{4}(-(0[1-9]|1[0-2]))?$/;
var STATABLE = ["level", "count", "wall", "choreographer", "choreographedIn"];
var GAPS = [
  { id: "level", label: "No level", core: true, filter: { levels: { $size: 0 }, notStated: { $ne: "level" } } },
  { id: "count", label: "No count", core: true, filter: { count: null, notStated: { $ne: "count" } } },
  { id: "wall", label: "No wall", core: true, filter: { wall: null, notStated: { $ne: "wall" } } },
  { id: "choreographer", label: "No choreographer", core: true, filter: { choreographerIds: { $size: 0 }, notStated: { $ne: "choreographer" } } },
  // When it was choreographed, from the credit ("- August 2021"); a credit that gives no date is "not stated"
  { id: "choreographedIn", label: "No choreographed date", core: true, filter: { choreographedIn: null, notStated: { $ne: "choreographedIn" } } },
  { id: "song", label: "No song", core: true, filter: { songArtists: { $size: 0 } } },
  { id: "stepsheet", label: "No stepsheet", core: true, filter: { stepsheets: { $size: 0 }, unpublished: { $ne: true } } },
  { id: "published", label: "No publish date", core: true, filter: { published: null } },
  { id: "estimated", label: "Estimated date", core: false, filter: { publishedSource: "id-estimate" } },
  { id: "yearOnly", label: "Year-only date", core: false, filter: { published: /^\d{4}$/ } },
  { id: "translationOnly", label: "Translations only", core: false, filter: { "stepsheets.0": { $exists: true }, stepsheets: { $not: { $elemMatch: { lang: null } } } } },
  { id: "notStated", label: "Not stated on the stepsheet", core: false, filter: { "notStated.0": { $exists: true } } },
  { id: "unpublished", label: "Not on copperknob yet", core: false, filter: { unpublished: true } },
  { id: "edited", label: "Edited by hand", core: false, filter: { "editedFields.0": { $exists: true } } }
];
function gapsOf(d) {
  const gaps = [];
  const stated = (f) => !d.notStated?.includes(f);
  if (!d.levels?.length && stated("level")) gaps.push("level");
  if (d.count == null && stated("count")) gaps.push("count");
  if (d.wall == null && stated("wall")) gaps.push("wall");
  if (!d.choreographerIds?.length && stated("choreographer")) gaps.push("choreographer");
  if (!d.choreographedIn && stated("choreographedIn")) gaps.push("choreographedIn");
  if (!d.songArtists?.length) gaps.push("song");
  if (!d.stepsheets?.length && !d.unpublished) gaps.push("stepsheet");
  if (!d.published) gaps.push("published");
  return gaps;
}
var escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function danceFilter({ gaps = [], q: q2, lang, level, danceType, choreographerId }) {
  const and = [];
  for (const id of gaps) {
    const gap = GAPS.find((g) => g.id === id);
    if (gap) and.push(gap.filter);
  }
  const text = q2?.trim();
  if (text) {
    if (/^https?:\/\//i.test(text)) and.push({ "stepsheets.url": text });
    else {
      const key = nameKeyOf(text);
      if (key) and.push({ nameKey: new RegExp(`^${escapeRegex(key)}`) });
    }
  }
  if (lang) and.push({ "stepsheets.lang": lang });
  if (level) and.push({ levels: level });
  if (danceType) and.push({ danceType });
  if (choreographerId) and.push({ choreographerIds: choreographerId });
  return and.length ? { $and: and } : {};
}
var CATALOGUE_PAGE_SIZE = 50;
async function listDances(db, query, page) {
  const dances = db.collection("dances");
  const filter = danceFilter(query);
  const [total, docs] = await Promise.all([
    dances.countDocuments(filter),
    dances.find(filter).sort({ nameKey: 1 }).skip(Math.max(0, page) * CATALOGUE_PAGE_SIZE).limit(CATALOGUE_PAGE_SIZE).toArray()
  ]);
  const ids = [...new Set(docs.flatMap((d) => d.choreographerIds ?? []))];
  const choreographers = await db.collection("choreographers").find({ _id: { $in: ids } }).project({ name: 1 }).toArray();
  return {
    total,
    pageSize: CATALOGUE_PAGE_SIZE,
    choreographers: Object.fromEntries(choreographers.map((c) => [c._id, c.name])),
    dances: docs.map((d) => ({ ...d, gaps: gapsOf(d) }))
  };
}
async function catalogueStats(db) {
  const dances = db.collection("dances");
  const total = await dances.countDocuments();
  const [gaps, complete, byLanguage, byLevel, candidates, choreographers, levels] = await Promise.all([
    Promise.all(GAPS.map(async (g) => ({ id: g.id, label: g.label, core: g.core, count: await dances.countDocuments(g.filter) }))),
    dances.countDocuments({ $nor: GAPS.filter((g) => g.core).map((g) => g.filter) }),
    dances.aggregate([{ $unwind: "$stepsheets" }, { $match: { "stepsheets.lang": { $ne: null } } }, { $group: { _id: "$stepsheets.lang", n: { $sum: 1 } } }, { $sort: { n: -1 } }]).toArray(),
    dances.aggregate([{ $unwind: "$levels" }, { $group: { _id: "$levels", n: { $sum: 1 } } }]).toArray(),
    db.collection("merge_candidates").countDocuments({ status: "open" }),
    db.collection("choreographers").countDocuments({ mergedInto: { $exists: false } }),
    db.collection("levels").find({}).sort({ rank: 1 }).toArray()
  ]);
  return {
    total,
    complete,
    gaps,
    openMergeCandidates: candidates,
    choreographers,
    languages: byLanguage.map((l) => ({ id: l._id, count: l.n })),
    levels: levels.map((l) => ({ id: l._id, name: l.name, aliases: l.aliases, count: byLevel.find((x) => x._id === l._id)?.n ?? 0 }))
  };
}
var wholeOrNull = (v, min, max) => v === null || Number.isInteger(v) && v >= min && v <= max;
function cleanDancePatch(body, levelIds) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return { ok: false, error: "Nothing to save." };
  const set = {};
  for (const [field, value] of Object.entries(body)) {
    switch (field) {
      case "danceName": {
        const name = typeof value === "string" ? value.trim() : "";
        if (!name) return { ok: false, error: "A dance needs a name." };
        set.danceName = name;
        set.nameKey = nameKeyOf(name);
        set.nameWords = nameWordsOf(set.nameKey);
        break;
      }
      case "count":
        if (!wholeOrNull(value, 0, 2e3)) return { ok: false, error: "Count must be a whole number, or blank." };
        set.count = value;
        break;
      case "wall":
        if (!wholeOrNull(value, 0, 8)) return { ok: false, error: "Wall must be a whole number from 0 to 8, or blank." };
        set.wall = value;
        break;
      case "introCounts":
        if (!wholeOrNull(value, 0, 999)) return { ok: false, error: "Intro must be a whole number, or blank." };
        set.introCounts = value;
        break;
      case "levels":
        if (!Array.isArray(value) || !value.every((l) => levelIds.includes(l))) return { ok: false, error: "Unknown level." };
        set.levels = [...new Set(value)].sort((a, b) => levelIds.indexOf(a) - levelIds.indexOf(b));
        break;
      case "levelQualifier":
        if (value !== null && !LEVEL_QUALIFIERS.includes(value)) return { ok: false, error: "Unknown level qualifier." };
        set.levelQualifier = value;
        break;
      case "phrased":
        if (typeof value !== "boolean") return { ok: false, error: "Phrased must be yes or no." };
        set.phrased = value;
        break;
      case "danceType":
        if (!DANCE_TYPES.includes(value)) return { ok: false, error: "Unknown dance type." };
        set.danceType = value;
        break;
      case "hasTags":
      case "hasRestarts":
      case "hasBridge":
        if (value !== null && typeof value !== "boolean") return { ok: false, error: `${field} must be yes, no or unknown.` };
        set[field] = value;
        break;
      case "choreographerIds":
        if (!Array.isArray(value) || !value.every((c) => typeof c === "string" && c)) return { ok: false, error: "Bad choreographer list." };
        set.choreographerIds = [...new Set(value)];
        break;
      case "songArtists": {
        if (!Array.isArray(value)) return { ok: false, error: "Bad song list." };
        const songs = value.map((s) => ({ song: String(s?.song ?? "").trim(), artist: String(s?.artist ?? "").trim() }));
        if (songs.some((s) => !s.song || !s.artist)) return { ok: false, error: "A song needs a title and an artist." };
        set.songArtists = songs;
        break;
      }
      case "choreographedIn":
        if (value === null || value === "") set.choreographedIn = null;
        else if (typeof value === "string" && CHOREOGRAPHED.test(value.trim())) set.choreographedIn = value.trim();
        else return { ok: false, error: "Choreographed date must be YYYY or YYYY-MM." };
        break;
      case "published":
        if (value === null || value === "") {
          set.published = null;
          set.publishedSource = null;
        } else {
          if (typeof value !== "string" || !PUBLISHED.test(value.trim())) return { ok: false, error: "Publish date must be YYYY, YYYY-MM or YYYY-MM-DD." };
          set.published = value.trim();
          set.publishedSource = "manual";
        }
        break;
      case "stepsheets": {
        if (!Array.isArray(value)) return { ok: false, error: "Bad stepsheet list." };
        const sheets = [];
        for (const s of value) {
          const url = String(s?.url ?? "").trim();
          if (!/^https?:\/\/\S+$/i.test(url)) return { ok: false, error: `Not a web address: ${url || "(blank)"}` };
          const lang = s?.lang ? String(s.lang).trim().toLowerCase() : null;
          if (lang && !/^[a-z]{2}$/.test(lang)) return { ok: false, error: `Language must be a two-letter code: ${lang}` };
          if (sheets.some((x) => x.url === url)) return { ok: false, error: `Listed twice: ${url}` };
          sheets.push({ url, lang, ...s?.title ? { title: String(s.title) } : {} });
        }
        set.stepsheets = sheets;
        break;
      }
      default:
        return { ok: false, error: `${field} can't be edited here.` };
    }
  }
  return Object.keys(set).length ? { ok: true, set } : { ok: false, error: "Nothing to save." };
}
function yearFields(d) {
  const pick = d.choreographedIn ? ["choreographed", d.choreographedIn] : d.published ? ["published", d.published] : null;
  const m = pick && /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/.exec(pick[1]);
  if (!pick || !m) return { year: null, yearFrom: null, dateKey: null };
  return { year: Number(m[1]), yearFrom: pick[0], dateKey: m[3] ? `${m[1]}-${m[2]}-${m[3]}` : m[2] ? `${m[1]}-${m[2]}-31` : `${m[1]}-12-31` };
}
var sameValue = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
function filledStatable(changed) {
  const filled = [];
  if (changed.levels?.length) filled.push("level");
  if (changed.count != null) filled.push("count");
  if (changed.wall != null) filled.push("wall");
  if (changed.choreographerIds?.length) filled.push("choreographer");
  if (changed.choreographedIn) filled.push("choreographedIn");
  return filled;
}
async function updateDance(db, id, body, by) {
  const dances = db.collection("dances");
  const current = await dances.findOne({ _id: id });
  if (!current) return { status: 404, error: "That dance doesn't exist." };
  const levelIds = (await db.collection("levels").find({}).sort({ rank: 1 }).toArray()).map((l) => l._id);
  const clean = cleanDancePatch(body, levelIds);
  if (!clean.ok) return { status: 400, error: clean.error };
  const changed = Object.fromEntries(Object.entries(clean.set).filter(([k, v]) => !sameValue(v, current[k])));
  if (!("published" in changed)) delete changed.publishedSource;
  if (!("danceName" in changed)) {
    delete changed.nameKey;
    delete changed.nameWords;
  }
  if (!Object.keys(changed).length) return { status: 200, dance: { ...current, gaps: gapsOf(current) }, changed: [] };
  if (changed.choreographerIds?.length) {
    const found = await db.collection("choreographers").countDocuments({ _id: { $in: changed.choreographerIds } });
    if (found !== changed.choreographerIds.length) return { status: 400, error: "One of those choreographers doesn't exist." };
  }
  if (changed.stepsheets?.length) {
    const urls = changed.stepsheets.map((s) => s.url);
    const other = await dances.findOne({ _id: { $ne: id }, "stepsheets.url": { $in: urls } }, { projection: { danceName: 1 } });
    if (other) return { status: 409, error: `Another dance already has that stepsheet: ${other.danceName}` };
  }
  const fields = Object.keys(changed).filter((f) => f !== "nameKey" && f !== "nameWords" && f !== "publishedSource");
  const filled = filledStatable(changed);
  const dates = "choreographedIn" in changed || "published" in changed ? yearFields({ ...current, ...changed }) : {};
  const res = await dances.updateOne(
    { _id: id },
    { $set: { ...changed, ...dates, editedAt: /* @__PURE__ */ new Date(), editedBy: by }, $addToSet: { editedFields: { $each: fields } }, ...filled.length ? { $pull: { notStated: { $in: filled } } } : {} }
  );
  const updated = res.matchedCount ? await dances.findOne({ _id: id }) : null;
  if (!updated) return { status: 404, error: "That dance doesn't exist." };
  return { status: 200, dance: { ...updated, gaps: gapsOf(updated) }, changed: fields };
}
async function searchChoreographers(db, q2) {
  const key = keyOf(q2);
  if (!key) return [];
  return db.collection("choreographers").find({ mergedInto: { $exists: false }, $or: [{ nameKey: new RegExp(`^${escapeRegex(key)}`) }, { aliases: new RegExp(`^${escapeRegex(q2.trim())}`, "i") }] }).sort({ nameKey: 1 }).limit(15).project({ name: 1, aliases: 1 }).toArray();
}
async function findOrCreateChoreographer(db, rawName, newId) {
  const name = typeof rawName === "string" ? rawName.replace(/\s+/g, " ").trim() : "";
  const nameKey = keyOf(name);
  if (!nameKey) return { error: "A choreographer needs a name." };
  const col = db.collection("choreographers");
  let known = await col.findOne({ $or: [{ nameKey }, { aliases: name }] });
  for (let hops = 0; known?.mergedInto && hops < 5; hops++) known = await col.findOne({ _id: known.mergedInto });
  if (known) return { choreographer: { _id: known._id, name: known.name }, created: false };
  await col.insertOne({ _id: newId, name, nameKey, aliases: [], countries: [] });
  return { choreographer: { _id: newId, name }, created: true };
}

// src/catalogue/review.ts
var FILL = ["count", "wall", "credit", "musicRaw", "bpm", "introCounts", "hasTags", "hasRestarts", "hasBridge", "choreographedIn", "published", "publishedSource", "publishedBy"];
var LEVEL = ["levels", "levelQualifier", "phrased", "danceType", "levelRaw"];
var STATED = {
  count: (d) => d.count != null,
  wall: (d) => d.wall != null,
  level: (d) => !!d.levels?.length,
  choreographer: (d) => !!d.choreographerIds?.length,
  choreographedIn: (d) => !!d.choreographedIn
};
var blank = (v) => v == null || Array.isArray(v) && !v.length || v === "";
var facts = (d) => ["count", "wall", "published", "credit", "bpm"].filter((f) => d[f] != null).length + (d.levels?.length ? 1 : 0) + (d.songArtists?.length ? 1 : 0);
var sheetId = (u) => /stepsheets\/([^/?#]+)/i.exec(u ?? "")?.[1] ?? "";
function suggestKeep(dances) {
  const sorted = [...dances].sort((a, b) => Number(b.stepsheets?.some((s) => !s.lang) ?? false) - Number(a.stepsheets?.some((s) => !s.lang) ?? false) || facts(b) - facts(a) || (/^\d+$/.test(sheetId(b.stepsheets?.[0]?.url)) ? 1 : 0) - (/^\d+$/.test(sheetId(a.stepsheets?.[0]?.url)) ? 1 : 0) || Number(sheetId(a.stepsheets?.[0]?.url)) - Number(sheetId(b.stepsheets?.[0]?.url)) || String(a._id).localeCompare(String(b._id)));
  return sorted[0] ? String(sorted[0]._id) : null;
}
function planCatalogueMerge(keep, others) {
  const set = {};
  const urls = new Set((keep.stepsheets ?? []).map((s) => s.url));
  const stepsheets = [...keep.stepsheets ?? []];
  for (const o of others) for (const s of o.stepsheets ?? []) if (!urls.has(s.url)) {
    urls.add(s.url);
    stepsheets.push(s);
  }
  if (stepsheets.length !== (keep.stepsheets ?? []).length) set.stepsheets = stepsheets;
  const k = keep;
  for (const f of FILL) if (blank(k[f])) {
    const from = others.find((o) => !blank(o[f]));
    if (from) set[f] = from[f];
  }
  if (!keep.levels?.length) {
    const from = others.find((o) => o.levels?.length);
    if (from) for (const f of LEVEL) set[f] = from[f] ?? null;
  }
  if (!keep.songArtists?.length) {
    const from = others.find((o) => o.songArtists?.length);
    if (from) set.songArtists = from.songArtists;
  }
  if (!keep.tracks?.length) {
    const from = others.find((o) => o.tracks?.length);
    if (from) set.tracks = from.tracks;
  }
  if (!keep.choreographerIds?.length) {
    const from = others.find((o) => o.choreographerIds?.length);
    if (from) set.choreographerIds = from.choreographerIds;
  }
  if (keep.unpublished && others.some((o) => !o.unpublished)) set.unpublished = false;
  if ("choreographedIn" in set || "published" in set) Object.assign(set, yearFields({ ...keep, ...set }));
  const after = { ...keep, ...set };
  const notStated = [...new Set([keep, ...others].flatMap((d) => d.notStated ?? []))].filter((f) => STATED[f] && !STATED[f](after)).sort();
  if (JSON.stringify(notStated) !== JSON.stringify([...keep.notStated ?? []].sort())) set.notStated = notStated;
  const ids = [...new Set(others.flatMap((o) => [o._id, ...o.ldcoIds ?? [], ...o.mergedFrom ?? []]).map(String))];
  return { set, addIds: ids };
}
var summary = { danceName: 1, count: 1, wall: 1, levels: 1, levelQualifier: 1, danceType: 1, choreographerIds: 1, songArtists: 1, choreographedIn: 1, published: 1, publishedSource: 1, publishedBy: 1, stepsheets: 1, unpublished: 1, notStated: 1, credit: 1, editedFields: 1 };
async function listDanceCandidates(db, { reason, page = 0, size = 20 }) {
  const col = db.collection("merge_candidates");
  const filter = { status: "open", ...reason ? { reason } : {} };
  const [reasons, total, rows] = await Promise.all([
    col.aggregate([{ $match: { status: "open" } }, { $group: { _id: "$reason", n: { $sum: 1 } } }, { $sort: { n: -1 } }]).toArray(),
    col.countDocuments(filter),
    col.find(filter).sort({ _id: 1 }).skip(page * size).limit(size).toArray()
  ]);
  const dances = new Map((await db.collection("dances").find({ _id: { $in: rows.flatMap((r) => r.danceIds) } }, { projection: summary }).toArray()).map((d) => [String(d._id), d]));
  const names = Object.fromEntries((await db.collection("choreographers").find({ _id: { $in: [...dances.values()].flatMap((d) => d.choreographerIds ?? []) } }, { projection: { name: 1 } }).toArray()).map((c) => [String(c._id), c.name]));
  return {
    reasons: reasons.map((r) => ({ reason: r._id, n: r.n })),
    total,
    pageSize: size,
    candidates: rows.map((r) => {
      const ds = r.danceIds.map((id) => dances.get(String(id))).filter((d) => !!d);
      return {
        _id: r._id,
        reason: r.reason,
        missing: r.danceIds.filter((id) => !dances.has(String(id))),
        suggestedKeep: suggestKeep(ds),
        dances: ds.map((d) => ({ ...d, choreographers: (d.choreographerIds ?? []).map((c) => names[String(c)] ?? c) }))
      };
    })
  };
}
async function keepApart(db, candidateId, by) {
  const r = await db.collection("merge_candidates").updateOne({ _id: candidateId, status: "open" }, { $set: { status: "rejected", resolvedAt: /* @__PURE__ */ new Date(), resolvedBy: by } });
  return r.matchedCount ? { status: 200 } : { status: 404, error: "That candidate isn't open any more." };
}
async function mergeCandidate(db, candidateId, keepId, mergeIds, by) {
  const candidates = db.collection("merge_candidates");
  const cand = await candidates.findOne({ _id: candidateId, status: "open" });
  if (!cand) return { status: 404, error: "That candidate isn't open any more." };
  const ids = cand.danceIds.map(String);
  const merge = [...new Set(mergeIds.map(String))].filter((id) => id !== keepId);
  if (!ids.includes(keepId) || !merge.length || merge.some((id) => !ids.includes(id))) return { status: 400, error: "Pick the record to keep and at least one other from this group." };
  const dances = db.collection("dances");
  const keep = await dances.findOne({ _id: keepId });
  const others = await dances.find({ _id: { $in: merge } }).toArray();
  if (!keep || others.length !== merge.length) return { status: 409, error: "One of these dances has changed or gone. Reload and try again." };
  const now = await mergeDanceRecords(db, keep, others, by, "reviewed: same dance", candidateId);
  const into = new Map(merge.map((id) => [id, keepId]));
  const rest = [...new Set(ids.map((id) => into.get(id) ?? id))];
  if (rest.length < 2) await candidates.updateOne({ _id: candidateId }, { $set: { status: "merged", resolvedAt: now, resolvedBy: by } });
  return { status: 200, kept: keepId, merged: merge.length, remaining: rest.length };
}
async function mergeDanceRecords(db, keep, others, by, rule, candidateId) {
  const dances = db.collection("dances");
  const candidates = db.collection("merge_candidates");
  const keepId = String(keep._id);
  const merge = others.map((o) => String(o._id));
  const { set, addIds } = planCatalogueMerge(keep, others);
  const now = /* @__PURE__ */ new Date();
  const k = keep;
  const filledKeys = Object.keys(set).filter((f) => !["stepsheets", "notStated", "unpublished"].includes(f));
  const gained = {
    stepsheets: (set.stepsheets ?? []).map((s) => s.url).filter((u) => !(keep.stepsheets ?? []).some((s) => s.url === u)),
    ids: addIds,
    filled: Object.fromEntries(filledKeys.map((f) => [f, set[f]])),
    before: Object.fromEntries(filledKeys.map((f) => [f, k[f] ?? null]))
  };
  await db.collection("dance_merges").bulkWrite(others.map((o) => ({ replaceOne: { filter: { _id: o._id }, replacement: { into: keep._id, rule, ...candidateId ? { candidateId } : {}, by, doc: o, gained, at: now }, upsert: true } })));
  await dances.updateOne({ _id: keepId }, { ...Object.keys(set).length ? { $set: { ...set, editedAt: now, editedBy: by } } : {}, $addToSet: { ldcoIds: { $each: addIds }, mergedFrom: { $each: addIds } } });
  await dances.deleteMany({ _id: { $in: merge } });
  const into = new Map(merge.map((id) => [id, keepId]));
  for (const c of await candidates.find({ status: "open", danceIds: { $in: merge } }).toArray()) {
    const list = [...new Set(c.danceIds.map((id) => into.get(String(id)) ?? String(id)))];
    await candidates.updateOne({ _id: c._id }, { $set: list.length < 2 ? { danceIds: list, status: "merged", resolvedAt: now, resolvedBy: by } : { danceIds: list } });
  }
  return now;
}

// src/catalogue/rank.ts
var RANK_WEIGHTS = { usage: 0.4, views: 0.3, languages: 0.12, recency: 0.12, complete: 0.06 };
var RANK_USAGE_POINTS = { lesson: 3, feedLesson: 3, requested: 1, played: 1, known: 1, favorite: 2, refresh: 1, interested: 1, collection: 1 };
var RANK_RECENT_MONTHS = 18;
var RANK_CORE_FACTS = ["level", "count", "wall", "choreographer", "song", "stepsheet"];
var RANK_CAP_QUANTILE = 0.995;
var RANK_LANGUAGES_CAP_MIN = 5;
var clamp = (x) => Math.max(0, Math.min(1, x));
var logScale = (n, cap) => n && n > 0 && cap > 0 ? clamp(Math.log1p(n) / Math.log1p(cap)) : 0;
function capOf(values, q2 = RANK_CAP_QUANTILE) {
  const pos = values.filter((v) => v > 0).sort((a, b) => a - b);
  return pos.length ? pos[Math.min(pos.length - 1, Math.floor(q2 * (pos.length - 1)))] : 0;
}
function monthsOld(dateKey, now = /* @__PURE__ */ new Date()) {
  const t = Date.parse(dateKey ?? "");
  return Number.isNaN(t) ? null : Math.max(0, (now.getTime() - t) / (30.44 * 864e5));
}
var recencyOf = (months, recentMonths = RANK_RECENT_MONTHS) => months == null ? 0 : clamp(1 - months / Math.max(1, recentMonths));
function coreGaps(d) {
  const stated = (f) => !(d.notStated ?? []).includes(f);
  const gaps = [];
  if (!d.levels?.length && stated("level")) gaps.push("level");
  if (d.count == null && stated("count")) gaps.push("count");
  if (d.wall == null && stated("wall")) gaps.push("wall");
  if (!d.choreographerIds?.length && stated("choreographer")) gaps.push("choreographer");
  if (!d.songArtists?.length) gaps.push("song");
  if (!d.stepsheets?.length && !d.unpublished) gaps.push("stepsheet");
  return gaps;
}
var languagesOf = (d) => new Set((d.stepsheets ?? []).map((s) => s.lang).filter(Boolean)).size;
function rankOf(signals, caps, weights = RANK_WEIGHTS, recentMonths = RANK_RECENT_MONTHS) {
  const parts = {
    usage: logScale(signals.usage, caps.usage),
    views: logScale(signals.views, caps.views),
    languages: logScale(signals.languages, caps.languages),
    recency: recencyOf(signals.monthsOld, recentMonths),
    complete: clamp(1 - (signals.gaps ?? 0) / RANK_CORE_FACTS.length)
  };
  const score = Object.keys(weights).reduce((sum, k) => sum + weights[k] * parts[k], 0);
  return { rank: Math.round(score * 1e3), parts };
}
async function rankCaps(db) {
  const one = async (f) => {
    const [r] = await db.collection("dances").aggregate([
      { $match: { [`rankSignals.${f}`]: { $gt: 0 } } },
      { $group: { _id: null, p: { $percentile: { input: `$rankSignals.${f}`, p: [RANK_CAP_QUANTILE], method: "approximate" } } } }
    ]).toArray();
    return r?.p?.[0] ?? 0;
  };
  return { usage: await one("usage"), views: await one("views"), languages: Math.max(RANK_LANGUAGES_CAP_MIN, await one("languages")) };
}
var partExpr = (field, cap) => cap > 0 ? { $min: [1, { $divide: [{ $ln: { $add: [1, { $ifNull: [`$rankSignals.${field}`, 0] }] } }, Math.log1p(cap)] }] } : 0;
function rankExpressions(caps, weights = RANK_WEIGHTS, recentMonths = RANK_RECENT_MONTHS, now = /* @__PURE__ */ new Date()) {
  const months = {
    $divide: [{ $dateDiff: { startDate: { $dateFromString: { dateString: "$dateKey", onError: null, onNull: null } }, endDate: now, unit: "day" } }, 30.44]
  };
  const parts = {
    usage: partExpr("usage", caps.usage),
    views: partExpr("views", caps.views),
    languages: partExpr("languages", caps.languages),
    recency: {
      $let: {
        vars: { m: months },
        in: { $cond: [{ $eq: ["$$m", null] }, 0, { $max: [0, { $min: [1, { $subtract: [1, { $divide: [{ $max: [0, "$$m"] }, Math.max(1, recentMonths)] }] }] }] }] }
      }
    },
    complete: { $max: [0, { $subtract: [1, { $divide: [{ $ifNull: ["$rankSignals.gaps", 0] }, RANK_CORE_FACTS.length] }] }] }
  };
  const rank = { $round: [{ $multiply: [1e3, { $add: Object.keys(weights).map((k) => ({ $multiply: [weights[k], `$_rankParts.${k}`] })) }] }, 0] };
  return { parts, rank };
}

// src/dances/merge.ts
var q = (filter) => filter;
function normalizeName(s) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/&/g, " and ").replace(/['‘’`´]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}
function nameKeys(name) {
  const keys = [normalizeName(name), normalizeName(name.replace(/\([^)]*\)/g, " "))].filter(Boolean);
  return [...new Set(keys)];
}
function findUnpublishedMatch(dance, candidates) {
  const keys = new Set(nameKeys(dance.title));
  const ids = new Set(dance.choreographerIds);
  const names = new Set(dance.choreographerNames.map(normalizeName));
  const matches = candidates.filter(
    (c) => nameKeys(c.danceName).some((k) => keys.has(k)) && ((c.choreographers ?? []).some((id) => ids.has(id)) || (c.unresolvedChoreographers ?? []).some((n) => names.has(normalizeName(n))))
  );
  return matches.length === 1 ? matches[0] : void 0;
}
var strings = (v) => Array.isArray(v) ? v.filter((x) => typeof x === "string" && x !== "") : [];
function mergedDance(keep, other) {
  const location = keep.location === "ldco" || other.location === "ldco" ? "ldco" : "ldco-reviews";
  const [base, fill] = keep.location === "ldco-reviews" && other.location === "ldco" ? [other.doc, keep.doc] : [keep.doc, other.doc];
  const stepsheet = base.stepsheet || fill.stepsheet || "";
  const stepsheetUrls = [.../* @__PURE__ */ new Set([...strings([base.stepsheet]), ...strings(base.stepsheetUrls), ...strings([fill.stepsheet]), ...strings(fill.stepsheetUrls)])].filter((u) => u !== stepsheet);
  const hasTrack = Boolean(base.primaryTrack);
  const doc = {
    _id: keep.doc._id,
    danceName: base.danceName || fill.danceName,
    difficulty: base.difficulty || fill.difficulty || "",
    choreographers: strings(base.choreographers).length ? strings(base.choreographers) : strings(fill.choreographers),
    stepsheet,
    stepsheetUrls,
    primaryTrack: hasTrack ? base.primaryTrack : fill.primaryTrack || "",
    tracks: hasTrack ? strings(base.tracks) : strings(fill.tracks)
  };
  const songArtists = base.songArtists?.length ? base.songArtists : fill.songArtists;
  if (songArtists?.length) doc.songArtists = songArtists;
  const dated = base.published ? base : fill.published ? fill : null;
  if (dated) {
    if (dated.publishedAt) doc.publishedAt = dated.publishedAt;
    doc.published = dated.published;
    if (dated.publishedSource) doc.publishedSource = dated.publishedSource;
  }
  if (location === "ldco-reviews") {
    for (const k of ["reviewKind", "sourceEvent", "createdBy", "createdAt"]) if (keep.doc[k] !== void 0) doc[k] = keep.doc[k];
    const unresolved = [.../* @__PURE__ */ new Set([...strings(keep.doc.unresolvedChoreographers), ...strings(other.doc.unresolvedChoreographers)])];
    if (unresolved.length) doc.unresolvedChoreographers = unresolved;
  }
  return { doc, location };
}
function replaceId(ids, from, to) {
  return [...new Set(ids.map((id) => id === from ? to : id))];
}
var OWNED_ROWS = [
  { db: "ldco", coll: "user_known_dances", owner: "userId" },
  { db: "ldco", coll: "user_favorite_dances", owner: "userId" },
  { db: "ldco", coll: "user_flagged_dances", owner: "userId" },
  { db: "ldco", coll: "user_refresh_dances", owner: "userId" },
  { db: "ldco", coll: "dance_tracks", owner: "trackId" },
  { db: "feed", coll: "feed_lessons", owner: "sessionId" }
];
var FLAT_REFS = [
  { db: "lessons", coll: "lessons" },
  { db: "bld", coll: "lessons" },
  { db: "feed", coll: "dj_requests" }
];
var NESTED_REFS = [
  { db: "lessons", coll: "events", array: "lessons" },
  { db: "bld", coll: "events", array: "lessons" },
  { db: "feed", coll: "requester_history", array: "requests" },
  { db: "feed", coll: "session_reports", array: "playedTracks" },
  { db: "events", coll: "event_registrations", array: "requests" }
];
var USER_ARRAYS = ["favorites", "known", "flagged", "refresh"];
async function countReferences(dbs, danceId) {
  const counts = [];
  const add = async (db, coll, filter) => {
    const count = await dbs[db].collection(coll).countDocuments(q(filter));
    if (count) counts.push({ collection: `${dbs[db].databaseName}.${coll}`, count });
  };
  await add("ldco", "dance_collections", { danceIds: danceId });
  await add("ldco", "users", { $or: [...USER_ARRAYS.map((k) => ({ [k]: danceId })), { "collections.danceIds": danceId }] });
  for (const r of OWNED_ROWS) await add(r.db, r.coll, { danceId });
  for (const r of FLAT_REFS) await add(r.db, r.coll, { danceId });
  for (const r of NESTED_REFS) await add(r.db, r.coll, { [`${r.array}.danceId`]: danceId });
  return counts;
}
async function repointReferences(dbs, fromId, keepId) {
  const changed = [];
  const note = (db, coll, count) => {
    if (count) changed.push({ collection: `${dbs[db].databaseName}.${coll}`, count });
  };
  const collections3 = dbs.ldco.collection("dance_collections");
  let n = 0;
  for (const c of await collections3.find(q({ danceIds: fromId })).toArray()) {
    await collections3.updateOne(q({ _id: c._id }), { $set: { danceIds: replaceId(strings(c.danceIds), fromId, keepId) } });
    n++;
  }
  note("ldco", "dance_collections", n);
  const users = dbs.ldco.collection("users");
  n = 0;
  for (const u of await users.find(q({ $or: [...USER_ARRAYS.map((k) => ({ [k]: fromId })), { "collections.danceIds": fromId }] })).toArray()) {
    const set = {};
    for (const k of USER_ARRAYS) if (Array.isArray(u[k]) && u[k].includes(fromId)) set[k] = replaceId(u[k], fromId, keepId);
    if (Array.isArray(u.collections) && u.collections.some((c) => strings(c.danceIds).includes(fromId))) {
      set.collections = u.collections.map((c) => ({ ...c, danceIds: replaceId(strings(c.danceIds), fromId, keepId) }));
    }
    await users.updateOne(q({ _id: u._id }), { $set: set });
    n++;
  }
  note("ldco", "users", n);
  for (const r of OWNED_ROWS) {
    const coll = dbs[r.db].collection(r.coll);
    n = 0;
    for (const row of await coll.find(q({ danceId: fromId })).toArray()) {
      const duplicate = await coll.findOne(q({ [r.owner]: row[r.owner], danceId: keepId }));
      if (duplicate) await coll.deleteOne(q({ _id: row._id }));
      else await coll.updateOne(q({ _id: row._id }), { $set: { danceId: keepId } });
      n++;
    }
    note(r.db, r.coll, n);
  }
  for (const r of FLAT_REFS) {
    const res = await dbs[r.db].collection(r.coll).updateMany(q({ danceId: fromId }), { $set: { danceId: keepId } });
    note(r.db, r.coll, res.modifiedCount);
  }
  for (const r of NESTED_REFS) {
    const res = await dbs[r.db].collection(r.coll).updateMany(
      q({ [`${r.array}.danceId`]: fromId }),
      { $set: { [`${r.array}.$[x].danceId`]: keepId } },
      { arrayFilters: [{ "x.danceId": fromId }] }
    );
    note(r.db, r.coll, res.modifiedCount);
  }
  return changed;
}
async function findDance(dbs, id) {
  const published = await dbs.ldco.collection("dances").findOne(q({ _id: id }));
  if (published) return { doc: published, location: "ldco" };
  const review = await dbs.reviews.collection("dances").findOne(q({ _id: id }));
  return review ? { doc: review, location: "ldco-reviews" } : null;
}
async function planDanceMerge(dbs, keepId, otherId) {
  if (!keepId || !otherId || keepId === otherId) throw new Error("Choose two different dances.");
  const [keep, other] = await Promise.all([findDance(dbs, keepId), findDance(dbs, otherId)]);
  if (!keep) throw new Error(`Dance ${keepId} no longer exists.`);
  if (!other) throw new Error(`Dance ${otherId} no longer exists.`);
  return { keep, other, result: mergedDance(keep, other), references: await countReferences(dbs, otherId) };
}
async function mergeDances(dbs, keepId, otherId) {
  const { keep, other, result } = await planDanceMerge(dbs, keepId, otherId);
  const target = result.location === "ldco" ? dbs.ldco : dbs.reviews;
  const stepsheetClash = other.location === "ldco" && !!result.doc.stepsheet && other.doc.stepsheet === result.doc.stepsheet && result.location === "ldco";
  await target.collection("dances").replaceOne(q({ _id: keepId }), stepsheetClash ? { ...result.doc, stepsheet: "" } : result.doc, { upsert: true });
  const repointed = await repointReferences(dbs, otherId, keepId);
  await (other.location === "ldco" ? dbs.ldco : dbs.reviews).collection("dances").deleteOne(q({ _id: otherId }));
  if (stepsheetClash) await dbs.ldco.collection("dances").updateOne(q({ _id: keepId }), { $set: { stepsheet: result.doc.stepsheet } });
  if (keep.location === "ldco-reviews" && result.location === "ldco") await dbs.reviews.collection("dances").deleteOne(q({ _id: keepId }));
  return { keepId, removedId: otherId, location: result.location, repointed };
}

// src/contract/index.ts
var CONTRACT_VERSION = version;
function computeContractHash() {
  const description = Object.entries(collections2).sort(([a], [b]) => a.localeCompare(b)).map(([key, c]) => [key, c.database, c.name, z93.toJSONSchema(c.schema, { unrepresentable: "any" })]);
  return createHash("sha256").update(JSON.stringify(description)).digest("hex");
}
function computeCollectionHashes() {
  return Object.fromEntries(
    Object.entries(collections2).sort(([a], [b]) => a.localeCompare(b)).map(([key, c]) => [
      key,
      createHash("sha256").update(JSON.stringify([key, c.database, c.name, z93.toJSONSchema(c.schema, { unrepresentable: "any" })])).digest("hex")
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
  LdcoReviewsInstructorVenuesSchema,
  LdcoReviewsInstructorsSchema,
  LdcoReviewsJoinChoreographerAppealsSchema,
  LdcoReviewsLessonsSchema,
  LdcoReviewsReportsSchema,
  LdcoReviewsTracksSchema,
  LdcoReviewsVenueUsersSchema,
  LdcoReviewsVenuesSchema,
  LdcoReviewsVerifyUserInstructorSchema,
  LinedanceChoreographerPairReviewsSchema,
  LinedanceChoreographersSchema,
  LinedanceDanceMergeUndosSchema,
  LinedanceDanceMergesSchema,
  LinedanceDancesSchema,
  LinedanceLevelsSchema,
  LinedanceMergeCandidatesSchema,
  LinedanceRecordingsSchema,
  LinedanceTrackAliasesSchema,
  LinedanceTrackLinksSchema,
  LinedanceTrackMergeCandidatesSchema,
  LinedanceTrackMergeUndosSchema,
  LinedanceTrackMergesSchema,
  LinedanceTracksSchema,
  MusicCatalogTracksSchema,
  collections2 as collections,
  inScope,
  unmatchedEntries,
  scopeFromPackageJson,
  keyOf,
  nameKeyOf,
  nameWordsOf,
  byAnyId,
  matchIds,
  resolveDances,
  resolveChoreographers,
  SEARCH_PAGE_SIZE,
  MATCH_POINTS,
  LISTED_DANCES,
  searchDances,
  LEVEL_QUALIFIERS,
  DANCE_TYPES,
  STATABLE,
  GAPS,
  gapsOf,
  danceFilter,
  CATALOGUE_PAGE_SIZE,
  listDances,
  catalogueStats,
  cleanDancePatch,
  yearFields,
  filledStatable,
  updateDance,
  searchChoreographers,
  findOrCreateChoreographer,
  suggestKeep,
  planCatalogueMerge,
  listDanceCandidates,
  keepApart,
  mergeCandidate,
  mergeDanceRecords,
  RANK_WEIGHTS,
  RANK_USAGE_POINTS,
  RANK_RECENT_MONTHS,
  RANK_CORE_FACTS,
  RANK_CAP_QUANTILE,
  RANK_LANGUAGES_CAP_MIN,
  logScale,
  capOf,
  monthsOld,
  recencyOf,
  coreGaps,
  languagesOf,
  rankOf,
  rankCaps,
  rankExpressions,
  normalizeName,
  nameKeys,
  findUnpublishedMatch,
  mergedDance,
  replaceId,
  countReferences,
  findDance,
  planDanceMerge,
  mergeDances,
  CONTRACT_VERSION,
  computeContractHash,
  computeCollectionHashes,
  CONTRACT_HASH,
  COLLECTION_HASHES
};
