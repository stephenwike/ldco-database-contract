import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/server/mongo";
import { cleanSettings, labSearch } from "@/server/searchLab";

// GET ?q&gap&page&settings (JSON): the lab's re-ranked results. Read-only.
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  let raw: unknown = null;
  try {
    raw = JSON.parse(p.get("settings") ?? "null");
  } catch {
    raw = null;
  }
  try {
    const db = await getDb("linedance");
    return NextResponse.json(await labSearch(db, p.get("q") ?? "", p.get("gap") ?? "", cleanSettings(raw), Math.max(0, Number(p.get("page")) || 0)));
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
