import type { Db } from "mongodb";
import type { Migration } from "../types";

// A stub is a placeholder track created by the importers when no real (Spotify) track was matched.
// Decision 7: unmatched song info lives on the dance in songArtists instead.
const STUB = { $or: [{ uri: "" }, { uri: null }, { uri: { $exists: false } }] };

interface Track { _id: string; name?: string; artists?: string[] }
interface Dance { _id: string; primaryTrack?: string; tracks?: string[]; songArtists?: { song: string; artist: string }[] }

async function load(db: Db) {
  const stubs = await db.collection<Track>("tracks").find(STUB).toArray();
  const byId = new Map(stubs.map((t) => [t._id, t]));
  const ids = [...byId.keys()];
  const dances = await db
    .collection<Dance>("dances")
    .find({ $or: [{ primaryTrack: { $in: ids } }, { tracks: { $in: ids } }] })
    .toArray();
  return { byId, ids, dances };
}

// Song info for a dance from its stubs, primary first, without duplicates.
function songArtistsFromStubs(dance: Dance, byId: Map<string, Track>) {
  const seen = new Set<string>();
  const out: { song: string; artist: string }[] = [];
  for (const id of [dance.primaryTrack, ...(dance.tracks ?? [])]) {
    const t = id ? byId.get(id) : undefined;
    if (!t?.name || seen.has(t._id)) continue;
    seen.add(t._id);
    out.push({ song: t.name, artist: (t.artists ?? []).join(", ") });
  }
  return out;
}

const hasSongArtists = (d: Dance) => Array.isArray(d.songArtists) && d.songArtists.length > 0;

export const migration: Migration = {
  id: "0005-ldco-remove-stub-tracks",
  description: "Move song info from stub tracks (empty uri) into dances.songArtists, then delete the stubs.",
  database: "ldco",

  async plan(db) {
    const { byId, ids, dances } = await load(db);
    const needSongArtists = dances.filter((d) => !hasSongArtists(d));
    const danceTracks = ids.length ? await db.collection("dance_tracks").countDocuments({ trackId: { $in: ids } }) : 0;
    return {
      summary: `${ids.length} stub tracks to delete; ${dances.length} dances reference them (${needSongArtists.length} need songArtists copied from the stub).`,
      counts: {
        stubTracks: ids.length,
        dancesReferencingStubs: dances.length,
        dancesNeedingSongArtists: needSongArtists.length,
        danceTracksRowsToDelete: danceTracks,
      },
      sample: needSongArtists.slice(0, 3).map((d) => ({ _id: d._id, songArtists: songArtistsFromStubs(d, byId) })),
    };
  },

  async apply(db) {
    const { byId, ids, dances } = await load(db);
    const stubIds = new Set(ids);
    let updated = 0;
    for (const d of dances) {
      const set: Partial<Dance> = {
        primaryTrack: d.primaryTrack && stubIds.has(d.primaryTrack) ? "" : d.primaryTrack ?? "",
        tracks: (d.tracks ?? []).filter((t) => !stubIds.has(t)),
      };
      if (!hasSongArtists(d)) set.songArtists = songArtistsFromStubs(d, byId);
      await db.collection<Dance>("dances").updateOne({ _id: d._id }, { $set: set });
      updated++;
    }
    // Delete only stubs no dance still points at, so a rerun after a partial failure is safe.
    const stillReferenced = new Set(
      (await db.collection<Dance>("dances").find({ $or: [{ primaryTrack: { $in: ids } }, { tracks: { $in: ids } }] }).toArray())
        .flatMap((d) => [d.primaryTrack, ...(d.tracks ?? [])])
        .filter((id): id is string => !!id && stubIds.has(id)),
    );
    const deletable = ids.filter((id) => !stillReferenced.has(id));
    const danceTracks = await db.collection("dance_tracks").deleteMany({ trackId: { $in: deletable } });
    const tracks = await db.collection<Track>("tracks").deleteMany({ _id: { $in: deletable } });
    return {
      summary: `${updated} dances updated, ${tracks.deletedCount} stub tracks and ${danceTracks.deletedCount} dance_tracks rows deleted.`,
      counts: { dancesUpdated: updated, stubTracksDeleted: tracks.deletedCount, danceTracksDeleted: danceTracks.deletedCount },
    };
  },
};
