import type { DbLike, WriteDbLike } from "./db";
import { keyOf } from "./keys";
import { resolveDances } from "./resolve";
import { LISTED_DANCES, searchDances } from "./search";

// Catalogue dances as the apps show them (decision 29: one copy every app uses). From line-dance-dj-feed's
// lib/server/catalogue.js, where it started: the linedance catalogue (decision 28) is too big to send to a browser, so
// apps search it and look dances up by id on the server, and get each dance in one plain shape:
//   { id, currentId, danceName, difficulty, levels, stepsheet, primaryTrack, songName, artist, duration_ms, spotifyUri,
//     isrc, choreographers: [names], choreographerIds }
// Ids: a dance merged into another keeps its old id in `ldcoIds`, and the old ldco catalogue's ids are there too, so
// lists, lessons and requests saved with an old id still find their dance (resolveDances). appDancesByIds answers
// under the id asked for (`id`), with `currentId` the dance's id now.
// A dance's song is its track (the one chosen in the apps, else its first), with the Spotify link and the recording's
// ISRC and length; lengths fall back to the old ldco.tracks (Spotify's data, kept for songs DJs have played).

/** A MongoClient: the catalogue is client.db("linedance"), and old track lengths are in client.db("ldco"). */
export interface ClientLike {
  db(name: string): WriteDbLike & DbLike;
}

export interface AppDance {
  id: string;
  currentId: string;
  danceName: string;
  difficulty: string;
  levels: string[];
  stepsheet: string;
  primaryTrack: string;
  songName: string;
  artist: string;
  duration_ms: number | null;
  spotifyUri: string | null;
  isrc: string | null;
  choreographers: string[];
  choreographerIds: string[];
}

export const CATALOGUE_DB = "linedance";
/** The fields the shape is made from. */
export const APP_DANCE_FIELDS = { danceName: 1, choreographerIds: 1, stepsheets: 1, levels: 1, levelQualifier: 1, levelRaw: 1, tracks: 1, songArtists: 1, unpublished: 1 } as const;
const LEVEL_NAMES: Record<string, string> = { "absolute-beginner": "Absolute Beginner", beginner: "Beginner", improver: "Improver", intermediate: "Intermediate", advanced: "Advanced" };
const MAX_RESULTS = 50;
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* eslint-disable @typescript-eslint/no-explicit-any */
type Doc = any;

/** A level id for a level's name: "Absolute Beginner" → "absolute-beginner". */
export const levelIdOf = (name: string) => String(name ?? "").trim().toLowerCase().replace(/\s+/g, "-");

/** The level as the stepsheet gives it ("High Improver"), else from the standard levels. */
export function difficultyOf(d: { levelRaw?: string | null; levels?: string[]; levelQualifier?: string | null }): string {
  if (d.levelRaw) return d.levelRaw;
  const levels = (d.levels ?? []).map((l) => LEVEL_NAMES[l] ?? l).join(" / ");
  return levels && d.levelQualifier ? `${d.levelQualifier[0].toUpperCase()}${d.levelQualifier.slice(1)} ${levels}` : levels;
}

/** The track a dance plays: the one users chose in the apps, else its first. */
export function trackIdOf(d: { tracks?: { trackId: string; versionNote?: string }[] }): string {
  const tracks = d.tracks ?? [];
  return String((tracks.find((t) => t.versionNote === "chosen in the apps") ?? tracks[0])?.trackId ?? "");
}

