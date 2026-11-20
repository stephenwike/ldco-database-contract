import { NextRequest, NextResponse } from "next/server";
import { getSpotifyAccessToken } from "@/server/spotify";

export async function GET(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Track ID is required." }, { status: 400 });

  const token = await getSpotifyAccessToken();
  const res = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Track not found." }, { status: res.status });
  }

  return NextResponse.json(await res.json());
}
