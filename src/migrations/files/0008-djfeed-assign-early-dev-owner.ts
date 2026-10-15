import type { Migration } from "../types";

// Before ldco-auth, the DJ feature used ids of the form "user_<random>", and the earliest sessions
// had no owner at all. Stephen was the only user during early development, so every such id, and
// every missing owner, belongs to his current account. The _archive_bld_* collections are left
// exactly as archived. Each changed _id is listed in the report (stored in djfeed._migrations).
const OWNER = "66919a36bfcd4d848099f2ba"; // Stephen Wike in ldco.users
const LEGACY = /^user_[A-Za-z0-9]{20,}$/;
const MISSING = [{ ownerId: null }, { ownerId: { $exists: false } }];

// collection -> field -> also fill when missing?
const TARGETS: [string, string, boolean][] = [
  ["dj_sessions", "ownerId", true],
  ["dj_requests", "ownerId", true],
  ["dj_requests", "clientId", false],
  ["dj_messages", "ownerId", false],
  ["session_reports", "ownerId", false],
  ["requester_history", "ownerId", false],
  ["requester_history", "clientId", false],
];

function filter(field: string, fillMissing: boolean) {
  const legacy = { [field]: LEGACY };
  return fillMissing && field === "ownerId" ? { $or: [legacy, ...MISSING] } : legacy;
}

export const migration: Migration = {
  id: "0008-djfeed-assign-early-dev-owner",
  description: "Assign pre-ldco-auth user_* ids and missing DJ session owners in djfeed to Stephen's account.",
  database: "djfeed",

  async plan(db) {
    const counts: Record<string, number> = {};
    for (const [c, f, fill] of TARGETS) counts[`${c}.${f}`] = await db.collection(c).countDocuments(filter(f, fill));
    const legacyIds = new Set<string>();
    for (const [c, f] of TARGETS) for (const v of await db.collection(c).distinct(f, { [f]: LEGACY })) legacyIds.add(String(v));
    return {
      summary: `${Object.values(counts).reduce((a, b) => a + b, 0)} fields across ${TARGETS.length} collection fields become ${OWNER}; legacy ids: ${[...legacyIds].join(", ")}.`,
      counts,
    };
  },

  async apply(db) {
    const counts: Record<string, number> = {};
    const changed: Record<string, string[]> = {};
    for (const [c, f, fill] of TARGETS) {
      const q = filter(f, fill);
      const ids = (await db.collection(c).find(q, { projection: { _id: 1 } }).toArray()).map((d) => d._id);
      if (!ids.length) continue;
      const res = await db.collection(c).updateMany({ _id: { $in: ids }, ...q }, { $set: { [f]: OWNER } });
      counts[`${c}.${f}`] = res.modifiedCount;
      changed[`${c}.${f}`] = ids.map(String);
    }
    return { summary: `${Object.values(counts).reduce((a, b) => a + b, 0)} fields assigned to ${OWNER}.`, counts, sample: [changed] };
  },
};
