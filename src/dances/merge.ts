// Merging two dances into one id (ldco-database decision 26, "Merging duplicates").
//
// The kept id survives: every reference to the other dance is repointed to it, rows that end up identical are
// de-duplicated (a dancer who marked both dances known keeps one row), and the other dance is deleted. Normally the
// kept id is an unpublished dance's (ldco-reviews.dances, reviewKind "unpublished"), because that's what dancers
// already tracked, and the other is the published copy in ldco.dances, whose data (copperknob's stepsheet, level,
// choreographers, song) becomes the kept dance's.
//
// Where the merged dance lives: ldco.dances if either dance is published, otherwise ldco-reviews.dances.
// From line-dance-manager-admin's lib/danceMerge.ts, which now uses this. copperknob-alert's lib/unpublished.ts has
// its own copy of normalizeName, nameKeys and findUnpublishedMatch.
import type { WriteDbLike } from "../catalogue/db";

// Documents from a dozen collections of different shapes; string _ids need the driver's ObjectId-typed filter loosened
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Doc = Record<string, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const q = (filter: Record<string, unknown>) => filter as any;

export interface MergeDbs {
  ldco: WriteDbLike;
  reviews: WriteDbLike;
  lessons: WriteDbLike;
  feed: WriteDbLike;
  events: WriteDbLike;
  bld: WriteDbLike;
}

export type DanceLocation = "ldco" | "ldco-reviews";

export interface LocatedDance {
  doc: Doc;
  location: DanceLocation;
}

// ── Names (the same normalisation as copperknob-alert lib/unpublished.ts) ─────────────────────────────────────────

export function normalizeName(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/['‘’`´]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** The name with and without anything in brackets: "Pull It On Over (Park)" also matches "Pull It On Over". */
export function nameKeys(name: string): string[] {
  const keys = [normalizeName(name), normalizeName(name.replace(/\([^)]*\)/g, " "))].filter(Boolean);
  return [...new Set(keys)];
}

export interface UnpublishedCandidate {
  _id: string;
  danceName: string;
  choreographers?: string[];
  unresolvedChoreographers?: string[];
}

/**
 * The one unpublished dance a newly published dance should take the id of: same name key and a shared choreographer
 * (an id, or a name in unresolvedChoreographers). Several qualifying, or none, means no match. Same rule as
 * copperknob-alert lib/unpublished.ts.
 */
export function findUnpublishedMatch(
  dance: { title: string; choreographerIds: string[]; choreographerNames: string[] },
  candidates: UnpublishedCandidate[],
): UnpublishedCandidate | undefined {
  const keys = new Set(nameKeys(dance.title));
  const ids = new Set(dance.choreographerIds);
  const names = new Set(dance.choreographerNames.map(normalizeName));
  const matches = candidates.filter(c =>
    nameKeys(c.danceName).some(k => keys.has(k)) &&
    ((c.choreographers ?? []).some(id => ids.has(id)) || (c.unresolvedChoreographers ?? []).some(n => names.has(normalizeName(n)))),
  );
  return matches.length === 1 ? matches[0] : undefined;
}

// ── The merged document ───────────────────────────────────────────────────────────────────────────────────────────

const strings = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && x !== "") : []);

/**
 * The kept dance's document after the merge. The published dance's data wins over an unpublished one's (copperknob is
 * the source of truth); with both published or both unpublished, the kept dance's data wins and gaps are filled from
 * the other. Every stepsheet either had is kept, the primary one first.
 */
export function mergedDance(keep: LocatedDance, other: LocatedDance): LocatedDance {
  const location: DanceLocation = keep.location === "ldco" || other.location === "ldco" ? "ldco" : "ldco-reviews";
  const [base, fill] = keep.location === "ldco-reviews" && other.location === "ldco" ? [other.doc, keep.doc] : [keep.doc, other.doc];

  const stepsheet = (base.stepsheet as string) || (fill.stepsheet as string) || "";
  const stepsheetUrls = [...new Set([...strings([base.stepsheet]), ...strings(base.stepsheetUrls), ...strings([fill.stepsheet]), ...strings(fill.stepsheetUrls)])]
    .filter(u => u !== stepsheet);
  const hasTrack = Boolean(base.primaryTrack);

  const doc: Doc = {
    _id: keep.doc._id,
    danceName: base.danceName || fill.danceName,
    difficulty: base.difficulty || fill.difficulty || "",
    choreographers: strings(base.choreographers).length ? strings(base.choreographers) : strings(fill.choreographers),
    stepsheet,
    stepsheetUrls,
    primaryTrack: hasTrack ? base.primaryTrack : fill.primaryTrack || "",
    tracks: hasTrack ? strings(base.tracks) : strings(fill.tracks),
  };
  const songArtists = base.songArtists?.length ? base.songArtists : fill.songArtists;
  if (songArtists?.length) doc.songArtists = songArtists;
  const dated = base.published ? base : fill.published ? fill : null;
  if (dated) {
    if (dated.publishedAt) doc.publishedAt = dated.publishedAt;
    doc.published = dated.published;
    if (dated.publishedSource) doc.publishedSource = dated.publishedSource;
  }

  if (location === "ldco-reviews") {
    // Still unpublished: keep the review fields, and any choreographer names the reviewer hasn't resolved yet
    for (const k of ["reviewKind", "sourceEvent", "createdBy", "createdAt"]) if (keep.doc[k] !== undefined) doc[k] = keep.doc[k];
    const unresolved = [...new Set([...strings(keep.doc.unresolvedChoreographers), ...strings(other.doc.unresolvedChoreographers)])];
    if (unresolved.length) doc.unresolvedChoreographers = unresolved;
  }
  return { doc, location };
}

