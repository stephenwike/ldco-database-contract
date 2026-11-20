import { NextRequest, NextResponse } from "next/server";
import { getMainDb } from "@/server/write";

export async function POST(req: NextRequest) {
  const { keepId, deleteId } = await req.json().catch(() => ({}));
  if (!keepId || !deleteId || keepId === deleteId) {
    return NextResponse.json({ error: "Invalid ids" }, { status: 400 });
  }

  const db = await getMainDb();

  // Find dances that reference the deleted choreographer
  const affectedDances = await db.collection("dances")
    .find({ choreographers: deleteId })
    .project({ _id: 1, choreographers: 1 })
    .toArray();

  for (const dance of affectedDances) {
    const chors = (dance.choreographers as string[]) ?? [];
    // Replace deleteId with keepId, deduplicate
    const updated = [...new Set(chors.map((id: string) => id === deleteId ? keepId : id))];
    await db.collection("dances").updateOne(
      { _id: dance._id },
      { $set: { choreographers: updated } }
    );
  }

  await db.collection("choreographers").deleteOne({ _id: deleteId } as never);

  return NextResponse.json({ ok: true, updatedDances: affectedDances.length });
}
