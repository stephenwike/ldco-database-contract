import type { Db } from "mongodb";
import { keyOf } from "@/catalogue";

// Reviewing choreographer pairs the merge rules won't decide (ldco-harvester's lib/duplicates.mjs finds the same ones):
// an initial ("K. Smith" / "Kathy Smith"), one letter apart ("Robert Flether" / "Robert Fletcher"), or an extra name
// ("Amy Glass" / "Amy Glass Bailey"). Never two people credited on the same dance.
//   same person       the other becomes a stub (mergedInto) whose dances and spellings move to the one kept, as
//                     ldco-harvester's choreographers-live.mjs does, so nothing is deleted
//   different people  recorded in choreographer_pair_reviews, so the pair isn't shown again

export type PairKind = "initial" | "typo" | "extra name";

const editDistance = (a: string, b: string) => {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
};

/** The kind of uncertain pair two name keys make, or null. A copy of ldco-harvester's lib/duplicates.mjs uncertainKind. */
export function uncertainKind(a: string, b: string): PairKind | null {
  if (!a || !b || a === b) return null;
  const x = a.split(" "), y = b.split(" ");
  if (x.length === y.length && x.length >= 2 && x.slice(1).join(" ") === y.slice(1).join(" ") && x[0][0] === y[0][0] && (x[0].length === 1 || y[0].length === 1)) return "initial";
  if (a.length >= 9 && editDistance(a, b) === 1) return "typo";
  const [s, l] = x.length < y.length ? [x, y] : [y, x];
  if (s.length >= 2 && l.length > s.length && s.every((w, i) => l[i] === w)) return "extra name";
  return null;
}

/** The same key for a pair whichever way round. */
export const pairKey = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);

interface Person { _id: string; name: string; nameKey?: string; aliases?: string[]; countries?: string[]; mergedInto?: string }
interface Pair { _id: string; kind: PairKind; ids: [string, string] }

// Working the pairs out reads every choreographer and dance, so the answer is kept for a few minutes
let cache: { at: number; pairs: Pair[]; uses: Map<string, number> } | null = null;
const KEEP_MS = 5 * 60_000;

async function allPairs(db: Db) {
  if (cache && Date.now() - cache.at < KEEP_MS) return cache;
  const people = await db.collection<Person>("choreographers").find({ mergedInto: { $exists: false } }, { projection: { name: 1, nameKey: 1 } }).toArray();
  const uses = new Map<string, number>();
  for await (const d of db.collection("dances").aggregate<{ _id: string; n: number }>([{ $unwind: "$choreographerIds" }, { $group: { _id: "$choreographerIds", n: { $sum: 1 } } }])) uses.set(String(d._id), d.n);
  const together = new Set<string>();
  for await (const d of db.collection<{ choreographerIds: string[] }>("dances").find({ "choreographerIds.1": { $exists: true } }, { projection: { choreographerIds: 1 } })) {
    const ids = d.choreographerIds.map(String);
    for (const a of ids) for (const b of ids) if (a < b) together.add(`${a}|${b}`);
  }
  const reviewed = new Set((await db.collection<{ _id: string }>("choreographer_pair_reviews").find({}, { projection: { _id: 1 } }).toArray()).map((r) => String(r._id)));
  const groups = (first: boolean) => {
    const m = new Map<string, Person[]>();
    for (const p of people) {
      const w = (p.nameKey ?? keyOf(p.name)).split(" ");
      if (w.length < 2) continue;
      const k = first ? w[0] : w[w.length - 1];
      (m.get(k) ?? m.set(k, []).get(k)!).push(p);
    }
    return m.values();
  };
  const found = new Map<string, Pair>();
  for (const first of [false, true]) for (const g of groups(first)) {
    if (g.length > 400) continue;
    for (let i = 0; i < g.length; i++) for (let j = i + 1; j < g.length; j++) {
      const a = String(g[i]._id), b = String(g[j]._id), key = pairKey(a, b);
      if (found.has(key) || together.has(key) || reviewed.has(key)) continue;
      const kind = uncertainKind(g[i].nameKey ?? keyOf(g[i].name), g[j].nameKey ?? keyOf(g[j].name));
      if (kind) found.set(key, { _id: key, kind, ids: [a, b] });
    }
  }
  // Busiest first: those matter most to the catalogue
  const pairs = [...found.values()].sort((p, q) => ((uses.get(q.ids[0]) ?? 0) + (uses.get(q.ids[1]) ?? 0)) - ((uses.get(p.ids[0]) ?? 0) + (uses.get(p.ids[1]) ?? 0)));
  cache = { at: Date.now(), pairs, uses };
  return cache;
}

