import { NextResponse } from "next/server";
import { COLLECTION_HASHES, CONTRACT_HASH, CONTRACT_VERSION } from "@/contract";

export const dynamic = "force-dynamic";

// Public: the version, the overall hash and one hash per collection (for scoped checks, decision 21),
// which is all ldco-db-check needs, so app builds need no token.
// The full listing stays behind CONTRACT_API_TOKEN at /api/contract.
export function GET() {
  return NextResponse.json({ version: CONTRACT_VERSION, hash: CONTRACT_HASH, collections: COLLECTION_HASHES });
}
