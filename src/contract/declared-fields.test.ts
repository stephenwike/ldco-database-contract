import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { ObjectId } from "mongodb";
import { applyDeclaredFields, applyDeclaredToModule } from "./apply-declared";
import {
  CopperknobAlertProcessedItemsSchema,
  CopperknobAlertWatchRulesSchema,
  DjfeedDjRequestsSchema,
  DjfeedDjSessionsSchema,
  DjfeedSessionReportsSchema,
  LdcoDancesSchema,
  LdcoLessonsEventTemplatesSchema,
  LdcoLessonsEventTypesSchema,
  LdcoLessonsEventsSchema,
  LdcoLessonsLessonsSchema,
  LdcoLessonsSchema,
  LdcoInstructorsSchema,
  LdcoReviewsInstructorVenuesSchema,
  LdcoReviewsInstructorsSchema,
  LdcoReviewsVenuesSchema,
  LdcoReviewsVerifyUserInstructorSchema,
  LdcoVenuesSchema,
  collections,
} from "./collections";
import { declaredCollections, declaredFields } from "./declared-fields";
import { CONTRACT_HASH, CONTRACT_VERSION, computeContractHash } from "./index";
import { maskDocument } from "../server/mask";

const at = new Date("2026-10-27T18:00:00Z");

function accept(schema: { safeParse(value: unknown): { success: boolean; error?: { issues: unknown[] } } }, value: unknown) {
  const result = schema.safeParse(value);
  assert.equal(result.success, true, result.success ? "" : JSON.stringify(result.error?.issues));
}

function reject(schema: { safeParse(value: unknown): { success: boolean } }, value: unknown) {
  assert.equal(schema.safeParse(value).success, false);
}

test("declared fields are already applied to the collection modules", () => {
  for (const [key, fields] of Object.entries(declaredFields)) {
    const dot = key.indexOf(".");
    const path = `src/contract/collections/${key.slice(0, dot)}/${key.slice(dot + 1)}.ts`;
    // A Windows checkout (core.autocrlf) has CRLF; the generator writes LF.
    const source = readFileSync(path, "utf8").replace(/\r\n/g, "\n");
    assert.equal(applyDeclaredToModule(source, fields), source, key);
  }
});

test("inserting into an array element keeps the closing brace's indent", () => {
  const body = `z.strictObject({
  playedTracks: z.array(z.strictObject({
    danceName: z.string(),
    requesters: z.array(z.strictObject({
      clientId: z.string(),
    })),
  })),
})`;
  const next = applyDeclaredFields(body, { "playedTracks[].lesson": "z.string().optional()" });
  assert.match(next, /\n    lesson: z\.string\(\)\.optional\(\), \/\/ declared in src\/contract\/declared-fields\.ts\n  \}\)\),/);
  assert.equal(applyDeclaredFields(next, { "playedTracks[].lesson": "z.string().optional()" }), next);
});

test("contract version is 0.22.0 and matches the lock", () => {
  assert.equal(CONTRACT_VERSION, "0.22.0");
  assert.equal(computeContractHash(), CONTRACT_HASH);
  const lock = JSON.parse(readFileSync("contract.lock.json", "utf8")) as { version: string };
  assert.equal(lock.version, "0.22.0");
});

test("dj_requests.lessonPhase is an optional string or null", () => {
  const base = {
    _id: new ObjectId(),
    sessionId: "s",
    ownerId: "o",
    danceId: null,
    danceName: "Dance",
    songName: "Song",
    artist: "Artist",
    difficulty: "Improver",
    stepsheet: "",
    duration_ms: null,
    clientId: "c",
    requesterName: "Ada",
    notes: "",
    status: "queued",
    queuePosition: 1,
    createdAt: at,
    updatedAt: at,
  };
  accept(DjfeedDjRequestsSchema, base);
  accept(DjfeedDjRequestsSchema, { ...base, lessonPhase: "teach" });
  accept(DjfeedDjRequestsSchema, { ...base, lessonPhase: null });
  reject(DjfeedDjRequestsSchema, { ...base, lessonPhase: 1 });
  reject(DjfeedDjRequestsSchema, { ...base, notAField: true });
  // Allow Duplicates: the queued request a pending one was queued with.
  accept(DjfeedDjRequestsSchema, { ...base, copyOf: "6a1b2c3d4e5f60718293a4b5" });
  reject(DjfeedDjRequestsSchema, { ...base, copyOf: null });
});

