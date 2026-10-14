import { ObjectId } from "mongodb";
import type { Migration } from "../types";

export const migration: Migration = {
  id: "0001-dances-objectid-to-string",
  description: "Convert dances with an ObjectId _id to the contract's string _id (same hex value).",
  database: "ldco",

  async plan(db) {
    const dances = db.collection<{ _id: ObjectId | string }>("dances");
    const docs = await dances.find({ _id: { $type: "objectId" } }, { projection: { _id: 1, danceName: 1 } }).toArray();
    const hexes = docs.map((d) => (d._id as ObjectId).toHexString());
    const conflicts = hexes.length ? await dances.countDocuments({ _id: { $in: hexes } }) : 0;
    return {
      summary: `${docs.length} dances to convert, ${conflicts} already have a string twin.`,
      counts: { toConvert: docs.length, stringTwinsAlreadyPresent: conflicts },
      sample: docs.slice(0, 3).map((d) => ({ from: String(d._id), to: (d._id as ObjectId).toHexString() })),
    };
  },

  async apply(db) {
    const dances = db.collection("dances");
    let converted = 0;
    // _id is immutable and `stepsheet` is unique, so the original must go before its string twin is inserted.
    for await (const doc of dances.find({ _id: { $type: "objectId" } })) {
      const oid = doc._id as unknown as ObjectId;
      await dances.deleteOne({ _id: oid as never });
      try {
        await dances.insertOne({ ...doc, _id: oid.toHexString() } as never);
      } catch (err) {
        await dances.insertOne(doc as never);
        throw err;
      }
      converted++;
    }
    return { summary: `${converted} dances converted.`, counts: { converted } };
  },
};
