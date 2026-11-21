import { NextRequest, NextResponse } from "next/server";
import { listMerges, undoChoreographerMerge, undoDanceMerge, undoTrackMerge, undoWrongRecording } from "@/server/catalogue/undo";
import { editor, getLinedanceDb } from "@/server/write";

const KINDS = ["dances", "tracks", "recordings", "choreographers"];

/** Recent merges of one kind, newest first. */
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const kind = KINDS.includes(p.get("kind") ?? "") ? p.get("kind")! : "dances";
  return NextResponse.json(await listMerges(await getLinedanceDb(), kind, Number(p.get("page")) || 0));
}

/** Undo one merge: { kind, id }. */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || !KINDS.includes(body.kind) || typeof body.id !== "string" || !body.id) return NextResponse.json({ error: "Say which kind and which merge." }, { status: 400 });
  const db = await getLinedanceDb();
  const undo = { dances: undoDanceMerge, tracks: undoTrackMerge, recordings: undoWrongRecording, choreographers: undoChoreographerMerge }[body.kind as "dances"];
  const { status, ...result } = await undo(db, body.id, await editor());
  return NextResponse.json(result, { status });
}
