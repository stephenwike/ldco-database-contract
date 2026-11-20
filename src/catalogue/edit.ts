import type { WriteDbLike } from "./db";
import { keyOf, nameKeyOf, nameWordsOf } from "./keys";

// Editing the linedance catalogue (decision 28): what's missing from each dance, and hand fixes. A fixed field is
// listed in `editedFields`, so scripts that rebuild the catalogue can leave it alone. From line-dance-manager-admin's
// lib/catalogue.ts, which now uses this.

type Filter = Record<string, unknown>;

export interface CatalogueStepsheet {
  url: string;
  lang: string | null;
  title?: string;
}

export interface CatalogueDance {
  _id: string;
  danceName: string;
  nameKey: string;
  /** The distinct words of nameKey, for the indexed word search (nameWordsOf) */
  nameWords?: string[];
  count: number | null;
  wall: number | null;
  levels: string[];
  levelQualifier: string | null;
  phrased: boolean;
  danceType: string;
  levelRaw: string | null;
  choreographerIds: string[];
  credit: string | null;
  songArtists: { song: string; artist: string }[];
  musicRaw: string | null;
  bpm: number | null;
  introCounts: number | null;
  hasTags: boolean | null;
  hasRestarts: boolean | null;
  hasBridge: boolean | null;
  choreographedIn: string | null;
  published: string | null;
  publishedSource: string | null;
  /** No publish date, but on copperknob by then (YYYY-MM): old sheets from copperknob's alphabetical import. */
  publishedBy?: string | null;
  stepsheets: CatalogueStepsheet[];
  ldcoIds?: string[];
  mergedFrom?: string[];
  editedFields?: string[];
  /** Fields the stepsheet itself leaves blank ("-", empty, "Unknown"): not a gap we can fill. */
  notStated?: string[];
  /** A dance from an event that isn't on copperknob yet, so it has no stepsheet (ldco-reviews' unpublished dances) */
  unpublished?: boolean;
  editedAt?: Date;
  editedBy?: string;
}

export const LEVEL_QUALIFIERS = ["easy", "high", "low"];
export const DANCE_TYPES = ["line", "partner", "contra", "circle", "chair"];
const PUBLISHED = /^\d{4}(-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?)?$/;
const CHOREOGRAPHED = /^\d{4}(-(0[1-9]|1[0-2]))?$/;

/** Fields a stepsheet can leave blank on purpose. A dance with one listed in `notStated` isn't missing it. */
export const STATABLE = ["level", "count", "wall", "choreographer", "choreographedIn"] as const;

/**
 * A gap: `core` gaps decide whether a dance counts as complete; the others are weak spots worth browsing. A field the
 * stepsheet doesn't state isn't a gap; those are listed under "Not stated on the stepsheet".
 */
export const GAPS: { id: string; label: string; core: boolean; filter: Filter }[] = [
  { id: "level", label: "No level", core: true, filter: { levels: { $size: 0 }, notStated: { $ne: "level" } } },
  { id: "count", label: "No count", core: true, filter: { count: null, notStated: { $ne: "count" } } },
  { id: "wall", label: "No wall", core: true, filter: { wall: null, notStated: { $ne: "wall" } } },
  { id: "choreographer", label: "No choreographer", core: true, filter: { choreographerIds: { $size: 0 }, notStated: { $ne: "choreographer" } } },
  // When it was choreographed, from the credit ("- August 2021"); a credit that gives no date is "not stated"
  { id: "choreographedIn", label: "No choreographed date", core: true, filter: { choreographedIn: null, notStated: { $ne: "choreographedIn" } } },
  { id: "song", label: "No song", core: true, filter: { songArtists: { $size: 0 } } },
  { id: "stepsheet", label: "No stepsheet", core: true, filter: { stepsheets: { $size: 0 }, unpublished: { $ne: true } } },
  { id: "published", label: "No publish date", core: true, filter: { published: null } },
  { id: "estimated", label: "Estimated date", core: false, filter: { publishedSource: "id-estimate" } },
  { id: "yearOnly", label: "Year-only date", core: false, filter: { published: /^\d{4}$/ } },
  { id: "translationOnly", label: "Translations only", core: false, filter: { "stepsheets.0": { $exists: true }, stepsheets: { $not: { $elemMatch: { lang: null } } } } },
  { id: "notStated", label: "Not stated on the stepsheet", core: false, filter: { "notStated.0": { $exists: true } } },
  { id: "unpublished", label: "Not on copperknob yet", core: false, filter: { unpublished: true } },
  { id: "edited", label: "Edited by hand", core: false, filter: { "editedFields.0": { $exists: true } } },
];

