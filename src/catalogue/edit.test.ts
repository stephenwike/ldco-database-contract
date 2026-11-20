import assert from "node:assert/strict";
import { test } from "node:test";
import { cleanDancePatch, danceFilter, filledStatable, gapsOf, keyOf, nameKeyOf, yearFields } from "./index";

const LEVELS = ["absolute-beginner", "beginner", "improver", "intermediate", "advanced"];
const patch = (body: unknown) => cleanDancePatch(body, LEVELS);
const refused = (body: unknown) => {
  const r = patch(body);
  assert.equal(r.ok, false, JSON.stringify(body));
};

test("names are keyed the way the catalogue builds them", () => {
  assert.equal(keyOf("Brand & New!"), "brand and new");
  assert.equal(nameKeyOf("Beautiful (美麗佳人)"), "beautiful");
  assert.equal(nameKeyOf("B.C.O (Baby Come On)"), "b c o baby come on");
  assert.equal(nameKeyOf("美麗佳人"), "美麗佳人");
});

test("a dance's gaps come from blank fields", () => {
  const whole = { levels: ["beginner"], count: 32, wall: 4, choreographerIds: ["c"], songArtists: [{ song: "s", artist: "a" }], stepsheets: [{ url: "u", lang: null }], published: "2020", choreographedIn: "2019-11" };
  assert.deepEqual(gapsOf(whole), []);
  assert.deepEqual(gapsOf({ ...whole, levels: [], published: null }), ["level", "published"]);
  assert.deepEqual(gapsOf({ ...whole, count: null, wall: null }), ["count", "wall"]);
  // What the stepsheet doesn't state isn't a gap; a stated 0 is a value
  assert.deepEqual(gapsOf({ ...whole, count: null, wall: null, levels: [], choreographerIds: [], notStated: ["count", "level", "choreographer"] }), ["wall"]);
  assert.deepEqual(gapsOf({ ...whole, count: 0, wall: 0 }), []);
  assert.deepEqual(gapsOf({ ...whole, choreographedIn: null }), ["choreographedIn"]);
  assert.deepEqual(gapsOf({ ...whole, choreographedIn: null, notStated: ["choreographedIn"] }), []);
  // An unpublished dance (from an event) has no stepsheet yet: not a gap
  assert.deepEqual(gapsOf({ ...whole, stepsheets: [], unpublished: true }), []);
  assert.deepEqual(gapsOf({ ...whole, stepsheets: [] }), ["stepsheet"]);
});

test("a rename updates nameKey and nameWords too", () => {
  const r = patch({ danceName: "  Walker  " });
  assert.ok(r.ok);
  assert.deepEqual(r.set, { danceName: "Walker", nameKey: "walker", nameWords: ["walker"] });
  // nameWords is what the word search looks up: each word once
  const r2 = patch({ danceName: "Ali's Tush Tush" });
  assert.ok(r2.ok);
  assert.deepEqual(r2.set, { danceName: "Ali's Tush Tush", nameKey: "ali s tush tush", nameWords: ["ali", "s", "tush"] });
  refused({ danceName: "   " });
});

test("numbers are checked, and blank is allowed", () => {
  assert.ok(patch({ count: 32, wall: 4, introCounts: 0 }).ok);
  assert.ok(patch({ count: null, wall: null, introCounts: null }).ok);
  assert.ok(patch({ count: 0, wall: 0 }).ok); // what some stepsheets say
  for (const bad of [{ count: -1 }, { count: "32" }, { count: 1.5 }, { wall: 66 }, { wall: 9 }, { introCounts: -1 }]) refused(bad);
});

test("levels must be known, and are kept in ladder order", () => {
  const r = patch({ levels: ["intermediate", "beginner", "beginner"] });
  assert.ok(r.ok);
  assert.deepEqual(r.set.levels, ["beginner", "intermediate"]);
  assert.ok(patch({ levels: [] }).ok);
  refused({ levels: ["novice"] });
  refused({ levelQualifier: "very" });
  refused({ danceType: "polka" });
});

