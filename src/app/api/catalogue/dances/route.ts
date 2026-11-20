import { NextRequest, NextResponse } from "next/server";
import { listDances } from "@/catalogue";
import { getLinedanceDb } from "@/server/write";

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const result = await listDances(await getLinedanceDb(), {
    gaps: p.get("gaps")?.split(",").filter(Boolean) ?? [],
    q: p.get("q") ?? undefined,
    lang: p.get("lang") ?? undefined,
    level: p.get("level") ?? undefined,
    danceType: p.get("danceType") ?? undefined,
    choreographerId: p.get("choreographerId") ?? undefined,
  }, Number(p.get("page")) || 0);
  return NextResponse.json(result);
}
