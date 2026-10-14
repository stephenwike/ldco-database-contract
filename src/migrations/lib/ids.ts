import type { Db, ObjectId } from "mongodb";

export async function planObjectIdToString(db: Db, collection: string) {
  const col = db.collection(collection);
  const toConvert = await col.countDocuments({ _id: { $type: "objectId" } });
  const docs = await col.find({ _id: { $type: "objectId" } }, { projection: { _id: 1 } }).toArray();
  const hexes = docs.map((d) => (d._id as unknown as ObjectId).toHexString());
  const twins = hexes.length ? await col.countDocuments({ _id: { $in: hexes as never[] } }) : 0;
  return { toConvert, twins, sample: hexes.slice(0, 2) };
}

// _id is immutable and other unique indexes may collide, so delete the original before inserting the string copy.
export async function applyObjectIdToString(db: Db, collection: string): Promise<number> {
  const col = db.collection(collection);
  let converted = 0;
  for await (const doc of col.find({ _id: { $type: "objectId" } })) {
    const oid = doc._id as unknown as ObjectId;
    await col.deleteOne({ _id: oid as never });
    try {
      await col.insertOne({ ...doc, _id: oid.toHexString() } as never);
    } catch (err) {
      await col.insertOne(doc as never);
      throw err;
    }
    converted++;
  }
  return converted;
}
