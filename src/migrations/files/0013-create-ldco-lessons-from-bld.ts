import { ObjectId, type AnyBulkWriteOperation, type Db } from "mongodb";
import { getDb } from "@/server/mongo";
import { mountainWallClockToDate } from "../lib/time";
import type { Migration, MigrationReport } from "../types";

// Decision 18: instructor data gets its own database, ldco-lessons, made from bld (Stephen's schedule) so
// every instructor can use it. Collection and field names stay as published in bld; only the approved
// changes are made:
//   - _id and references become strings (decision 5).
//   - Dated things become UTC Dates plus the venue's IANA zone (decision 9): events.startAt / endAt replace
//     startTime / endTime / endDayOffset / durationMinutes; each event lesson's time becomes startAt;
//     lessons.date (history) becomes a Date. events.date stays the local YYYY-MM-DD, which is how a stored
//     event is matched to the date its frequency projects.
//   - Recurring rules stay local wall-clock time, as 24-hour "HH:mm": frequencies.startTime,
//     event_types.defaultStartTime, event_templates lesson times.
//   - Added: event_types.createdBy (final say), verifiedAt / verifiedBy (decision 17) on event_types and
//     events, events.substituteInstructorId, an _id and a skipped flag on each event lesson (committed is
//     still "taught"), and instructorId / venueId / eventId / lessonId on history.
//   - New: event_instructors (who teaches which event type or special event) and event_instructor_requests
//     (requests to co-teach, waiting for the creator). Everything in bld was Stephen's.
// bld stays in place: a later migration drops it once the admin and dance-folly-website read ldco-lessons.

const STEPHEN_INSTRUCTOR = "f5e37f5a-e74e-4d68-985e-397b00c2f09b";
const TIME_ZONE = "America/Denver";

// bld.lessons recorded the venue as free text; these are every label in the data (2026-10-15).
const HISTORY_VENUES: Record<string, string> = {
  "Charlie's Denver": "382c2df6b1ff828d4b22ff6f",
  "Alternative Line Dance Charlie's": "382c2df6b1ff828d4b22ff6f",
  "Washington Park Rec Center": "694f55089fad7f908b6be15a",
  "Glenarm Recreation Center": "69aa49260a7750f056e60745",
  "Barnum Rec Center": "685446c22d8653b899869dae",
  "Barnum Rec Center - Wednesdays": "685446c22d8653b899869dae",
  "Barnum Rec Center - Tuesdays": "685446c22d8653b899869dae",
  "St. Charles Rec Center": "694f55089fad7f908b6be15d",
  "Fraco's Bar and Live Music": "694f55089fad7f908b6be15c",
  "Fraco's Sundays": "694f55089fad7f908b6be15c",
  "Parker Dance Academy": "694f55089fad7f908b6be155",
  "Turnverein": "694f55089fad7f908b6be15f",
  "Highlands Rec Center": "c803d539104754c597d6a71b",
  "Scheitler Rec Center": "694f55089fad7f908b6be159",
  "Jefferson County Colorado Fairgrounds": "6a5266d15e39fc6d4a7b0e9e",
  "National Western Complex": "694f55089fad7f908b6be15b",
  "Adams County Fairgrounds": "6a2245b3588a1f3b3474e120",
  "Riverdale Regional Park": "6a2245b3588a1f3b3474e120",
  "International Dance Club": "694f55089fad7f908b6be15e",
  "Stampede": "eb523fec195af08f3b8ce87b",
  "Ladies Night at Stampede": "eb523fec195af08f3b8ce87b",
  "VFW Post 4171": "8649172006c54a2d5a7d567d",
};

type Doc = Record<string, unknown> & { _id: ObjectId | string };

// "5:00 PM" / "12:30 AM" -> minutes after midnight; null for empty or unparsable.
function parse12h(value: unknown): number | null {
  const m = String(value ?? "").trim().match(/^(\d{1,2}):(\d{2})\s*([AP]M)$/i);
  if (!m) return null;
  let h = Number(m[1]) % 12;
  if (m[3].toUpperCase() === "PM") h += 12;
  return h * 60 + Number(m[2]);
}

