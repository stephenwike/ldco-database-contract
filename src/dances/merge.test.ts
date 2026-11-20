import assert from "node:assert/strict";
import { test } from "node:test";
import { findUnpublishedMatch, mergedDance, nameKeys, replaceId, type LocatedDance } from "./index";

test("bulk import publishes in place only for exactly one same-name dance with a shared choreographer", () => {
  const dance = { title: "Pull It On Over", choreographerIds: ["jen"], choreographerNames: ["Jen Smith"] };
  const a = { _id: "a", danceName: "Pull It On Over (Park)", choreographers: ["jen"] };
  const b = { _id: "b", danceName: "Pull it on over", choreographers: [], unresolvedChoreographers: ["Jen Smith"] };
  const c = { _id: "c", danceName: "Pull It On Over", choreographers: ["other"] };
  assert.equal(findUnpublishedMatch(dance, [a, c])?._id, "a");
  assert.equal(findUnpublishedMatch(dance, [b])?._id, "b");
  assert.equal(findUnpublishedMatch(dance, [a, b]), undefined, "two qualify: ambiguous");
  assert.equal(findUnpublishedMatch(dance, [c]), undefined);
});

const unpublished: LocatedDance = {
  location: "ldco-reviews",
  doc: {
    _id: "u1",
    danceName: "Liquid Motion",
    difficulty: "Improver",
    choreographers: [],
    unresolvedChoreographers: ["Giuseppe Scaccianoce"],
    stepsheet: "",
    primaryTrack: "",
    tracks: [],
    reviewKind: "unpublished",
    sourceEvent: "VDE 2026",
    createdBy: "user1",
    createdAt: new Date("2026-11-10T00:00:00Z"),
  },
};

const published: LocatedDance = {
  location: "ldco",
  doc: {
    _id: "p1",
    danceName: "Liquid Motion",
    difficulty: "Intermediate",
    choreographers: ["giuseppe"],
    stepsheet: "https://www.copperknob.co.uk/stepsheets/1/liquid-motion",
    stepsheetUrls: [],
    primaryTrack: "",
    tracks: [],
    songArtists: [{ song: "Liquid", artist: "Someone" }],
    publishedAt: new Date("2026-11-20T10:00:00Z"),
    published: "2026-11-20",
    publishedSource: "feed",
  },
};

test("keeping the unpublished id takes the published dance's data and drops the review fields", () => {
  const { doc, location } = mergedDance(unpublished, published);
  assert.equal(location, "ldco");
  assert.equal(doc._id, "u1");
  assert.equal(doc.difficulty, "Intermediate");
  assert.deepEqual(doc.choreographers, ["giuseppe"]);
  assert.equal(doc.stepsheet, published.doc.stepsheet);
  assert.equal(doc.published, "2026-11-20");
  assert.equal(doc.publishedSource, "feed");
  assert.deepEqual(doc.songArtists, published.doc.songArtists);
  for (const k of ["reviewKind", "unresolvedChoreographers", "sourceEvent", "createdBy", "createdAt"]) assert.equal(k in doc, false, k);
});

test("keeping the published id keeps its data", () => {
  const { doc, location } = mergedDance(published, unpublished);
  assert.equal(location, "ldco");
  assert.equal(doc._id, "p1");
  assert.equal(doc.difficulty, "Intermediate");
});

test("two published dances keep every stepsheet, the kept one primary", () => {
  const other: LocatedDance = { location: "ldco", doc: { ...published.doc, _id: "p2", stepsheet: "https://example.com/b", stepsheetUrls: ["https://example.com/c"], primaryTrack: "t1", tracks: ["t1"] } };
  const { doc } = mergedDance(published, other);
  assert.equal(doc.stepsheet, published.doc.stepsheet);
  assert.deepEqual(doc.stepsheetUrls, ["https://example.com/b", "https://example.com/c"]);
  assert.equal(doc.primaryTrack, "t1", "a missing track is filled from the other dance");
});

test("two unpublished dances stay in review with both dances' unresolved names", () => {
  const other: LocatedDance = { location: "ldco-reviews", doc: { ...unpublished.doc, _id: "u2", unresolvedChoreographers: ["Someone Else"] } };
  const { doc, location } = mergedDance(unpublished, other);
  assert.equal(location, "ldco-reviews");
  assert.equal(doc.reviewKind, "unpublished");
  assert.equal(doc.sourceEvent, "VDE 2026");
  assert.deepEqual(doc.unresolvedChoreographers, ["Giuseppe Scaccianoce", "Someone Else"]);
});

test("replaceId repoints and drops the repeat when both were present", () => {
  assert.deepEqual(replaceId(["a", "p1", "b", "u1"], "p1", "u1"), ["a", "u1", "b"]);
  assert.deepEqual(replaceId(["a", "b"], "p1", "u1"), ["a", "b"]);
});

test("name keys match copperknob-alert's", () => {
  assert.deepEqual(nameKeys("Pull It On Over (Park)"), ["pull it on over park", "pull it on over"]);
  assert.deepEqual(nameKeys("Joe’s Cotton Eyes"), ["joes cotton eyes"]);
});
