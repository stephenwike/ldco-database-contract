import type { Db } from "mongodb";
import { LinedanceDancesSchema } from "../../contract/collections";
import { keyOf, nameKeyOf, nameWordsOf, RANK_CORE_FACTS, RANK_WEIGHTS, coreGaps } from "../../catalogue";
import type { Migration } from "../types";

// Every ldco dance must be findable in the linedance catalogue (decision 28): apps now read dances from linedance by
// any id (decision 29's appDancesByIds), so an ldco dance that linedance doesn't know would drop out of them. A few
// were added to ldco after the catalogue was built on 2026-11-13 (by the admin's bulk import, before it moved). For
// each ldco dance that no linedance dance answers to (by _id or ldcoIds):
//   same stepsheet in linedance   that dance takes the ldco id in ldcoIds (the feed added it under its own id)
//   none                          the dance is created in linedance under its ldco id, the way copperknob-alert's
//                                 addFeedDance writes a new dance: level parsed from the ldco difficulty, choreographers
//                                 mapped (a credit naming nobody is "not stated"), the song from its ldco track, the
//                                 chosen Spotify track if the catalogue has it, and the rank a new dance starts with
// Reads ldco through the same client; writes only linedance. Every new record is checked against the contract first.

/* eslint-disable @typescript-eslint/no-explicit-any */
type Doc = any;

const LEVEL_PATTERNS: [string, RegExp][] = [
  ["absolute-beginner", /\b(?:absolute(?: beginners?)?|newcomers?|ultra beginners?)\b/],
  ["beginner", /\bbeginners?\b/],
  ["improver", /\b(?:improvers?|novices?)\b/],
  ["intermediate", /\bintermediates?\b/],
  ["advanced", /\badvanced\b/],
];
// A credit that names nobody (copperknob-alert's creditNamesNobody, for a whole name)
const NOBODY = /^(?:unknown|anon|anonymous|various|traditional|trad|n a|na|none)$/;

/** A level field as copperknob-alert's parseLevel reads it. */
export function parseLevel(raw: string | null | undefined) {
  const q = keyOf(raw ?? "");
  let s = q.replace(/\badvanced (beginners?)\b/g, "$1");
  const levels: string[] = [];
  for (const [id, re] of LEVEL_PATTERNS) {
    if (re.test(s)) levels.push(id);
    s = s.replace(new RegExp(re.source, "g"), " ");
  }
  return {
    levels,
    levelQualifier: /\beasy\b/.test(q) ? ("easy" as const) : /\bhigh\b/.test(q) || /\badvanced beginners?\b/.test(q) ? ("high" as const) : /\blow\b/.test(q) ? ("low" as const) : null,
    phrased: /\bphrased\b/.test(q),
    danceType: /\b(?:partner|couples?)\b/.test(q) ? ("partner" as const) : /\bcontra\b/.test(q) ? ("contra" as const) : /\bcircle\b/.test(q) ? ("circle" as const) : /\b(?:wheelchair|chair)\b/.test(q) ? ("chair" as const) : ("line" as const),
    levelRaw: raw ? String(raw) : null,
  };
}