test("a publish date keeps its precision and is marked as manual", () => {
  for (const value of ["2024", "2024-03", "2024-03-09"]) {
    const r = patch({ published: value });
    assert.ok(r.ok);
    assert.deepEqual(r.set, { published: value, publishedSource: "manual" });
  }
  const cleared = patch({ published: "" });
  assert.ok(cleared.ok);
  assert.deepEqual(cleared.set, { published: null, publishedSource: null });
  for (const bad of ["March 2024", "2024-13", "2024-03-32", "24"]) refused({ published: bad });
});

test("songs need a title and an artist", () => {
  const r = patch({ songArtists: [{ song: " Hey ", artist: " You " }] });
  assert.ok(r.ok);
  assert.deepEqual(r.set.songArtists, [{ song: "Hey", artist: "You" }]);
  assert.ok(patch({ songArtists: [] }).ok);
  refused({ songArtists: [{ song: "Hey", artist: "" }] });
});

test("stepsheets need a web address and a real language code", () => {
  const r = patch({ stepsheets: [{ url: "https://x/1", lang: "DE", title: "T (de)" }, { url: "https://x/2", lang: "" }] });
  assert.ok(r.ok);
  assert.deepEqual(r.set.stepsheets, [{ url: "https://x/1", lang: "de", title: "T (de)" }, { url: "https://x/2", lang: null }]);
  refused({ stepsheets: [{ url: "javascript:alert(1)", lang: null }] });
  refused({ stepsheets: [{ url: "https://x/1", lang: "german" }] });
  refused({ stepsheets: [{ url: "https://x/1" }, { url: "https://x/1" }] });
});

test("only known fields can be edited", () => {
  for (const bad of [{ _id: "x" }, { nameKey: "x" }, { editedFields: [] }, { ldcoIds: [] }, { publishedSource: "feed" }, { $set: { count: 1 } }]) refused(bad);
  refused({});
  refused(null);
  refused([]);
});

test("the browse filter combines what's asked for", () => {
  assert.deepEqual(danceFilter({}), {});
  assert.deepEqual(danceFilter({ gaps: ["count", "nonsense"] }), { $and: [{ count: null, notStated: { $ne: "count" } }] });
  assert.deepEqual(danceFilter({ q: "https://x/stepsheets/1/a" }), { $and: [{ "stepsheets.url": "https://x/stepsheets/1/a" }] });
  assert.deepEqual(danceFilter({ lang: "fr", level: "beginner", choreographerId: "c1" }), { $and: [{ "stepsheets.lang": "fr" }, { levels: "beginner" }, { choreographerIds: "c1" }] });
  const text = danceFilter({ q: "Rock & (Roll" }) as { $and: { nameKey: RegExp }[] };
  assert.equal(text.$and[0].nameKey.source, "^rock and roll");
});

test("a value filled in by hand is no longer 'not stated'", () => {
  assert.deepEqual(filledStatable({ count: 32, wall: 0, levels: ["beginner"], choreographerIds: ["c"] }), ["level", "count", "wall", "choreographer"]);
  assert.deepEqual(filledStatable({ count: null, levels: [], danceName: "x" }), []);
});

test("a choreographed date by hand", () => {
  for (const v of ["2021", "2021-08"]) assert.deepEqual(patch({ choreographedIn: v }), { ok: true, set: { choreographedIn: v } });
  assert.deepEqual(patch({ choreographedIn: "" }), { ok: true, set: { choreographedIn: null } });
  for (const bad of ["August 2021", "2021-13", "2021-08-01", "21"]) assert.ok(!patch({ choreographedIn: bad }).ok, bad);
  assert.deepEqual(filledStatable({ choreographedIn: "2021" }), ["choreographedIn"]);
});

test("the date fields: choreographed first, then published (same as ldco-harvester's yearFields)", () => {
  assert.deepEqual(yearFields({ choreographedIn: "2021-08", published: "2022" }), { year: 2021, yearFrom: "choreographed", dateKey: "2021-08-31" });
  assert.deepEqual(yearFields({ published: "2012" }), { year: 2012, yearFrom: "published", dateKey: "2012-12-31" });
  assert.deepEqual(yearFields({ published: "2019-03-14" }), { year: 2019, yearFrom: "published", dateKey: "2019-03-14" });
  assert.deepEqual(yearFields({}), { year: null, yearFrom: null, dateKey: null });
});