test("dj_sessions.durationMinutes is nullable and extensions is an optional array", () => {
  const base = {
    _id: new ObjectId(),
    ownerId: "o",
    name: "Friday",
    status: "closed",
    startedAt: at,
    closedAt: at,
  };
  accept(DjfeedDjSessionsSchema, base);
  accept(DjfeedDjSessionsSchema, { ...base, durationMinutes: 90 });
  accept(DjfeedDjSessionsSchema, { ...base, durationMinutes: null });
  accept(DjfeedDjSessionsSchema, { ...base, extensions: [] });
  accept(DjfeedDjSessionsSchema, { ...base, extensions: [{ minutes: 15 }] });
  reject(DjfeedDjSessionsSchema, { ...base, durationMinutes: "90" });
  reject(DjfeedDjSessionsSchema, { ...base, extensions: null });
  accept(DjfeedDjSessionsSchema, { ...base, allowDuplicates: true });
  reject(DjfeedDjSessionsSchema, { ...base, allowDuplicates: "yes" });
  accept(DjfeedDjSessionsSchema, { ...base, tippingEnabled: false, directTipsEnabled: true });
  reject(DjfeedDjSessionsSchema, { ...base, directTipsEnabled: 1 });
});

test("session report played rows may carry a lesson marker", () => {
  const track = {
    danceName: "Dance",
    danceId: null,
    songName: "Song",
    artist: "Artist",
    difficulty: "Improver",
    danceType: null,
    partnerStyle: null,
    playedAt: at,
    requesters: [{ clientId: "c", requesterName: "Ada", tipCents: 0 }],
    totalTips: 0,
    requesterCount: 1,
  };
  const report = {
    _id: new ObjectId(),
    sessionId: "s",
    actualDurationMs: 1,
    autoClosedAt: null,
    closedAt: at,
    endsAt: at,
    extensions: [],
    generatedAt: at,
    ownerId: "o",
    playedTracks: [track],
    sessionName: "Friday",
    startedAt: at,
    stats: {
      totalDancesPlayed: 1,
      totalRequests: 1,
      totalApproved: 1,
      totalSkipped: 0,
      totalPending: 0,
      approvalRate: 1,
      totalTipCents: 0,
      uniqueRequesters: 1,
    },
  };
  accept(DjfeedSessionReportsSchema, report);
  accept(DjfeedSessionReportsSchema, { ...report, playedTracks: [{ ...track, lesson: "teach" }] });
  accept(DjfeedSessionReportsSchema, { ...report, playedTracks: [{ ...track, lesson: true }] });
  accept(DjfeedSessionReportsSchema, { ...report, playedTracks: [{ ...track, lesson: null }] });
  reject(DjfeedSessionReportsSchema, { ...report, playedTracks: [{ ...track, lesson: 1 }] });
  reject(DjfeedSessionReportsSchema, { ...report, playedTracks: [{ ...track, lesson: { phase: "teach" } }] });
});

