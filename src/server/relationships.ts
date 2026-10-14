import { collections } from "@/contract";
import { getDb } from "./mongo";

export interface Relationship {
  from: { collection: string; path: string };
  to: string;
  distinct: number;
  matched: number;
  dangling: number;
  danglingSamples: string[];
}

type Leaves = Map<string, Set<string>>;

const MAX_DISTINCT_PER_FIELD = 100_000;
const MIN_MATCHED = 3;
const MIN_RATIO = 0.3;
const CACHE_MS = 5 * 60_000;

function add(out: Leaves, path: string, value: string) {
  let set = out.get(path);
  if (!set) out.set(path, (set = new Set()));
  if (set.size < MAX_DISTINCT_PER_FIELD) set.add(value);
}

// Collects every string / ObjectId leaf by path; arrays collapse to `path[]`.
function collectLeaves(value: unknown, path: string, out: Leaves) {
  if (typeof value === "string") {
    if (value) add(out, path, value);
  } else if (Array.isArray(value)) {
    for (const v of value) collectLeaves(v, `${path}[]`, out);
  } else if (value && typeof value === "object" && !(value instanceof Date)) {
    const bson = (value as { _bsontype?: string })._bsontype;
    if (bson === "ObjectId") add(out, path, String(value));
    else if (!bson) {
      for (const [k, v] of Object.entries(value)) collectLeaves(v, path ? `${path}.${k}` : k, out);
    }
  }
}

let cache: { at: number; data: Relationship[] } | undefined;

// A field "references" a collection when most of its string values are ids found in that collection.
export async function getRelationships(): Promise<Relationship[]> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.data;

  const idSets = new Map<string, Set<string>>();
  const leavesByCollection = new Map<string, Leaves>();

  for (const { database, name } of Object.values(collections)) {
    const key = `${database}.${name}`;
    const ids = new Set<string>();
    const leaves: Leaves = new Map();
    for await (const doc of (await getDb(database)).collection(name).find()) {
      ids.add(String(doc._id));
      collectLeaves(doc, "", leaves);
    }
    idSets.set(key, ids);
    leavesByCollection.set(key, leaves);
  }

  const result: Relationship[] = [];
  for (const [collection, leaves] of leavesByCollection) {
    for (const [path, values] of leaves) {
      if (path === "_id" || values.size < MIN_MATCHED) continue;

      let best: { to: string; matched: number } | undefined;
      for (const [to, ids] of idSets) {
        let matched = 0;
        for (const v of values) if (ids.has(v)) matched++;
        if (matched >= MIN_MATCHED && (!best || matched > best.matched)) best = { to, matched };
      }
      if (!best || best.matched / values.size < MIN_RATIO) continue;

      const targetIds = idSets.get(best.to)!;
      const missing = [...values].filter((v) => !targetIds.has(v));
      result.push({
        from: { collection, path },
        to: best.to,
        distinct: values.size,
        matched: best.matched,
        dangling: missing.length,
        danglingSamples: missing.slice(0, 5),
      });
    }
  }

  result.sort((a, b) => a.from.collection.localeCompare(b.from.collection) || a.from.path.localeCompare(b.from.path));
  cache = { at: Date.now(), data: result };
  return result;
}
