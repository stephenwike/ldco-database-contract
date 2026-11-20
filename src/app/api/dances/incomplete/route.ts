import { NextResponse } from "next/server";
import { readPublishDate, unpublishedPublishedConditions } from "@/lib/dancePublished";
import { getMainDb } from "@/server/write";

export async function GET() {
  const db = await getMainDb();

  const dances = await db.collection("dances").find({
    $or: [
      { stepsheet: "" },
      { stepsheet: null },
      { stepsheet: { $exists: false } },
      { primaryTrack: "" },
      { primaryTrack: null },
      { primaryTrack: { $exists: false } },
      ...unpublishedPublishedConditions,
    ],
  }).sort({ danceName: 1 }).toArray();

  if (dances.length === 0) return NextResponse.json([]);

  const allChoreographerIds = [...new Set(dances.flatMap(d => (d.choreographers as string[]) ?? []))];
  const allTrackIds = [...new Set(dances.map(d => d.primaryTrack as string).filter(Boolean))];

  const [choreographers, tracks] = await Promise.all([
    allChoreographerIds.length > 0
      ? db.collection("choreographers").find({ _id: { $in: allChoreographerIds as never[] } }).toArray()
      : Promise.resolve([]),
    allTrackIds.length > 0
      ? db.collection("tracks").find({ _id: { $in: allTrackIds } } as never).toArray()
      : Promise.resolve([]),
  ]);

  const choreoMap = new Map(choreographers.map(c => [c._id.toString(), c.name as string]));
  const trackMap = new Map(tracks.map(t => [t._id.toString(), t.name as string]));

  return NextResponse.json(dances.map(d => {
    const stepsheet = (d.stepsheet as string) ?? "";
    const primaryTrack = (d.primaryTrack as string) ?? "";
    const published = readPublishDate(d.published);
    const missing: string[] = [];
    if (!stepsheet) missing.push("stepsheet");
    if (!primaryTrack) missing.push("track");
    if (!published) missing.push("published");

    return {
      id: d._id.toString(),
      danceName: d.danceName as string,
      difficulty: (d.difficulty as string) ?? "",
      choreographerNames: ((d.choreographers as string[]) ?? []).map(id => choreoMap.get(id) ?? id),
      stepsheet,
      primaryTrack,
      primaryTrackName: primaryTrack ? (trackMap.get(primaryTrack) ?? null) : null,
      songArtists: (d.songArtists as { song: string; artist: string }[]) ?? [],
      published,
      missing,
    };
  }));
}
