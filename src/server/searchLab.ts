import { BSON, type Db, type Document } from "mongodb";
import {
  GAPS,
  keyOf,
  MATCH_POINTS,
  nameKeyOf,
  RANK_RECENT_MONTHS,
  RANK_WEIGHTS,
  rankCaps,
  rankExpressions,
  searchDances,
  type RankCaps,
  type RankWeights,
  type SearchQuery,
} from "@/catalogue";

// The search lab (decision 29), from the harvester's data desk: the package's search and rank with every weight
// adjustable, so a change can be tried before it goes into the package. Read-only: nothing is saved or written.
//   labSearch      the rank worked out inside MongoDB from each dance's stored rankSignals with the lab's weights
//                  (rankExpressions), plus match points, so trying weights rewrites nothing
//   measureSearch  the package's searchDances as the apps run it (stored rank, indexed queries, the lab's match
//                  points), with MongoDB's explain of every query it makes: what one search costs

export type MatchTier = "name" | "start" | "word" | "choreographer" | "song";
export interface LabSettings {
  weights: RankWeights;
  recentMonths: number;
  matchPoints: Record<MatchTier, number>;
}
export const LAB_DEFAULTS: LabSettings = {
  weights: { ...RANK_WEIGHTS },
  recentMonths: RANK_RECENT_MONTHS,
  matchPoints: { name: MATCH_POINTS.name, start: MATCH_POINTS.start, word: MATCH_POINTS.word, choreographer: MATCH_POINTS.choreographer, song: MATCH_POINTS.song },
};
const TIERS: MatchTier[] = ["name", "start", "word", "choreographer", "song"];
const PAGE = 50;
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const num = (v: unknown, min: number, max: number, fallback: number) => (typeof v === "number" && Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : fallback);

/** Settings from a request, each value kept in range; anything missing or odd falls back to what's in use. */
export function cleanSettings(raw: unknown): LabSettings {
  const r = (raw && typeof raw === "object" ? raw : {}) as Partial<Record<keyof LabSettings, Record<string, unknown>>> & { recentMonths?: unknown };
  const weights = Object.fromEntries((Object.keys(RANK_WEIGHTS) as (keyof RankWeights)[]).map((k) => [k, num(r.weights?.[k], 0, 1, RANK_WEIGHTS[k])])) as RankWeights;
  const matchPoints = Object.fromEntries(TIERS.map((t) => [t, num(r.matchPoints?.[t], 0, 2000, LAB_DEFAULTS.matchPoints[t])])) as Record<MatchTier, number>;
  return { weights, recentMonths: num(r.recentMonths, 1, 120, RANK_RECENT_MONTHS), matchPoints };
}

// The caps change only when the harvester re-ranks: worked out once every ten minutes
let capsCache: { at: number; caps: RankCaps } | null = null;
async function caps(db: Db) {
  if (capsCache && Date.now() - capsCache.at < 10 * 60_000) return capsCache.caps;
  capsCache = { at: Date.now(), caps: await rankCaps(db) };
  return capsCache.caps;
}

export async function labSearch(db: Db, q: string, gap: string, s: LabSettings, page = 0) {
  const started = Date.now();
  const c = await caps(db);
  const text = q.trim();
  const key = text ? nameKeyOf(text) : "";
  const words = key.split(" ").filter(Boolean);
  const and: Document[] = [];
  const gapFilter = GAPS.find((g) => g.id === gap)?.filter;
  if (gapFilter) and.push(gapFilter);

  // What each kind of match is, for the filter and for its points
  let flags: Partial<Record<MatchTier, Document>> = {};
  if (key) {
    const people = (await db.collection("choreographers").find({ mergedInto: { $exists: false }, nameKey: new RegExp(`(^| )${esc(keyOf(text))}`) }, { projection: { _id: 1 } }).limit(300).toArray()).map((p) => p._id);
    const tracks = (await db.collection("tracks").find({ key: new RegExp(`^${esc(keyOf(text))}`) }, { projection: { _id: 1 } }).limit(1000).toArray()).map((t) => t._id);
    const wordRe = words.length > 1 ? null : `(^| )${esc(key)}`;
    flags = {
      name: { $eq: ["$nameKey", key] },
      start: { $regexMatch: { input: "$nameKey", regex: `^${esc(key)}` } },
      word: wordRe ? { $regexMatch: { input: "$nameKey", regex: wordRe } } : { $and: words.map((w) => ({ $regexMatch: { input: "$nameKey", regex: `(^| )${esc(w)}` } })) },
      choreographer: { $gt: [{ $size: { $setIntersection: [{ $ifNull: ["$choreographerIds", []] }, people] } }, 0] },
      song: { $gt: [{ $size: { $setIntersection: [{ $ifNull: ["$tracks.trackId", []] }, tracks] } }, 0] },
    };
    and.push({
      $or: [
        { nameKey: new RegExp(`^${esc(key)}`) },
        wordRe ? { nameKey: new RegExp(wordRe) } : { $and: words.map((w) => ({ nameKey: new RegExp(`(^| )${esc(w)}`) })) },
        ...(people.length ? [{ choreographerIds: { $in: people } }] : []),
        ...(tracks.length ? [{ "tracks.trackId": { $in: tracks } }] : []),
      ],
    });
  }
  const tiers = TIERS.filter((t) => flags[t]);
  const rank = rankExpressions(c, s.weights, s.recentMonths);

  const [r] = await db
    .collection("dances")
    .aggregate<{ total: { n: number }[]; rows: Document[] }>(
      [
        ...(and.length ? [{ $match: { $and: and } }] : []),
        { $addFields: { _m: Object.fromEntries(tiers.map((t) => [t, flags[t]])), _rankParts: rank.parts } },
        {
          $addFields: {
            labRank: rank.rank,
            matchPoints: tiers.length ? { $max: tiers.map((t) => ({ $cond: [`$_m.${t}`, s.matchPoints[t], 0] })) } : 0,
          },
        },
        { $addFields: { score: { $add: ["$labRank", "$matchPoints"] } } },
        {
          $facet: {
            total: [{ $count: "n" }],
            rows: [
              { $sort: { score: -1, nameKey: 1 } },
              { $skip: page * PAGE },
              { $limit: PAGE },
              { $project: { danceName: 1, choreographerIds: 1, count: 1, wall: 1, levels: 1, year: 1, rank: 1, rankSignals: 1, labRank: 1, matchPoints: 1, score: 1, _m: 1, _rankParts: 1 } },
            ],
          },
        },
      ],
      { allowDiskUse: true },
    )
    .toArray();

  const rows = r?.rows ?? [];
  const ids = [...new Set(rows.flatMap((d) => (d.choreographerIds ?? []) as string[]))];
  const names = Object.fromEntries(
    (await db.collection<{ _id: string; name: string }>("choreographers").find({ _id: { $in: ids } }, { projection: { name: 1 } }).toArray()).map((x) => [x._id, x.name]),
  );
  return {
    total: r?.total?.[0]?.n ?? 0,
    pageSize: PAGE,
    caps: c,
    ms: Date.now() - started,
    rows: rows.map((d) => ({
      _id: String(d._id),
      danceName: d.danceName as string,
      choreographers: ((d.choreographerIds ?? []) as string[]).map((x) => names[x] ?? "?").join(" & "),
      count: (d.count ?? null) as number | null,
      wall: (d.wall ?? null) as number | null,
      levels: (d.levels ?? []) as string[],
      year: (d.year ?? null) as number | null,
      storedRank: (d.rank ?? null) as number | null,
      labRank: d.labRank as number,
      matchPoints: d.matchPoints as number,
      score: d.score as number,
      matched: tiers.filter((t) => d._m?.[t]),
      parts: d._rankParts as Record<string, number>,
      signals: (d.rankSignals ?? null) as Record<string, number> | null,
    })),
  };
}

