import type { Db } from "mongodb";
import { LdcoUserRolesSchema } from "../../contract/collections";
import type { Migration } from "../types";

// Decision 30: roles live in ldco.user_roles, and the owner grants them on the admin's Users page, so the first owner
// has to come from here. Stephen's account (the user his instructor profile, f5e37f5a-…, is linked to) becomes owner
// and admin. Roles are only added, never removed, so running it again changes nothing.

const OWNER_USER_ID = "66919a36bfcd4d848099f2ba";
const GRANT = ["owner", "admin"] as const;

/* eslint-disable @typescript-eslint/no-explicit-any */
async function check(db: Db) {
  const user = await db.collection<any>("users").findOne({ _id: OWNER_USER_ID }, { projection: { name: 1 } });
  const current = await db.collection<any>("user_roles").findOne({ _id: OWNER_USER_ID });
  const missing = GRANT.filter((r) => !(current?.roles ?? []).includes(r));
  return { user, current, missing };
}

export const migration: Migration = {
  id: "0022-owner-role",
  description: "Make Stephen's account the owner (owner and admin roles in ldco.user_roles), so he can grant roles from the admin.",
  database: "ldco",

  async plan(db) {
    const c = await check(db);
    if (!c.user) return { summary: `Refuses: no user ${OWNER_USER_ID}.`, counts: { missing: c.missing.length } };
    return {
      summary: c.missing.length ? `${c.user.name ?? OWNER_USER_ID} gets ${c.missing.join(" and ")}${c.current ? ` (has ${c.current.roles.join(", ")})` : ""}.` : `${c.user.name ?? OWNER_USER_ID} already has owner and admin.`,
      counts: { missing: c.missing.length },
      sample: [{ _id: OWNER_USER_ID, roles: [...new Set([...(c.current?.roles ?? []), ...GRANT])] }],
    };
  },

  async apply(db) {
    const c = await check(db);
    if (!c.user) throw new Error(`No user ${OWNER_USER_ID}; nothing changed.`);
    if (!c.missing.length) return { summary: "Already owner and admin; nothing changed.", counts: { granted: 0 } };
    const record = LdcoUserRolesSchema.parse({
      _id: OWNER_USER_ID,
      roles: (["owner", "admin"] as const).filter((r) => [...(c.current?.roles ?? []), ...GRANT].includes(r)),
      grantedBy: "migration 0022-owner-role",
      grantedAt: new Date(),
    });
    await db.collection<any>("user_roles").updateOne({ _id: OWNER_USER_ID }, { $set: record }, { upsert: true });
    return { summary: `${c.user.name ?? OWNER_USER_ID} is owner and admin.`, counts: { granted: c.missing.length } };
  },
};
