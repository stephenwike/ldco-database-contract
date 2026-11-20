import type { Db } from "mongodb";

// Undoing merges in the linedance catalogue. Every merge kept what it replaced, so each can be put back:
//   dances          a removed record comes back from dance_merges; the kept one gives back the stepsheets and ids it
//                   gained (and the blanks it filled, when the merge recorded them); the pair is marked rejected
//   tracks          the merged track stops being a stub and gets its links (and dances, when recorded) back; the pair
//                   is marked rejected and the undo is noted in track_merge_undos, which ldco-harvester's tracks:live
//                   copies back so tracks:build doesn't merge them again
//   recordings      a track removed from a recording on review gets it, and its links, back
//   choreographers  a stub stops pointing at the person kept and gets its dances back (when recorded); the pair is
//                   recorded as different people so neither the review page nor the merge scripts join them again
// Merges made before they recorded every detail can still be undone; the result says what couldn't be restored.

const pairId = (a: string, b: string) => [String(a), String(b)].sort().join("|");
type Notes = string[];

export async function listMerges(db: Db, kind: string, page = 0, size = 30) {
  const skip = page * size;
  if (kind === "dances") {
    const col = db.collection<{ _id: string; into: string; rule?: string; by?: string; at?: Date; doc: { danceName?: string; stepsheets?: { url: string }[] }; gained?: unknown }>("dance_merges");
    const [total, rows] = await Promise.all([col.countDocuments(), col.find({}, { projection: { into: 1, rule: 1, by: 1, at: 1, "doc.danceName": 1, "doc.stepsheets": 1, gained: 1 } }).sort({ at: -1, _id: 1 }).skip(skip).limit(size).toArray()]);
    const kept = new Map((await db.collection<{ _id: string; danceName: string }>("dances").find({ _id: { $in: rows.map((r) => r.into) } }, { projection: { danceName: 1 } }).toArray()).map((d) => [String(d._id), d.danceName]));
    return { total, items: rows.map((r) => ({ id: r._id, removed: r.doc?.danceName ?? r._id, removedSheets: (r.doc?.stepsheets ?? []).map((s) => s.url), into: r.into, kept: kept.get(String(r.into)) ?? null, why: r.rule ?? "", by: r.by ?? "automatic", at: r.at ?? null, exact: !!r.gained })) };
  }
  if (kind === "tracks") {
    const col = db.collection<{ _id: string; into: string; reason?: string; by?: string; at?: Date; movedDances?: string[] }>("track_merges");
    const [total, rows] = await Promise.all([col.countDocuments(), col.find({}).sort({ at: -1, _id: 1 }).skip(skip).limit(size).toArray()]);
    const tracks = new Map((await db.collection<{ _id: string; title: string; artist: string }>("tracks").find({ _id: { $in: rows.flatMap((r) => [r._id, r.into]) } }, { projection: { title: 1, artist: 1 } }).toArray()).map((t) => [String(t._id), `${t.title} – ${t.artist}`]));
    return { total, items: rows.map((r) => ({ id: r._id, removed: tracks.get(String(r._id)) ?? r._id, into: r.into, kept: tracks.get(String(r.into)) ?? null, why: r.reason ?? "", by: r.by ?? "automatic", at: r.at ?? null, exact: !!r.movedDances })) };
  }
  if (kind === "recordings") {
    const col = db.collection<{ _id: string; recordingIds: string[]; history?: { recordingId: string; by: string; at: Date }[] }>("track_recording_rejections");
    const [total, rows] = await Promise.all([col.countDocuments({ "recordingIds.0": { $exists: true } }), col.find({ "recordingIds.0": { $exists: true } }).sort({ "history.at": -1 }).skip(skip).limit(size).toArray()]);
    const tracks = new Map((await db.collection<{ _id: string; title: string; artist: string }>("tracks").find({ _id: { $in: rows.map((r) => r._id) } }, { projection: { title: 1, artist: 1 } }).toArray()).map((t) => [String(t._id), `${t.title} – ${t.artist}`]));
    return { total, items: rows.map((r) => { const last = r.history?.at(-1); return { id: r._id, removed: last?.recordingId ?? r.recordingIds.at(-1), into: null, kept: tracks.get(String(r._id)) ?? r._id, why: "wrong recording", by: last?.by ?? "", at: last?.at ?? null, exact: !!last }; }) };
  }
  if (kind === "choreographers") {
    const col = db.collection<{ _id: string; name: string; mergedInto: string; mergedAt?: Date; mergedBy?: string; splitInto?: string[]; movedDances?: string[] }>("choreographers");
    const filter = { mergedInto: { $exists: true } };
    const [total, rows] = await Promise.all([col.countDocuments(filter), col.find(filter, { projection: { name: 1, mergedInto: 1, mergedAt: 1, mergedBy: 1, splitInto: 1, movedDances: 1 } }).sort({ mergedAt: -1, _id: 1 }).skip(skip).limit(size).toArray()]);
    const names = new Map((await db.collection<{ _id: string; name: string }>("choreographers").find({ _id: { $in: rows.flatMap((r) => [r.mergedInto, ...(r.splitInto ?? [])]) } }, { projection: { name: 1 } }).toArray()).map((c) => [String(c._id), c.name]));
    return {
      total,
      items: rows.map((r) => ({
        id: r._id, removed: r.name, into: r.mergedInto,
        kept: r.splitInto ? r.splitInto.map((id) => names.get(String(id)) ?? id).join(" & ") : names.get(String(r.mergedInto)) ?? null,
        why: r.splitInto ? "split into two people" : "same person", by: r.mergedBy ?? "automatic", at: r.mergedAt ?? null, exact: !!r.movedDances, split: !!r.splitInto,
      })),
    };
  }
  return { total: 0, items: [] };
}

