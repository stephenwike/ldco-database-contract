import { NextRequest, NextResponse } from "next/server";
import { differentPeople, listChoreographerPairs, samePerson } from "@/server/catalogue/choreographerReview";
import { EDITOR, getLinedanceDb } from "@/server/write";

/** Choreographer pairs the rules won't decide, a page at a time, optionally of one kind. */
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  return NextResponse.json(await listChoreographerPairs(await getLinedanceDb(), { kind: p.get("kind") || undefined, page: Number(p.get("page")) || 0 }));
}

/** A decision: { action: "same", keepId, loseId } or { action: "different", a, b }. */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const db = await getLinedanceDb();
  const str = (v: unknown): v is string => typeof v === "string" && v.length > 0;
  let result: { status: number; [k: string]: unknown };
  if (body?.action === "same" && str(body.keepId) && str(body.loseId)) result = await samePerson(db, body.keepId, body.loseId, EDITOR);
  else if (body?.action === "different" && str(body.a) && str(body.b)) result = await differentPeople(db, body.a, body.b, EDITOR);
  else return NextResponse.json({ error: "Say same (with keepId and loseId) or different (with a and b)." }, { status: 400 });
  const { status, ...rest } = result;
  return NextResponse.json(rest, { status });
}
