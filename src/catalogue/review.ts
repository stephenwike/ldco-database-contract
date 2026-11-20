import type { WriteDbLike } from "./db";
import { yearFields, type CatalogueDance } from "./edit";

// Reviewing possible duplicate dances in the linedance catalogue (its merge_candidates). A merge is lossless, as in
// ldco-harvester's dances-merge-live.mjs: the record kept gains the others' stepsheets, fills its blanks from them and
// lists their ids in ldcoIds and mergedFrom (so references to them still resolve); each removed record is saved whole in
// dance_merges before it's removed, so a merge can be undone. "Different dances" marks the candidate rejected; no script
// reopens a reviewed candidate on live, so it's never suggested again. From line-dance-manager-admin's
// lib/danceReview.ts, which now uses this.

type Dance = CatalogueDance & { tracks?: { trackId: string; recordingId?: string; versionNote?: string }[]; unpublished?: boolean; publishedBy?: string | null };

/** Facts a kept record takes from the others when it has none. */
const FILL = ["count", "wall", "credit", "musicRaw", "bpm", "introCounts", "hasTags", "hasRestarts", "hasBridge", "choreographedIn", "published", "publishedSource", "publishedBy"] as const;
const LEVEL = ["levels", "levelQualifier", "phrased", "danceType", "levelRaw"] as const;
const STATED: Record<string, (d: Partial<Dance> & { choreographedIn?: string | null }) => boolean> = {
  count: (d) => d.count != null, wall: (d) => d.wall != null, level: (d) => !!d.levels?.length,
  choreographer: (d) => !!d.choreographerIds?.length, choreographedIn: (d) => !!d.choreographedIn,
};
const blank = (v: unknown) => v == null || (Array.isArray(v) && !v.length) || v === "";
const facts = (d: Dance) => ["count", "wall", "published", "credit", "bpm"].filter((f) => (d as unknown as Record<string, unknown>)[f] != null).length + (d.levels?.length ? 1 : 0) + (d.songArtists?.length ? 1 : 0);
const sheetId = (u?: string) => /stepsheets\/([^/?#]+)/i.exec(u ?? "")?.[1] ?? "";

/** The record to keep by default: one with an untranslated stepsheet, then the most facts, then the oldest stepsheet id. */
export function suggestKeep(dances: Dance[]): string | null {
  const sorted = [...dances].sort((a, b) =>
    Number(b.stepsheets?.some((s) => !s.lang) ?? false) - Number(a.stepsheets?.some((s) => !s.lang) ?? false)
    || facts(b) - facts(a)
    || (/^\d+$/.test(sheetId(b.stepsheets?.[0]?.url)) ? 1 : 0) - (/^\d+$/.test(sheetId(a.stepsheets?.[0]?.url)) ? 1 : 0)
    || Number(sheetId(a.stepsheets?.[0]?.url)) - Number(sheetId(b.stepsheets?.[0]?.url))
    || String(a._id).localeCompare(String(b._id)));
  return sorted[0] ? String(sorted[0]._id) : null;
}

/** What the record kept changes to when the others merge into it. Pure, so it can be tested. */
export function planCatalogueMerge(keep: Dance, others: Dance[]) {
  const set: Record<string, unknown> = {};
  const urls = new Set((keep.stepsheets ?? []).map((s) => s.url));
  const stepsheets = [...(keep.stepsheets ?? [])];
  for (const o of others) for (const s of o.stepsheets ?? []) if (!urls.has(s.url)) { urls.add(s.url); stepsheets.push(s); }
  if (stepsheets.length !== (keep.stepsheets ?? []).length) set.stepsheets = stepsheets;
  const k = keep as unknown as Record<string, unknown>;
  for (const f of FILL) if (blank(k[f])) { const from = others.find((o) => !blank((o as unknown as Record<string, unknown>)[f])); if (from) set[f] = (from as unknown as Record<string, unknown>)[f]; }
  if (!keep.levels?.length) { const from = others.find((o) => o.levels?.length); if (from) for (const f of LEVEL) set[f] = (from as unknown as Record<string, unknown>)[f] ?? null; }
  if (!keep.songArtists?.length) { const from = others.find((o) => o.songArtists?.length); if (from) set.songArtists = from.songArtists; }
  if (!keep.tracks?.length) { const from = others.find((o) => o.tracks?.length); if (from) set.tracks = from.tracks; }
  if (!keep.choreographerIds?.length) { const from = others.find((o) => o.choreographerIds?.length); if (from) set.choreographerIds = from.choreographerIds; }
  // A merged-in dance from the feed is published, so the kept one is too
  if (keep.unpublished && others.some((o) => !o.unpublished)) set.unpublished = false;
  // The date fields follow the dates, if the merge filled one
  if ("choreographedIn" in set || "published" in set) Object.assign(set, yearFields({ ...keep, ...set } as Dance));
  const after = { ...keep, ...set } as Dance;
  const notStated = [...new Set([keep, ...others].flatMap((d) => d.notStated ?? []))].filter((f) => STATED[f] && !STATED[f](after)).sort();
  if (JSON.stringify(notStated) !== JSON.stringify([...(keep.notStated ?? [])].sort())) set.notStated = notStated;
  const ids = [...new Set(others.flatMap((o) => [o._id, ...(o.ldcoIds ?? []), ...(o.mergedFrom ?? [])]).map(String))];
  return { set, addIds: ids };
}

const summary = { danceName: 1, count: 1, wall: 1, levels: 1, levelQualifier: 1, danceType: 1, choreographerIds: 1, songArtists: 1, choreographedIn: 1, published: 1, publishedSource: 1, publishedBy: 1, stepsheets: 1, unpublished: 1, notStated: 1, credit: 1, editedFields: 1 };

/** A page of open candidates with their dances, the reasons with counts, and the suggested record to keep. */
export async function listDanceCandidates(db: WriteDbLike, { reason, page = 0, size = 20 }: { reason?: string; page?: number; size?: number }) {
  const col = db.collection<{ _id: string; danceIds: string[]; reason: string; status: string }>("merge_candidates");
  const filter = { status: "open", ...(reason ? { reason } : {}) };
  const [reasons, total, rows] = await Promise.all([
    col.aggregate([{ $match: { status: "open" } }, { $group: { _id: "$reason", n: { $sum: 1 } } }, { $sort: { n: -1 } }]).toArray(),
    col.countDocuments(filter),
    col.find(filter).sort({ _id: 1 }).skip(page * size).limit(size).toArray(),
  ]);
  const dances = new Map((await db.collection<Dance>("dances").find({ _id: { $in: rows.flatMap((r) => r.danceIds) } }, { projection: summary }).toArray()).map((d) => [String(d._id), d]));
  const names = Object.fromEntries((await db.collection<{ _id: string; name: string }>("choreographers").find({ _id: { $in: [...dances.values()].flatMap((d) => d.choreographerIds ?? []) } }, { projection: { name: 1 } }).toArray()).map((c) => [String(c._id), c.name]));
  return {
    reasons: reasons.map((r) => ({ reason: r._id, n: r.n })),
    total,
    pageSize: size,
    candidates: rows.map((r) => {
      const ds = r.danceIds.map((id) => dances.get(String(id))).filter((d): d is Dance => !!d);
      return {
        _id: r._id, reason: r.reason,
        missing: r.danceIds.filter((id) => !dances.has(String(id))),
        suggestedKeep: suggestKeep(ds),
        dances: ds.map((d) => ({ ...d, choreographers: (d.choreographerIds ?? []).map((c) => names[String(c)] ?? c) })),
      };
    }),
  };
}

/** "Different dances": the candidate is rejected and never suggested again. */
export async function keepApart(db: WriteDbLike, candidateId: string, by: string) {
  const r = await db.collection<{ _id: string; status: string }>("merge_candidates").updateOne({ _id: candidateId, status: "open" }, { $set: { status: "rejected", resolvedAt: new Date(), resolvedBy: by } });
  return r.matchedCount ? { status: 200 } : { status: 404, error: "That candidate isn't open any more." };
}

/** "Same dance": the dances in mergeIds merge into keepId, losslessly. Only dances of this candidate. */
export async function mergeCandidate(db: WriteDbLike, candidateId: string, keepId: string, mergeIds: string[], by: string) {
  const candidates = db.collection<{ _id: string; danceIds: string[]; status: string }>("merge_candidates");
  const cand = await candidates.findOne({ _id: candidateId, status: "open" });
  if (!cand) return { status: 404, error: "That candidate isn't open any more." };
  const ids = cand.danceIds.map(String);
  const merge = [...new Set(mergeIds.map(String))].filter((id) => id !== keepId);
  if (!ids.includes(keepId) || !merge.length || merge.some((id) => !ids.includes(id))) return { status: 400, error: "Pick the record to keep and at least one other from this group." };
  const dances = db.collection<Dance>("dances");
  const keep = await dances.findOne({ _id: keepId });
  const others = await dances.find({ _id: { $in: merge } }).toArray();
  if (!keep || others.length !== merge.length) return { status: 409, error: "One of these dances has changed or gone. Reload and try again." };

  const now = await mergeDanceRecords(db, keep, others, by, "reviewed: same dance", candidateId);
  const into = new Map(merge.map((id) => [id, keepId]));
  // This candidate: done when everything in it is now one dance; otherwise the rest stay open to review
  const rest = [...new Set(ids.map((id) => into.get(id) ?? id))];
  if (rest.length < 2) await candidates.updateOne({ _id: candidateId }, { $set: { status: "merged", resolvedAt: now, resolvedBy: by } });
  return { status: 200, kept: keepId, merged: merge.length, remaining: rest.length };
}

/**
 * Merges `others` into `keep`, losslessly: each removed record is saved whole in dance_merges first (with what the kept
 * record gained, so lib/undo.ts can undo it exactly), the kept record fills its blanks from them and lists their ids
 * in ldcoIds and mergedFrom (so anything that stored those ids still finds the dance), and open candidates that
 * named a removed record now name the kept one. Returns the time it was recorded under.
 */
export async function mergeDanceRecords(db: WriteDbLike, keep: Dance, others: Dance[], by: string, rule: string, candidateId?: string): Promise<Date> {
  const dances = db.collection<Dance>("dances");
  const candidates = db.collection<{ _id: string; danceIds: string[]; status: string }>("merge_candidates");
  const keepId = String(keep._id);
  const merge = others.map((o) => String(o._id));
  const { set, addIds } = planCatalogueMerge(keep, others);
  const now = new Date();
  // What the kept dance gains, so an undo can give exactly that back
  const k = keep as unknown as Record<string, unknown>;
  const filledKeys = Object.keys(set).filter((f) => !["stepsheets", "notStated", "unpublished"].includes(f));
  const gained = {
    stepsheets: ((set.stepsheets as { url: string }[] | undefined) ?? []).map((s) => s.url).filter((u) => !(keep.stepsheets ?? []).some((s) => s.url === u)),
    ids: addIds,
    filled: Object.fromEntries(filledKeys.map((f) => [f, set[f]])),
    before: Object.fromEntries(filledKeys.map((f) => [f, k[f] ?? null])),
  };
  // The removed records first, whole, so nothing is lost even if a later step fails
  await db.collection("dance_merges").bulkWrite(others.map((o) => ({ replaceOne: { filter: { _id: o._id }, replacement: { into: keep._id, rule, ...(candidateId ? { candidateId } : {}), by, doc: o, gained, at: now }, upsert: true } })) as never);
  await dances.updateOne({ _id: keepId }, { ...(Object.keys(set).length ? { $set: { ...set, editedAt: now, editedBy: by } } : {}), $addToSet: { ldcoIds: { $each: addIds }, mergedFrom: { $each: addIds } } } as never);
  await dances.deleteMany({ _id: { $in: merge } });

  // Candidates: removed ids point at the record kept; one left with a single dance is settled
  const into = new Map(merge.map((id) => [id, keepId]));
  for (const c of await candidates.find({ status: "open", danceIds: { $in: merge } }).toArray()) {
    const list = [...new Set(c.danceIds.map((id) => into.get(String(id)) ?? String(id)))];
    await candidates.updateOne({ _id: c._id }, { $set: list.length < 2 ? { danceIds: list, status: "merged", resolvedAt: now, resolvedBy: by } : { danceIds: list } });
  }
  return now;
}
