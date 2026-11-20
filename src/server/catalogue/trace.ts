import type { Db } from "mongodb";
import { keyOf } from "@/catalogue";

// Everything known about one record in the linedance catalogue (decision 29; from the harvester's data desk): the
// record, what it points at, what points at it, and the merges and reviews it took part in. Read-only.

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Doc = { _id: string; [field: string]: any };

/** A dance id that isn't a dance any more: where it went. */
export async function whereDidDanceGo(db: Db, id: string) {
  const merged = await db.collection<Doc>("dance_merges").findOne({ _id: id }, { projection: { into: 1 } });
  if (merged) return { into: String(merged.into), how: "merged" as const };
  const holder = await db.collection<Doc>("dances").findOne({ ldcoIds: id }, { projection: { _id: 1 } });
  if (holder) return { into: String(holder._id), how: "old id" as const };
  return null;
}

export async function traceDance(db: Db, id: string) {
  const dance = await db.collection<Doc>("dances").findOne({ _id: id });
  if (!dance) return null;
  const choreographers = await db.collection<Doc>("choreographers").find({ _id: { $in: dance.choreographerIds ?? [] } }, { projection: { name: 1, mergedInto: 1 } }).toArray();
  const trackIds: string[] = (dance.tracks ?? []).map((t: { trackId: string }) => t.trackId);
  const tracks = await db.collection<Doc>("tracks").find({ _id: { $in: trackIds } }).toArray();
  const recordings = await db.collection<Doc>("recordings").find({ _id: { $in: tracks.map((t) => t.recordingId).filter(Boolean) } }).toArray();
  const links = await db.collection<Doc>("track_links").find({ trackId: { $in: trackIds } }).toArray();
  const mergedIn = await db.collection<Doc>("dance_merges").find({ into: id }, { projection: { "doc.danceName": 1, "doc.stepsheets": 1, rule: 1, by: 1, at: 1, gained: 1 } }).sort({ at: -1 }).toArray();
  const candidates = await db.collection<Doc>("merge_candidates").find({ danceIds: id }).toArray();
  const others = await db.collection<Doc>("dances").find({ _id: { $in: candidates.flatMap((c) => c.danceIds).filter((x: string) => x !== id) } }, { projection: { danceName: 1 } }).toArray();
  const undone = await db.collection<Doc>("dance_merge_undos").find({ $or: [{ _id: id }, { "merge.into": id }] }, { projection: { "merge.doc.danceName": 1, "merge.into": 1, by: 1, at: 1 } }).toArray();
  return {
    dance,
    choreographers,
    tracks: trackIds.map((tid: string) => {
      const t = tracks.find((x) => x._id === tid);
      return { trackId: tid, track: t ?? null, recording: t?.recordingId ? recordings.find((r) => r._id === t.recordingId) ?? null : null, links: links.filter((l) => l.trackId === tid) };
    }),
    mergedIn,
    candidates: candidates.map((c): Doc => ({ ...c, others: c.danceIds.filter((x: string) => x !== id).map((x: string) => ({ _id: x, danceName: others.find((o) => o._id === x)?.danceName ?? null })) })),
    undone,
  };
}

export async function traceChoreographer(db: Db, id: string) {
  const person = await db.collection<Doc>("choreographers").findOne({ _id: id });
  if (!person) return null;
  const dances = db.collection<Doc>("dances");
  const [danceCount, list, stubs, reviews] = await Promise.all([
    dances.countDocuments({ choreographerIds: id }),
    dances.find({ choreographerIds: id }, { projection: { danceName: 1, choreographerIds: 1, year: 1 } }).sort({ nameKey: 1 }).limit(300).toArray(),
    db.collection<Doc>("choreographers").find({ $or: [{ mergedInto: id }, { splitInto: id }] }, { projection: { name: 1, mergedAt: 1, mergedBy: 1, splitInto: 1, movedDances: 1 } }).toArray(),
    db.collection<Doc>("choreographer_pair_reviews").find({ _id: new RegExp(`(^|\\|)${esc(id)}($|\\|)`) }).toArray(),
  ]);
  const coIds = [...new Set(list.flatMap((d) => d.choreographerIds ?? []))].concat(person.mergedInto ? [person.mergedInto] : [], person.splitInto ?? [], reviews.flatMap((r) => String(r._id).split("|")));
  const names = Object.fromEntries((await db.collection<Doc>("choreographers").find({ _id: { $in: [...new Set(coIds)] } }, { projection: { name: 1 } }).toArray()).map((c) => [c._id, c.name]));
  return { person, danceCount, dances: list, stubs, reviews, names };
}

