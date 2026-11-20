import assert from "node:assert/strict";
import { test } from "node:test";
import {
  isPublishDate,
  PUBLISH_DATE_PATTERN,
  readPublishDate,
  resolvePublished,
  unpublishedPublishedConditions,
  utcPublishDay,
} from "./dancePublished";

const UTC_EVENING = new Date("2026-10-27T23:30:00.000Z");
const UTC_AFTER_MIDNIGHT = new Date("2026-10-28T00:30:00.000Z");

test("utcPublishDay uses the UTC calendar day, including across local midnight", () => {
  assert.equal(utcPublishDay(UTC_EVENING), "2026-10-27");
  assert.equal(utcPublishDay(UTC_AFTER_MIDNIGHT), "2026-10-28");
});

test("Publish stores today's UTC day, never boolean true", () => {
  const update = resolvePublished(true, UTC_AFTER_MIDNIGHT);
  assert.equal(update.ok, true);
  if (!update.ok) return;
  assert.equal(update.published, "2026-10-28");
  assert.equal(typeof update.published, "string");
  assert.notEqual(update.published, true);
  assert.match(update.published, PUBLISH_DATE_PATTERN);
});

test("a contract date string is stored unchanged", () => {
  for (const published of ["2024", "2024-10", "2024-10-27"]) {
    const update = resolvePublished(published, UTC_EVENING);
    assert.equal(update.ok, true);
    if (!update.ok) return;
    assert.equal(update.published, published);
  }
});

test("values that are not a calendar string are rejected", () => {
  for (const value of ["true", "2024-1-01", "2024-10-1", "20241027", "", "2024-10-27T00:00:00.000Z", 1, "2024/10/27"]) {
    const update = resolvePublished(value, UTC_EVENING);
    assert.equal(update.ok, false, `expected reject for ${JSON.stringify(value)}`);
  }
});

test("false and null still store boolean false (decision 22 does not define unpublish)", () => {
  for (const value of [false, null]) {
    const update = resolvePublished(value, UTC_EVENING);
    assert.deepEqual(update, { ok: true, published: false });
  }
});

test("only a contract date string counts as published", () => {
  assert.equal(readPublishDate("2026-10-27"), "2026-10-27");
  assert.equal(readPublishDate("2026-10"), "2026-10");
  assert.equal(readPublishDate("2026"), "2026");
  for (const value of [true, false, null, undefined, "", "yes", 1]) {
    assert.equal(isPublishDate(value), false);
    assert.equal(readPublishDate(value), null);
  }
});

test("unpublished query matches legacy booleans and ignores real dates", () => {
  assert.ok(unpublishedPublishedConditions.some(clause => clause.published === true));
  assert.ok(unpublishedPublishedConditions.some(clause => clause.published === false));
  assert.ok(unpublishedPublishedConditions.some(clause => clause.published === null));
  const patternClause = unpublishedPublishedConditions.find(clause => {
    const published = clause.published as { $not?: RegExp } | undefined;
    return published !== null && typeof published === "object" && published.$not instanceof RegExp;
  });
  assert.ok(patternClause);
  const pattern = (patternClause!.published as { $not: RegExp }).$not;
  assert.equal(pattern.test("2026-10-27"), true);
  assert.equal(pattern.test("true"), false);
});
