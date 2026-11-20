import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { MongoClient, type Db } from "mongodb";
import { mergeRecords } from "./merge";
import { undoChoreographerMerge, undoDanceMerge, undoTrackMerge } from "./undo";

// Merging any two records, then undoing it, on a throwaway database on this computer (never live). Skipped when
// MONGODB_URI isn't local or the local database isn't running.
const uri = process.env.MONGODB_URI ?? "";
const local = /localhost|127\.0\.0\.1/.test(uri);
const NAME = "ldco_database_test_merge";
let client: MongoClient | null = null;
let db: Db;

before(async () => {
  if (!local) return;
  try {
    client = await new MongoClient(uri, { serverSelectionTimeoutMS: 2000 }).connect();
    db = client.db(NAME);
    await db.dropDatabase();
  } catch {
    client = null;
  }
});
after(async () => {
  if (client) {
    await db.dropDatabase();
    await client.close();
  }
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const col = (name: string) => db.collection<any>(name);

test("two dances: one kept whole in dance_merges, its id leads to the kept one, and undo puts it back", async (t) => {
  if (!client) return t.skip("needs the local database (MONGODB_URI on localhost, running)");
  await col("dances").insertMany([
    { _id: "k1", danceName: "Boots Off", nameKey: "boots off", levels: ["beginner"], count: 32, wall: 4, choreographerIds: ["c1"], songArtists: [], stepsheets: [{ url: "https://www.copperknob.co.uk/stepsheets/1/a", lang: null }] },
    { _id: "l1", danceName: "Boots Off!", nameKey: "boots off", levels: [], count: null, wall: null, choreographerIds: [], songArtists: [{ song: "Boots", artist: "X" }], stepsheets: [{ url: "https://www.copperknob.co.uk/stepsheets/2/b", lang: null }] },
  ]);
  assert.equal((await mergeRecords(db, "dances", "k1", "l1", "test")).status, 200);
  const kept = await col("dances").findOne({ _id: "k1" });
  assert.equal(await col("dances").countDocuments({ _id: "l1" }), 0);
  assert.ok(kept.ldcoIds.includes("l1"), "the removed dance's id finds the kept one");
  assert.equal(kept.stepsheets.length, 2, "the kept dance gains the other's stepsheet");
  assert.deepEqual(kept.songArtists, [{ song: "Boots", artist: "X" }], "and fills its blank song");
  assert.equal((await col("dance_merges").findOne({ _id: "l1" }))?.into, "k1");

  assert.equal((await undoDanceMerge(db, "l1", "test")).status, 200);
  assert.equal(await col("dances").countDocuments({ _id: "l1" }), 1, "undo brings it back");
  const after = await col("dances").findOne({ _id: "k1" });
  assert.equal(after.stepsheets.length, 1);
  assert.ok(!(after.ldcoIds ?? []).includes("l1"));
});

test("two tracks: the lost one becomes a stub, its dances move, and undo moves them back", async (t) => {
  if (!client) return t.skip("needs the local database (MONGODB_URI on localhost, running)");
  await col("tracks").insertMany([
    { _id: "t1", title: "Boots", artist: "X", key: "boots|x" },
    { _id: "t2", title: "Boots (Radio)", artist: "X", key: "boots radio|x", recordingId: "r1" },
  ]);
  await col("dances").insertOne({ _id: "d1", danceName: "D", nameKey: "d", tracks: [{ trackId: "t2" }] });
  assert.equal((await mergeRecords(db, "tracks", "t1", "t2", "test")).status, 200);
  assert.deepEqual((await col("dances").findOne({ _id: "d1" })).tracks, [{ trackId: "t1" }]);
  assert.equal((await col("tracks").findOne({ _id: "t2" })).mergedInto, "t1");
  assert.equal((await col("tracks").findOne({ _id: "t1" })).recordingId, "r1", "the kept track takes the recording it lacked");
  assert.equal((await col("track_merges").findOne({ _id: "t2" }))?.reason, "picked: same song");

  assert.equal((await undoTrackMerge(db, "t2", "test")).status, 200);
  assert.deepEqual((await col("dances").findOne({ _id: "d1" })).tracks, [{ trackId: "t2" }]);
  assert.equal((await col("tracks").findOne({ _id: "t2" })).mergedInto, undefined);
});

test("two choreographers: the lost one becomes a stub, its dances move, and undo moves them back", async (t) => {
  if (!client) return t.skip("needs the local database (MONGODB_URI on localhost, running)");
  await col("choreographers").insertMany([
    { _id: "p1", name: "Rob Fowler", nameKey: "rob fowler", aliases: [], countries: ["UK"] },
    { _id: "p2", name: "Robert Fowler", nameKey: "robert fowler", aliases: [], countries: [] },
  ]);
  await col("dances").insertOne({ _id: "d2", danceName: "E", nameKey: "e", choreographerIds: ["p2"] });
  assert.equal((await mergeRecords(db, "choreographers", "p1", "p2", "test")).status, 200);
  assert.deepEqual((await col("dances").findOne({ _id: "d2" })).choreographerIds, ["p1"]);
  assert.equal((await col("choreographers").findOne({ _id: "p2" })).mergedInto, "p1");
  assert.ok((await col("choreographers").findOne({ _id: "p1" })).aliases.includes("Robert Fowler"), "the kept person learns the other spelling");

  assert.equal((await undoChoreographerMerge(db, "p2", "test")).status, 200);
  assert.deepEqual((await col("dances").findOne({ _id: "d2" })).choreographerIds, ["p2"]);
});

test("a merge needs two different records that exist", async (t) => {
  if (!client) return t.skip("needs the local database (MONGODB_URI on localhost, running)");
  for (const kind of ["dances", "tracks", "choreographers"] as const) {
    assert.equal((await mergeRecords(db, kind, "x", "x", "test")).status, 400, `${kind}: the same record twice`);
  }
  assert.equal((await mergeRecords(db, "dances", "k1", "nope", "test")).status, 409, "a dance that doesn't exist");
  assert.equal((await mergeRecords(db, "tracks", "t1", "nope", "test")).status, 409, "a track that doesn't exist");
  assert.equal((await mergeRecords(db, "choreographers", "p1", "nope", "test")).status, 409, "a person that doesn't exist");
});
