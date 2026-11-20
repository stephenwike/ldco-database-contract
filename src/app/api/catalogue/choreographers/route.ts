import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { findOrCreateChoreographer, searchChoreographers } from "@/catalogue";
import { getLinedanceDb } from "@/server/write";

export async function GET(req: NextRequest) {
  return NextResponse.json(await searchChoreographers(await getLinedanceDb(), req.nextUrl.searchParams.get("q") ?? ""));
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const result = await findOrCreateChoreographer(await getLinedanceDb(), body?.name, new ObjectId().toHexString());
  return NextResponse.json(result, { status: result.error ? 400 : 200 });
}
