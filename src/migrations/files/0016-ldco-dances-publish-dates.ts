import type { Db } from "mongodb";
import rows from "../data/publish-dates/publish-dates.json";
import type { Migration, MigrationReport } from "../types";

// Publish dates at the precision the evidence supports (decision 22, amended). The data file is built by
// scripts/build-publish-dates.ts from the local copy and the evidence next to it (method and checks in
// src/migrations/data/publish-dates/README.md). Rebuild it after a fresh db:sync-local just before applying.
// - A dance that already has `published` is never changed.
// - A dance that already has `publishedAt` (set by copperknob-alert from the feed) gets `published` from it
//   (its UTC day) with source "feed", so the rule "publishedAt set => published is its day" always holds.
// - Otherwise the data file's row is written: published, publishedSource and, for feed/archive rows, publishedAt.

interface Row { danceId: string; published: string; publishedSource: string; publishedAt?: string }
interface Dance { _id: string; published?: string; publishedAt?: Date }

const data = rows as Row[];

async function load(db: Db) {
  const dances = db.collection<Dance>("dances");
  const existing = new Map(
    (await dances.find({ _id: { $in: data.map((r) => r.danceId) } }, { projection: { published: 1, publishedAt: 1 } }).toArray()).map((d) => [d._id, d]),
  );
  const fromPublishedAt = await dances.find({ publishedAt: { $exists: true }, published: { $exists: false } }, { projection: { publishedAt: 1 } }).toArray();
  const fromPublishedAtIds = new Set(fromPublishedAt.map((d) => d._id));
  const missing = data.filter((r) => !existing.has(r.danceId));
  const alreadyPublished = data.filter((r) => existing.get(r.danceId)?.published);
  const toWrite = data.filter((r) => existing.has(r.danceId) && !existing.get(r.danceId)!.published && !fromPublishedAtIds.has(r.danceId));
  return { dances, fromPublishedAt, missing, alreadyPublished, toWrite };
}

function precisionCounts(list: Row[]) {
  const counts: Record<string, number> = {};
  for (const r of list) {
    const key = `${r.publishedSource} (${r.published.length === 10 ? "day" : r.published.length === 7 ? "month" : "year"})`;
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

export const migration: Migration = {
  id: "0016-ldco-dances-publish-dates",
  description: "Backfill ldco.dances published / publishedSource (and publishedAt for feed and archived-feed rows) from the evidence-built data file.",
  database: "ldco",

  async plan(db): Promise<MigrationReport> {
    const { fromPublishedAt, missing, alreadyPublished, toWrite } = await load(db);
    return {
      summary: `${toWrite.length} dances to date from the data file, ${fromPublishedAt.length} from their existing publishedAt; ${alreadyPublished.length} already dated, ${missing.length} rows whose dance doesn't exist.`,
      counts: {
        dataRows: data.length,
        toWriteFromData: toWrite.length,
        fromExistingPublishedAt: fromPublishedAt.length,
        alreadyPublished: alreadyPublished.length,
        rowsWithoutDance: missing.length,
        ...precisionCounts(toWrite),
      },
      sample: missing.slice(0, 5),
    };
  },

  async apply(db): Promise<MigrationReport> {
    const { dances, fromPublishedAt, toWrite } = await load(db);
    let derived = 0;
    for (const d of fromPublishedAt) {
      const res = await dances.updateOne(
        { _id: d._id, published: { $exists: false } },
        { $set: { published: d.publishedAt!.toISOString().slice(0, 10), publishedSource: "feed" } },
      );
      derived += res.modifiedCount;
    }
    let written = 0;
    for (const r of toWrite) {
      const set: Record<string, unknown> = { published: r.published, publishedSource: r.publishedSource };
      if (r.publishedAt) set.publishedAt = new Date(r.publishedAt);
      const res = await dances.updateOne({ _id: r.danceId, published: { $exists: false }, publishedAt: { $exists: false } }, { $set: set });
      written += res.modifiedCount;
    }
    return {
      summary: `${written} dances dated from the data file, ${derived} from their existing publishedAt.`,
      counts: { writtenFromData: written, fromExistingPublishedAt: derived, ...precisionCounts(toWrite) },
    };
  },
};
