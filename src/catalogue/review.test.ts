import test from "node:test";
import assert from "node:assert/strict";
import { planCatalogueMerge as planMerge, suggestKeep } from "./index";

const dance = (o: Record<string, unknown>) => ({
  _id: "x", danceName: "Boots Off", nameKey: "boots off", count: null, wall: null, levels: [], levelQualifier: null, phrased: false, danceType: "line", levelRaw: null,
  choreographerIds: ["rm"], credit: null, songArtists: [], musicRaw: null, bpm: null, introCounts: null, hasTags: null, hasRestarts: null, hasBridge: null,
  choreographedIn: null, published: null, publishedSource: null, stepsheets: [], ...o,
}) as never;

test("the record kept by default: an untranslated stepsheet, then the most facts, then the oldest id", () => {
  const old = dance({ _id: "old", count: 32, wall: 4, levels: ["beginner"], stepsheets: [{ url: "https://www.copperknob.co.uk/stepsheets/196086/boots-off", lang: null }] });
  const reissue = dance({ _id: "new", stepsheets: [{ url: "https://www.copperknob.co.uk/stepsheets/5C29H2X/boots-off", lang: null }] });
  const translation = dance({ _id: "fr", count: 32, wall: 4, levels: ["beginner"], published: "2025", stepsheets: [{ url: "https://www.copperknob.co.uk/stepsheets/196087/boots-off-fr", lang: "fr" }] });
  assert.equal(suggestKeep([reissue, translation, old]), "old");
  assert.equal(suggestKeep([]), null);
});

test("a merge keeps every stepsheet and fills only blanks", () => {
  const keep = dance({ _id: "k", count: 32, wall: null, stepsheets: [{ url: "a", lang: null }], notStated: ["wall", "choreographedIn"] });
  const other = dance({ _id: "o", count: 48, wall: 4, choreographedIn: "2021-08", stepsheets: [{ url: "a", lang: null }, { url: "b", lang: "fr" }], ldcoIds: ["l1"], songArtists: [{ song: "s", artist: "a" }] });
  const { set, addIds } = planMerge(keep, [other]);
  assert.deepEqual(set.stepsheets, [{ url: "a", lang: null }, { url: "b", lang: "fr" }]);
  assert.equal(set.count, undefined, "a value already there is never overwritten");
  assert.equal(set.wall, 4);
  assert.equal(set.choreographedIn, "2021-08");
  assert.deepEqual(set.songArtists, [{ song: "s", artist: "a" }]);
  assert.deepEqual(set.notStated, [], "filled fields aren't 'not stated' any more");
  assert.deepEqual(addIds, ["o", "l1"]);
});

test("an unpublished event dance merged with its copperknob sheet is published", () => {
  const { set } = planMerge(dance({ _id: "k", unpublished: true }), [dance({ _id: "o", stepsheets: [{ url: "u", lang: null }] })]);
  assert.equal(set.unpublished, false);
});
