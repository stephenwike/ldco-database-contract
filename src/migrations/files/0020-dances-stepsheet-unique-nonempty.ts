import type { Db } from "mongodb";
import type { Migration } from "../types";

// ldco.dances.stepsheet was unique through `stepsheet_1` (unique, sparse), so a missing stepsheet was fine but only
// one dance could have stepsheet "". The admin writes "" while no stepsheet has been assigned yet, so this replaces
// it with `stepsheet_unique_nonempty`: unique only on non-empty strings. Two dances still can't share a URL.
// The new index is built before the old one is dropped, so uniqueness is never off in between.

const OLD = "stepsheet_1";
const NEW = "stepsheet_unique_nonempty";

async function check(db: Db) {
  const dances = db.collection("dances");
  const names = (await dances.indexes()).map((i) => i.name);
  const duplicates = await dances
    .aggregate<{ _id: string; n: number }>([
      { $match: { stepsheet: { $gt: "" } } },
      { $group: { _id: "$stepsheet", n: { $sum: 1 } } },
      { $match: { n: { $gt: 1 } } },
    ])
    .toArray();
  return {
    hasOld: names.includes(OLD),
    hasNew: names.includes(NEW),
    duplicates,
    empty: await dances.countDocuments({ stepsheet: "" }),
  };
}

export const migration: Migration = {
  id: "0020-dances-stepsheet-unique-nonempty",
  description: "Replace ldco.dances index stepsheet_1 with a unique index on non-empty stepsheets, so several dances can have stepsheet \"\".",
  database: "ldco",

  async plan(db) {
    const c = await check(db);
    const steps = [
      c.hasNew ? `${NEW} already exists.` : `Create ${NEW}.`,
      c.hasOld ? `Drop ${OLD}.` : `${OLD} already dropped.`,
    ];
    if (c.duplicates.length) steps.push(`Refuses: ${c.duplicates.length} non-empty stepsheets are shared by more than one dance.`);
    return {
      summary: `${steps.join(" ")} ${c.empty} dances have stepsheet "".`,
      counts: { duplicates: c.duplicates.length, emptyStepsheets: c.empty },
      sample: c.duplicates.slice(0, 10),
    };
  },

  async apply(db) {
    const c = await check(db);
    if (c.duplicates.length) {
      throw new Error(`${c.duplicates.length} non-empty stepsheets are shared by more than one dance; fix them first. Nothing changed.`);
    }
    const dances = db.collection("dances");
    if (!c.hasNew) {
      await dances.createIndex({ stepsheet: 1 }, { name: NEW, unique: true, partialFilterExpression: { stepsheet: { $gt: "" } } });
    }
    if (c.hasOld) await dances.dropIndex(OLD);
    return {
      summary: `${c.hasNew ? `${NEW} already existed` : `Created ${NEW}`}; ${c.hasOld ? `dropped ${OLD}` : `${OLD} was already gone`}.`,
      counts: { created: c.hasNew ? 0 : 1, dropped: c.hasOld ? 1 : 0 },
    };
  },
};