/** A page of pairs, optionally of one kind, with each person's dance count, countries, other spellings and a few dances. */
export async function listChoreographerPairs(db: Db, { kind, page = 0, size = 25 }: { kind?: string; page?: number; size?: number }) {
  const { pairs, uses } = await allPairs(db);
  const kinds: Record<string, number> = {};
  for (const p of pairs) kinds[p.kind] = (kinds[p.kind] ?? 0) + 1;
  const list = kind ? pairs.filter((p) => p.kind === kind) : pairs;
  const slice = list.slice(page * size, page * size + size);
  const ids = slice.flatMap((p) => p.ids);
  const people = new Map((await db.collection<Person>("choreographers").find({ _id: { $in: ids } }, { projection: { name: 1, aliases: 1, countries: 1, mergedInto: 1 } }).toArray()).map((c) => [String(c._id), c]));
  const out = [];
  for (const p of slice) {
    const side = [];
    for (const id of p.ids) {
      const c = people.get(id);
      if (!c || c.mergedInto) continue;
      const dances = await db.collection<{ _id: string; danceName: string }>("dances").find({ choreographerIds: id }, { projection: { danceName: 1 } }).limit(4).toArray();
      side.push({ _id: id, name: c.name, aliases: (c.aliases ?? []).slice(0, 5), countries: c.countries ?? [], dances: uses.get(id) ?? 0, sample: dances.map((d) => d.danceName) });
    }
    if (side.length === 2) out.push({ _id: p._id, kind: p.kind, people: side });
  }
  return { kinds, total: list.length, pageSize: size, pairs: out };
}

const forget = (key: string) => { if (cache) cache.pairs = cache.pairs.filter((p) => p._id !== key); };

/** "Different people": the pair isn't shown again. */
export async function differentPeople(db: Db, a: string, b: string, by: string) {
  const key = pairKey(a, b);
  const names = (await db.collection<Person>("choreographers").find({ _id: { $in: [a, b] } }, { projection: { name: 1 } }).toArray()).map((c) => c.name);
  await db.collection<{ _id: string }>("choreographer_pair_reviews").updateOne({ _id: key }, { $set: { status: "different", names, by, at: new Date() } }, { upsert: true });
  forget(key);
  return { status: 200 };
}

/** "Same person": loseId becomes a stub pointing at keepId; its dances and spellings move over. */
export async function samePerson(db: Db, keepId: string, loseId: string, by: string) {
  if (!keepId || !loseId || keepId === loseId) return { status: 400, error: "Pick one of the two to keep." };
  const choreographers = db.collection<Person>("choreographers");
  const [keep, lose] = await Promise.all([choreographers.findOne({ _id: keepId }), choreographers.findOne({ _id: loseId })]);
  if (!keep || !lose || keep.mergedInto || lose.mergedInto) return { status: 409, error: "One of these has changed. Reload and try again." };
  const dances = db.collection<{ _id: string; choreographerIds: string[] }>("dances");
  if (await dances.countDocuments({ choreographerIds: { $all: [keepId, loseId] } })) return { status: 409, error: "They're credited together on a dance, so they're two people." };
  const now = new Date();
  let moved = 0;
  const movedDances: string[] = [];
  for (const d of await dances.find({ choreographerIds: loseId }, { projection: { choreographerIds: 1 } }).toArray()) {
    movedDances.push(String(d._id));
    await dances.updateOne({ _id: d._id }, { $set: { choreographerIds: [...new Set(d.choreographerIds.map((id) => (id === loseId ? keepId : id)))] } });
    moved++;
  }
  await choreographers.updateOne({ _id: keepId }, { $addToSet: { aliases: { $each: [lose.name, ...(lose.aliases ?? [])].filter((n) => n !== keep.name) }, countries: { $each: lose.countries ?? [] } } });
  await choreographers.updateOne({ _id: loseId }, { $set: { mergedInto: keepId, mergedAt: now, mergedBy: by, movedDances } });
  await db.collection<{ _id: string }>("choreographer_pair_reviews").updateOne({ _id: pairKey(keepId, loseId) }, { $set: { status: "same", kept: keepId, names: [keep.name, lose.name], by, at: now } }, { upsert: true });
  forget(pairKey(keepId, loseId));
  return { status: 200, dancesMoved: moved };
}
