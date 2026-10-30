import { ObjectId, type Db } from "mongodb";
import { getDb } from "@/server/mongo";
import { mountainWallClockToDate } from "../lib/time";
import type { Migration, MigrationReport } from "../types";

// Decision 24: special events live in the schedule (ldco-lessons.events with no eventTypeId), and a ticketed
// event in ldco-events.events points at one with lessonEventId. Phase 1 for the two ticketed events that existed
// on 2026-10-30, both Stephen's Intermediate Line Dance Socials:
//   - Sept 19, 2026, 12-4 PM at Midnight Toad: stored as an Alternative Line Dance occurrence carrying the social's
//     note, with no lessons or history. It becomes the special event in place (same id).
//   - Nov 21, 2026, 12-4 PM at Denver Turnverein: nothing stored. A special event is created.
// Midnight Toad wasn't a venue; it's added, not validated and without coordinates. Each special event gets a
// `creator` row in event_instructors. Idempotent: every step checks what's already there.

const STEPHEN_INSTRUCTOR = "f5e37f5a-e74e-4d68-985e-397b00c2f09b";
const TIME_ZONE = "America/Denver";
const TITLE = "Intermediate Line Dance Social";
const NOON = 12 * 60;
const FOUR_PM = 16 * 60;

const SEPT_19_OCCURRENCE = "6aacdf108cf418eb1b97c787";
const TURNVEREIN = "694f55089fad7f908b6be15f";
const MIDNIGHT_TOAD = {
  venuename: "Midnight Toad",
  venueaddress: "5302 S Federal Cir # A",
  city: "Littleton",
  state: "CO",
};

const SOCIALS = [
  { slug: "intermediate-social-2026-09-12", date: "2026-09-19", venue: "midnight-toad", existingEventId: SEPT_19_OCCURRENCE },
  { slug: "int-line-dance-social-2026-11-21", date: "2026-11-21", venue: TURNVEREIN, existingEventId: null },
] as const;

type Doc = { _id: string; [key: string]: unknown };
const lessonEvents = (db: Db) => db.collection<Doc>("events");
const eventInstructors = (db: Db) => db.collection<Doc>("event_instructors");

async function findMidnightToad() {
  const ldco = await getDb("ldco");
  return ldco.collection<{ _id: string }>("venues").findOne({ venuename: { $regex: /^midnight toad$/i } });
}

async function survey(db: Db) {
  const tickets = await getDb("ldco-events");
  const toad = await findMidnightToad();
  const rows = [];
  for (const s of SOCIALS) {
    const ticket = await tickets.collection("events").findOne({ slug: s.slug });
    const linked = ticket?.lessonEventId ? await lessonEvents(db).findOne({ _id: ticket.lessonEventId }) : null;
    const existing = s.existingEventId ? await lessonEvents(db).findOne({ _id: s.existingEventId }) : null;
    rows.push({ ...s, ticket: !!ticket, linked: !!linked, existing: existing ? { eventTypeId: existing.eventTypeId ?? null, title: existing.title ?? null } : null });
  }
  return { toad: !!toad, rows };
}

export const migration: Migration = {
  id: "0017-special-events-in-schedule",
  description: "Make the existing ticketed events' special events in ldco-lessons.events (adding Midnight Toad as a venue) and link them from ldco-events.events (decision 24).",
  database: "ldco-lessons",

  async plan(db) {
    const { toad, rows } = await survey(db);
    return {
      summary: [
        toad ? "Midnight Toad is already a venue." : "Add venue Midnight Toad.",
        ...rows.map((r) => !r.ticket ? `${r.slug}: ticketed event not found (skipped).`
          : r.linked ? `${r.slug}: already linked.`
          : r.existingEventId ? `${r.slug}: turn ${r.existingEventId} (event type ${r.existing?.eventTypeId ?? "none"}) into the special event and link it.`
          : `${r.slug}: create the special event on ${r.date} and link it.`),
      ].join(" "),
      counts: {
        venuesToAdd: toad ? 0 : 1,
        toLink: rows.filter((r) => r.ticket && !r.linked).length,
        alreadyLinked: rows.filter((r) => r.linked).length,
      },
      sample: rows,
    };
  },

  async apply(db) {
    const ldco = await getDb("ldco");
    const tickets = await getDb("ldco-events");
    const now = new Date();
    const report: MigrationReport = { summary: "", counts: { venuesAdded: 0, converted: 0, created: 0, linked: 0, instructorRows: 0 } };

    let toad = await findMidnightToad();
    if (!toad) {
      const _id = new ObjectId().toHexString();
      await ldco.collection("venues").insertOne({
        _id, ...MIDNIGHT_TOAD, geolocation: [], phone: "", website: "", timeZone: TIME_ZONE, verifiedAt: null, verifiedBy: null,
      } as never);
      toad = { _id };
      report.counts.venuesAdded++;
    }

    for (const s of SOCIALS) {
      const ticket = await tickets.collection("events").findOne({ slug: s.slug });
      if (!ticket || (ticket.lessonEventId && await lessonEvents(db).findOne({ _id: String(ticket.lessonEventId) }))) continue;
      const venueId = s.venue === "midnight-toad" ? toad._id : s.venue;
      const special = {
        title: TITLE, venueId, createdBy: STEPHEN_INSTRUCTOR, date: s.date, timeZone: TIME_ZONE,
        startAt: mountainWallClockToDate(s.date, NOON), endAt: mountainWallClockToDate(s.date, FOUR_PM), updatedAt: now,
      };
      let eventId: string;
      if (s.existingEventId && await lessonEvents(db).findOne({ _id: s.existingEventId })) {
        eventId = s.existingEventId;
        await lessonEvents(db).updateOne({ _id: eventId }, { $set: special, $unset: { eventTypeId: "" } });
        report.counts.converted++;
      } else {
        eventId = new ObjectId().toHexString();
        await lessonEvents(db).insertOne({
          _id: eventId, ...special, isCancelled: false, cancelNote: null, specialNote: null, substitute: null,
          substituteInstructorId: null, lessons: [], verifiedAt: null, verifiedBy: null, createdAt: now,
        } as never);
        report.counts.created++;
      }
      const role = await eventInstructors(db).updateOne(
        { instructorId: STEPHEN_INSTRUCTOR, eventId },
        { $setOnInsert: { _id: new ObjectId().toHexString(), instructorId: STEPHEN_INSTRUCTOR, eventId, role: "creator", createdAt: now } },
        { upsert: true },
      );
      report.counts.instructorRows += role.upsertedCount;
      await tickets.collection("events").updateOne({ _id: ticket._id }, { $set: { lessonEventId: eventId } });
      report.counts.linked++;
    }

    report.summary = `Venues added ${report.counts.venuesAdded}; special events converted ${report.counts.converted}, created ${report.counts.created}; ticketed events linked ${report.counts.linked}.`;
    return report;
  },
};
