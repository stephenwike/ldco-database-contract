import { NextRequest, NextResponse } from "next/server";
import { MERGE_KINDS, pickRecords, type MergeKind } from "@/server/catalogue/merge";
import { getLinedanceDb } from "@/server/write";

/** GET ?kind&q: records to choose from when merging. */
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const kind = p.get("kind") as MergeKind;
  if (!MERGE_KINDS.includes(kind)) return NextResponse.json({ error: "Which kind?" }, { status: 400 });
  return NextResponse.json(await pickRecords(await getLinedanceDb(), kind, p.get("q") ?? ""));
}
