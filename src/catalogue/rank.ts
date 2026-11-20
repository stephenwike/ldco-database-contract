// A dance's global relevance, 0–1000 (decision 29: search algorithms live in the package). The same formula as
// ldco-harvester's scripts/lib/rank.mjs, which writes each dance's stored `rank` and `rankSignals`; change both
// together until the harvester imports this. The parts:
//   usage       what our own users do (taught, requested, played, on lists, in collections): the surest sign
//   views       YouTube views of the dance's videos
//   languages   how many languages its stepsheet is translated into
//   recency     new dances get a boost that fades to nothing over RANK_RECENT_MONTHS
//   complete    a little for having its count, wall, level, choreographer, song and stepsheet
// Each count is log-scaled against a cap (a high percentile, so one viral video doesn't flatten everyone else).
import type { WriteDbLike } from "./db";

export type RankPart = "usage" | "views" | "languages" | "recency" | "complete";
export type RankWeights = Record<RankPart, number>;
export interface RankCaps {
  usage: number;
  views: number;
  languages: number;
}
export interface RankSignals {
  usage?: number;
  views?: number;
  languages?: number;
  monthsOld?: number | null;
  gaps?: number;
}

export const RANK_WEIGHTS: RankWeights = { usage: 0.4, views: 0.3, languages: 0.12, recency: 0.12, complete: 0.06 };
export const RANK_USAGE_POINTS = { lesson: 3, feedLesson: 3, requested: 1, played: 1, known: 1, favorite: 2, refresh: 1, interested: 1, collection: 1 };
export const RANK_RECENT_MONTHS = 18;
/** The facts `complete` counts. */
export const RANK_CORE_FACTS = ["level", "count", "wall", "choreographer", "song", "stepsheet"] as const;
/** The quantile each cap is taken at, and the least the languages cap can be. */
export const RANK_CAP_QUANTILE = 0.995;
export const RANK_LANGUAGES_CAP_MIN = 5;

const clamp = (x: number) => Math.max(0, Math.min(1, x));
export const logScale = (n: number | undefined, cap: number) => (n && n > 0 && cap > 0 ? clamp(Math.log1p(n) / Math.log1p(cap)) : 0);

/** The value at quantile q of the positive numbers in a list. */
export function capOf(values: number[], q = RANK_CAP_QUANTILE): number {
  const pos = values.filter((v) => v > 0).sort((a, b) => a - b);
  return pos.length ? pos[Math.min(pos.length - 1, Math.floor(q * (pos.length - 1)))] : 0;
}

/** Months between a dateKey ("2024-03-31") and now; null without a date. */
export function monthsOld(dateKey: string | null | undefined, now = new Date()): number | null {
  const t = Date.parse(dateKey ?? "");
  return Number.isNaN(t) ? null : Math.max(0, (now.getTime() - t) / (30.44 * 86400_000));
}

export const recencyOf = (months: number | null | undefined, recentMonths = RANK_RECENT_MONTHS) =>
  months == null ? 0 : clamp(1 - months / Math.max(1, recentMonths));

/** The core facts a dance is missing (a fact the stepsheet doesn't state isn't missing). */
export function coreGaps(d: {
  levels?: string[];
  count?: number | null;
  wall?: number | null;
  choreographerIds?: string[];
  songArtists?: unknown[];
  stepsheets?: unknown[];
  unpublished?: boolean;
  notStated?: string[];
}): string[] {
  const stated = (f: string) => !(d.notStated ?? []).includes(f);
  const gaps: string[] = [];
  if (!d.levels?.length && stated("level")) gaps.push("level");
  if (d.count == null && stated("count")) gaps.push("count");
  if (d.wall == null && stated("wall")) gaps.push("wall");
  if (!d.choreographerIds?.length && stated("choreographer")) gaps.push("choreographer");
  if (!d.songArtists?.length) gaps.push("song");
  if (!d.stepsheets?.length && !d.unpublished) gaps.push("stepsheet");
  return gaps;
}