/** Puts back a dance merged into another. */
export async function undoDanceMerge(db: Db, removedId: string, by: string) {
  const merges = db.collection<{ _id: string; into: string; doc: { _id: string; stepsheets?: { url: string }[]; ldcoIds?: string[]; mergedFrom?: string[] } & Record<string, unknown>; gained?: { stepsheets?: string[]; ids?: string[]; before?: Record<string, unknown>; filled?: Record<string, unknown> } }>("dance_merges");
  const m = await merges.findOne({ _id: removedId });
  if (!m) return { status: 404, error: "That merge isn't on record (already undone?)." };
  const dances = db.collection<{ _id: string } & Record<string, unknown>>("dances");
  if (await dances.findOne({ _id: removedId }, { projection: { _id: 1 } })) return { status: 409, error: "That dance is already back." };
  const keep = await dances.findOne({ _id: m.into });
  if (!keep) return { status: 409, error: "The dance it was merged into is gone (merged again?). Undo that first." };
  const notes: Notes = [];
  const urls = m.gained?.stepsheets ?? (m.doc.stepsheets ?? []).map((s) => s.url);
  const ids = m.gained?.ids ?? [m.doc._id, ...(m.doc.ldcoIds ?? []), ...(m.doc.mergedFrom ?? [])].map(String);
  const set: Record<string, unknown> = {};
  if (m.gained?.filled && m.gained.before) {
    // A blank the merge filled goes back to blank, unless it was changed since
    for (const [f, v] of Object.entries(m.gained.filled)) if (JSON.stringify(keep[f]) === JSON.stringify(v)) set[f] = m.gained.before[f] ?? null; else notes.push(`${f} was changed after the merge, so it's left as it is.`);
  } else notes.push("This merge didn't record which blanks it filled on the kept dance; check its count, wall, level, song and dates.");
  await dances.insertOne(m.doc);
  await dances.updateOne({ _id: m.into }, { ...(Object.keys(set).length ? { $set: set } : {}), $pull: { stepsheets: { url: { $in: urls } }, ldcoIds: { $in: ids }, mergedFrom: { $in: ids } } } as never);
  const now = new Date();
  await db.collection<{ _id: string }>("merge_candidates").updateOne({ _id: `undone:${pairId(m.into, removedId)}` }, { $set: { danceIds: [m.into, removedId], reason: "merge undone", confidence: null, status: "rejected", resolvedAt: now, resolvedBy: by } }, { upsert: true });
  await db.collection<{ _id: string }>("dance_merge_undos").updateOne({ _id: removedId }, { $set: { merge: m, by, at: now } }, { upsert: true });
  await merges.deleteOne({ _id: removedId });
  return { status: 200, notes };
}

/** Takes a track out of the track it was merged into. */
export async function undoTrackMerge(db: Db, loserId: string, by: string) {
  const merges = db.collection<{ _id: string; into: string; movedDances?: string[] }>("track_merges");
  const m = await merges.findOne({ _id: loserId });
  if (!m) return { status: 404, error: "That merge isn't on record (already undone?)." };
  const tracks = db.collection<{ _id: string; mergedInto?: string }>("tracks");
  const notes: Notes = [];
  const now = new Date();
  await tracks.updateOne({ _id: loserId }, { $unset: { mergedInto: "" }, $set: { updatedAt: now } });
  const links = await db.collection("track_links").updateMany({ trackId: m.into, movedFrom: loserId }, { $set: { trackId: loserId }, $unset: { movedFrom: "" } });
  const dances = db.collection<{ _id: string; tracks: { trackId: string }[] }>("dances");
  if (m.movedDances?.length) {
    for (const d of await dances.find({ _id: { $in: m.movedDances }, "tracks.trackId": m.into }, { projection: { tracks: 1 } }).toArray()) {
      if (d.tracks.some((t) => t.trackId === loserId)) continue;
      await dances.updateOne({ _id: d._id }, { $set: { tracks: d.tracks.map((t) => (t.trackId === m.into ? { ...t, trackId: loserId } : t)) } });
    }
  } else notes.push("This merge didn't record which dances moved; they're given back their own track on the next tracks:live.");
  for (const id of [loserId, m.into]) await tracks.updateOne({ _id: id }, { $set: { danceCount: await dances.countDocuments({ "tracks.trackId": id }) } });
  await db.collection<{ _id: string }>("track_merge_candidates").updateOne({ _id: pairId(loserId, m.into) }, { $set: { trackIds: [loserId, m.into].sort(), reason: "merge undone", status: "rejected", resolvedAt: now, resolvedBy: by }, $setOnInsert: { createdAt: now } }, { upsert: true });
  await db.collection<{ _id: string }>("track_merge_undos").updateOne({ _id: loserId }, { $set: { into: m.into, merge: m, by, at: now } }, { upsert: true });
  await merges.deleteOne({ _id: loserId });
  return { status: 200, linksMovedBack: links.modifiedCount, notes };
}

