import type { Db } from "mongodb";
import { mergeDanceRecords, searchDances } from "@/catalogue";
import { samePerson } from "./choreographerReview";
import { mergeTrackInto } from "./trackReview";
import { searchChoreographerList, searchTrackList } from "./trace";

// Merging any two records, not only the review's suggestions (decision 29; from the data desk). Each kind writes
// exactly what its review page writes, so Merge history and the undo functions understand it:
//   dances          mergeDanceRecords (the package): the removed dance kept whole in dance_merges
//   tracks          mergeTrackInto: the lost track stays as a stub, track_merges lists the dances moved
//   choreographers  samePerson: the lost record stays as a stub with movedDances

export type MergeKind = "dances" | "choreographers" | "tracks";
export const MERGE_KINDS: MergeKind[] = ["dances", "choreographers", "tracks"];

export async function mergeRecords(db: Db, kind: MergeKind, keepId: string, loseId: string, by: string): Promise<{ status: number; error?: string; [k: string]: unknown }> {
  if (!keepId || !loseId || keepId === loseId) return { status: 400, error: "Pick two different records." };
  if (kind === "tracks") return mergeTrackInto(db, keepId, loseId, by, "picked: same song");
  if (kind === "choreographers") return samePerson(db, keepId, loseId, by);
  const dances = db.collection<{ _id: string; [k: string]: unknown }>("dances");
  const [keep, lose] = await Promise.all([dances.findOne({ _id: keepId }), dances.findOne({ _id: loseId })]);
  if (!keep || !lose) return { status: 409, error: "One of these dances doesn't exist (merged already?). Reload and try again." };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await mergeDanceRecords(db, keep as any, [lose as any], by, "picked: same dance");
  return { status: 200, kept: keepId };
}

/** Records to choose from when merging: by name (or id, or a stepsheet address for dances), most relevant first. */
export async function pickRecords(db: Db, kind: MergeKind, q: string, limit = 20): Promise<{ _id: string; label: string }[]> {
  const text = q.trim();
  if (text.length < 2) return [];
  if (kind === "choreographers") {
    return (await searchChoreographerList(db, text, limit)).map((p) => ({
      _id: String(p._id),
      label: `${p.name}${p.mergedInto ? " (merged)" : ""} · ${p.danceCount} dances${p.countries?.length ? ` · ${p.countries.join(", ")}` : ""}`,
    }));
  }
  if (kind === "tracks") {
    return (await searchTrackList(db, text, limit)).map((t) => ({ _id: String(t._id), label: `${t.title} – ${t.artist}${t.mergedInto ? " (merged)" : ""} · ${t.danceCount ?? 0} dances` }));
  }
  const r = await searchDances(db, { q: text, pageSize: limit });
  return r.dances.map((d) => ({
    _id: String(d._id),
    label: `${d.danceName} · ${((d.choreographerIds ?? []) as string[]).map((c) => r.choreographers[c] ?? "?").join(" & ") || "no choreographer"} · ${d.count ?? "?"}c ${d.wall ?? "?"}w${d.year ? ` · ${d.year}` : ""}`,
  }));
}
