import { NextRequest, NextResponse } from "next/server";
import { auditStats, nextAuditDance, saveAudit } from "@/server/catalogue/audit";
import { editor, getLinedanceDb } from "@/server/write";

/** The next random dance to audit (one this person hasn't audited yet), with the accuracy so far. */
export async function GET() {
  const db = await getLinedanceDb();
  const [next, stats] = await Promise.all([nextAuditDance(db, await editor()), auditStats(db)]);
  return NextResponse.json({ next, stats });
}

/** Saves an audit: { danceId, results: { field: "right" | "wrong" | "unsure" }, note? }. */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.danceId !== "string") return NextResponse.json({ error: "Which dance?" }, { status: 400 });
  const { status, ...result } = await saveAudit(await getLinedanceDb(), body.danceId, body, await editor());
  return NextResponse.json(result, { status });
}
