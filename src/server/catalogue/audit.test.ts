import test from "node:test";
import assert from "node:assert/strict";
import { cleanAudit, shownValues, wilson } from "./audit";

test("an audit takes known fields and verdicts only", () => {
  assert.deepEqual(cleanAudit({ results: { count: "right", wall: "wrong" }, note: " typo " }), { ok: true, results: { count: "right", wall: "wrong" }, note: "typo" });
  for (const bad of [null, {}, { results: {} }, { results: { count: "maybe" } }, { results: { bpm: "right" } }, { results: [] }]) assert.equal(cleanAudit(bad).ok, false, JSON.stringify(bad));
});

test("the 95% range is wide for few audits and narrows with more", () => {
  const few = wilson(9, 10)!, many = wilson(900, 1000)!;
  assert.ok(few.low < 0.6 && few.high > 0.95);
  assert.ok(many.low > 0.87 && many.high < 0.93); // 88.0% to 91.7%
  assert.equal(wilson(0, 0), null);
});

test("values shown say what's missing and what the stepsheet doesn't state", () => {
  const v = shownValues({
    _id: "d", danceName: "Boots Off", count: 32, wall: null, levels: [], levelQualifier: null, choreographerIds: ["c"],
    songArtists: [{ song: "Boots Off", artist: "Jon Pardi" }], choreographedIn: null, notStated: ["level"], stepsheets: [],
  }, { c: "Rachael McEnaney" }, {});
  assert.deepEqual(v, { danceName: "Boots Off", count: "32", wall: "missing", level: "not stated", choreographers: "Rachael McEnaney", song: "Boots Off – Jon Pardi", choreographedIn: "missing" });
});
