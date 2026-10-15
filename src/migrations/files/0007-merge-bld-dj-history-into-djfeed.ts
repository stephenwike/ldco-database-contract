import type { Db, Document } from "mongodb";
import { getDb } from "@/server/mongo";
import type { Migration } from "../types";

// bld held the DJ feature while it lived inside dance-folly-website (May to June 2026), before it
// moved to line-dance-dj-feed and the djfeed database. Decision: keep the history in one place.
// - DJ history (sessions, requests, messages) merges into djfeed, marked migratedFrom: "bld".
//   Requests from that era have no ownerId; it is filled from their session when the session has one.
// - Beats and wallet records from that era are Stripe test-mode payments. The DJ Feed derives
//   balances from these collections, so they are archived unchanged in djfeed._archive_bld_<name>
//   instead of being merged into the live ledger.
// - bld.spotify_tokens (one stale token from the old DJ code) is deleted.
const MERGE = ["dj_sessions", "dj_requests", "dj_messages"];
const ARCHIVE = ["beat_balances", "beat_transactions", "dj_wallet_transactions"];
const DROP = ["spotify_tokens"];
const MARK = { migratedFrom: "bld" };

async function existing(db: Db) {
  return new Set((await db.listCollections().toArray()).map((c) => c.name));
}

// Upsert by _id so a rerun after a partial failure is safe.
async function copy(docs: Document[], target: Db, name: string) {
  if (!docs.length) return 0;
  const res = await target.collection(name).bulkWrite(
    docs.map((d) => ({ updateOne: { filter: { _id: d._id }, update: { $setOnInsert: d }, upsert: true } })),
  );
  return res.upsertedCount;
}

export const migration: Migration = {
  id: "0007-merge-bld-dj-history-into-djfeed",
  description: "Merge bld's DJ sessions, requests and messages into djfeed; archive bld's test-mode beats/wallet records; drop the bld copies.",
  database: "djfeed",

  async plan(db) {
    const bld = await getDb("bld");
    const names = await existing(bld);
    const counts: Record<string, number> = {};
    for (const c of [...MERGE, ...ARCHIVE, ...DROP]) counts[`bld.${c}`] = names.has(c) ? await bld.collection(c).countDocuments() : 0;
    const ids = names.has("dj_sessions") ? (await bld.collection("dj_sessions").find({}, { projection: { _id: 1 } }).toArray()).map((d) => d._id) : [];
    counts["djfeed.dj_sessions _id clashes"] = ids.length ? await db.collection("dj_sessions").countDocuments({ _id: { $in: ids } }) : 0;
    return {
      summary: `Merge ${MERGE.map((c) => counts[`bld.${c}`]).join("/")} sessions/requests/messages; archive ${ARCHIVE.map((c) => counts[`bld.${c}`]).join("/")} balances/beat tx/wallet tx; drop ${counts["bld.spotify_tokens"]} spotify token(s).`,
      counts,
    };
  },

  async apply(db) {
    const bld = await getDb("bld");
    const names = await existing(bld);
    const counts: Record<string, number> = {};

    const sessions = names.has("dj_sessions") ? await bld.collection("dj_sessions").find().toArray() : [];
    const ownerBySession = new Map(sessions.filter((s) => s.ownerId).map((s) => [String(s._id), s.ownerId]));

    for (const c of MERGE) {
      if (!names.has(c)) continue;
      const docs = (await bld.collection(c).find().toArray()).map((d) => {
        const owner = c === "dj_requests" && !d.ownerId ? ownerBySession.get(String(d.sessionId)) : undefined;
        return { ...d, ...MARK, ...(owner ? { ownerId: owner } : {}) };
      });
      counts[`merged ${c}`] = await copy(docs, db, c);
      // Drop the source only once every document is present in djfeed
      const present = await db.collection(c).countDocuments({ _id: { $in: docs.map((d) => d._id) } });
      if (present !== docs.length) throw new Error(`${c}: only ${present} of ${docs.length} copied; bld.${c} kept.`);
      await bld.collection(c).drop();
    }

    for (const c of ARCHIVE) {
      if (!names.has(c)) continue;
      const docs = await bld.collection(c).find().toArray();
      counts[`archived ${c}`] = await copy(docs, db, `_archive_bld_${c}`);
      const present = await db.collection(`_archive_bld_${c}`).countDocuments();
      if (present < docs.length) throw new Error(`${c}: archive incomplete; bld.${c} kept.`);
      await bld.collection(c).drop();
    }

    for (const c of DROP) {
      if (!names.has(c)) continue;
      counts[`dropped ${c}`] = await bld.collection(c).countDocuments();
      await bld.collection(c).drop();
    }

    return { summary: "bld DJ history merged into djfeed; test-mode payments archived; bld copies dropped.", counts };
  },
};
