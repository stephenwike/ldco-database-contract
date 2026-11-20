import { NextRequest, NextResponse } from "next/server";
import { getMainDb } from "@/server/write";

export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";

  const db = await getMainDb();
  const filter = q
    ? { name: { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } }
    : {};

  const results = await db.collection("choreographers")
    .find(filter)
    .sort({ name: 1 })
    .limit(10)
    .toArray();

  return NextResponse.json(results.map((c) => ({
    id: c._id.toString(),
    name: c.name,
    copperknobUrl: (c.copperknobUrl as string) ?? null,
  })));
}
