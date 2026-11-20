import { NextRequest, NextResponse } from "next/server";
import { catalogueStats } from "@/catalogue";
import { getLinedanceDb } from "@/server/write";

// Counting scans the whole catalogue, so the answer is kept for a few minutes
const KEEP_MS = 5 * 60_000;
let cached: { at: number; stats: Awaited<ReturnType<typeof catalogueStats>> } | null = null;

export async function GET(req: NextRequest) {
  const fresh = req.nextUrl.searchParams.get("fresh") === "1";
  if (!fresh && cached && Date.now() - cached.at < KEEP_MS) return NextResponse.json({ ...cached.stats, asOf: new Date(cached.at).toISOString() });

  const stats = await catalogueStats(await getLinedanceDb());
  cached = { at: Date.now(), stats };
  return NextResponse.json({ ...stats, asOf: new Date(cached.at).toISOString() });
}
