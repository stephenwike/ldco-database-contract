import { applyObjectIdToString, planObjectIdToString } from "../lib/ids";
import type { Migration } from "../types";

const COLLECTIONS = ["users", "user_favorite_dances", "user_flagged_dances", "user_known_dances", "user_refresh_dances"];

export const migration: Migration = {
  id: "0003-ldco-user-ids-to-string",
  description: "Convert ObjectId _id to string (same hex) in ldco.users and the user_* dance collections.",
  database: "ldco",

  async plan(db) {
    const counts: Record<string, number> = {};
    const sample: unknown[] = [];
    for (const c of COLLECTIONS) {
      const p = await planObjectIdToString(db, c);
      counts[c] = p.toConvert;
      counts[`${c} (string twin already present)`] = p.twins;
      if (p.sample.length) sample.push({ collection: c, example: p.sample[0] });
    }
    const total = COLLECTIONS.reduce((n, c) => n + counts[c], 0);
    return { summary: `${total} documents to convert.`, counts, sample };
  },

  async apply(db) {
    const counts: Record<string, number> = {};
    for (const c of COLLECTIONS) counts[c] = await applyObjectIdToString(db, c);
    return { summary: `${Object.values(counts).reduce((a, b) => a + b, 0)} documents converted.`, counts };
  },
};
