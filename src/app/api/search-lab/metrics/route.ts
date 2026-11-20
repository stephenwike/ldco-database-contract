import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/server/mongo";
import { cleanSettings, measureSearch } from "@/server/searchLab";

// GET ?q&gap&settings (JSON): the package's searchDances as the apps run it, with MongoDB's explain of each query.
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
    return NextResponse.json(await measureSearch(db, p.get("q") ?? "", p.get("gap") ?? "", cleanSettings(raw).matchPoints));
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
