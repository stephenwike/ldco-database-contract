/**
 * The Dances tools' write routes reject a body that isn't a JSON object before they touch the database (from
 * line-dance-manager-admin's lib/adminBodyGuards.test.mts, for the routes that moved here). PATCH /api/dances/[id] has
 * its own, fuller test in dancePatch.test.ts.
 */
import assert from "node:assert/strict";
import path from "node:path";
import { mock, test } from "node:test";
import { pathToFileURL } from "node:url";
import { NextRequest } from "next/server";

const root = path.resolve(import.meta.dirname, "../..");
const GUARD_ERROR = { error: "JSON body must be an object" };

const dbHits: string[] = [];
const cursor = () => {
  const c = { toArray: async () => [] as unknown[], sort: () => c, project: () => c, limit: () => c, skip: () => c };
  return c;
};
const collection = () => ({
  find: () => cursor(),
  aggregate: () => cursor(),
  findOne: async () => null,
  countDocuments: async () => 0,
  insertOne: async () => ({ insertedId: "id" }),
  updateOne: async () => ({ matchedCount: 0, modifiedCount: 0 }),
  updateMany: async () => ({ matchedCount: 0, modifiedCount: 0 }),
  deleteOne: async () => ({ deletedCount: 0 }),
});
const db = (name: string) =>
  mock.fn(async () => {
    dbHits.push(name);
    return { collection };
  });
const getMainDb = db("getMainDb");
const getReviewDb = db("getReviewDb");

mock.module(pathToFileURL(path.join(root, "src/server/write.ts")).href, {
  namedExports: { getMainDb, getReviewDb, getWriteDb: db("getWriteDb"), getLinedanceDb: db("getLinedanceDb"), editor: async () => "test" },
});

type Handler = (req: NextRequest, ctx: { params: Promise<Record<string, string>> }) => Promise<Response>;
const routes: { label: string; file: string; method: "POST" | "PATCH" }[] = [
  { label: "POST /api/dances", file: "../app/api/dances/route", method: "POST" },
  { label: "POST /api/dances/[id]", file: "../app/api/dances/[id]/route", method: "POST" },
  { label: "POST /api/dances/backfill-tracks", file: "../app/api/dances/backfill-tracks/route", method: "POST" },
  { label: "POST /api/dances/bulk-check", file: "../app/api/dances/bulk-check/route", method: "POST" },
  { label: "POST /api/dances/bulk-import", file: "../app/api/dances/bulk-import/route", method: "POST" },
  { label: "PATCH /api/choreographers/[id]", file: "../app/api/choreographers/[id]/route", method: "PATCH" },
  { label: "POST /api/scrape", file: "../app/api/scrape/route", method: "POST" },
  { label: "POST /api/scrape-choreographer-list", file: "../app/api/scrape-choreographer-list/route", method: "POST" },
];

async function call(handler: Handler, method: string, raw: string) {
  const req = new NextRequest("http://localhost/api/x", { method, headers: { "content-type": "application/json" }, body: raw });
  return handler(req, { params: Promise.resolve({ id: "abc" }) });
}

for (const route of routes) {
  for (const [what, raw] of [["invalid JSON", "{"], ["JSON null", "null"], ["a JSON array", "[]"]] as const) {
    test(`${route.label} rejects ${what} before any database access`, async () => {
      const mod = (await import(route.file)) as Record<string, Handler>;
      dbHits.length = 0;
      const res = await call(mod[route.method], route.method, raw);
      assert.equal(res.status, 400);
      assert.deepEqual(await res.json(), GUARD_ERROR);
      assert.deepEqual(dbHits, []);
    });
  }

  test(`${route.label} lets a JSON object past the guard`, async () => {
    const mod = (await import(route.file)) as Record<string, Handler>;
    const res = await call(mod[route.method], route.method, "{}");
    const text = await res.text();
    let json: { error?: string } = {};
    try {
      json = JSON.parse(text);
    } catch {
      json = {};
    }
    assert.notEqual(json.error, GUARD_ERROR.error, text);
  });
}
