import type { DbLike } from "./db";

// Following an id an app has stored to the record it means now (decision 28). Apps store dance and choreographer
// ids in users' lists, collections, lessons and DJ Feed requests. Those ids stay valid when the catalogue changes:
//   dances          a dance merged into another, or known to ldco by another id, is listed in the kept dance's
//                   ldcoIds (a merge adds every id the removed dance had, so chains of merges are covered)
//   choreographers  same with ldcoIds; a merged person also stays as a stub with mergedInto
// So a read by id goes through here, never through _id alone.

/* eslint-disable @typescript-eslint/no-explicit-any */
type Doc = { _id: string; ldcoIds?: string[]; mergedInto?: string; [field: string]: any };

/** The filter that finds the records behind any of these ids (all indexed: _id and ldcoIds). */
export const byAnyId = (ids: string[]) => ({ $or: [{ _id: { $in: ids } }, { ldcoIds: { $in: ids } }] });

/** Each requested id with the record it means now, or null when it's gone. Prefers a record's own _id. */
export function matchIds<T extends Doc>(ids: string[], docs: T[]): Map<string, T | null> {
  const own = new Map(docs.map((d) => [String(d._id), d]));
  const old = new Map<string, T>();
  for (const d of docs) for (const x of d.ldcoIds ?? []) if (!old.has(String(x))) old.set(String(x), d);
  return new Map(ids.map((id) => [id, own.get(id) ?? old.get(id) ?? null]));
}

const unique = (ids: string[]) => [...new Set(ids.filter((x) => typeof x === "string" && x))];

/**
 * The dances behind these ids (from lists, collections, lessons…), each id mapped to the dance it means now, or
 * null when it doesn't lead to any dance. projection: the fields to read (ldcoIds is always read).
 */
export async function resolveDances<T extends Doc = Doc>(db: DbLike, ids: string[], projection?: Record<string, 1>): Promise<Map<string, T | null>> {
  const want = unique(ids);
  if (!want.length) return new Map();
  const docs = (await db.collection("dances").find(byAnyId(want), projection ? { projection: { ...projection, ldcoIds: 1 } } : {}).toArray()) as T[];
  return matchIds(want, docs);
}

/** The choreographers behind these ids, following merges (mergedInto) to the person kept. */
export async function resolveChoreographers<T extends Doc = Doc>(db: DbLike, ids: string[], projection?: Record<string, 1>): Promise<Map<string, T | null>> {
  const want = unique(ids);
  if (!want.length) return new Map();
  const people = db.collection("choreographers");
  const proj = projection ? { projection: { ...projection, ldcoIds: 1, mergedInto: 1 } } : {};
  const out = matchIds(want, (await people.find(byAnyId(want), proj).toArray()) as T[]);
  // A merged person leads to the one kept (a few hops at most)
  for (let hop = 0; hop < 5; hop++) {
    const next = unique([...out.values()].map((d) => d?.mergedInto ?? "").filter(Boolean));
    if (!next.length) break;
    const kept = new Map(((await people.find({ _id: { $in: next } }, proj).toArray()) as T[]).map((d) => [String(d._id), d]));
    for (const [id, d] of out) if (d?.mergedInto) out.set(id, kept.get(String(d.mergedInto)) ?? null);
  }
  return out;
}
