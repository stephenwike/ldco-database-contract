import { NextResponse } from "next/server";
import { getMainDb } from "@/server/write";

function normalize(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  const dp: number[] = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const temp = dp[j];
      dp[j] = a[i - 1] === b[j - 1] ? prev : 1 + Math.min(prev, dp[j], dp[j - 1]);
      prev = temp;
    }
  }
  return dp[n];
}

function isSimilar(normA: string, normB: string): string | null {
  if (normA === normB) return "same normalized name";
  if (levenshtein(normA, normB) <= 2) return "similar spelling";
  return null;
}

export async function GET() {
  const db = await getMainDb();

  const [choreographers, dances] = await Promise.all([
    db.collection("choreographers").find({}, { projection: { _id: 1, name: 1, copperknobUrl: 1 } }).toArray(),
    db.collection("dances").find({}, { projection: { choreographers: 1 } }).toArray(),
  ]);

  const danceCount = new Map<string, number>();
  for (const dance of dances) {
    for (const id of (dance.choreographers as string[]) ?? []) {
      danceCount.set(id, (danceCount.get(id) ?? 0) + 1);
    }
  }

  type Group = { ids: string[]; names: string[]; copperknobUrls: (string | null)[]; danceCounts: number[]; reason: string };
  const groups: Group[] = [];

  for (let i = 0; i < choreographers.length; i++) {
    const a = choreographers[i];
    const normA = normalize(a.name as string);
    for (let j = i + 1; j < choreographers.length; j++) {
      const b = choreographers[j];
      const normB = normalize(b.name as string);
      const reason = isSimilar(normA, normB);
      if (!reason) continue;

      const aId = a._id.toString();
      const bId = b._id.toString();

      // Always emit a pair — never accumulate 3+ into one group.
      // If A↔B and B↔C both match, they appear as two separate pairs.
      groups.push({
        ids: [aId, bId],
        names: [a.name as string, b.name as string],
        copperknobUrls: [(a.copperknobUrl as string) ?? null, (b.copperknobUrl as string) ?? null],
        danceCounts: [danceCount.get(aId) ?? 0, danceCount.get(bId) ?? 0],
        reason,
      });
    }
  }

  return NextResponse.json(groups);
}
