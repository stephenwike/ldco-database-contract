/**
 * PATCH /api/dances/[id] body handling (from line-dance-manager-admin's lib/dancePatchBody.qa.test.mts).
 * getMainDb is mocked so a rejected body can be shown not to touch the database. Sign-in is the proxy's job here, so
 * the route itself has no session check to test.
 */
import assert from "node:assert/strict";
import path from "node:path";
import { mock, test } from "node:test";
import { pathToFileURL } from "node:url";
import { NextRequest, NextResponse } from "next/server";

const root = path.resolve(import.meta.dirname, "../..");

const calls: string[] = [];

const getMainDb = mock.fn(async (): Promise<unknown> => {
  calls.push("getMainDb");
  throw new Error("database was accessed");
});
const updateOne = mock.fn(async () => {
  calls.push("updateOne");
  return { matchedCount: 1 };
});
const findOne = mock.fn(async () => {
  calls.push("findOne");
  return null;
});
const insertOne = mock.fn(async () => {
  calls.push("insertOne");
  return { insertedId: "x" };
});

mock.module(pathToFileURL(path.join(root, "src/server/write.ts")).href, {
  namedExports: { getMainDb },
});
mock.module("mongodb", {
  namedExports: {
    ObjectId: class ObjectId {
      constructor(id: string) {
        if (!/^[a-f\d]{24}$/i.test(id)) throw new Error("invalid id");
      }
    },
    Document: class Document {},
    Db: class Db {},
  },
});

const { PATCH } = await import("../app/api/dances/[id]/route");

const JSON_HEADERS = { "content-type": "application/json" };
const OBJECT_ERROR = "JSON body must be an object";

function asAdmin() {
  calls.length = 0;
  getMainDb.mock.resetCalls();
  updateOne.mock.resetCalls();
  findOne.mock.resetCalls();
  insertOne.mock.resetCalls();
  getMainDb.mock.mockImplementation(async () => {
    calls.push("getMainDb");
    throw new Error("database was accessed");
  });
}

function asAdminWithDb() {
  asAdmin();
  getMainDb.mock.mockImplementation(async () => {
    calls.push("getMainDb");
    return {
      collection() {
        return { updateOne, findOne, insertOne };
      },
    };
  });
}

function patchRequest(raw: BodyInit | undefined, headers?: Record<string, string>) {
  return new NextRequest("http://localhost/api/dances/abc", {
    method: "PATCH",
    headers,
    body: raw,
  });
}

function send(raw: BodyInit | undefined, headers: Record<string, string> = JSON_HEADERS) {
  return PATCH(patchRequest(raw, headers), { params: Promise.resolve({ id: "abc" }) });
}

async function readJson(res: Response): Promise<{ text: string; body: unknown }> {
  const text = await res.text();
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }
  return { text, body };
}

function assertNoLeak(text: string) {
  assert.equal(text.includes("TypeError"), false, text);
  assert.equal(text.includes("SyntaxError"), false, text);
  assert.equal(text.includes("stack"), false, text);
  assert.equal(/at\s+\S+\.ts:\d+/.test(text), false, text);
  assert.equal(text.includes("route.ts"), false, text);
}

function assertError(body: unknown, message: string) {
  assert.deepEqual(body, { error: message });
}

async function expectObjectRejected(raw: BodyInit | undefined, headers?: Record<string, string>) {
  asAdmin();
  const res = await send(raw, headers);
  const { text, body } = await readJson(res);
  assert.equal(res.status, 400);
  assert.match(res.headers.get("content-type") ?? "", /application\/json/);
  assertError(body, OBJECT_ERROR);
  assertNoLeak(text);
  assert.deepEqual(calls, []);
  assert.equal(getMainDb.mock.callCount(), 0);
  assert.equal(updateOne.mock.callCount(), 0);
  return res;
}

test("PATCH rejects JSON null before any database access", async () => {
  await expectObjectRejected("null");
});

test("PATCH rejects an empty JSON array before any database access", async () => {
  await expectObjectRejected("[]");
});

test("PATCH rejects an array of objects before any database access", async () => {
  await expectObjectRejected("[{}]");
});

test("PATCH rejects a JSON string before any database access", async () => {
  await expectObjectRejected('"string"');
});

test("PATCH rejects a JSON number before any database access", async () => {
  await expectObjectRejected("123");
});

test("PATCH rejects JSON true before any database access", async () => {
  await expectObjectRejected("true");
});

test("PATCH rejects JSON false before any database access", async () => {
  await expectObjectRejected("false");
});

test("PATCH rejects invalid JSON before any database access", async () => {
  await expectObjectRejected("{bad");
});

test("PATCH rejects an empty body before any database access", async () => {
  await expectObjectRejected("");
});

