import type { Db } from "mongodb";

// Reviewing pairs of tracks in the linedance catalogue that share a MusicBrainz recording but are spelled differently
// (track_merge_candidates). Three answers:
//   same song         the other track becomes a stub (mergedInto) whose dances and links move to the one kept; logged in
//                     track_merges, as ldco-harvester's tracks:build does it
//   different songs   the pair is rejected and never suggested again
//   wrong recording   one track loses that recording (and the links that came with it), kept in
//                     track_recording_rejections so it can be undone and so the next build doesn't give it back
// ldco-harvester's tracks:live copies these decisions back to the local build before it writes, so it never undoes them.

interface Track {
  _id: string; title: string; artist: string; key?: string; danceCount?: number; recordingId?: string | null; matchStatus?: string;
  songMatch?: string | null; recordingConfidence?: string; mergedInto?: string;
}
interface Candidate { _id: string; trackIds: string[]; reason: string; status: string }

export async function listTrackCandidates(db: Db, { page = 0, size = 20 }: { page?: number; size?: number }) {
  const col = db.collection<Candidate>("track_merge_candidates");
  const [total, rows] = await Promise.all([col.countDocuments({ status: "open" }), col.find({ status: "open" }).sort({ _id: 1 }).skip(page * size).limit(size).toArray()]);
  const tracks = new Map((await db.collection<Track>("tracks").find({ _id: { $in: rows.flatMap((r) => r.trackIds) } }).toArray()).map((t) => [String(t._id), t]));
  const recordings = new Map((await db.collection<{ _id: string; title: string; artist?: string; version?: string; length?: number }>("recordings")
    .find({ _id: { $in: [...tracks.values()].map((t) => t.recordingId).filter((x): x is string => !!x) } }, { projection: { title: 1, artist: 1, version: 1, length: 1 } }).toArray()).map((r) => [String(r._id), r]));
  const out = [];
  for (const r of rows) {
    const ts = [];
    for (const id of r.trackIds) {
      const t = tracks.get(String(id));
      if (!t) continue;
      const [dances, links] = await Promise.all([
        db.collection<{ _id: string; danceName: string }>("dances").find({ "tracks.trackId": t._id }, { projection: { danceName: 1 } }).limit(4).toArray(),
        db.collection<{ provider: string; url: string; matchedBy: string; recordingId?: string | null }>("track_links").find({ trackId: t._id }, { projection: { provider: 1, url: 1, matchedBy: 1, recordingId: 1 } }).limit(6).toArray(),
      ]);
      ts.push({ ...t, recording: t.recordingId ? recordings.get(String(t.recordingId)) ?? null : null, dances, links });
    }
    out.push({ _id: r._id, reason: r.reason, tracks: ts });
  }
  return { total, pageSize: size, candidates: out };
}

async function openCandidate(db: Db, candidateId: string) {
  return db.collection<Candidate>("track_merge_candidates").findOne({ _id: candidateId, status: "open" });
}
const settle = (db: Db, candidateId: string, status: string, by: string) =>
  db.collection<Candidate>("track_merge_candidates").updateOne({ _id: candidateId }, { $set: { status, resolvedAt: new Date(), resolvedBy: by } });

/** "Different songs": never suggested again. */
export async function tracksDifferent(db: Db, candidateId: string, by: string) {
  if (!(await openCandidate(db, candidateId))) return { status: 404, error: "That pair isn't open any more." };
  await settle(db, candidateId, "rejected", by);
  return { status: 200 };
}

