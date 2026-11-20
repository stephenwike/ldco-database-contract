import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { MongoClient } from "mongodb";
import { appDancesByIds, danceExists, difficultyOf, levelIdOf, sampleCommunityDances, searchAppDances, trackIdOf } from "./index";

test("a dance's level reads as the stepsheet gives it, else from its levels", () => {
  assert.equal(difficultyOf({ levelRaw: "High Improver", levels: ["improver"] }), "High Improver");
  assert.equal(difficultyOf({ levels: ["beginner"], levelQualifier: "high" }), "High Beginner");
  assert.equal(difficultyOf({ levels: ["absolute-beginner", "beginner"] }), "Absolute Beginner / Beginner");
  assert.equal(difficultyOf({}), "");
  assert.equal(levelIdOf("Absolute Beginner"), "absolute-beginner");
  assert.equal(levelIdOf(" Improver "), "improver");
});

test("a dance plays the track chosen in the apps, else its first", () => {
  assert.equal(trackIdOf({ tracks: [{ trackId: "a" }, { trackId: "b", versionNote: "chosen in the apps" }] }), "b");
  assert.equal(trackIdOf({ tracks: [{ trackId: "a" }] }), "a");
  assert.equal(trackIdOf({}), "");
});

// Read-only, on this computer's copy of the catalogue (the data desk's working copy); skipped without it
const uri = process.env.MONGODB_URI ?? "";
let client: MongoClient | null = null;
before(async () => {
  if (!/localhost|127\.0\.0\.1/.test(uri)) return;
  try {
    client = await new MongoClient(uri, { serverSelectionTimeoutMS: 2000 }).connect();
    if (!(await client.db("linedance").collection("dances").estimatedDocumentCount())) {
      await client.close();
      client = null;
    }
  } catch {
    client = null;
  }
});
after(() => client?.close());

test("searching and looking up dances on the local catalogue", async (t) => {
  if (!client) return t.skip("needs the local catalogue (MONGODB_URI on localhost, with linedance)");
  const found = await searchAppDances(client, "electric slide", { limit: 5 });
  assert.ok(found.length > 0 && found.length <= 5);
  assert.match(found[0].danceName, /electric slide/i, "the best match first");
  for (const key of ["id", "currentId", "danceName", "difficulty", "levels", "stepsheet", "songName", "artist", "choreographers", "choreographerIds"]) assert.ok(key in found[0], key);

  const withOld = await client.db("linedance").collection("dances").findOne({ "ldcoIds.0": { $exists: true } }, { projection: { ldcoIds: 1 } });
  if (withOld) {
    const oldId = String(withOld.ldcoIds[0]);
    const [d] = await appDancesByIds(client, [oldId, "no-such-dance"]);
    assert.equal(d.id, oldId, "answered under the id asked for");
    assert.equal(d.currentId, String(withOld._id), "with the dance's id now");
    assert.equal(await danceExists(client, oldId), true);
  }
  assert.deepEqual(await appDancesByIds(client, ["no-such-dance"]), []);
  assert.equal(await danceExists(client, "no-such-dance"), false);
});

test("random dances come from those the community uses, of the levels asked for", async (t) => {
  if (!client) return t.skip("needs the local catalogue (MONGODB_URI on localhost, with linedance)");
  const picked = await sampleCommunityDances(client, { levels: ["beginner"], count: 5 });
  assert.ok(picked.length > 0 && picked.length <= 5);
  for (const d of picked) assert.ok(d.levels.includes("beginner"), d.danceName);
  const ids = picked.map((d) => d.currentId);
  const used = await client.db("linedance").collection("dances").countDocuments({ _id: { $in: ids as never[] }, "rankSignals.usage": { $gt: 0 } });
  assert.equal(used, ids.length, "each one used by the community");
});
