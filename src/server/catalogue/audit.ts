import type { Db } from "mongodb";

// Sample audits of the linedance catalogue: a random dance, checked against its stepsheet field by field, so each field
// gets a measured accuracy instead of a guess. Kept in linedance.audits, one per dance per person, with a copy of the
// values as they were checked (a later fix doesn't change what the audit said).

export const AUDIT_FIELDS = [
  { id: "danceName", label: "Name" },
  { id: "count", label: "Count" },
  { id: "wall", label: "Wall" },
  { id: "level", label: "Level" },
  { id: "choreographers", label: "Choreographers" },
  { id: "song", label: "Song" },
  { id: "choreographedIn", label: "Choreographed date" },
] as const;
export type AuditField = (typeof AUDIT_FIELDS)[number]["id"];
/** right: matches the stepsheet. wrong: doesn't. unsure: can't tell. */
export const VERDICTS = ["right", "wrong", "unsure"] as const;
export type Verdict = (typeof VERDICTS)[number];

export interface AuditDance {
  _id: string;
  danceName: string;
  count: number | null;
  wall: number | null;
  levels: string[];
  levelQualifier: string | null;
  choreographerIds: string[];
  songArtists: { song: string; artist: string }[];
  choreographedIn: string | null;
  notStated?: string[];
  stepsheets: { url: string; lang: string | null }[];
}

/** The values an auditor sees, as text, so the audit keeps exactly what was checked. */
export function shownValues(d: AuditDance, names: Record<string, string>, levelNames: Record<string, string>): Record<AuditField, string> {
  const ns = (f: string) => d.notStated?.includes(f);
  return {
    danceName: d.danceName,
    count: d.count != null ? String(d.count) : ns("count") ? "not stated" : "missing",
    wall: d.wall != null ? String(d.wall) : ns("wall") ? "not stated" : "missing",
    level: d.levels?.length ? `${d.levelQualifier ? `${d.levelQualifier} ` : ""}${d.levels.map((l) => levelNames[l] ?? l).join(" / ")}` : ns("level") ? "not stated" : "missing",
    choreographers: d.choreographerIds?.length ? d.choreographerIds.map((c) => names[c] ?? c).join(" & ") : ns("choreographer") ? "not stated" : "missing",
    song: d.songArtists?.length ? d.songArtists.map((s) => `${s.song} – ${s.artist}`).join("; ") : "missing",
    choreographedIn: d.choreographedIn ?? (ns("choreographedIn") ? "not stated" : "missing"),
  };
}

/** A random dance with a stepsheet that this person hasn't audited yet. */
export async function nextAuditDance(db: Db, by: string) {
  const done = (await db.collection<{ danceId: string }>("audits").find({ by }, { projection: { danceId: 1 } }).toArray()).map((a) => a.danceId);
  const [dance] = await db.collection<AuditDance>("dances").aggregate<AuditDance>([
    { $match: { "stepsheets.0": { $exists: true }, _id: { $nin: done } } },
    { $sample: { size: 1 } },
  ]).toArray();
  if (!dance) return null;
  return { dance, values: await valuesFor(db, dance) };
}

/** shownValues with the choreographer and level names looked up. */
async function valuesFor(db: Db, dance: AuditDance) {
  const names = Object.fromEntries((await db.collection<{ _id: string; name: string }>("choreographers").find({ _id: { $in: dance.choreographerIds ?? [] } }, { projection: { name: 1 } }).toArray()).map((c) => [c._id, c.name]));
  const levelNames = Object.fromEntries((await db.collection<{ _id: string; name: string }>("levels").find({}, { projection: { name: 1 } }).toArray()).map((l) => [l._id, l.name]));
  return shownValues(dance, names, levelNames);
}

type Clean = { ok: true; results: Partial<Record<AuditField, Verdict>>; note: string | null } | { ok: false; error: string };

/** Checks an audit: known fields only, each right, wrong or unsure, at least one given. */
export function cleanAudit(body: unknown): Clean {
  const b = body as { results?: unknown; note?: unknown } | null;
  if (!b || typeof b.results !== "object" || b.results === null || Array.isArray(b.results)) return { ok: false, error: "Nothing to save." };
  const results: Partial<Record<AuditField, Verdict>> = {};
  for (const [field, verdict] of Object.entries(b.results)) {
    if (!AUDIT_FIELDS.some((f) => f.id === field)) return { ok: false, error: `Unknown field: ${field}` };
    if (!VERDICTS.includes(verdict as Verdict)) return { ok: false, error: `${field} must be right, wrong or unsure.` };
    results[field as AuditField] = verdict as Verdict;
  }
  if (!Object.keys(results).length) return { ok: false, error: "Mark at least one field." };
  const note = typeof b.note === "string" && b.note.trim() ? b.note.trim().slice(0, 1000) : null;
  return { ok: true, results, note };
}

/** Saves an audit of one dance, with the values as they were checked. One per dance per person; a second replaces it. */
export async function saveAudit(db: Db, danceId: string, body: unknown, by: string) {
  const clean = cleanAudit(body);
  if (!clean.ok) return { status: 400, error: clean.error };
  const dance = await db.collection<AuditDance>("dances").findOne({ _id: danceId });
  if (!dance) return { status: 404, error: "That dance doesn't exist." };
  const found = await valuesFor(db, dance);
  await db.collection("audits").updateOne(
    { danceId, by },
    { $set: { danceId, by, values: found, results: clean.results, note: clean.note, at: new Date() } },
    { upsert: true },
  );
  await db.collection("audits").createIndex({ by: 1, danceId: 1 }, { unique: true });
  return { status: 200, stats: await auditStats(db) };
}

/** The 95% range for a share (Wilson score interval): honest with small samples. */
export function wilson(right: number, n: number): { low: number; high: number } | null {
  if (!n) return null;
  const z = 1.96, p = right / n;
  const centre = (p + (z * z) / (2 * n)) / (1 + (z * z) / n);
  const half = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / (1 + (z * z) / n);
  return { low: Math.max(0, centre - half), high: Math.min(1, centre + half) };
}

/** Per field: how many audits said right, wrong and unsure, and the accuracy with its 95% range. */
export async function auditStats(db: Db) {
  const audits = await db.collection<{ results: Partial<Record<AuditField, Verdict>> }>("audits").find({}, { projection: { results: 1 } }).toArray();
  const fields = AUDIT_FIELDS.map(({ id, label }) => {
    const r = { right: 0, wrong: 0, unsure: 0 };
    for (const a of audits) { const v = a.results?.[id]; if (v) r[v]++; }
    const n = r.right + r.wrong;
    const range = wilson(r.right, n);
    return { id, label, ...r, accuracy: n ? r.right / n : null, low: range?.low ?? null, high: range?.high ?? null };
  });
  return { audited: audits.length, fields };
}