/** `ids` with `from` replaced by `to`, keeping the first position of each id and dropping repeats. */
export function replaceId(ids: string[], from: string, to: string): string[] {
  return [...new Set(ids.map(id => (id === from ? to : id)))];
}

// ── References ────────────────────────────────────────────────────────────────────────────────────────────────────

/** Rows keyed by (owner, danceId): one per owner, so a row the kept dance already has is dropped instead of moved. */
const OWNED_ROWS: Array<{ db: keyof MergeDbs; coll: string; owner: string }> = [
  { db: "ldco", coll: "user_known_dances", owner: "userId" },
  { db: "ldco", coll: "user_favorite_dances", owner: "userId" },
  { db: "ldco", coll: "user_flagged_dances", owner: "userId" },
  { db: "ldco", coll: "user_refresh_dances", owner: "userId" },
  { db: "ldco", coll: "dance_tracks", owner: "trackId" },
  { db: "feed", coll: "feed_lessons", owner: "sessionId" },
];

/** Documents with a top-level danceId. */
const FLAT_REFS: Array<{ db: keyof MergeDbs; coll: string }> = [
  { db: "lessons", coll: "lessons" },
  { db: "bld", coll: "lessons" },
  { db: "feed", coll: "dj_requests" },
];

/** Documents with danceId inside an array of objects. */
const NESTED_REFS: Array<{ db: keyof MergeDbs; coll: string; array: string }> = [
  { db: "lessons", coll: "events", array: "lessons" },
  { db: "bld", coll: "events", array: "lessons" },
  { db: "feed", coll: "requester_history", array: "requests" },
  { db: "feed", coll: "session_reports", array: "playedTracks" },
  { db: "events", coll: "event_registrations", array: "requests" },
];

const USER_ARRAYS = ["favorites", "known", "flagged", "refresh"] as const;

export interface ReferenceCount {
  collection: string;
  count: number;
}

/** How many documents reference the dance, per collection (only those with any). */
export async function countReferences(dbs: MergeDbs, danceId: string): Promise<ReferenceCount[]> {
  const counts: ReferenceCount[] = [];
  const add = async (db: keyof MergeDbs, coll: string, filter: Doc) => {
    const count = await dbs[db].collection(coll).countDocuments(q(filter));
    if (count) counts.push({ collection: `${dbs[db].databaseName}.${coll}`, count });
  };
  await add("ldco", "dance_collections", { danceIds: danceId });
  await add("ldco", "users", { $or: [...USER_ARRAYS.map(k => ({ [k]: danceId })), { "collections.danceIds": danceId }] });
  for (const r of OWNED_ROWS) await add(r.db, r.coll, { danceId });
  for (const r of FLAT_REFS) await add(r.db, r.coll, { danceId });
  for (const r of NESTED_REFS) await add(r.db, r.coll, { [`${r.array}.danceId`]: danceId });
  return counts;
}