function hhmm(minutes: number | null): string | null {
  if (minutes === null) return null;
  return `${String(Math.floor(minutes / 60) % 24).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

function idString(v: unknown): string {
  return v instanceof ObjectId ? v.toHexString() : String(v);
}

function createdAtOf(doc: Doc): Date {
  if (doc.createdAt instanceof Date) return doc.createdAt;
  return doc._id instanceof ObjectId ? doc._id.getTimestamp() : new Date(0);
}

function updatedAtOf(doc: Doc): Date {
  return doc.updatedAt instanceof Date ? doc.updatedAt : createdAtOf(doc);
}

// bld.lessons dates are local wall clocks with an offset the admin hardcoded to -07:00 even in summer;
// the wall clock is what was meant, so the offset is ignored and Mountain Time applied.
function historyInstant(value: unknown): { date: Date; ymd: string; corrected: boolean } | null {
  const m = String(value ?? "").match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})(?::\d{2})?(Z|[+-]\d{2}:?\d{2})?$/);
  if (!m) return null;
  const date = mountainWallClockToDate(m[1], Number(m[2]) * 60 + Number(m[3]));
  const asWritten = m[4] ? new Date(String(value)) : date;
  return { date, ymd: m[1], corrected: asWritten.getTime() !== date.getTime() };
}

async function build(target: Db) {
  const bld = await getDb("bld");
  const ldco = await getDb("ldco");
  const [eventTypes, frequencies, events, templates, history] = await Promise.all(
    ["event_types", "frequencies", "events", "event_templates", "lessons"].map((c) => bld.collection<Doc>(c).find().toArray()),
  );
  const venueIds = new Set((await ldco.collection<{ _id: string }>("venues").find({}, { projection: { _id: 1 } }).toArray()).map((v) => v._id));
  const problems: string[] = [];

  const eventTypeDocs = eventTypes.map((et) => {
    const venueId = String(et.venueId ?? "");
    if (!venueIds.has(venueId)) problems.push(`event type ${idString(et._id)}: venue ${venueId} not in ldco.venues`);
    return {
      _id: idString(et._id),
      title: String(et.title ?? ""),
      level: String(et.level ?? ""),
      price: String(et.price ?? ""),
      defaultStartTime: hhmm(parse12h(et.defaultStartTime)),
      defaultDurationMinutes: Number(et.defaultDurationMinutes ?? 0),
      isActive: et.isActive !== false,
      venueId,
      createdBy: STEPHEN_INSTRUCTOR,
      verifiedAt: null,
      verifiedBy: null,
      createdAt: createdAtOf(et),
      updatedAt: updatedAtOf(et),
    };
  });
  const venueByEventType = new Map(eventTypeDocs.map((et) => [et._id, et.venueId]));

  const instructorDocs = eventTypeDocs.map((et) => ({
    instructorId: STEPHEN_INSTRUCTOR,
    eventTypeId: et._id,
    role: "creator",
    createdAt: et.createdAt,
  }));

  // Same fields and values as bld (kind stays WEEKLY / MONTHLY_NTH_WEEKDAY; isActive stays optional,
  // missing = on); the id becomes a string and startTime a 24-hour local time.
  const frequencyDocs = frequencies.map((f) => {
    const startTime = hhmm(parse12h(f.startTime));
    if (!startTime) problems.push(`frequency ${idString(f._id)}: unparsable startTime ${String(f.startTime)}`);
    const { _id, eventTypeId, ...rest } = f;
    return {
      ...rest,
      _id: idString(_id),
      eventTypeId: idString(eventTypeId),
      startTime,
      createdAt: createdAtOf(f),
      updatedAt: updatedAtOf(f),
    };
  });

  let lessonsOutsideEvent = 0;
  const eventDocs = events.map((ev) => {
    const id = idString(ev._id);
    const date = String(ev.date);
    const startMin = parse12h(ev.startTime);
    if (startMin === null) problems.push(`event ${id}: unparsable startTime ${String(ev.startTime)}`);
    const start = startMin ?? 0;
    const endParsed = parse12h(ev.endTime);
    let endMin: number;
    if (endParsed === null) endMin = start + Number(ev.durationMinutes ?? 0);
    else {
      const offset = typeof ev.endDayOffset === "number" ? ev.endDayOffset : endParsed <= start ? 1 : 0;
      endMin = endParsed + offset * 24 * 60;
    }

    const lessons = (Array.isArray(ev.lessons) ? (ev.lessons as Record<string, unknown>[]) : []).map((l) => {
      const t = parse12h(l.time);
      // A lesson earlier than the event's start belongs to the following day (events that run past midnight).
      const lessonMin = t === null ? null : t < start && endMin > 24 * 60 ? t + 24 * 60 : t;
      if (lessonMin !== null && (lessonMin < start || lessonMin > endMin)) lessonsOutsideEvent++;
      return {
        _id: new ObjectId().toHexString(),
        startAt: lessonMin === null ? null : mountainWallClockToDate(date, lessonMin),
        dance: l.dance ? String(l.dance) : null,
        danceId: l.danceId ? String(l.danceId) : null,
        level: l.level ? String(l.level) : null,
        link: l.link ? String(l.link) : null,
        committed: !!l.committed,
        skipped: false,
      };
    });

    return {
      _id: id,
      eventTypeId: idString(ev.eventTypeId),
      date,
      startAt: mountainWallClockToDate(date, start),
      endAt: mountainWallClockToDate(date, endMin),
      timeZone: TIME_ZONE,
      isCancelled: !!ev.isCancelled,
      cancelNote: ev.cancelNote ? String(ev.cancelNote) : null,
      substitute: ev.substitute ? String(ev.substitute) : null,
      substituteInstructorId: null,
      specialNote: ev.specialNote ? String(ev.specialNote) : null,
      lessons,
      verifiedAt: null,
      verifiedBy: null,
      createdAt: createdAtOf(ev),
      updatedAt: updatedAtOf(ev),
    };
  });

  const templateDocs = templates.map((t) => ({
    _id: idString(t._id),
    eventTypeId: idString(t.eventTypeId),
    name: String(t.name ?? ""),
    isDefault: t.isDefault === true,
    lessons: (Array.isArray(t.lessons) ? (t.lessons as Record<string, unknown>[]) : []).map((l) => ({
      time: hhmm(parse12h(l.time)),
      dance: l.dance ? String(l.dance) : null,
      level: l.level ? String(l.level) : null,
      link: l.link ? String(l.link) : null,
    })),
    createdAt: createdAtOf(t),
    updatedAt: updatedAtOf(t),
  }));

  // Link history to the event it was taught at when exactly one stored event at that venue contains it.
  const eventsByVenueDate = new Map<string, typeof eventDocs>();
  for (const ev of eventDocs) {
    const key = `${venueByEventType.get(ev.eventTypeId)}|${ev.date}`;
    eventsByVenueDate.set(key, [...(eventsByVenueDate.get(key) ?? []), ev]);
  }

  let corrected = 0;
  let linkedToEvent = 0;
  const unmappedLabels = new Set<string>();
  const historyDocs = history.map((h) => {
    const id = idString(h._id);
    const label = String(h.venue ?? "");
    const venueId = HISTORY_VENUES[label] ?? null;
    if (!venueId) unmappedLabels.add(label);
    const when = historyInstant(h.date);
    if (!when) problems.push(`history ${id}: unparsable date ${String(h.date)}`);
    if (when?.corrected) corrected++;
    const candidates = when && venueId
      ? (eventsByVenueDate.get(`${venueId}|${when.ymd}`) ?? []).filter((ev) => ev.startAt <= when.date && when.date <= ev.endAt)
      : [];
    const event = candidates.length === 1 ? candidates[0] : null;
    if (event) linkedToEvent++;
    return {
      _id: id,
      ...(h.danceId ? { danceId: String(h.danceId) } : {}),
      ...(h.danceName ? { danceName: String(h.danceName) } : {}),
      venue: label,
      date: when?.date ?? new Date(0),
      instructorId: STEPHEN_INSTRUCTOR,
      venueId,
      eventId: event?._id ?? null,
      lessonId: null,
    };
  });
  for (const label of unmappedLabels) problems.push(`history venue label not mapped: ${label}`);

  const existing = (await target.listCollections().toArray()).map((c) => c.name);

  return {
    eventTypeDocs, instructorDocs, frequencyDocs, eventDocs, templateDocs, historyDocs,
    problems, lessonsOutsideEvent, corrected, linkedToEvent, existing,
  };
}

function counts(b: Awaited<ReturnType<typeof build>>) {
  return {
    eventTypes: b.eventTypeDocs.length,
    eventInstructors: b.instructorDocs.length,
    frequencies: b.frequencyDocs.length,
    events: b.eventDocs.length,
    eventLessons: b.eventDocs.reduce((n, e) => n + e.lessons.length, 0),
    eventLessonsCommitted: b.eventDocs.reduce((n, e) => n + e.lessons.filter((l) => l.committed).length, 0),
    lessonsOutsideEventTimes: b.lessonsOutsideEvent,
    eventTemplates: b.templateDocs.length,
    lessons: b.historyDocs.length,
    lessonsLinkedToEvent: b.linkedToEvent,
    lessonsTimeCorrected: b.corrected,
    problems: b.problems.length,
  };
}

// Insert-only by _id, so a rerun leaves already-copied (and since edited) documents alone.
function insertMissing<T extends { _id: string }>(docs: T[]): AnyBulkWriteOperation<T>[] {
  return docs.map((doc) => ({ updateOne: { filter: { _id: doc._id } as never, update: { $setOnInsert: doc as never }, upsert: true } }));
}

export const migration: Migration = {
  id: "0013-create-ldco-lessons-from-bld",
  description: "Create ldco-lessons from bld's schedule (event_types, frequencies, events, event_templates, lessons) with decision 18's changes, link Stephen as creator, add event_instructors and event_instructor_requests. bld is left in place.",
  database: "ldco-lessons",

  async plan(db): Promise<MigrationReport> {
    const b = await build(db);
    return {
      summary: `${b.eventTypeDocs.length} event types, ${b.frequencyDocs.length} frequencies, ${b.eventDocs.length} events, ${b.templateDocs.length} templates, ${b.historyDocs.length} lessons (${b.corrected} times corrected, ${b.linkedToEvent} linked to an event). ${b.problems.length} problems.`,
      counts: counts(b),
      sample: [
        ...b.problems.map((p) => ({ problem: p })),
        { eventType: b.eventTypeDocs[0] },
        { frequency: b.frequencyDocs[0] },
        { event: b.eventDocs.find((e) => e.lessons.length) },
        { lesson: b.historyDocs[b.historyDocs.length - 1] },
      ],
    };
  },

  async apply(db): Promise<MigrationReport> {
    const b = await build(db);
    if (b.problems.length) throw new Error(`Fix before applying:\n${b.problems.join("\n")}`);

    const write = async <T extends { _id: string }>(name: string, docs: T[]) => {
      if (!docs.length) return 0;
      const res = await db.collection<T>(name).bulkWrite(insertMissing(docs), { ordered: false });
      return res.upsertedCount;
    };

    const inserted = {
      eventTypes: await write("event_types", b.eventTypeDocs),
      frequencies: await write("frequencies", b.frequencyDocs as Array<{ _id: string }>),
      events: await write("events", b.eventDocs),
      eventTemplates: await write("event_templates", b.templateDocs),
      lessons: await write("lessons", b.historyDocs),
      eventInstructors: 0,
    };

    const links = db.collection<{ _id: string }>("event_instructors");
    for (const link of b.instructorDocs) {
      const res = await links.updateOne(
        { instructorId: link.instructorId, eventTypeId: link.eventTypeId },
        { $setOnInsert: { _id: new ObjectId().toHexString(), ...link } },
        { upsert: true },
      );
      inserted.eventInstructors += res.upsertedCount;
    }
    // Requests to co-teach start empty; create the collection so it's part of the database from the start.
    if (!b.existing.includes("event_instructor_requests")) await db.createCollection("event_instructor_requests");

    return {
      summary: `Created ldco-lessons: ${Object.entries(inserted).map(([k, v]) => `${v} ${k}`).join(", ")}. bld left in place.`,
      counts: { ...inserted, lessonsOutsideEventTimes: b.lessonsOutsideEvent },
    };
  },
};