/** Title, artist, Spotify id, ISRC and length for each track id. */
export async function trackDetails(client: ClientLike, trackIds: string[]) {
  const ids = [...new Set(trackIds.filter(Boolean))];
  const out = new Map<string, { title: string; artist: string; spotifyUri: string | null; isrc: string | null; duration_ms: number | null }>();
  if (!ids.length) return out;
  const db = client.db(CATALOGUE_DB);
  const [tracks, links] = await Promise.all([
    db.collection("tracks").find({ _id: { $in: ids } }, { projection: { title: 1, artist: 1, recordingId: 1 } }).toArray() as Promise<Doc[]>,
    db.collection("track_links").find({ trackId: { $in: ids }, provider: "spotify" }, { projection: { providerId: 1, trackId: 1, kind: 1, confidence: 1 } }).toArray() as Promise<Doc[]>,
  ]);
  // A confident link first; never an album
  const order: Record<string, number> = { high: 0, probable: 1 };
  const spotifyOf = new Map<string, string>();
  for (const l of links.filter((l) => l.kind !== "album").sort((a, b) => (order[a.confidence] ?? 2) - (order[b.confidence] ?? 2))) {
    if (!spotifyOf.has(String(l.trackId))) spotifyOf.set(String(l.trackId), String(l.providerId));
  }
  const recordingIds = [...new Set(tracks.map((t) => t.recordingId).filter(Boolean))];
  const spotifyIds = [...new Set(spotifyOf.values())];
  const [recordings, spotifyTracks] = await Promise.all([
    recordingIds.length ? (db.collection("recordings").find({ _id: { $in: recordingIds } }, { projection: { isrcs: 1, durationMs: 1 } }).toArray() as Promise<Doc[]>) : [],
    spotifyIds.length ? (client.db("ldco").collection("tracks").find({ _id: { $in: spotifyIds } }, { projection: { duration_ms: 1, isrc: 1 } }).toArray() as Promise<Doc[]>) : [],
  ]);
  const recordingById = new Map(recordings.map((r) => [String(r._id), r]));
  const spotifyById = new Map(spotifyTracks.map((t) => [String(t._id), t]));
  for (const t of tracks) {
    const rec = t.recordingId ? recordingById.get(String(t.recordingId)) : null;
    const spotify = spotifyOf.get(String(t._id)) ?? null;
    const known = spotify ? spotifyById.get(spotify) : null;
    out.set(String(t._id), {
      title: t.title ?? "",
      artist: t.artist ?? "",
      spotifyUri: spotify ? `spotify:track:${spotify}` : null,
      isrc: rec?.isrcs?.[0] ?? (known?.isrc ? String(known.isrc).toUpperCase() : null),
      duration_ms: rec?.durationMs ?? known?.duration_ms ?? null,
    });
  }
  return out;
}

/** Catalogue records (with APP_DANCE_FIELDS) as app dances, in the same order. */
export async function toAppDances(client: ClientLike, docs: Doc[]): Promise<AppDance[]> {
  if (!docs.length) return [];
  const people = [...new Set(docs.flatMap((d) => d.choreographerIds ?? []).map(String))];
  const [names, tracks] = await Promise.all([
    people.length ? (client.db(CATALOGUE_DB).collection("choreographers").find({ _id: { $in: people } }, { projection: { name: 1 } }).toArray() as Promise<Doc[]>) : [],
    trackDetails(client, docs.map(trackIdOf)),
  ]);
  const nameOf = new Map(names.map((c) => [String(c._id), String(c.name)]));
  return docs.map((d) => {
    const trackId = trackIdOf(d);
    const track = tracks.get(trackId) ?? null;
    // A dance without a matched track keeps the song its stepsheet names
    const song = track ? null : (d.songArtists?.[0] ?? null);
    const choreographerIds = (d.choreographerIds ?? []).map(String);
    return {
      id: String(d._id),
      currentId: String(d._id),
      danceName: d.danceName ?? "",
      difficulty: difficultyOf(d),
      levels: d.levels ?? [],
      stepsheet: (d.stepsheets ?? []).find((s: { lang?: string | null }) => !s.lang)?.url ?? d.stepsheets?.[0]?.url ?? "",
      primaryTrack: trackId,
      songName: track?.title ?? song?.song ?? "",
      artist: track?.artist ?? song?.artist ?? "",
      duration_ms: track?.duration_ms ?? null,
      spotifyUri: track?.spotifyUri ?? null,
      isrc: track?.isrc ?? null,
      choreographers: choreographerIds.map((id: string) => nameOf.get(id)).filter((n: string | undefined): n is string => !!n),
      choreographerIds,
    };
  });
}

