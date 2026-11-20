import { NextRequest, NextResponse } from "next/server";
import { readJsonObject } from "@/server/jsonBody";
import { getMainDb } from "@/server/write";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await readJsonObject(req);
  if (body instanceof NextResponse) return body;

  const update: Record<string, unknown> = {};
  if ("copperknobUrl" in body) update.copperknobUrl = body.copperknobUrl ?? null;
  if ("lastImportedAt" in body) update.lastImportedAt = body.lastImportedAt ?? null;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const db = await getMainDb();
  const result = await db.collection("choreographers").updateOne(
    { _id: id } as never,
    { $set: update }
  );

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: "Choreographer not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
