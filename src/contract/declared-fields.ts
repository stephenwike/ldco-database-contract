// Fields the generator must keep even when a sample of documents doesn't show them (decision 22).
// scripts/infer-contract.ts applies every entry here on top of what it inferred:
// a missing path is inserted, and a path it did see is replaced with this expression.
// Values are zod source text; objectId and bsonDate from ../bson are available.
// Paths use dots, and `[]` for an array element (`playedTracks[].lesson`).

export const declaredFields: Record<string, Record<string, string>> = {
  // Publish dates at the precision the evidence supports (decision 22, amended). publishedAt is an exact
  // copperknob timestamp (feed or archived feed); published is the date as YYYY, YYYY-MM or YYYY-MM-DD (UTC);
  // publishedSource says where it came from. When publishedAt is set, published is its UTC day and the
  // source is "feed" or "feed-archive". A legacy boolean `published: true` is not valid; fixing those
  // documents is a live write and is not part of the contract change.
  "ldco.dances": {
    publishedAt: "bsonDate.optional()",
    published: String.raw`z.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$/).optional()`,
    publishedSource: 'z.enum(["feed", "feed-archive", "sync-time", "id-estimate"]).optional()',
    // Separate from the publish-date fields. line-dance-manager-admin writes these when an admin
    // reviews a dance (decision 23). Optional, so a dance that has never been reviewed stays valid.
    reviewed: "z.boolean().optional()",
    reviewedAt: "bsonDate.optional()",
    reviewedBy: "z.string().optional()",
  },

  // Decision 17: not-validated is a null Date / user id, and a confirmation writes a real Date and id.
  // Inference only saw null. The same pair lives on the instructor schedule below.
  "ldco.venues": {
    verifiedAt: "bsonDate.nullable()",
    verifiedBy: "z.string().nullable()",
  },
  "ldco.lessons": {
    verifiedAt: "bsonDate.nullable()",
    verifiedBy: "z.string().nullable()",
  },

  // Instructor schedule (data-model.md, decisions 17 and 18). Special events omit eventTypeId and carry
  // venueId, title and createdBy. substituteInstructorId, lessonId and template links were null in the
  // migrated rows and are strings once an app writes them.
  "ldco-lessons.events": {
    // Absent or null on a special event (data-model: no eventTypeId). A string on a recurring event.
    eventTypeId: "z.string().nullable().optional()",
    substituteInstructorId: "z.string().nullable()",
    verifiedAt: "bsonDate.nullable()",
    verifiedBy: "z.string().nullable()",
    title: "z.string().optional()",
    venueId: "z.string().optional()",
    createdBy: "z.string().optional()",
  },
  "ldco-lessons.event_types": {
    verifiedAt: "bsonDate.nullable()",
    verifiedBy: "z.string().nullable()",
  },
  "ldco-lessons.event_templates": {
    "lessons[].link": "z.string().nullable()",
  },
  "ldco-lessons.lessons": {
    lessonId: "z.string().nullable()",
  },

  // DJ Feed fields written after the last inference. lessonPhase is the lesson-block phase on a request.
  // A played row copies a lesson marker (a phase or id string, or a boolean flag). extensions matches the
  // array on session_reports, whose items have never been observed. durationMinutes is null on some sessions.
  "djfeed.dj_requests": {
    lessonPhase: "z.string().nullable().optional()",
  },
  "djfeed.dj_sessions": {
    durationMinutes: "z.number().nullable().optional()",
    extensions: "z.array(z.unknown()).optional()",
  },
  "djfeed.session_reports": {
    "playedTracks[].lesson": "z.union([z.string(), z.boolean()]).nullable().optional()",
  },

  // copperknob-alert. A rule can watch a dance name with no choreographer. notifyWebhookUrl is where a
  // match is posted; older rules don't have one. A processed item's choreographer is "" when the feed
  // item didn't name one (z.string() already allows that; the declaration keeps a future infer from
  // narrowing it).
  "copperknob_alert.watch_rules": {
    choreographer: "z.string().optional()",
    notifyWebhookUrl: "z.string().optional()",
  },
  "copperknob_alert.processed_items": {
    "details.choreographer": "z.string()",
  },
};