const sheetsOf = (d: Doc): string[] => [...new Set([d.stepsheet, ...(d.stepsheetUrls ?? [])].filter((u): u is string => typeof u === "string" && /^https?:\/\//.test(u)))];

interface Plan {
  link: { ldcoId: string; danceName: string; into: string }[];
  create: Doc[];
  skipped: { ldcoId: string; danceName: string; why: string }[];
}

async function work(db: Db): Promise<Plan> {
  const ldco = db.client.db("ldco");
  const dances = db.collection<any>("dances");
  const known = new Set<string>();
  for await (const d of dances.find({}, { projection: { _id: 1, ldcoIds: 1 } })) {
    known.add(String(d._id));
    for (const x of d.ldcoIds ?? []) known.add(String(x));
  }
  const plan: Plan = { link: [], create: [], skipped: [] };
  for await (const o of ldco.collection<any>("dances").find({})) {
    const id = String(o._id);
    if (known.has(id)) continue;
    const urls = sheetsOf(o);
    const same = urls.length ? await dances.findOne({ "stepsheets.url": { $in: urls } }, { projection: { _id: 1 } }) : null;
    if (same) {
      plan.link.push({ ldcoId: id, danceName: String(o.danceName ?? ""), into: String(same._id) });
      continue;
    }
    if (!o.danceName) {
      plan.skipped.push({ ldcoId: id, danceName: "", why: "no name" });
      continue;
    }

    // Choreographers: the linedance record that is (or took in) the ldco one, following merges; "Unknown" is nobody
    const choreographerIds: string[] = [];
    let nobody = false;
    for (const cid of (o.choreographers ?? []).map(String)) {
      let p = await db.collection<any>("choreographers").findOne({ $or: [{ _id: cid }, { ldcoIds: cid }] }, { projection: { _id: 1, mergedInto: 1 } });
      for (let hops = 0; p?.mergedInto && hops < 5; hops++) p = await db.collection<any>("choreographers").findOne({ _id: p.mergedInto }, { projection: { _id: 1, mergedInto: 1 } });
      if (p) {
        if (!choreographerIds.includes(String(p._id))) choreographerIds.push(String(p._id));
        continue;
      }
      const old = await ldco.collection<any>("choreographers").findOne({ _id: cid }, { projection: { name: 1 } });
      if (old && NOBODY.test(keyOf(old.name))) nobody = true;
      else plan.skipped.push({ ldcoId: id, danceName: String(o.danceName), why: `choreographer ${cid} (${old?.name ?? "unknown id"}) isn't in linedance` });
    }
    if (plan.skipped.some((s) => s.ldcoId === id)) continue;

    // The song from its ldco track (Spotify's data), and that track in the catalogue if a link knows it
    const spotifyId = String(o.primaryTrack || o.tracks?.[0] || "");
    const spotify = spotifyId ? await ldco.collection<any>("tracks").findOne({ _id: spotifyId }, { projection: { name: 1, artists: 1 } }) : null;
    const songArtists = spotify?.name ? [{ song: String(spotify.name), artist: (spotify.artists ?? []).join(", ") }] : (o.songArtists ?? []).filter((s: Doc) => s?.song && s?.artist);
    const link = spotifyId ? await db.collection<any>("track_links").findOne({ provider: "spotify", providerId: spotifyId }, { projection: { trackId: 1 } }) : null;

    const level = parseLevel(o.difficulty);
    const nameKey = nameKeyOf(String(o.danceName));
    const record: Doc = {
      _id: id,
      danceName: String(o.danceName).trim(),
      nameKey,
      nameWords: nameWordsOf(nameKey),
      count: null,
      wall: null,
      ...level,
      choreographerIds,
      notStated: [...(!level.levels.length && !o.difficulty ? ["level"] : []), ...(nobody && !choreographerIds.length ? ["choreographer"] : [])],
      credit: null,
      songArtists,
      musicRaw: songArtists[0] ? `${songArtists[0].song} - ${songArtists[0].artist}` : null,
      bpm: null,
      introCounts: null,
      hasTags: null,
      hasRestarts: null,
      hasBridge: null,
      choreographedIn: null,
      published: null,
      year: null,
      yearFrom: null,
      dateKey: null,
      publishedSource: null,
      stepsheets: urls.map((url) => ({ url, lang: null })),
      ...(link ? { tracks: [{ trackId: String(link.trackId), versionNote: "chosen in the apps" }] } : {}),
      createdAt: new Date(),
    };
    // A new dance's rank before the next rank run: no date, so only having its core facts counts (copperknob-alert's startingRank)
    record.rank = Math.round(1000 * RANK_WEIGHTS.complete * (1 - coreGaps(record).length / RANK_CORE_FACTS.length));
    plan.create.push(LinedanceDancesSchema.parse(record) as Doc);
  }
  return plan;
}

export const migration: Migration = {
  id: "0021-linedance-missing-ldco-dances",
  description: "Make every ldco dance findable in linedance: add its id to the linedance dance with the same stepsheet, or create it under its ldco id.",
  database: "linedance",

  async plan(db) {
    const p = await work(db);
    return {
      summary: `${p.link.length} ldco ids go into an existing linedance dance's ldcoIds; ${p.create.length} dances are created under their ldco ids; ${p.skipped.length} can't be done.`,
      counts: { link: p.link.length, create: p.create.length, skipped: p.skipped.length },
      sample: [...p.link.map((l) => ({ action: "add to ldcoIds", ...l })), ...p.create.map((d) => ({ action: "create", record: d })), ...p.skipped.map((s) => ({ action: "skip", ...s }))],
    };
  },

  async apply(db) {
    const p = await work(db);
    const dances = db.collection<any>("dances");
    for (const l of p.link) await dances.updateOne({ _id: l.into }, { $addToSet: { ldcoIds: l.ldcoId } });
    let created = 0;
    for (const d of p.create) {
      const r = await dances.updateOne({ _id: d._id }, { $setOnInsert: d }, { upsert: true });
      created += r.upsertedCount;
    }
    return {
      summary: `Added ${p.link.length} ldco ids to existing dances' ldcoIds; created ${created} dances${p.skipped.length ? `; skipped ${p.skipped.length}` : ""}.`,
      counts: { linked: p.link.length, created, skipped: p.skipped.length },
      sample: [...p.link, ...p.create.map((d) => ({ _id: d._id, danceName: d.danceName })), ...p.skipped],
    };
  },
};
