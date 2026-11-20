import { NextRequest, NextResponse } from "next/server";
import { listDanceCandidates } from "@/catalogue";
import { getLinedanceDb } from "@/server/write";

/** Open possible duplicate dances, a page at a time, optionally of one reason. */
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  return NextResponse.json(await listDanceCandidates(await getLinedanceDb(), { reason: p.get("reason") || undefined, page: Number(p.get("page")) || 0 }));
}
