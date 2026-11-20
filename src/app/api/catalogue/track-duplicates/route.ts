import { NextRequest, NextResponse } from "next/server";
import { listTrackCandidates } from "@/server/catalogue/trackReview";
import { getLinedanceDb } from "@/server/write";

/** Open pairs of tracks sharing a recording, a page at a time. */
export async function GET(req: NextRequest) {
  return NextResponse.json(await listTrackCandidates(await getLinedanceDb(), { page: Number(req.nextUrl.searchParams.get("page")) || 0 }));
}