/** "Same song": the other track merges into keepId. Its spellings still lead to it; its dances and links move over. */
export async function tracksSame(db: Db, candidateId: string, keepId: string, by: string) {
  const cand = await openCandidate(db, candidateId);
  if (!cand) return { status: 404, error: "That pair isn't open any more." };
  const ids = cand.trackIds.map(String);
  if (!ids.includes(keepId)) return { status: 400, error: "Pick one of the two tracks to keep." };
  const loseId = ids.find((id) => id !== keepId)!;
  const tracks = db.collection<Track>("tracks");
  const [keep, lose] = await Promise.all([tracks.findOne({ _id: keepId }), tracks.findOne({ _id: loseId })]);
  if (!keep || !lose || keep.mergedInto || lose.mergedInto) return { status: 409, error: "One of these tracks has changed. Reload and try again." };
  const now = new Date();
  // The log first, as tracks:build keeps it: the merge always stands
  await db.collection<{ _id: string }>("track_merges").updateOne({ _id: loseId }, { $setOnInsert: { into: keepId, reason: "reviewed: same song", key: lose.key ?? null, by, at: now } }, { upsert: true });
  // Dances: the lost track becomes the kept one (once), keeping each entry's version note
  const dances = db.collection<{ _id: string; tracks: { trackId: string; recordingId?: string; versionNote?: string }[] }>("dances");
  let moved = 0;
  const movedDances: string[] = [];
  for (const d of await dances.find({ "tracks.trackId": loseId }, { projection: { tracks: 1 } }).toArray()) {
    movedDances.push(String(d._id));
    const seen = new Set<string>();
    const list = d.tracks.map((t) => (t.trackId === loseId ? { ...t, trackId: keepId } : t)).filter((t) => (seen.has(t.trackId) ? false : (seen.add(t.trackId), true)));
    await dances.updateOne({ _id: d._id }, { $set: { tracks: list } });
    moved++;
  }
  await db.collection("track_links").updateMany({ trackId: loseId }, { $set: { trackId: keepId, movedFrom: loseId } });
  // Which dances moved, so an undo can move exactly those back
  await db.collection<{ _id: string }>("track_merges").updateOne({ _id: loseId }, { $set: { movedDances } });
  await tracks.updateOne({ _id: loseId }, { $set: { mergedInto: keepId, updatedAt: now }, $unset: { matchStatus: "", songMatch: "", recordingId: "", recordingConfidence: "", versions: "", danceCount: "" } });
  if (!keep.recordingId && lose.recordingId) await tracks.updateOne({ _id: keepId }, { $set: { recordingId: lose.recordingId, recordingConfidence: lose.recordingConfidence ?? "probable", matchStatus: "matched" } });
  await tracks.updateOne({ _id: keepId }, { $set: { danceCount: await dances.countDocuments({ "tracks.trackId": keepId }), updatedAt: now } });
  await settle(db, candidateId, "merged", by);
  // Other open pairs with the lost track now concern the kept one; a pair of one is settled
  for (const c of await db.collection<Candidate>("track_merge_candidates").find({ status: "open", trackIds: loseId }).toArray()) {
    const list = [...new Set(c.trackIds.map((id) => (id === loseId ? keepId : id)))];
    await db.collection<Candidate>("track_merge_candidates").updateOne({ _id: c._id }, { $set: list.length < 2 ? { trackIds: list, status: "merged", resolvedAt: now, resolvedBy: by } : { trackIds: list } });
  }
  return { status: 200, kept: keepId, dancesMoved: moved };
}

/** "Wrong recording": trackId loses its recording and the links that came with it; both are kept so it can be undone. */
export async function trackWrongRecording(db: Db, candidateId: string, trackId: string, by: string) {
  const cand = await openCandidate(db, candidateId);
  if (!cand) return { status: 404, error: "That pair isn't open any more." };
  if (!cand.trackIds.map(String).includes(trackId)) return { status: 400, error: "Pick one of the two tracks." };
  const tracks = db.collection<Track>("tracks");
  const t = await tracks.findOne({ _id: trackId });
  if (!t?.recordingId) return { status: 409, error: "That track has no recording now. Reload and try again." };
  const now = new Date();
  const links = await db.collection<{ _id: string; recordingId?: string | null }>("track_links").find({ trackId, recordingId: t.recordingId }).toArray();
  await db.collection<{ _id: string }>("track_recording_rejections").updateOne(
    { _id: trackId },
    { $addToSet: { recordingIds: t.recordingId }, $push: { history: { recordingId: t.recordingId, previous: { matchStatus: t.matchStatus, songMatch: t.songMatch, recordingConfidence: t.recordingConfidence }, links, by, at: now } } } as never,
    { upsert: true },
  );
  if (links.length) await db.collection<{ _id: string }>("track_links").deleteMany({ _id: { $in: links.map((l) => l._id) } });
  await tracks.updateOne({ _id: trackId }, { $set: { recordingId: null, recordingConfidence: "none", matchStatus: "unmatched", songMatch: null, versions: [], updatedAt: now } });
  await settle(db, candidateId, "wrong-recording", by);
  return { status: 200, linksRemoved: links.length };
}
