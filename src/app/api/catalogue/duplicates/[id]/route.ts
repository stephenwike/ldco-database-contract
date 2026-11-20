import { NextRequest, NextResponse } from "next/server";
import { keepApart, mergeCandidate } from "@/catalogue";
import { EDITOR, getLinedanceDb } from "@/server/write";

/** A decision on one candidate: { action: "merge", keepId, mergeIds } or { action: "keep-apart" }. */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const db = await getLinedanceDb();
  if (body?.action === "keep-apart") {
    const { status, ...result } = await keepApart(db, id, EDITOR);
    return NextResponse.json(result, { status });
  }
  if (body?.action === "merge" && typeof body.keepId === "string" && Array.isArray(body.mergeIds) && body.mergeIds.every((x: unknown) => typeof x === "string")) {
    const { status, ...result } = await mergeCandidate(db, id, body.keepId, body.mergeIds, EDITOR);
    return NextResponse.json(result, { status });
  }
  return NextResponse.json({ error: "Say merge (with keepId and mergeIds) or keep-apart." }, { status: 400 });
}
