import { NextResponse } from "next/server";
import { getMainDb } from "@/server/write";

function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
}

export async function GET() {
  const db = await getMainDb();

  const dances = await db.collection("dances").find(
    {},
    { projection: { _id: 1, danceName: 1, choreographers: 1, stepsheet: 1, difficulty: 1, primaryTrack: 1 } }
  ).toArray();

  // Group by normalized name
  const groups = new Map<string, typeof dances>();
  for (const dance of dances) {
    const key = normalizeName(dance.danceName as string);
    if (!key) continue;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(dance);
  }

  // Keep only groups with 2+ dances where at least one pair shares a choreographer
  const duplicateGroups: { normalizedName: string; dances: typeof dances }[] = [];
  for (const [normalizedName, group] of groups) {
    if (group.length < 2) continue;
    let hasDupe = false;
    outer: for (let i = 0; i < group.length; i++) {
      const aChors = new Set((group[i].choreographers as string[]) ?? []);
      for (let j = i + 1; j < group.length; j++) {
        const bChors = (group[j].choreographers as string[]) ?? [];
        if (bChors.some(c => aChors.has(c))) { hasDupe = true; break outer; }
      }
    }
    if (!hasDupe) continue;
    duplicateGroups.push({ normalizedName, dances: group });
  }

  if (duplicateGroups.length === 0) return NextResponse.json([]);

  // Resolve choreographer names
  const allChoreographerIds = [...new Set(
    duplicateGroups.flatMap(g => g.dances.flatMap(d => (d.choreographers as string[]) ?? []))
  )];
  const choreographers = allChoreographerIds.length > 0
    ? await db.collection("choreographers").find({ _id: { $in: allChoreographerIds as never[] } }).toArray()
    : [];
  const choreoMap = new Map(choreographers.map(c => [c._id.toString(), c.name as string]));

  return NextResponse.json(duplicateGroups.map(g => ({
    normalizedName: g.normalizedName,
    dances: g.dances.map(d => ({
      id: d._id.toString(),
      danceName: d.danceName as string,
      difficulty: (d.difficulty as string) ?? "",
      choreographerIds: (d.choreographers as string[]) ?? [],
      choreographerNames: ((d.choreographers as string[]) ?? []).map(id => choreoMap.get(id) ?? id),
      stepsheet: (d.stepsheet as string) || "",
      hasPrimaryTrack: Boolean(d.primaryTrack),
    })),
  })));
}
