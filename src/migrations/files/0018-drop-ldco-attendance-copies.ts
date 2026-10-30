import type { Db } from "mongodb";
import { getDb } from "@/server/mongo";
import type { Migration } from "../types";

// Decision 20: the DJ Feed's attendance lives in djfeed. Migration 0015 copied ldco.session_attendance and
// ldco.host_dancers there (2026-10-24), and since then line-dance-dj-feed writes and line-dance-manager reads only
// djfeed, so the ldco copies are frozen. This drops them, but only if every row is in djfeed (matched on its natural
// key) and no ldco row is newer than its djfeed copy; otherwise it refuses and reports what's missing (rerun 0015).

type Attendance = { sessionId: string; userId: string; lastSeenAt: Date };
type HostDancer = { hostId: string; userId: string; lastSeenAt: Date };

async function exists(db: Db, name: string) {
  return (await db.listCollections({ name }).toArray()).length > 0;
}

async function check(ldco: Db) {
  const djfeed = await getDb("djfeed");
  const result = { attendance: { exists: false, rows: 0, missing: 0 }, hostDancers: { exists: false, rows: 0, missing: 0 } };

  if (await exists(ldco, "session_attendance")) {
    const rows = await ldco.collection<Attendance>("session_attendance").find().toArray();
    const copies = await djfeed.collection<Attendance>("session_attendance").find({}, { projection: { sessionId: 1, userId: 1, lastSeenAt: 1 } }).toArray();
    const byKey = new Map(copies.map((c) => [`${c.sessionId}|${c.userId}`, c]));
    const missing = rows.filter((r) => {
      const c = byKey.get(`${r.sessionId}|${r.userId}`);
      return !c || new Date(c.lastSeenAt) < new Date(r.lastSeenAt);
    });
    result.attendance = { exists: true, rows: rows.length, missing: missing.length };
  }
  if (await exists(ldco, "host_dancers")) {
    const rows = await ldco.collection<HostDancer>("host_dancers").find().toArray();
    const copies = await djfeed.collection<HostDancer>("host_dancers").find({}, { projection: { hostId: 1, userId: 1, lastSeenAt: 1 } }).toArray();
    const byKey = new Map(copies.map((c) => [`${c.hostId}|${c.userId}`, c]));
    const missing = rows.filter((r) => {
      const c = byKey.get(`${r.hostId}|${r.userId}`);
      return !c || new Date(c.lastSeenAt) < new Date(r.lastSeenAt);
    });
    result.hostDancers = { exists: true, rows: rows.length, missing: missing.length };
  }
  return result;
}

export const migration: Migration = {
  id: "0018-drop-ldco-attendance-copies",
  description: "Drop ldco.session_attendance and ldco.host_dancers, frozen copies of the djfeed collections since 0015 (decision 20).",
  database: "ldco",

  async plan(db) {
    const c = await check(db);
    const part = (name: string, x: { exists: boolean; rows: number; missing: number }) =>
      !x.exists ? `${name}: already dropped.` : `${name}: ${x.rows} rows, ${x.missing} not (or not as new) in djfeed.`;
    return {
      summary: `${part("ldco.session_attendance", c.attendance)} ${part("ldco.host_dancers", c.hostDancers)}`,
      counts: {
        attendanceRows: c.attendance.rows, attendanceMissing: c.attendance.missing,
        hostDancerRows: c.hostDancers.rows, hostDancersMissing: c.hostDancers.missing,
      },
    };
  },

  async apply(db) {
    const c = await check(db);
    if (c.attendance.missing || c.hostDancers.missing) {
      throw new Error(`${c.attendance.missing} attendance and ${c.hostDancers.missing} host-dancer rows aren't (as new) in djfeed; rerun 0015 first. Nothing dropped.`);
    }
    if (c.attendance.exists) await db.collection("session_attendance").drop();
    if (c.hostDancers.exists) await db.collection("host_dancers").drop();
    return {
      summary: `Dropped ldco.session_attendance (${c.attendance.rows} rows) and ldco.host_dancers (${c.hostDancers.rows} rows); all were in djfeed.`,
      counts: { attendanceDropped: c.attendance.rows, hostDancersDropped: c.hostDancers.rows },
    };
  },
};
