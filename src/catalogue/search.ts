import type { DbLike, SortSpec } from "./db";
import { keyOf, nameKeyOf } from "./keys";

// Finding dances in the linedance catalogue, most relevant first (decision 28). The same search the data desk
// uses (ldco-harvester desk/lib/search.ts), so a search gives the same order in every app.
//   No search text: every dance matching `filter`, by rank (0–1000, ldco-harvester's npm run rank), then name.
//   Search text:    each match scores points for how well it matches, plus its rank, best first:
//                     name           300  the name is exactly the text
//                     start          200  the name starts with it
//                     word           150  a word in the name starts with it ("tush" finds "Ali's Tush"); several
//                                         words match in any order
//                     choreographer  100  by someone whose name (or a word of it) starts with it
//                     song            80  to a song whose title starts with it
//                   A popular partial match beats an obscure exact one; a dance matching several ways counts its best.
//   A stepsheet address or a 24-character id finds that one dance (old ids too).
// Every query is indexed (nameKey, nameWords, rank + nameKey, choreographerIds, tracks.trackId); each kind of match
// reads at most TIER_LIMIT ids, so a one-letter search stays quick.

export const SEARCH_PAGE_SIZE = 50;
const TIER_LIMIT = 2000;
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export type MatchKind = "id" | "name" | "start" | "word" | "choreographer" | "song";
export const MATCH_POINTS: Record<MatchKind, number> = { id: 1000, name: 300, start: 200, word: 150, choreographer: 100, song: 80 };

/** Dances apps list by default: not unpublished (an event's dance waiting for its stepsheet). */
export const LISTED_DANCES = { unpublished: { $ne: true } };

/* eslint-disable @typescript-eslint/no-explicit-any */
type Dance = { _id: string; rank?: number; [field: string]: any };

/** One query a search made (for measuring its cost, as the data desk's metrics do). */
export interface SearchQuery {
  label: string;
  collection: string;
  kind: "find" | "count";
  filter: object;
  sort?: SortSpec;
  limit?: number;
  skip?: number;
  projection?: Record<string, 1>;
  hint?: SortSpec;
}

export interface SearchOptions {
  /** What the user typed. Empty lists every dance matching `filter` by rank. */
  q?: string;
  /** Narrows every query, e.g. LISTED_DANCES, or { levels: "beginner" }. */
  filter?: object;
  /** 0-based. */
  page?: number;
  pageSize?: number;
  /** Fields to return for each dance on the page (default: all). */
  projection?: Record<string, 1>;
  /** Collects every query made, if given. */
  trace?: SearchQuery[];
}

export interface SearchResult<T> {
  /** How many dances matched (for text searches, those found within each kind's limit). */
  total: number;
  /** True when some kind of match hit its limit, so total is a floor. */
  more: boolean;
  page: number;
  pageSize: number;
  /** The page's dances in order, each with how it matched (null without search text). */
  dances: (T & { match: MatchKind | null })[];
  /** Names of the page's choreographers, by id. */
  choreographers: Record<string, string>;
}

// A word starting with w: through the nameWords index, or for a record not given nameWords yet (new from the feed,
// before the next rank run), through its nameKey
const wordStarts = (w: string) => ({ $or: [{ nameWords: new RegExp(`^${esc(w)}`) }, { nameWords: null, nameKey: new RegExp(`(^| )${esc(w)}`) }] });

