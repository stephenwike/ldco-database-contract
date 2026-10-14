import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { collections, CONTRACT_HASH, CONTRACT_VERSION } from "@/contract";

export const dynamic = "force-dynamic";

function authorized(request: Request): boolean {
  const expected = process.env.CONTRACT_API_TOKEN;
  if (!expected) return true;
  const given = request.headers.get("authorization")?.replace(/^Bearer /, "") ?? "";
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    version: CONTRACT_VERSION,
    hash: CONTRACT_HASH,
    collections: Object.values(collections).map(({ database, name }) => ({ database, name })),
  });
}