/** The languages a dance's stepsheets are translated into (not counting the original). */
export const languagesOf = (d: { stepsheets?: { lang?: string | null }[] }) =>
  new Set((d.stepsheets ?? []).map((s) => s.lang).filter(Boolean)).size;

/** A dance's rank from its signals and the caps over all dances, with each part (0–1). */
export function rankOf(signals: RankSignals, caps: RankCaps, weights: RankWeights = RANK_WEIGHTS, recentMonths = RANK_RECENT_MONTHS) {
  const parts: Record<RankPart, number> = {
    usage: logScale(signals.usage, caps.usage),
    views: logScale(signals.views, caps.views),
    languages: logScale(signals.languages, caps.languages),
    recency: recencyOf(signals.monthsOld, recentMonths),
    complete: clamp(1 - (signals.gaps ?? 0) / RANK_CORE_FACTS.length),
  };
  const score = (Object.keys(weights) as RankPart[]).reduce((sum, k) => sum + weights[k] * parts[k], 0);
  return { rank: Math.round(score * 1000), parts };
}

// ── The same, inside MongoDB ─────────────────────────────────────────────────────────────────────────────────────
// For trying other weights over every dance without rewriting anything (the search lab): worked out from each dance's
// stored rankSignals and dateKey.

/** The caps over all dances, as the harvester takes them (approximate percentiles of the positive values). */
export async function rankCaps(db: WriteDbLike): Promise<RankCaps> {
  const one = async (f: string) => {
    const [r] = await db
      .collection("dances")
      .aggregate([
        { $match: { [`rankSignals.${f}`]: { $gt: 0 } } },
        { $group: { _id: null, p: { $percentile: { input: `$rankSignals.${f}`, p: [RANK_CAP_QUANTILE], method: "approximate" } } } },
      ])
      .toArray();
    return (r?.p?.[0] as number | undefined) ?? 0;
  };
  return { usage: await one("usage"), views: await one("views"), languages: Math.max(RANK_LANGUAGES_CAP_MIN, await one("languages")) };
}

const partExpr = (field: string, cap: number) =>
  cap > 0 ? { $min: [1, { $divide: [{ $ln: { $add: [1, { $ifNull: [`$rankSignals.${field}`, 0] }] } }, Math.log1p(cap)] }] } : 0;

/**
 * Aggregation expressions matching rankOf: `parts` for an $addFields into `_rankParts`, then `rank` (which reads
 * `$_rankParts`) in a later stage.
 */
export function rankExpressions(caps: RankCaps, weights: RankWeights = RANK_WEIGHTS, recentMonths = RANK_RECENT_MONTHS, now = new Date()) {
  const months = {
    $divide: [{ $dateDiff: { startDate: { $dateFromString: { dateString: "$dateKey", onError: null, onNull: null } }, endDate: now, unit: "day" } }, 30.44],
  };
  const parts: Record<RankPart, object | number> = {
    usage: partExpr("usage", caps.usage),
    views: partExpr("views", caps.views),
    languages: partExpr("languages", caps.languages),
    recency: {
      $let: {
        vars: { m: months },
        in: { $cond: [{ $eq: ["$$m", null] }, 0, { $max: [0, { $min: [1, { $subtract: [1, { $divide: [{ $max: [0, "$$m"] }, Math.max(1, recentMonths)] }] }] }] }] },
      },
    },
    complete: { $max: [0, { $subtract: [1, { $divide: [{ $ifNull: ["$rankSignals.gaps", 0] }, RANK_CORE_FACTS.length] }] }] },
  };
  const rank = { $round: [{ $multiply: [1000, { $add: (Object.keys(weights) as RankPart[]).map((k) => ({ $multiply: [weights[k], `$_rankParts.${k}`] })) }] }, 0] };
  return { parts, rank };
}