// ── What a search costs ──────────────────────────────────────────────────────────────────────────────────────────

export interface QueryCost {
  label: string;
  collection: string;
  keys: number;
  docs: number;
  returned: number;
  ms: number;
  plan: string;
  wasteful: boolean;
}

function planOf(p: Document | undefined): string {
  if (!p) return "";
  const stages: string[] = [];
  const walk = (n: Document | undefined) => {
    if (!n) return;
    stages.push(n.indexName ? `${n.stage}(${n.indexName})` : n.stage);
    walk(n.inputStage);
    for (const c of n.inputStages ?? []) walk(c);
  };
  walk(p.queryPlan ?? p);
  return stages.filter(Boolean).join(" ← ");
}

async function explain(db: Db, t: SearchQuery): Promise<QueryCost> {
  let e: Document;
  if (t.kind === "count") e = await db.command({ explain: { count: t.collection, query: t.filter }, verbosity: "executionStats" });
  else {
    let cur = db.collection(t.collection).find(t.filter as Document, t.projection ? { projection: t.projection } : {});
    if (t.hint) cur = cur.hint(t.hint);
    if (t.sort) cur = cur.sort(t.sort);
    if (t.skip) cur = cur.skip(t.skip);
    if (t.limit) cur = cur.limit(t.limit);
    e = await cur.explain("executionStats");
  }
  const s = e.executionStats ?? {};
  const keys = s.totalKeysExamined ?? 0,
    docs = s.totalDocsExamined ?? 0,
    returned = s.nReturned ?? 0;
  // Reading far more than it returns means the query scans rather than seeks
  return { label: t.label, collection: t.collection, keys, docs, returned, ms: s.executionTimeMillis ?? 0, plan: planOf(e.queryPlanner?.winningPlan), wasteful: Math.max(keys, docs) > 20 * Math.max(returned, 50) };
}

export async function measureSearch(db: Db, q: string, gap: string, matchPoints: Record<MatchTier, number> = LAB_DEFAULTS.matchPoints) {
  const trace: SearchQuery[] = [];
  const filter = GAPS.find((g) => g.id === gap)?.filter ?? {};
  const started = Date.now();
  const r = await searchDances(db, { q, filter, trace, matchPoints });
  const wallMs = Date.now() - started;
  const queries: QueryCost[] = [];
  for (const t of trace) queries.push(await explain(db, t));
  const bytes = r.dances.reduce((n, d) => n + BSON.calculateObjectSize(d), 0);
  const stats = await db.command({ dbStats: 1 });
  return {
    wallMs,
    queries,
    top: r.dances.slice(0, 10).map((d) => ({ _id: String(d._id), danceName: String(d.danceName ?? ""), match: d.match, rank: (d.rank ?? null) as number | null })),
    total: r.total,
    more: r.more,
    totals: {
      operations: queries.length,
      keys: queries.reduce((n, x) => n + x.keys, 0),
      docs: queries.reduce((n, x) => n + x.docs, 0),
      ms: queries.reduce((n, x) => n + x.ms, 0),
      bytes,
    },
    storageMB: { data: Math.round(stats.dataSize / 1e6), storage: Math.round(stats.storageSize / 1e6), indexes: Math.round(stats.indexSize / 1e6) },
  };
}
