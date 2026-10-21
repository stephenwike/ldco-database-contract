import { NextResponse } from "next/server";
import { CONTRACT_HASH, CONTRACT_VERSION } from "@/contract";

export const dynamic = "force-dynamic";

// Public: only the version and hash, which is all ldco-db-check needs, so app builds need no token.
// The full listing stays behind CONTRACT_API_TOKEN at /api/contract.
export function GET() {
  return NextResponse.json({ version: CONTRACT_VERSION, hash: CONTRACT_HASH });
}