/** Dances with a song by an artist whose name (or a word of it) starts with `text`. */
async function byArtist(client: ClientLike, text: string, limit: number): Promise<Doc[]> {
  const key = keyOf(text);
  if (!key) return [];
  const db = client.db(CATALOGUE_DB);
  // A track's key is "title|artist"
  const tracks = (await db
    .collection("tracks")
    .find({ key: new RegExp(`\\|(?:.* )?${esc(key)}`), mergedInto: { $exists: false } }, { projection: { _id: 1 } })
    .limit(1000)
    .toArray()) as Doc[];
  if (!tracks.length) return [];
  return db
    .collection("dances")
    .find({ ...LISTED_DANCES, "tracks.trackId": { $in: tracks.map((t) => String(t._id)) } }, { projection: APP_DANCE_FIELDS })
    .sort({ rank: -1 })
    .limit(limit)
    .toArray() as Promise<Doc[]>;
}

/**
 * Dances matching what was typed, most relevant first: by name, choreographer and song title (searchDances, the same
 * order every app gives), or, with field "artist", by the song's artist. Unpublished dances (an event's, waiting for a
 * stepsheet) aren't listed.
 */
export async function searchAppDances(client: ClientLike, q: string, { field = "danceName", limit = 20 }: { field?: "danceName" | "artist"; limit?: number } = {}): Promise<AppDance[]> {
  const text = String(q ?? "").trim().slice(0, 100);
  if (!text) return [];
  const n = Math.max(1, Math.min(MAX_RESULTS, Number(limit) || 20));
  const docs =
    field === "artist"
      ? await byArtist(client, text, n)
      : ((await searchDances(client.db(CATALOGUE_DB), { q: text, filter: LISTED_DANCES, pageSize: n, projection: APP_DANCE_FIELDS })).dances as Doc[]);
  return toAppDances(client, docs);
}

/** Dances by id, old ids included: each under the id asked for (`id`), with `currentId` its id now. Ids with no dance are left out. */
export async function appDancesByIds(client: ClientLike, ids: string[]): Promise<AppDance[]> {
  const wanted = [...new Set((ids ?? []).map(String).filter(Boolean))].slice(0, 1000);
  if (!wanted.length) return [];
  const found = await resolveDances(client.db(CATALOGUE_DB), wanted, APP_DANCE_FIELDS as unknown as Record<string, 1>);
  const docs = [...new Map([...found.values()].filter(Boolean).map((d) => [String((d as Doc)._id), d as Doc])).values()];
  const app = new Map((await toAppDances(client, docs)).map((d) => [d.id, d]));
  return wanted.flatMap((id) => {
    const d = found.get(id) as Doc | null | undefined;
    const dance = d && app.get(String(d._id));
    return dance ? [{ ...dance, id }] : [];
  });
}

/** Whether a dance with this id (or old id) is in the catalogue. */
export async function danceExists(client: ClientLike, id: string): Promise<boolean> {
  return (await resolveDances(client.db(CATALOGUE_DB), [String(id)], { _id: 1 })).get(String(id)) != null;
}

/**
 * Dances the community uses (taught, requested, played, on dancers' lists: rankSignals.usage), picked at random,
 * optionally only of some levels (ids) or by some choreographers (ids).
 */
export async function sampleCommunityDances(client: ClientLike, { levels = [], choreographerIds = [], count = 5 }: { levels?: string[]; choreographerIds?: string[]; count?: number } = {}): Promise<AppDance[]> {
  const match: Record<string, unknown> = { ...LISTED_DANCES, "rankSignals.usage": { $gt: 0 } };
  if (levels.length) match.levels = { $in: levels };
  if (choreographerIds.length) match.choreographerIds = { $in: choreographerIds };
  const size = Math.min(Math.max(1, Math.floor(count) || 5), 50);
  const docs = (await client.db(CATALOGUE_DB).collection("dances").aggregate([{ $match: match }, { $sample: { size } }, { $project: APP_DANCE_FIELDS }]).toArray()) as Doc[];
  return toAppDances(client, docs);
}
