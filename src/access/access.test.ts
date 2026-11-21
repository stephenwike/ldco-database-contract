import assert from "node:assert/strict";
import test from "node:test";
import type { MongoClient } from "mongodb";
import { accessOf, can, cleanRoles, type AccessClientLike } from "./index";

// Any driver's MongoClient must fit (a type error here fails `npm run typecheck`)
export const fitsClient = (client: MongoClient): AccessClientLike => client;

// A database of two collections, in memory: find by _id or userId, as accessOf asks
function fakeClient(userRoles: Record<string, unknown[]>, instructorUsers: Record<string, string>): AccessClientLike {
  const rows: Record<string, Record<string, unknown>[]> = {
    user_roles: Object.entries(userRoles).map(([id, roles]) => ({ _id: id, roles })),
    instructors: Object.entries(instructorUsers).map(([id, userId]) => ({ _id: id, userId })),
  };
  return {
    db: () => ({
      collection: (name: string) => ({
        find: (filter: Record<string, unknown>) => {
          const found = (rows[name] ?? []).filter((r) => Object.entries(filter).every(([k, v]) => r[k] === v));
          const cursor = { sort: () => cursor, skip: () => cursor, limit: () => cursor, hint: () => cursor, toArray: async () => found };
          return cursor;
        },
        countDocuments: async () => 0,
      }),
    }),
  };
}

const client = fakeClient({ stephen: ["owner", "admin"], ann: ["admin"], odd: ["admin", "superuser"] }, { i1: "stephen", i2: "bob" });

test("access comes from user_roles and an instructor profile", async () => {
  assert.deepEqual(await accessOf(client, "stephen"), { userId: "stephen", roles: ["owner", "admin"], owner: true, admin: true, instructorId: "i1" });
  assert.deepEqual(await accessOf(client, "ann"), { userId: "ann", roles: ["admin"], owner: false, admin: true, instructorId: null });
  assert.deepEqual(await accessOf(client, "bob"), { userId: "bob", roles: [], owner: false, admin: false, instructorId: "i2" });
  assert.deepEqual(await accessOf(client, "nobody"), { userId: "nobody", roles: [], owner: false, admin: false, instructorId: null });
  assert.deepEqual((await accessOf(client, "odd")).roles, ["admin"], "an unknown role is ignored");
  assert.equal((await accessOf(client, "")).admin, false, "no user, no access");
});

test("owner meets every need; admin and instructor only their own", async () => {
  const [owner, admin, instructor, nobody] = await Promise.all(["stephen", "ann", "bob", "nobody"].map((u) => accessOf(client, u)));
  for (const need of ["owner", "admin", "instructor"] as const) assert.equal(can(owner, need), true, `owner: ${need}`);
  assert.deepEqual([can(admin, "owner"), can(admin, "admin"), can(admin, "instructor")], [false, true, false]);
  assert.deepEqual([can(instructor, "owner"), can(instructor, "admin"), can(instructor, "instructor")], [false, false, true]);
  assert.deepEqual([can(nobody, "owner"), can(nobody, "admin"), can(nobody, "instructor")], [false, false, false]);
});

test("roles to store: known ones only, each once, owner first", () => {
  assert.deepEqual(cleanRoles(["admin", "owner", "admin", "god"]), ["owner", "admin"]);
  assert.deepEqual(cleanRoles("admin"), []);
  assert.deepEqual(cleanRoles(undefined), []);
});