/** The core gaps a dance has, for showing on its row. */
export function gapsOf(d: Pick<CatalogueDance, "levels" | "count" | "wall" | "choreographerIds" | "songArtists" | "stepsheets" | "published" | "notStated"> & { choreographedIn?: string | null; unpublished?: boolean }): string[] {
  const gaps: string[] = [];
  const stated = (f: string) => !d.notStated?.includes(f);
  if (!d.levels?.length && stated("level")) gaps.push("level");
  if (d.count == null && stated("count")) gaps.push("count");
  if (d.wall == null && stated("wall")) gaps.push("wall");
  if (!d.choreographerIds?.length && stated("choreographer")) gaps.push("choreographer");
  if (!d.choreographedIn && stated("choreographedIn")) gaps.push("choreographedIn");
  if (!d.songArtists?.length) gaps.push("song");
  if (!d.stepsheets?.length && !d.unpublished) gaps.push("stepsheet");
  if (!d.published) gaps.push("published");
  return gaps;
}

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export interface DanceQuery {
  gaps?: string[];
  q?: string;
  lang?: string;
  level?: string;
  danceType?: string;
  choreographerId?: string;
}

/** The Mongo filter for a browse query. A pasted URL finds that stepsheet; any other text matches the start of the name. */
export function danceFilter({ gaps = [], q, lang, level, danceType, choreographerId }: DanceQuery): Filter {
  const and: Filter[] = [];
  for (const id of gaps) {
    const gap = GAPS.find((g) => g.id === id);
    if (gap) and.push(gap.filter);
  }
  const text = q?.trim();
  if (text) {
    if (/^https?:\/\//i.test(text)) and.push({ "stepsheets.url": text });
    else {
      const key = nameKeyOf(text);
      if (key) and.push({ nameKey: new RegExp(`^${escapeRegex(key)}`) });
    }
  }
  if (lang) and.push({ "stepsheets.lang": lang });
  if (level) and.push({ levels: level });
  if (danceType) and.push({ danceType });
  if (choreographerId) and.push({ choreographerIds: choreographerId });
  return and.length ? { $and: and } : {};
}

export const CATALOGUE_PAGE_SIZE = 50;

export async function listDances(db: WriteDbLike, query: DanceQuery, page: number) {
  const dances = db.collection<CatalogueDance>("dances");
  const filter = danceFilter(query);
  const [total, docs] = await Promise.all([
    dances.countDocuments(filter),
    dances.find(filter).sort({ nameKey: 1 }).skip(Math.max(0, page) * CATALOGUE_PAGE_SIZE).limit(CATALOGUE_PAGE_SIZE).toArray(),
  ]);
  const ids = [...new Set(docs.flatMap((d) => d.choreographerIds ?? []))];
  const choreographers: { _id: string; name: string }[] = await db.collection("choreographers").find({ _id: { $in: ids } }).project({ name: 1 }).toArray();
  return {
    total,
    pageSize: CATALOGUE_PAGE_SIZE,
    choreographers: Object.fromEntries(choreographers.map((c) => [c._id, c.name])),
    dances: docs.map((d) => ({ ...d, gaps: gapsOf(d) })),
  };
}

export async function catalogueStats(db: WriteDbLike) {
  const dances = db.collection<CatalogueDance>("dances");
  const total = await dances.countDocuments();
  const [gaps, complete, byLanguage, byLevel, candidates, choreographers, levels] = await Promise.all([
    Promise.all(GAPS.map(async (g) => ({ id: g.id, label: g.label, core: g.core, count: await dances.countDocuments(g.filter) }))),
    dances.countDocuments({ $nor: GAPS.filter((g) => g.core).map((g) => g.filter) }),
    dances.aggregate([{ $unwind: "$stepsheets" }, { $match: { "stepsheets.lang": { $ne: null } } }, { $group: { _id: "$stepsheets.lang", n: { $sum: 1 } } }, { $sort: { n: -1 } }]).toArray(),
    dances.aggregate([{ $unwind: "$levels" }, { $group: { _id: "$levels", n: { $sum: 1 } } }]).toArray(),
    db.collection("merge_candidates").countDocuments({ status: "open" }),
    db.collection("choreographers").countDocuments({ mergedInto: { $exists: false } }),
    db.collection<{ _id: string; name: string; rank: number; aliases: string[] }>("levels").find({}).sort({ rank: 1 }).toArray(),
  ]);
  return {
    total,
    complete,
    gaps,
    openMergeCandidates: candidates,
    choreographers,
    languages: byLanguage.map((l) => ({ id: l._id, count: l.n })),
    levels: levels.map((l) => ({ id: l._id, name: l.name, aliases: l.aliases, count: byLevel.find((x) => x._id === l._id)?.n ?? 0 })),
  };
}

type Clean = { ok: true; set: Partial<CatalogueDance> } | { ok: false; error: string };

const wholeOrNull = (v: unknown, min: number, max: number) => v === null || (Number.isInteger(v) && (v as number) >= min && (v as number) <= max);

/** Checks a hand edit. Only known fields get through, and each must be valid; anything else is refused, not ignored. */
export function cleanDancePatch(body: unknown, levelIds: string[]): Clean {
  if (!body || typeof body !== "object" || Array.isArray(body)) return { ok: false, error: "Nothing to save." };
  const set: Partial<CatalogueDance> = {};
  for (const [field, value] of Object.entries(body)) {
    switch (field) {
      case "danceName": {
        const name = typeof value === "string" ? value.trim() : "";
        if (!name) return { ok: false, error: "A dance needs a name." };
        set.danceName = name;
        set.nameKey = nameKeyOf(name);
        set.nameWords = nameWordsOf(set.nameKey);
        break;
      }
      case "count":
        if (!wholeOrNull(value, 0, 2000)) return { ok: false, error: "Count must be a whole number, or blank." };
        set.count = value as number | null;
        break;
      case "wall":
        if (!wholeOrNull(value, 0, 8)) return { ok: false, error: "Wall must be a whole number from 0 to 8, or blank." };
        set.wall = value as number | null;
        break;
      case "introCounts":
        if (!wholeOrNull(value, 0, 999)) return { ok: false, error: "Intro must be a whole number, or blank." };
        set.introCounts = value as number | null;
        break;
      case "levels":
        if (!Array.isArray(value) || !value.every((l) => levelIds.includes(l))) return { ok: false, error: "Unknown level." };
        set.levels = [...new Set(value as string[])].sort((a, b) => levelIds.indexOf(a) - levelIds.indexOf(b));
        break;
      case "levelQualifier":
        if (value !== null && !LEVEL_QUALIFIERS.includes(value as string)) return { ok: false, error: "Unknown level qualifier." };
        set.levelQualifier = value as string | null;
        break;
      case "phrased":
        if (typeof value !== "boolean") return { ok: false, error: "Phrased must be yes or no." };
        set.phrased = value;
        break;
      case "danceType":
        if (!DANCE_TYPES.includes(value as string)) return { ok: false, error: "Unknown dance type." };
        set.danceType = value as string;
        break;
      case "hasTags":
      case "hasRestarts":
      case "hasBridge":
        if (value !== null && typeof value !== "boolean") return { ok: false, error: `${field} must be yes, no or unknown.` };
        set[field] = value as boolean | null;
        break;
      case "choreographerIds":
        if (!Array.isArray(value) || !value.every((c) => typeof c === "string" && c)) return { ok: false, error: "Bad choreographer list." };
        set.choreographerIds = [...new Set(value as string[])];
        break;
      case "songArtists": {
        if (!Array.isArray(value)) return { ok: false, error: "Bad song list." };
        const songs = value.map((s) => ({ song: String(s?.song ?? "").trim(), artist: String(s?.artist ?? "").trim() }));
        if (songs.some((s) => !s.song || !s.artist)) return { ok: false, error: "A song needs a title and an artist." };
        set.songArtists = songs;
        break;
      }
      case "choreographedIn":
        if (value === null || value === "") set.choreographedIn = null;
        else if (typeof value === "string" && CHOREOGRAPHED.test(value.trim())) set.choreographedIn = value.trim();
        else return { ok: false, error: "Choreographed date must be YYYY or YYYY-MM." };
        break;
      case "published":
        if (value === null || value === "") {
          set.published = null;
          set.publishedSource = null;
        } else {
          if (typeof value !== "string" || !PUBLISHED.test(value.trim())) return { ok: false, error: "Publish date must be YYYY, YYYY-MM or YYYY-MM-DD." };
          set.published = value.trim();
          set.publishedSource = "manual";
        }
        break;
      case "stepsheets": {
        if (!Array.isArray(value)) return { ok: false, error: "Bad stepsheet list." };
        const sheets: CatalogueStepsheet[] = [];
        for (const s of value) {
          const url = String(s?.url ?? "").trim();
          if (!/^https?:\/\/\S+$/i.test(url)) return { ok: false, error: `Not a web address: ${url || "(blank)"}` };
          const lang = s?.lang ? String(s.lang).trim().toLowerCase() : null;
          if (lang && !/^[a-z]{2}$/.test(lang)) return { ok: false, error: `Language must be a two-letter code: ${lang}` };
          if (sheets.some((x) => x.url === url)) return { ok: false, error: `Listed twice: ${url}` };
          sheets.push({ url, lang, ...(s?.title ? { title: String(s.title) } : {}) });
        }
        set.stepsheets = sheets;
        break;
      }
      default:
        return { ok: false, error: `${field} can't be edited here.` };
    }
  }
  return Object.keys(set).length ? { ok: true, set } : { ok: false, error: "Nothing to save." };
}

/**
 * The fields apps filter and sort dances by, from a dance's own dates: the choreographed date first, then the publish
 * date. dateKey is the end of the period, sortable ("2021" -> "2021-12-31"), as ldco-database decision 22 sorts.
 * A copy of ldco-harvester's scripts/lib/publishDates.mjs yearFields: change all three (copperknob-alert has one too).
 */
export function yearFields(d: { choreographedIn?: string | null; published?: string | null }): { year: number | null; yearFrom: "choreographed" | "published" | null; dateKey: string | null } {
  const pick: ["choreographed" | "published", string] | null = d.choreographedIn ? ["choreographed", d.choreographedIn] : d.published ? ["published", d.published] : null;
  const m = pick && /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/.exec(pick[1]);
  if (!pick || !m) return { year: null, yearFrom: null, dateKey: null };
  return { year: Number(m[1]), yearFrom: pick[0], dateKey: m[3] ? `${m[1]}-${m[2]}-${m[3]}` : m[2] ? `${m[1]}-${m[2]}-31` : `${m[1]}-12-31` };
}

const sameValue = (a: unknown, b: unknown) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

/** The statable fields an edit gives a value to. */
export function filledStatable(changed: Partial<CatalogueDance>): string[] {
  const filled: string[] = [];
  if (changed.levels?.length) filled.push("level");
  if (changed.count != null) filled.push("count");
  if (changed.wall != null) filled.push("wall");
  if (changed.choreographerIds?.length) filled.push("choreographer");
  if (changed.choreographedIn) filled.push("choreographedIn");
  return filled;
}

/** Saves a hand edit: only fields that really changed, each noted in `editedFields`. */
export async function updateDance(db: WriteDbLike, id: string, body: unknown, by: string) {
  const dances = db.collection<CatalogueDance>("dances");
  const current = await dances.findOne({ _id: id });
  if (!current) return { status: 404, error: "That dance doesn't exist." };
  const levelIds = (await db.collection<{ _id: string; rank: number }>("levels").find({}).sort({ rank: 1 }).toArray()).map((l) => l._id);
  const clean = cleanDancePatch(body, levelIds);
  if (!clean.ok) return { status: 400, error: clean.error };

  const changed = Object.fromEntries(Object.entries(clean.set).filter(([k, v]) => !sameValue(v, current[k as keyof CatalogueDance]))) as Partial<CatalogueDance>;
  // These only follow from their field: saving an untouched date mustn't relabel it as set by hand
  if (!("published" in changed)) delete changed.publishedSource;
  if (!("danceName" in changed)) {
    delete changed.nameKey;
    delete changed.nameWords;
  }
  if (!Object.keys(changed).length) return { status: 200, dance: { ...current, gaps: gapsOf(current) }, changed: [] as string[] };

  if (changed.choreographerIds?.length) {
    const found = await db.collection<{ _id: string }>("choreographers").countDocuments({ _id: { $in: changed.choreographerIds } });
    if (found !== changed.choreographerIds.length) return { status: 400, error: "One of those choreographers doesn't exist." };
  }
  if (changed.stepsheets?.length) {
    const urls = changed.stepsheets.map((s) => s.url);
    const other = await dances.findOne({ _id: { $ne: id }, "stepsheets.url": { $in: urls } }, { projection: { danceName: 1 } });
    if (other) return { status: 409, error: `Another dance already has that stepsheet: ${other.danceName}` };
  }

  // nameKey, nameWords and publishedSource follow from the fields actually edited
  const fields = Object.keys(changed).filter((f) => f !== "nameKey" && f !== "nameWords" && f !== "publishedSource");
  // A value filled in by hand means the field is no longer "not stated"
  const filled = filledStatable(changed);
  // The date fields follow the dates
  const dates = "choreographedIn" in changed || "published" in changed ? yearFields({ ...current, ...changed }) : {};
  const res = await dances.updateOne(
    { _id: id },
    { $set: { ...changed, ...dates, editedAt: new Date(), editedBy: by }, $addToSet: { editedFields: { $each: fields } }, ...(filled.length ? { $pull: { notStated: { $in: filled } } } : {}) },
  );
  const updated = res.matchedCount ? await dances.findOne({ _id: id }) : null;
  if (!updated) return { status: 404, error: "That dance doesn't exist." };
  return { status: 200, dance: { ...updated, gaps: gapsOf(updated) }, changed: fields };
}

export async function searchChoreographers(db: WriteDbLike, q: string) {
  const key = keyOf(q);
  if (!key) return [];
  // A merged record (mergedInto) is a stub pointing at the person kept: never offered
  return db.collection<{ _id: string; name: string; aliases: string[] }>("choreographers")
    .find({ mergedInto: { $exists: false }, $or: [{ nameKey: new RegExp(`^${escapeRegex(key)}`) }, { aliases: new RegExp(`^${escapeRegex(q.trim())}`, "i") }] })
    .sort({ nameKey: 1 }).limit(15).project({ name: 1, aliases: 1 }).toArray() as Promise<{ _id: string; name: string; aliases: string[] }[]>;
}

/** Finds a choreographer by name or alias, or creates one. Never makes a second record for a name it already knows. */
export async function findOrCreateChoreographer(db: WriteDbLike, rawName: unknown, newId: string) {
  const name = typeof rawName === "string" ? rawName.replace(/\s+/g, " ").trim() : "";
  const nameKey = keyOf(name);
  if (!nameKey) return { error: "A choreographer needs a name." };
  const col = db.collection<{ _id: string; name: string; nameKey: string; aliases: string[]; countries: string[]; mergedInto?: string }>("choreographers");
  let known = await col.findOne({ $or: [{ nameKey }, { aliases: name }] });
  // A merged record leads to the person it was merged into
  for (let hops = 0; known?.mergedInto && hops < 5; hops++) known = await col.findOne({ _id: known.mergedInto });
  if (known) return { choreographer: { _id: known._id, name: known.name }, created: false };
  await col.insertOne({ _id: newId, name, nameKey, aliases: [], countries: [] });
  return { choreographer: { _id: newId, name }, created: true };
}
