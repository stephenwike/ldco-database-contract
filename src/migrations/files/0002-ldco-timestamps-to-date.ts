import type { Migration, MigrationReport } from "../types";
import { legacyTimestampToDate } from "../lib/time";

const TARGETS: { collection: string; fields: string[] }[] = [
  { collection: "dance_collections", fields: ["createdAt", "updatedAt"] },
  { collection: "dance_tracks", fields: ["createdAt"] },
  { collection: "user_favorite_dances", fields: ["createdAt"] },
  { collection: "user_flagged_dances", fields: ["createdAt"] },
  { collection: "user_known_dances", fields: ["createdAt"] },
  { collection: "user_refresh_dances", fields: ["createdAt"] },
];

export const migration: Migration = {
  id: "0002-ldco-timestamps-to-date",
  description: "Convert string timestamps in ldco to BSON Dates; offset-less strings are Mountain Time (America/Denver).",
  database: "ldco",

  async plan(db) {
    const counts: Record<string, number> = {};
    const sample: unknown[] = [];
    let unparsable = 0;
    for (const { collection, fields } of TARGETS) {
      for (const field of fields) {
        const docs = await db.collection(collection).find({ [field]: { $type: "string" } }, { projection: { [field]: 1 } }).toArray();
        counts[`${collection}.${field}`] = docs.length;
        for (const doc of docs) {
          const parsed = legacyTimestampToDate(doc[field] as string);
          if (!parsed) unparsable++;
          else if (sample.length < 4 && !sample.some((s) => (s as { collection: string }).collection === collection)) {
            sample.push({ collection, from: doc[field], to: parsed.date.toISOString(), assumedMountain: parsed.assumedMountain });
          }
        }
      }
    }
    return { summary: `${Object.values(counts).reduce((a, b) => a + b, 0)} string timestamps to convert, ${unparsable} unparsable.`, counts: { ...counts, unparsable }, sample };
  },

  async apply(db) {
    const counts: Record<string, number> = {};
    let skipped = 0;
    for (const { collection, fields } of TARGETS) {
      for (const field of fields) {
        const col = db.collection(collection);
        let converted = 0;
        for await (const doc of col.find({ [field]: { $type: "string" } }, { projection: { [field]: 1 } })) {
          const parsed = legacyTimestampToDate(doc[field] as string);
          if (!parsed) {
            skipped++;
            continue;
          }
          await col.updateOne({ _id: doc._id }, { $set: { [field]: parsed.date } });
          converted++;
        }
        counts[`${collection}.${field}`] = converted;
      }
    }
    const report: MigrationReport = { summary: `${Object.values(counts).reduce((a, b) => a + b, 0)} timestamps converted, ${skipped} skipped.`, counts: { ...counts, skipped } };
    return report;
  },
};