async function repointReferences(dbs: MergeDbs, fromId: string, keepId: string): Promise<ReferenceCount[]> {
  const changed: ReferenceCount[] = [];
  const note = (db: keyof MergeDbs, coll: string, count: number) => {
    if (count) changed.push({ collection: `${dbs[db].databaseName}.${coll}`, count });
  };

  const collections = dbs.ldco.collection("dance_collections");
  let n = 0;
  for (const c of await collections.find(q({ danceIds: fromId })).toArray()) {
    await collections.updateOne(q({ _id: c._id }), { $set: { danceIds: replaceId(strings(c.danceIds), fromId, keepId) } });
    n++;
  }
  note("ldco", "dance_collections", n);

  // Legacy per-user arrays (favorites, known, flagged, refresh, and the old embedded collections)
  const users = dbs.ldco.collection("users");
  n = 0;
  for (const u of await users.find(q({ $or: [...USER_ARRAYS.map(k => ({ [k]: fromId })), { "collections.danceIds": fromId }] })).toArray()) {
    const set: Doc = {};
    for (const k of USER_ARRAYS) if (Array.isArray(u[k]) && u[k].includes(fromId)) set[k] = replaceId(u[k], fromId, keepId);
    if (Array.isArray(u.collections) && u.collections.some((c: Doc) => strings(c.danceIds).includes(fromId))) {
      set.collections = u.collections.map((c: Doc) => ({ ...c, danceIds: replaceId(strings(c.danceIds), fromId, keepId) }));
    }
    await users.updateOne(q({ _id: u._id }), { $set: set });
    n++;
  }
  note("ldco", "users", n);

  for (const r of OWNED_ROWS) {
    const coll = dbs[r.db].collection(r.coll);
    n = 0;
    for (const row of await coll.find(q({ danceId: fromId })).toArray()) {
      const duplicate = await coll.findOne(q({ [r.owner]: row[r.owner], danceId: keepId }));
      if (duplicate) await coll.deleteOne(q({ _id: row._id }));
      else await coll.updateOne(q({ _id: row._id }), { $set: { danceId: keepId } });
      n++;
    }
    note(r.db, r.coll, n);
  }

  for (const r of FLAT_REFS) {
    const res = await dbs[r.db].collection(r.coll).updateMany(q({ danceId: fromId }), { $set: { danceId: keepId } });
    note(r.db, r.coll, res.modifiedCount);
  }

  for (const r of NESTED_REFS) {
    const res = await dbs[r.db].collection(r.coll).updateMany(
      q({ [`${r.array}.danceId`]: fromId }),
      { $set: { [`${r.array}.$[x].danceId`]: keepId } },
      { arrayFilters: [{ "x.danceId": fromId }] },
    );
    note(r.db, r.coll, res.modifiedCount);
  }
  return changed;
}

// ── The merge ─────────────────────────────────────────────────────────────────────────────────────────────────────

/** The dance with this id, published (ldco.dances) or not (ldco-reviews.dances), or null. */
export async function findDance(dbs: MergeDbs, id: string): Promise<LocatedDance | null> {
  const published = await dbs.ldco.collection("dances").findOne(q({ _id: id }));
  if (published) return { doc: published, location: "ldco" };
  const review = await dbs.reviews.collection("dances").findOne(q({ _id: id }));
  return review ? { doc: review, location: "ldco-reviews" } : null;
}

export interface DanceMergePlan {
  keep: LocatedDance;
  other: LocatedDance;
  result: LocatedDance;
  references: ReferenceCount[];
}

export async function planDanceMerge(dbs: MergeDbs, keepId: string, otherId: string): Promise<DanceMergePlan> {
  if (!keepId || !otherId || keepId === otherId) throw new Error("Choose two different dances.");
  const [keep, other] = await Promise.all([findDance(dbs, keepId), findDance(dbs, otherId)]);
  if (!keep) throw new Error(`Dance ${keepId} no longer exists.`);
  if (!other) throw new Error(`Dance ${otherId} no longer exists.`);
  return { keep, other, result: mergedDance(keep, other), references: await countReferences(dbs, otherId) };
}

/**
 * Merges `otherId` into `keepId`. The steps are ordered so an interruption never loses the dance: the kept document
 * is written first, references are repointed, and only then is the other dance deleted. Running it again after an
 * interruption finishes the job as long as the other dance still exists.
 */
export async function mergeDances(dbs: MergeDbs, keepId: string, otherId: string) {
  const { keep, other, result } = await planDanceMerge(dbs, keepId, otherId);
  const target = result.location === "ldco" ? dbs.ldco : dbs.reviews;

  // ldco.dances has a unique index on non-empty stepsheets: while the other dance still holds the same stepsheet,
  // the kept one is written without it and gets it after the other is deleted.
  const stepsheetClash = other.location === "ldco" && !!result.doc.stepsheet && other.doc.stepsheet === result.doc.stepsheet && result.location === "ldco";
  await target.collection("dances").replaceOne(q({ _id: keepId }), stepsheetClash ? { ...result.doc, stepsheet: "" } : result.doc, { upsert: true });

  const repointed = await repointReferences(dbs, otherId, keepId);

  await (other.location === "ldco" ? dbs.ldco : dbs.reviews).collection("dances").deleteOne(q({ _id: otherId }));
  if (stepsheetClash) await dbs.ldco.collection("dances").updateOne(q({ _id: keepId }), { $set: { stepsheet: result.doc.stepsheet } });
  // Published now: the review copy goes (the same id is in ldco.dances)
  if (keep.location === "ldco-reviews" && result.location === "ldco") await dbs.reviews.collection("dances").deleteOne(q({ _id: keepId }));

  return { keepId, removedId: otherId, location: result.location, repointed };
}