test("PATCH rejects null when Content-Type is missing", async () => {
  const req = patchRequest(new TextEncoder().encode("null"));
  assert.equal(req.headers.get("content-type"), null);
  asAdmin();
  const res = await PATCH(req, { params: Promise.resolve({ id: "abc" }) });
  const { text, body } = await readJson(res);
  assert.equal(res.status, 400);
  assertError(body, OBJECT_ERROR);
  assertNoLeak(text);
  assert.deepEqual(calls, []);
  assert.equal(getMainDb.mock.callCount(), 0);
});

test("PATCH rejects null when Content-Type is text/plain", async () => {
  const req = patchRequest("null", { "content-type": "text/plain" });
  assert.equal(req.headers.get("content-type"), "text/plain");
  asAdmin();
  const res = await PATCH(req, { params: Promise.resolve({ id: "abc" }) });
  const { text, body } = await readJson(res);
  assert.equal(res.status, 400);
  assertError(body, OBJECT_ERROR);
  assertNoLeak(text);
  assert.deepEqual(calls, []);
  assert.equal(getMainDb.mock.callCount(), 0);
});

test("PATCH empty object returns Nothing to update and does open the database", async () => {
  asAdminWithDb();
  const res = await send("{}");
  const { text, body } = await readJson(res);
  assert.equal(res.status, 400);
  assert.match(res.headers.get("content-type") ?? "", /application\/json/);
  assertError(body, "Nothing to update");
  assertNoLeak(text);
  assert.deepEqual(calls, ["getMainDb"]);
  assert.equal(updateOne.mock.callCount(), 0);
  assert.equal(findOne.mock.callCount(), 0);
  assert.equal(insertOne.mock.callCount(), 0);
});

test("PATCH nested null stepsheet is stored as an empty string and hits the database", async () => {
  asAdminWithDb();
  const res = await send(JSON.stringify({ stepsheet: null }));
  const { text, body } = await readJson(res);
  assert.equal(res.status, 200);
  assert.deepEqual(body, { ok: true });
  assertNoLeak(text);
  assert.equal(getMainDb.mock.callCount(), 1);
  assert.equal(updateOne.mock.callCount(), 1);
  const update = (updateOne.mock.calls[0].arguments as unknown[])[1] as { $set: { stepsheet: string } };
  assert.equal(update.$set.stepsheet, "");
  assert.deepEqual(calls.filter(name => name === "getMainDb" || name === "updateOne"), ["getMainDb", "updateOne"]);
});

test("PATCH nested null published stores boolean false and hits the database", async () => {
  asAdminWithDb();
  const res = await send(JSON.stringify({ published: null }));
  const { text, body } = await readJson(res);
  assert.equal(res.status, 200);
  assert.deepEqual(body, { ok: true, published: false });
  assertNoLeak(text);
  assert.equal(getMainDb.mock.callCount(), 1);
  assert.equal(updateOne.mock.callCount(), 1);
  const update = (updateOne.mock.calls[0].arguments as unknown[])[1] as { $set: { published: false } };
  assert.equal(update.$set.published, false);
});

test("PATCH valid object still updates the dance and hits the database", async () => {
  asAdminWithDb();
  const res = await send(JSON.stringify({ stepsheet: "  https://example.com/sheet  " }));
  const { text, body } = await readJson(res);
  assert.equal(res.status, 200);
  assert.deepEqual(body, { ok: true });
  assertNoLeak(text);
  assert.equal(getMainDb.mock.callCount(), 1);
  assert.equal(updateOne.mock.callCount(), 1);
  assert.equal(findOne.mock.callCount(), 0);
  assert.equal(insertOne.mock.callCount(), 0);
  const update = (updateOne.mock.calls[0].arguments as unknown[])[1] as { $set: { stepsheet: string } };
  assert.equal(update.$set.stepsheet, "https://example.com/sheet");
});

test("non-object 400 uses the same shape as the route's other 400s", async () => {
  asAdminWithDb();
  const invalidPublished = await send(JSON.stringify({ published: "nope" }));
  const publishedPayload = await readJson(invalidPublished);
  assert.equal(invalidPublished.status, 400);
  assert.deepEqual(Object.keys(publishedPayload.body as object), ["error"]);
  assert.equal(
    (publishedPayload.body as { error: string }).error,
    "published must be true (publish now) or a UTC date string (YYYY, YYYY-MM, or YYYY-MM-DD)",
  );
  assertNoLeak(publishedPayload.text);
  assert.deepEqual(calls, []);
  assert.equal(getMainDb.mock.callCount(), 0);

  asAdmin();
  const rejected = await send("null");
  const rejectedPayload = await readJson(rejected);
  assert.equal(rejected.status, 400);
  assert.ok(rejectedPayload.body !== null && typeof rejectedPayload.body === "object");
  assert.deepEqual(Object.keys(rejectedPayload.body as object), Object.keys(publishedPayload.body as object));
  assertError(rejectedPayload.body, OBJECT_ERROR);
  assert.equal(resInstance(rejected), true);
});

function resInstance(res: Response) {
  return res instanceof NextResponse || res instanceof Response;
}
