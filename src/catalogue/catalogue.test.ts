import assert from "node:assert/strict";
import test from "node:test";
import { MongoClient, type Db } from "mongodb";
import { LinedanceDancesSchema, LinedanceChoreographersSchema } from "../contract/collections";
import { keyOf, nameKeyOf, nameWordsOf, matchIds, resolveDances, resolveChoreographers, searchDances, LISTED_DANCES, type DbLike, type WriteDbLike, type ClientLike } from "./index";

// Any driver's Db must fit the catalogue's minimal interface (a type error here fails `npm run typecheck`)
export const fitsDriver = (db: Db): DbLike => db;
// ...and the editing helpers' interface
export const fitsWriteDriver = (db: Db): WriteDbLike => db;
// ...and a client, for the app dances
export const fitsClient = (client: MongoClient): ClientLike => client;

test("keys match the harvester's", () => {
  assert.equal(keyOf("Boot Scootin' Boogie"), "boot scootin boogie");
  assert.equal(keyOf("Rock & Roll"), "rock and roll");
  assert.equal(keyOf("Señorita"), "senorita");
  assert.equal(nameKeyOf("Ali (阿里)"), "ali");
  assert.equal(nameKeyOf("Pull It On Over (Park)"), "pull it on over park");
  assert.deepEqual(nameWordsOf("don t you agree don"), ["don", "t", "you", "agree"]);
});

test("an id leads to its own record first, then to the record that took it over", () => {
  const docs = [
    { _id: "a", ldcoIds: ["old1"] },
    { _id: "b", ldcoIds: ["a"] }, // claims a's id, but a still exists: a wins
  ];
  const m = matchIds(["a", "old1", "gone"], docs);
  assert.equal(m.get("a")?._id, "a");
  assert.equal(m.get("old1")?._id, "a");
  assert.equal(m.get("gone"), null);
});

test("linedance documents: a dance copperknob-alert has just added (no rank yet) is valid", () => {
  const dance = {
    _id: "d", danceName: "Green Door", nameKey: "green door", count: 32, wall: 4, levels: ["beginner"], levelQualifier: null,
    phrased: false, danceType: "line", levelRaw: "Beginner", choreographerIds: ["c"], credit: null,
    songArtists: [{ song: "Green Door", artist: "Shakin' Stevens" }], musicRaw: null, published: "2026-11", publishedSource: "feed",
    stepsheets: [{ url: "https://www.copperknob.co.uk/stepsheets/1/green-door", lang: null }],
  };
  const ok = LinedanceDancesSchema.safeParse(dance);
  assert.equal(ok.success, true, ok.success ? "" : JSON.stringify(ok.error.issues));
  assert.equal(LinedanceDancesSchema.safeParse({ ...dance, published: "Nov 2026" }).success, false);
  assert.equal(LinedanceDancesSchema.safeParse({ ...dance, danceType: "solo" }).success, false);
  assert.equal(LinedanceChoreographersSchema.safeParse({ _id: "c", name: "Jo", nameKey: "jo", aliases: [], countries: [] }).success, true);
});

// Against the local copy of linedance (the data desk's working copy), when there is one
const uri = process.env.MONGODB_URI;
const local = !!uri && /localhost|127\.0\.0\.1/.test(uri);

test("search and lookups on the local catalogue", { skip: !local && "set MONGODB_URI to the local database" }, async () => {
  const client = await new MongoClient(uri!).connect();
  try {
    const db = client.db("linedance");
    if (!(await db.collection("dances").estimatedDocumentCount())) return;
    const tush = await searchDances(db, { q: "tush", filter: LISTED_DANCES, projection: { danceName: 1 } });
    assert.equal(tush.dances[0].danceName, "Tush Push");
    assert.equal(tush.dances[0].match, "start");
    const electric = await searchDances(db, { q: "electric" });
    assert.equal(electric.dances[0].danceName, "Electric Slide");
    // Choreographer names for the page come back too
    for (const d of electric.dances) for (const c of d.choreographerIds ?? []) assert.ok(electric.choreographers[c], c);
    // The plain list is by rank
    const top = await searchDances(db, { filter: LISTED_DANCES, pageSize: 5, projection: { rank: 1 } });
    assert.ok(top.total > 100000);
    assert.ok(top.dances.every((d, i) => i === 0 || (top.dances[i - 1].rank ?? 0) >= (d.rank ?? 0)));
    // Page 2 starts where page 1 ends
    const p2 = await searchDances(db, { q: "electric", page: 1 });
    assert.ok(!p2.dances.some((d) => electric.dances.some((e) => e._id === d._id)));

    // An id ldco knew a dance by leads to the dance (Always: ldco 6af3db94…, linedance 6adf090d…)
    const always = await resolveDances(db, ["6af3db94231295ead1367de5", "6adf090d854d44ce104c4a5f", "000000000000000000000000"], { danceName: 1 });
    assert.equal(always.get("6af3db94231295ead1367de5")?._id, "6adf090d854d44ce104c4a5f");
    assert.equal(always.get("6adf090d854d44ce104c4a5f")?.danceName, "Always");
    assert.equal(always.get("000000000000000000000000"), null);
    // A merged choreographer leads to the person kept
    const people = await resolveChoreographers(db, ["f60ca84689fd6da040fbd097"], { name: 1 });
    assert.equal(people.get("f60ca84689fd6da040fbd097")?._id, "009d102a078d2ca6492231a5");
  } finally {
    await client.close();
  }
});
