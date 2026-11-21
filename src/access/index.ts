import type { DbLike } from "../catalogue/db";

// What a signed-in user may do (decision 30), worked out on the server from the database, never from the browser or a
// token, so taking a role away works on the next check. One copy every app uses.
//   owner        everything (Stephen); implies admin
//   admin        reviewing what users send in, and the data tools
//   instructor   an approved instructor profile linked to the user (ldco.instructors.userId); the instructor CMS
// Owner and admin are stored in ldco.user_roles (one record per user, keyed by user id); instructor isn't stored.

export type Role = "owner" | "admin";
export type Need = Role | "instructor";
export const ROLES: Role[] = ["owner", "admin"];

export interface Access {
  userId: string;
  roles: Role[];
  owner: boolean;
  admin: boolean;
  /** The user's approved instructor profile, if they have one. */
  instructorId: string | null;
}

/** A MongoClient, or anything that hands out the ldco database. */
export interface AccessClientLike {
  db(name: string): DbLike;
}

/** A user's access, from ldco.user_roles and ldco.instructors. A user with neither has an empty Access. */
export async function accessOf(client: AccessClientLike, userId: string): Promise<Access> {
  const id = String(userId ?? "");
  const none: Access = { userId: id, roles: [], owner: false, admin: false, instructorId: null };
  if (!id) return none;
  const ldco = client.db("ldco");
  const [roleDocs, instructors] = await Promise.all([
    ldco.collection("user_roles").find({ _id: id }, { projection: { roles: 1 } }).limit(1).toArray(),
    ldco.collection("instructors").find({ userId: id }, { projection: { _id: 1 } }).limit(1).toArray(),
  ]);
  const roles = ((roleDocs[0]?.roles ?? []) as unknown[]).filter((r): r is Role => ROLES.includes(r as Role));
  const owner = roles.includes("owner");
  return { userId: id, roles, owner, admin: owner || roles.includes("admin"), instructorId: instructors[0] ? String(instructors[0]._id) : null };
}

/** Whether this access meets the need. Owner meets every need; admin meets admin; an instructor profile meets instructor. */
export function can(access: Pick<Access, "owner" | "admin" | "instructorId">, need: Need): boolean {
  if (access.owner) return true;
  if (need === "admin") return access.admin;
  if (need === "instructor") return access.instructorId != null;
  return false;
}

/** The roles to store for a user after the owner changes them: known roles only, each once, owner first. */
export function cleanRoles(roles: unknown): Role[] {
  const list = Array.isArray(roles) ? roles : [];
  return ROLES.filter((r) => list.includes(r));
}
