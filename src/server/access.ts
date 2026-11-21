import { accessOf, can, type Access, type Need } from "@/access";
import { getDb } from "./mongo";

// The signed-in user's access, from the package's accessOf (ldco.user_roles and ldco.instructors), cached for a
// minute per user so the proxy doesn't read it on every request. Taking a role away works within a minute.

const TTL_MS = 60_000;
const cache = new Map<string, { at: number; access: Access }>();

export async function accessFor(userId: string): Promise<Access> {
  const hit = cache.get(userId);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.access;
  const ldco = await getDb("ldco");
  const access = await accessOf({ db: () => ldco }, userId);
  cache.set(userId, { at: Date.now(), access });
  return access;
}

export async function allowed(userId: string, need: Need): Promise<boolean> {
  return can(await accessFor(userId), need);
}
