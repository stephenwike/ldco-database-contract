import type { Db } from "mongodb";
import { getDb } from "@/server/mongo";
import type { Migration } from "../types";

// Decision 20: the collections the DJ Feed writes about its own events live in djfeed. This copies
// ldco.session_attendance and ldco.host_dancers into djfeed (insert-only: the ldco copies stay until a
// later migration drops them, once line-dance-dj-feed and line-dance-manager read djfeed). It also
// creates the indexes, including djfeed.feed_lessons' (that collection is new and starts empty).
//
// Rows are matched on their natural key, not _id, so a rerun (or a row the DJ Feed already wrote to
// djfeed) never duplicates: dates only widen (firstSeenAt keeps the earliest, lastSeenAt the latest) and
// a row already in djfeed keeps its own _id, sessionCount and lastSessionId.

type Attendance = { _id: string; sessionId: string; hostId: string; userId: string; firstSeenAt: Date; lastSeenAt: Date };
type HostDancer = { _id: string; hostId: string; userId: string; firstSeenAt: Date; lastSeenAt: Date; sessionCount: number; lastSessionId: string };

async function sources() {
  const ldco = await getDb("ldco");
  const [attendance, hostDancers] = await Promise.all([
    ldco.collection<Attendance>("session_attendance").find().toArray(),
    ldco.collection<HostDancer>("host_dancers").find().toArray(),
  ]);
  return { attendance, hostDancers };
}

async function missing(db: Db, attendance: Attendance[], hostDancers: HostDancer[]) {
  const [haveAttendance, haveHostDancers] = await Promise.all([
    db.collection<Attendance>("session_attendance").find({}, { projection: { sessionId: 1, userId: 1 } }).toArray(),
    db.collection<HostDancer>("host_dancers").find({}, { projection: { hostId: 1, userId: 1 } }).toArray(),
  ]);
  const a = new Set(haveAttendance.map((d) => `${d.sessionId}|${d.userId}`));
  const h = new Set(haveHostDancers.map((d) => `${d.hostId}|${d.userId}`));
  return {
    attendance: attendance.filter((d) => !a.has(`${d.sessionId}|${d.userId}`)).length,
    hostDancers: hostDancers.filter((d) => !h.has(`${d.hostId}|${d.userId}`)).length,
  };
}

async function ensureIndexes(db: Db) {
  await Promise.all([
    db.collection("session_attendance").createIndex({ sessionId: 1, userId: 1 }, { unique: true }),
    db.collection("session_attendance").createIndex({ hostId: 1, lastSeenAt: -1 }),
    db.collection("host_dancers").createIndex({ hostId: 1, userId: 1 }, { unique: true }),
    db.collection("host_dancers").createIndex({ userId: 1 }),
    db.collection("feed_lessons").createIndex({ sessionId: 1, danceId: 1 }, { unique: true }),
    db.collection("feed_lessons").createIndex({ hostId: 1, startedAt: -1 }),
  ]);
}

export const migration: Migration = {
  id: "0015-move-dj-feed-attendance-to-djfeed",
  description: "Copy ldco.session_attendance and ldco.host_dancers into djfeed (decision 20) and create djfeed's indexes for them and feed_lessons.",
  database: "djfeed",

  async plan(db) {
    const { attendance, hostDancers } = await sources();
    const toCopy = await missing(db, attendance, hostDancers);
    return {
      summary: `${toCopy.attendance} of ${attendance.length} attendance rows and ${toCopy.hostDancers} of ${hostDancers.length} host-dancer rows to copy into djfeed.`,
      counts: {
        ldcoAttendance: attendance.length,
        attendanceToCopy: toCopy.attendance,
        ldcoHostDancers: hostDancers.length,
        hostDancersToCopy: toCopy.hostDancers,
      },
      sample: attendance.slice(0, 3),
    };
  },

  async apply(db) {
    const { attendance, hostDancers } = await sources();
    const toCopy = await missing(db, attendance, hostDancers);
    await ensureIndexes(db);
    if (attendance.length) {
      await db.collection<Attendance>("session_attendance").bulkWrite(attendance.map((d) => ({
        updateOne: {
          filter: { sessionId: d.sessionId, userId: d.userId },
          update: {
            $setOnInsert: { _id: d._id, hostId: d.hostId },
            $min: { firstSeenAt: d.firstSeenAt },
            $max: { lastSeenAt: d.lastSeenAt },
          },
          upsert: true,
        },
      })));
    }
    if (hostDancers.length) {
      await db.collection<HostDancer>("host_dancers").bulkWrite(hostDancers.map((d) => ({
        updateOne: {
          filter: { hostId: d.hostId, userId: d.userId },
          update: {
            $setOnInsert: { _id: d._id, sessionCount: d.sessionCount, lastSessionId: d.lastSessionId },
            $min: { firstSeenAt: d.firstSeenAt },
            $max: { lastSeenAt: d.lastSeenAt },
          },
          upsert: true,
        },
      })));
    }
    return {
      summary: `Copied ${toCopy.attendance} attendance rows and ${toCopy.hostDancers} host-dancer rows into djfeed; indexes created.`,
      counts: { attendanceCopied: toCopy.attendance, hostDancersCopied: toCopy.hostDancers },
    };
  },
};
