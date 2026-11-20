import { NextRequest, NextResponse } from "next/server";
import { readJsonObject } from "@/server/jsonBody";
import { getMainDb } from "@/server/write";

export async function POST(req: NextRequest) {
  const body = await readJsonObject(req);
  if (body instanceof NextResponse) return body;
  const { urls } = body;
  if (!Array.isArray(urls)) {
    return NextResponse.json({ error: "urls must be an array" }, { status: 400 });
  }

  const db = await getMainDb();
  const found = await db.collection("dances")
    .find({ stepsheet: { $in: urls } } as never)
    .project({ stepsheet: 1 })
    .toArray();

  const existing = new Set(found.map(d => d.stepsheet as string));
  return NextResponse.json({ existing: Array.from(existing) });
}
