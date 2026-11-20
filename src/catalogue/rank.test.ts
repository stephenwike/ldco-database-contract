import assert from "node:assert/strict";
import test from "node:test";
import { capOf, coreGaps, languagesOf, logScale, monthsOld, rankOf, recencyOf, RANK_WEIGHTS } from "./index";

// Expected values were worked out by ldco-harvester's scripts/lib/rank.mjs rankOf (2026-11-20), which writes the stored
// ranks: the two copies must agree.
const caps = { usage: 40, views: 2500000, languages: 9 };
const round = (parts: Record<string, number>) => Object.fromEntries(Object.entries(parts).map(([k, v]) => [k, Math.round(v * 1e6) / 1e6]));

test("rankOf gives the harvester's ranks", () => {
  const a = rankOf({ usage: 12, views: 850000, languages: 4, monthsOld: 3, gaps: 0 }, caps);
  assert.equal(a.rank, 798);
  assert.deepEqual(round(a.parts), { usage: 0.690696, views: 0.92677, languages: 0.69897, recency: 0.833333, complete: 1 });
  assert.equal(rankOf({ usage: 0, views: 0, languages: 0, monthsOld: null, gaps: 6 }, caps).rank, 0);
  assert.equal(rankOf({ usage: 400, views: 9e7, languages: 30, monthsOld: 0, gaps: 0 }, caps).rank, 1000, "capped at 1000");
  const d = rankOf({ usage: 1, views: 1200, languages: 1, monthsOld: 40, gaps: 2 }, caps);
  assert.equal(d.rank, 295);
  assert.deepEqual(round(d.parts), { usage: 0.186652, views: 0.481334, languages: 0.30103, recency: 0, complete: 0.666667 });
});

test("other weights and recency windows change the rank", () => {
  const s = { usage: 12, views: 850000, languages: 4, monthsOld: 3, gaps: 0 };
  assert.equal(rankOf(s, caps, { ...RANK_WEIGHTS, views: 0 }).rank < rankOf(s, caps).rank, true);
  assert.equal(rankOf(s, caps, RANK_WEIGHTS, 6).parts.recency, 0.5);
});

test("the helpers match the harvester's", () => {
  assert.equal(capOf([0, 5, 1, 9, 3, 0, 7]), 7);
  assert.equal(capOf([0, 0]), 0);
  assert.equal(recencyOf(9), 0.5);
  assert.equal(recencyOf(null), 0);
  assert.equal(logScale(0, 10), 0);
  assert.equal(logScale(10, 0), 0);
  assert.equal(monthsOld("nonsense"), null);
  assert.equal(Math.round(monthsOld("2026-01-01", new Date("2026-07-02T12:00:00Z"))!), 6);
  assert.deepEqual(coreGaps({ levels: [], count: 32, wall: null, choreographerIds: ["c"], songArtists: [], stepsheets: [], notStated: ["wall"] }), ["level", "song", "stepsheet"]);
  assert.equal(languagesOf({ stepsheets: [{ lang: null }, { lang: "de" }, { lang: "nl" }, { lang: "de" }] }), 2);
});