/** Gives a track back the recording a review removed (the latest one), with its links. */
export async function undoWrongRecording(db: Db, trackId: string, by: string) {
  const col = db.collection<{ _id: string; recordingIds: string[]; history?: { recordingId: string; previous?: Record<string, unknown>; links?: { _id: string }[] }[] }>("track_recording_rejections");
  const r = await col.findOne({ _id: trackId });
  const last = r?.history?.at(-1);
  if (!r || !last) return { status: 404, error: "Nothing to undo for that track." };
  const tracks = db.collection<{ _id: string; recordingId?: string | null }>("tracks");
  const t = await tracks.findOne({ _id: trackId });
  if (t?.recordingId) return { status: 409, error: "That track has another recording now; undoing would replace it." };
  await tracks.updateOne({ _id: trackId }, { $set: { recordingId: last.recordingId, ...(last.previous ?? {}), updatedAt: new Date() } });
  if (last.links?.length) await db.collection<{ _id: string }>("track_links").bulkWrite(last.links.map((l) => ({ replaceOne: { filter: { _id: l._id }, replacement: l, upsert: true } })) as never);
  await col.updateOne({ _id: trackId }, { $pull: { recordingIds: last.recordingId, history: { recordingId: last.recordingId } }, $push: { undone: { ...last, undoneBy: by, undoneAt: new Date() } } } as never);
  await db.collection("track_merge_candidates").updateMany({ trackIds: trackId, status: "wrong-recording" }, { $set: { status: "open" }, $unset: { resolvedAt: "", resolvedBy: "" } });
  return { status: 200, linksRestored: last.links?.length ?? 0, notes: [] as string[] };
}

/** Separates a choreographer merged into another person again. */
export async function undoChoreographerMerge(db: Db, stubId: string, by: string) {
  const col = db.collection<{ _id: string; name: string; aliases?: string[]; mergedInto?: string; splitInto?: string[]; movedDances?: string[] }>("choreographers");
  const stub = await col.findOne({ _id: stubId });
  if (!stub?.mergedInto) return { status: 404, error: "That record isn't merged (already undone?)." };
  if (stub.splitInto && !stub.movedDances) return { status: 409, error: "This split didn't record which dances it changed, so it can't be undone here." };
  const notes: Notes = [];
  const keepId = stub.mergedInto, now = new Date();
  const dances = db.collection<{ _id: string; choreographerIds: string[] }>("dances");
  if (stub.movedDances?.length) {
    for (const d of await dances.find({ _id: { $in: stub.movedDances } }, { projection: { choreographerIds: 1 } }).toArray()) {
      const ids = d.choreographerIds.map(String);
      const list = stub.splitInto ? [...new Set([...ids.filter((x) => !stub.splitInto!.includes(x)), stubId])] : ids.includes(stubId) ? ids : [...new Set(ids.map((x) => (x === keepId ? stubId : x)))];
      await dances.updateOne({ _id: d._id }, { $set: { choreographerIds: list } });
    }
  } else notes.push(`This merge didn't record which dances it moved, so they stay credited to the person kept. Fix any that are wrong by hand in the Catalogue.`);
  await col.updateOne({ _id: stubId }, { $unset: { mergedInto: "", mergedAt: "", mergedBy: "", splitInto: "" }, $set: { unmergedAt: now, unmergedBy: by } });
  if (!stub.splitInto) await col.updateOne({ _id: keepId }, { $pull: { aliases: { $in: [stub.name, ...(stub.aliases ?? [])] } } });
  for (const other of stub.splitInto ?? [keepId]) {
    await db.collection<{ _id: string }>("choreographer_pair_reviews").updateOne({ _id: pairId(stubId, other) }, { $set: { status: "different", note: "merge undone", by, at: now } }, { upsert: true });
  }
  return { status: 200, notes };
}