export async function traceTrack(db: Db, id: string) {
  const track = await db.collection<Doc>("tracks").findOne({ _id: id });
  if (!track) return null;
  const [aliases, recording, links, danceCount, dances, mergedIn, mergedLog, candidates, rejection] = await Promise.all([
    db.collection<Doc>("track_aliases").find({ trackId: id }).toArray(),
    track.recordingId ? db.collection<Doc>("recordings").findOne({ _id: track.recordingId }) : null,
    db.collection<Doc>("track_links").find({ trackId: id }).toArray(),
    db.collection("dances").countDocuments({ "tracks.trackId": id }),
    db.collection<Doc>("dances").find({ "tracks.trackId": id }, { projection: { danceName: 1 } }).sort({ nameKey: 1 }).limit(200).toArray(),
    db.collection<Doc>("tracks").find({ mergedInto: id }, { projection: { title: 1, artist: 1 } }).toArray(),
    db.collection<Doc>("track_merges").find({ $or: [{ into: id }, { _id: id }] }).toArray(),
    db.collection<Doc>("track_merge_candidates").find({ trackIds: id }).toArray(),
    db.collection<Doc>("track_recording_rejections").findOne({ _id: id }),
  ]);
  const otherIds = [...new Set([track.mergedInto, ...candidates.flatMap((c) => c.trackIds)].filter((x) => x && x !== id))];
  const others = Object.fromEntries((await db.collection<Doc>("tracks").find({ _id: { $in: otherIds } }, { projection: { title: 1, artist: 1 } }).toArray()).map((t) => [t._id, `${t.title} – ${t.artist}`]));
  return { track, aliases, recording, links, danceCount, dances, mergedIn, mergedLog, candidates, rejection, others };
}

export async function searchChoreographerList(db: Db, q: string, limit = 50) {
  const key = keyOf(q);
  if (!key) return [];
  const people = await db.collection<Doc>("choreographers")
    .find({ $or: [{ nameKey: new RegExp(`^${esc(key)}`) }, { aliases: new RegExp(`^${esc(q.trim())}`, "i") }, { _id: q.trim() }] }, { projection: { name: 1, aliases: 1, countries: 1, mergedInto: 1 } })
    .sort({ nameKey: 1 }).limit(limit).toArray();
  const counts = new Map((await db.collection("dances").aggregate<{ _id: string; n: number }>([{ $match: { choreographerIds: { $in: people.map((p) => p._id) } } }, { $unwind: "$choreographerIds" }, { $group: { _id: "$choreographerIds", n: { $sum: 1 } } }]).toArray()).map((c) => [String(c._id), c.n]));
  return people.map((p): Doc => ({ ...p, danceCount: counts.get(p._id) ?? 0 }));
}

export async function searchTrackList(db: Db, q: string, limit = 50) {
  const text = q.trim();
  if (!text) return [];
  const [title, artist] = text.split(/\s+[-–]\s+|\|/).map((s) => keyOf(s));
  const filter = text.length >= 20 && /^[0-9a-f]{24}$/.test(text) ? { _id: text } : artist ? { key: new RegExp(`^${esc(title)}.*\\|.*${esc(artist)}`) } : { key: new RegExp(`^${esc(title ?? "")}`) };
  return db.collection<Doc>("tracks").find(filter as never, { projection: { title: 1, artist: 1, danceCount: 1, matchStatus: 1, mergedInto: 1, recordingId: 1 } }).sort({ danceCount: -1 }).limit(limit).toArray();
}
