import { NextRequest, NextResponse } from "next/server";
import { trackWrongRecording, tracksDifferent, tracksSame } from "@/server/catalogue/trackReview";
import { editor, getLinedanceDb } from "@/server/write";

/** A decision on one pair: { action: "same", keepId } | { action: "different" } | { action: "wrong-recording", trackId }. */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const db = await getLinedanceDb();
  let result: { status: number; [k: string]: unknown };
  if (body?.action === "same" && typeof body.keepId === "string") result = await tracksSame(db, id, body.keepId, await editor());
  else if (body?.action === "different") result = await tracksDifferent(db, id, await editor());
  else if (body?.action === "wrong-recording" && typeof body.trackId === "string") result = await trackWrongRecording(db, id, body.trackId, await editor());
  else return NextResponse.json({ error: "Say same (with keepId), different, or wrong-recording (with trackId)." }, { status: 400 });
  const { status, ...rest } = result;
  return NextResponse.json(rest, { status });
}
