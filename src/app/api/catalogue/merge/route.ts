import { NextRequest, NextResponse } from "next/server";
import { readJsonObject } from "@/server/jsonBody";
import { MERGE_KINDS, mergeRecords, type MergeKind } from "@/server/catalogue/merge";
import { EDITOR, getLinedanceDb } from "@/server/write";

/** Merge any two records of one kind: { kind: "dances" | "choreographers" | "tracks", keepId, loseId }. */
export async function POST(req: NextRequest) {
  const body = await readJsonObject(req);
  if (body instanceof NextResponse) return body;
  const { kind, keepId, loseId } = body;
  if (!MERGE_KINDS.includes(kind) || typeof keepId !== "string" || typeof loseId !== "string") {
    return NextResponse.json({ error: "Say which kind, which record to keep (keepId) and which to merge in (loseId)." }, { status: 400 });
  }
  const { status, ...result } = await mergeRecords(await getLinedanceDb(), kind as MergeKind, keepId, loseId, EDITOR);
  return NextResponse.json(result, { status });
}