test("verifiedAt / verifiedBy accept a Date and a user id, or null", () => {
  const venue = {
    _id: "v",
    venuename: "Charlie's",
    venueaddress: "Denver",
    geolocation: [0, 0],
    phone: "",
    website: "",
    timeZone: "America/Denver",
    verifiedAt: null,
    verifiedBy: null,
  };
  accept(LdcoVenuesSchema, venue);
  accept(LdcoVenuesSchema, { ...venue, verifiedAt: at, verifiedBy: "user-1" });
  reject(LdcoVenuesSchema, { ...venue, verifiedAt: at.toISOString() });

  const lesson = {
    _id: "l",
    lessonday: "Monday",
    lessonstart: "19:00",
    instructors: ["i"],
    duration: "60",
    lessoncost: "10",
    notes: "",
    difficulty: "Improver",
    venueid: "v",
    verifiedAt: null,
    verifiedBy: null,
  };
  accept(LdcoLessonsSchema, lesson);
  accept(LdcoLessonsSchema, { ...lesson, verifiedAt: at, verifiedBy: "user-1" });

  const eventType = {
    _id: "t",
    createdAt: at,
    createdBy: "i",
    defaultDurationMinutes: 60,
    defaultStartTime: "19:00",
    isActive: true,
    level: "Improver",
    price: "10",
    title: "Charlies",
    updatedAt: at,
    venueId: "v",
    verifiedAt: null,
    verifiedBy: null,
  };
  accept(LdcoLessonsEventTypesSchema, eventType);
  accept(LdcoLessonsEventTypesSchema, { ...eventType, verifiedAt: at, verifiedBy: "user-1" });
});

function storedEvent(over: Record<string, unknown> = {}) {
  return {
    _id: "e",
    cancelNote: null,
    createdAt: at,
    date: "2026-10-27",
    endAt: at,
    eventTypeId: "t",
    isCancelled: false,
    lessons: [
      {
        _id: "slot",
        startAt: at,
        dance: null,
        danceId: null,
        level: null,
        link: null,
        committed: false,
        skipped: false,
      },
    ],
    specialNote: null,
    startAt: at,
    substitute: null,
    substituteInstructorId: null,
    timeZone: "America/Denver",
    updatedAt: at,
    verifiedAt: null,
    verifiedBy: null,
    ...over,
  };
}

test("events keep recurring rows valid and accept special events", () => {
  accept(LdcoLessonsEventsSchema, storedEvent());
  accept(LdcoLessonsEventsSchema, storedEvent({ substituteInstructorId: "inst-2", verifiedAt: at, verifiedBy: "user-1" }));
  const { eventTypeId: _omit, ...special } = storedEvent({ title: "Workshop", venueId: "v", createdBy: "i" });
  accept(LdcoLessonsEventsSchema, special);
  accept(LdcoLessonsEventsSchema, storedEvent({ eventTypeId: null, title: "Workshop", venueId: "v", createdBy: "i" }));
  reject(LdcoLessonsEventsSchema, storedEvent({ substituteInstructorId: 1 }));
});

test("history lessonId and template links are strings or null", () => {
  const row = {
    _id: "h",
    date: at,
    eventId: null,
    instructorId: "i",
    lessonId: null,
    venue: "Charlie's",
    venueId: "v",
  };
  accept(LdcoLessonsLessonsSchema, row);
  accept(LdcoLessonsLessonsSchema, { ...row, lessonId: "slot" });
  reject(LdcoLessonsLessonsSchema, { ...row, lessonId: 1 });

  const template = {
    _id: "tpl",
    createdAt: at,
    eventTypeId: "t",
    isDefault: true,
    lessons: [{ time: "19:00", dance: null, level: null, link: null }],
    name: "Default",
    updatedAt: at,
  };
  accept(LdcoLessonsEventTemplatesSchema, template);
  accept(LdcoLessonsEventTemplatesSchema, {
    ...template,
    lessons: [{ time: "19:00", dance: "Dance", level: "Improver", link: "https://example.com/steps" }],
  });
});

test("watch rules may omit choreographer and may set a webhook", () => {
  const rule = {
    _id: new ObjectId(),
    id: "rule-1",
    checkIntervalMinutes: 30,
    danceName: "Dance",
    fuzzyThreshold: 0.8,
    lastCheckedAt: "2026-10-27T00:00:00.000Z",
  };
  accept(CopperknobAlertWatchRulesSchema, rule);
  accept(CopperknobAlertWatchRulesSchema, { ...rule, choreographer: "Jo" });
  accept(CopperknobAlertWatchRulesSchema, { ...rule, notifyWebhookUrl: "https://example.com/hook" });
  reject(CopperknobAlertWatchRulesSchema, { ...rule, notifyWebhookUrl: null });
});

