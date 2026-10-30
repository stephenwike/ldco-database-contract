import type { Db } from "mongodb";
import type { Migration } from "../types";

// Decision 24, phase 3: a ticketed event's date, time and venue are its special event's (lessonEventId), so the
// copies kept as text on ldco-events.events (date, dateShort, time, venueName, venueAddress) are removed. Refuses
// while any ticketed event isn't linked to a special event that exists (phase 1, migration 0017, links the
// existing ones; the admin links every new one). Run after the admin reads the schedule only.

const TEXT_FIELDS = ["date", "dateShort", "time", "venueName", "venueAddress"] as const;

async function survey(db: Db) {
  const { getDb } = await import("@/server/mongo");
  const lessons = await getDb("ldco-lessons");
  const tickets = await db.collection<{ slug: string; lessonEventId?: string }>("events").find().toArray();
  const ids = tickets.map((t) => t.lessonEventId).filter((v): v is string => !!v);
  const found = new Set((await lessons.collection<{ _id: string }>("events").find({ _id: { $in: ids } }, { projection: { _id: 1 } }).toArray()).map((e) => e._id));
  const unlinked = tickets.filter((t) => !t.lessonEventId || !found.has(t.lessonEventId)).map((t) => t.slug);
  const withText = await db.collection("events").countDocuments({ $or: TEXT_FIELDS.map((f) => ({ [f]: { $exists: true } })) });
  return { total: tickets.length, unlinked, withText };
}

export const migration: Migration = {
  id: "0019-ticketed-events-drop-schedule-text",
  description: "Remove date, dateShort, time, venueName and venueAddress from ldco-events.events; each ticketed event's special event holds them (decision 24, phase 3).",
  database: "ldco-events",

  async plan(db) {
    const s = await survey(db);
    return {
      summary: s.unlinked.length
        ? `${s.unlinked.length} of ${s.total} ticketed events aren't linked to a special event (${s.unlinked.join(", ")}); apply will refuse.`
        : `${s.withText} of ${s.total} ticketed events still carry the text fields; all are linked.`,
      counts: { ticketedEvents: s.total, unlinked: s.unlinked.length, withText: s.withText },
    };
  },

  async apply(db) {
    const s = await survey(db);
    if (s.unlinked.length) throw new Error(`Not linked to a special event: ${s.unlinked.join(", ")}. Nothing changed.`);
    const result = await db.collection("events").updateMany(
      {},
      { $unset: Object.fromEntries(TEXT_FIELDS.map((f) => [f, ""])) },
    );
    return {
      summary: `Removed the date / time / venue text from ${result.modifiedCount} ticketed events.`,
      counts: { modified: result.modifiedCount },
    };
  },
};
