import type { Migration } from "../types";

const FILTER = { durationMinutes: { $type: "string" } };

export const migration: Migration = {
  id: "0004-bld-event-duration-to-number",
  description: "Convert string bld.events.durationMinutes to a number.",
  database: "bld",

  async plan(db) {
    const docs = await db.collection("events").find(FILTER, { projection: { durationMinutes: 1 } }).toArray();
    const unparseable = docs.filter((d) => !Number.isFinite(Number(d.durationMinutes)));
    return {
      summary: `${docs.length - unparseable.length} durations to convert, ${unparseable.length} unparseable (left alone).`,
      counts: { toConvert: docs.length - unparseable.length, unparseable: unparseable.length },
      sample: docs.slice(0, 3).map((d) => ({ _id: String(d._id), durationMinutes: d.durationMinutes })),
    };
  },

  async apply(db) {
    const col = db.collection("events");
    let converted = 0;
    for await (const doc of col.find(FILTER, { projection: { durationMinutes: 1 } })) {
      const n = Number(doc.durationMinutes);
      if (!Number.isFinite(n)) continue;
      await col.updateOne({ _id: doc._id, durationMinutes: doc.durationMinutes }, { $set: { durationMinutes: n } });
      converted++;
    }
    return { summary: `${converted} durations converted.`, counts: { converted } };
  },
};
