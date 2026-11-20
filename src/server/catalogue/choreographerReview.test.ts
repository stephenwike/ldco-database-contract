import test from "node:test";
import assert from "node:assert/strict";
import { pairKey, uncertainKind } from "./choreographerReview";
import { keyOf } from "@/catalogue";

test("the kinds of pair a person decides (same as ldco-harvester's lib/duplicates.mjs)", () => {
  const kind = (a: string, b: string) => uncertainKind(keyOf(a), keyOf(b));
  assert.equal(kind("K. Smith", "Kathy Smith"), "initial");
  assert.equal(kind("Robert Flether", "Robert Fletcher"), "typo");
  assert.equal(kind("Amy Glass", "Amy Glass Bailey"), "extra name");
  assert.equal(kind("Jesus Moreno", "Jesús Moreno Vera"), "extra name");
  for (const [a, b] of [["Kathy Smith", "Kevin Jones"], ["Amy Glass", "Amy Glass"], ["Jo Hu", "Jo Ho"]]) assert.equal(kind(a, b), null, `${a} / ${b}`);
});

test("a pair has one key whichever way round", () => {
  assert.equal(pairKey("b", "a"), "a|b");
  assert.equal(pairKey("a", "b"), "a|b");
});
