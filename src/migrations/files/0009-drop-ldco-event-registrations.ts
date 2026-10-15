import { getDb } from "@/server/mongo";
import type { Migration } from "../types";

// Event registrations moved to ldco-events (line-dance-manager-admin's one-time
// /api/admin/migrate/events route copied all of them). Every reader and writer uses ldco-events,
// so ldco.event_registrations is a stale copy. It is dropped only if every row exists in ldco-events.
async function check(db: import("mongodb").Db) {
  const exists = (await db.listCollections({ name: "event_registrations" }).toArray()).length > 0;
  if (!exists) return { exists, ids: [], missing: 0 };
  const ids = (await db.collection("event_registrations").find({}, { projection: { _id: 1 } }).toArray()).map((d) => d._id);
  const present = await (await getDb("ldco-events")).collection("event_registrations").countDocuments({ _id: { $in: ids } });
  return { exists, ids, missing: ids.length - present };
}

export const migration: Migration = {
  id: "0009-drop-ldco-event-registrations",
  description: "Drop ldco.event_registrations, a stale copy of ldco-events.event_registrations.",
  database: "ldco",

  async plan(db) {
    const { exists, ids, missing } = await check(db);
    return {
      summary: exists ? `${ids.length} rows, ${missing} missing from ldco-events.` : "Already dropped.",
      counts: { rows: ids.length, missingFromLdcoEvents: missing },
    };
  },

  async apply(db) {
    const { exists, ids, missing } = await check(db);
    if (!exists) return { summary: "Already dropped.", counts: { dropped: 0 } };
    if (missing) throw new Error(`${missing} rows are not in ldco-events; not dropping.`);
    await db.collection("event_registrations").drop();
    return { summary: `Dropped ldco.event_registrations (${ids.length} rows, all in ldco-events).`, counts: { dropped: ids.length } };
  },
};