export async function searchDances<T extends Dance = Dance>(db: DbLike, options: SearchOptions = {}): Promise<SearchResult<T>> {
  const { q = "", filter = {}, page: rawPage = 0, pageSize = SEARCH_PAGE_SIZE, projection, trace } = options;
  const dances = db.collection("dances");
  const note = (t: SearchQuery) => trace?.push(t);
  const text = q.trim();
  const page = Math.max(0, Math.floor(rawPage));
  const skip = page * pageSize;
  const sort: SortSpec = { rank: -1, nameKey: 1 };

  let ids: string[] = [];
  let total = 0;
  let more = false;
  const kindOf = new Map<string, MatchKind>();
  if (!text) {
    note({ label: "count", collection: "dances", kind: "count", filter });
    note({ label: "page by rank", collection: "dances", kind: "find", filter, sort, skip, limit: pageSize, projection: { _id: 1 } });
    const [n, docs] = await Promise.all([
      dances.countDocuments(filter),
      dances.find(filter, { projection: { _id: 1 } }).sort(sort).skip(skip).limit(pageSize).toArray(),
    ]);
    total = n;
    ids = docs.map((d: Dance) => String(d._id));
  } else {
    const kinds: [MatchKind, object][] = [];
    if (/^https?:\/\//i.test(text)) kinds.push(["id", { "stepsheets.url": text }]);
    else if (/^[0-9a-f]{24}$/i.test(text)) kinds.push(["id", { $or: [{ _id: text }, { ldcoIds: text }] }]);
    else {
      const key = nameKeyOf(text);
      if (key) {
        const words = key.split(" ").filter(Boolean);
        kinds.push(["name", { nameKey: key }]);
        kinds.push(["start", { nameKey: new RegExp(`^${esc(key)}`) }]);
        kinds.push(["word", words.length > 1 ? { $and: words.map(wordStarts) } : wordStarts(key)]);
        const pk = keyOf(text);
        const peopleFilter = { mergedInto: { $exists: false }, ...(pk.includes(" ") ? { nameKey: new RegExp(`(^| )${esc(pk)}`), ...wordStarts(pk.split(" ")[0]) } : wordStarts(pk)) };
        note({ label: "choreographers named", collection: "choreographers", kind: "find", filter: peopleFilter, limit: 300, projection: { _id: 1 } });
        const people = await db.collection("choreographers").find(peopleFilter, { projection: { _id: 1 } }).limit(300).toArray();
        if (people.length) kinds.push(["choreographer", { choreographerIds: { $in: people.map((p: Dance) => String(p._id)) } }]);
        const trackFilter = { key: new RegExp(`^${esc(pk)}`) };
        note({ label: "songs titled", collection: "tracks", kind: "find", filter: trackFilter, limit: 1000, projection: { _id: 1 } });
        const tracks = await db.collection("tracks").find(trackFilter, { projection: { _id: 1 } }).limit(1000).toArray();
        if (tracks.length) kinds.push(["song", { "tracks.trackId": { $in: tracks.map((t: Dance) => String(t._id)) } }]);
      }
    }
    const score = new Map<string, number>();
    for (const [kind, match] of kinds) {
      // Exact and starts-with seek on the name index; left to itself MongoDB may walk the rank index instead
      const hint: SortSpec | undefined = kind === "name" || kind === "start" ? { nameKey: 1 } : undefined;
      const q2 = { $and: [match, filter] };
      note({ label: `match: ${kind}`, collection: "dances", kind: "find", filter: q2, sort, limit: TIER_LIMIT, projection: { _id: 1, rank: 1 }, hint });
      let cursor = dances.find(q2, { projection: { _id: 1, rank: 1 } });
      if (hint) cursor = cursor.hint(hint);
      const found: Dance[] = await cursor.sort(sort).limit(TIER_LIMIT).toArray();
      if (found.length === TIER_LIMIT) more = true;
      for (const d of found) {
        const id = String(d._id);
        const points = MATCH_POINTS[kind] + (d.rank ?? 0);
        if ((score.get(id) ?? -1) < points) {
          score.set(id, points);
          kindOf.set(id, kind);
        }
      }
    }
    const ranked = [...score].sort((a, b) => b[1] - a[1]).map(([id]) => id);
    total = ranked.length;
    ids = ranked.slice(skip, skip + pageSize);
  }

  note({ label: "the page's dances", collection: "dances", kind: "find", filter: { _id: { $in: ids } }, projection });
  const docs = new Map(
    ((await dances.find({ _id: { $in: ids } }, projection ? { projection: { ...projection, choreographerIds: 1 } } : {}).toArray()) as T[]).map((d) => [String(d._id), d]),
  );
  const list = ids.map((id) => docs.get(id)).filter((d): d is T => !!d);
  const people = [...new Set(list.flatMap((d) => (d.choreographerIds ?? []) as string[]))];
  note({ label: "their choreographers' names", collection: "choreographers", kind: "find", filter: { _id: { $in: people } }, projection: { name: 1 } });
  const names = people.length
    ? Object.fromEntries((await db.collection("choreographers").find({ _id: { $in: people } }, { projection: { name: 1 } }).toArray()).map((c: Dance) => [String(c._id), String(c.name)]))
    : {};
  return { total, more, page, pageSize, choreographers: names, dances: list.map((d) => ({ ...d, match: kindOf.get(String(d._id)) ?? null })) };
}