test("processed item choreographer may be an empty string", () => {
  const item = {
    _id: new ObjectId(),
    guid: "g",
    danceTitle: "Dance",
    details: { method: "fuzzy", score: 1, choreographer: "" },
    matchedRule: "rule-1",
    processedAt: at,
    status: "alerted",
    submitUrl: "https://example.com/submit",
    youtubeUrl: null,
  };
  accept(CopperknobAlertProcessedItemsSchema, item);
  accept(CopperknobAlertProcessedItemsSchema, { ...item, details: { ...item.details, choreographer: "Jo" } });
  reject(CopperknobAlertProcessedItemsSchema, { ...item, details: { method: "fuzzy", score: 1 } });
});

test("ldco.dances.published stays a calendar string", () => {
  const dance = {
    _id: "d",
    difficulty: "Improver",
    tracks: [],
    primaryTrack: "",
    danceName: "Dance",
    choreographers: [],
  };
  accept(LdcoDancesSchema, dance);
  accept(LdcoDancesSchema, { ...dance, published: "2026-10-27", publishedSource: "feed", publishedAt: at });
  reject(LdcoDancesSchema, { ...dance, published: true });
});

test("notifyWebhookUrl is masked in the dashboard", () => {
  const masked = maskDocument({ notifyWebhookUrl: "https://hooks.example/secret", danceName: "Dance" }) as {
    notifyWebhookUrl: string;
    danceName: string;
  };
  assert.equal(masked.notifyWebhookUrl, "[masked string]");
  assert.equal(masked.danceName, "Dance");
});

test("every declared collection is declared in full and registered", () => {
  for (const key of declaredCollections) {
    assert.ok(declaredFields[key]?._id, `${key} declares _id`);
    assert.ok(key in collections, `${key} is in the contract`);
  }
});

test("provisional instructor profiles and venue links", () => {
  const profile = { _id: "p1", name: "Ada", bio: "", image: "", userId: "u1", createdAt: at, updatedAt: at };
  accept(LdcoReviewsInstructorsSchema, profile);
  reject(LdcoReviewsInstructorsSchema, { ...profile, userId: undefined });
  // Approval copies the profile whole into ldco.instructors
  accept(LdcoInstructorsSchema, profile);
  accept(LdcoInstructorsSchema, { _id: "i1", name: "Ada" });
  accept(LdcoReviewsInstructorVenuesSchema, { _id: "l1", instructorId: "p1", venueId: "v1", createdAt: at, updatedAt: at });
});

test("review venues may record who submitted them", () => {
  const venue = {
    _id: "v1",
    venuename: "Hall",
    venueaddress: "1 Main St",
    geolocation: [0, 0],
    phone: "",
    website: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    createdAt: at,
    timeZone: "America/Denver",
    verifiedAt: null,
    verifiedBy: null,
  };
  accept(LdcoReviewsVenuesSchema, venue);
  accept(LdcoReviewsVenuesSchema, { ...venue, submittedBy: "u1" });
});

test("instructor requests: older resolved claims, pending claims and new profiles", () => {
  accept(LdcoReviewsVerifyUserInstructorSchema, {
    _id: new ObjectId(),
    userId: "u1",
    instructorId: "i1",
    createdAt: at,
    resolved: true,
    resolution: "approve",
    resolvedAt: at,
    resolvedBy: "admin",
  });
  const pending = {
    _id: new ObjectId().toHexString(),
    userId: "u1",
    kind: "new-profile",
    instructorId: "p1",
    provisionalInstructorId: "p1",
    requestedName: "Ada",
    createdAt: at,
    resolved: false,
  };
  accept(LdcoReviewsVerifyUserInstructorSchema, pending);
  accept(LdcoReviewsVerifyUserInstructorSchema, { ...pending, kind: "claim", instructorId: "i1", note: "Not the other Ada" });
  reject(LdcoReviewsVerifyUserInstructorSchema, { ...pending, kind: "transfer" });
  reject(LdcoReviewsVerifyUserInstructorSchema, { ...pending, resolution: "maybe" });
});
