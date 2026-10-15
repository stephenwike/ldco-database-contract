import { collections } from "@/contract";
import { getDb } from "@/server/mongo";
import type { CollectionKey } from "@/server/validate";
import { assertLocal } from "./runner";

// Decision 10: contract-violating documents move to ldco-reviews. The document is moved unchanged;
// why it moved is recorded in a ledger so the review collections keep their own shape.
const REVIEWS_DB = "ldco-reviews";
const LEDGER = "_quarantine";

export interface QuarantineCandidate {
  _id: string;
  issues: string[];
}

export interface QuarantinePlan {
  key: CollectionKey;
  target: string;
  candidates: QuarantineCandidate[];
  // Violating documents whose _id already exists in the target; these are never moved.
  conflicts: string[];
}

// ldco names map 1:1 (the review collections mirror ldco); other databases reuse names, so prefix them.
export function targetName(key: CollectionKey): string {
  const { database, name } = collections[key];
  return database === "ldco" ? name : `${database}__${name}`;
}

async function findViolations(key: CollectionKey) {
  const { database, name, schema } = collections[key];
  if (database === REVIEWS_DB) throw new Error(`${key} is already in ${REVIEWS_DB}.`);
  const docs: { doc: Record<string, unknown>; issues: string[] }[] = [];
  for await (const doc of (await getDb(database)).collection(name).find({})) {
    const result = schema.safeParse(doc);
    if (!result.success) {
      docs.push({ doc, issues: result.error.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`) });
    }
  }
  return docs;
}

export async function planQuarantine(key: CollectionKey): Promise<QuarantinePlan> {
  const target = targetName(key);
  const violations = await findViolations(key);
  const ids = violations.map((v) => v.doc._id);
  const existing = ids.length
    ? await (await getDb(REVIEWS_DB)).collection(target).find({ _id: { $in: ids as never[] } }, { projection: { _id: 1 } }).toArray()
    : [];
  const taken = new Set(existing.map((d) => String(d._id)));
  return {
    key,
    target: `${REVIEWS_DB}.${target}`,
    candidates: violations.filter((v) => !taken.has(String(v.doc._id))).map((v) => ({ _id: String(v.doc._id), issues: v.issues })),
    conflicts: [...taken],
  };
}

// Insert into the target before deleting the source, so a failure part-way never loses a document.
// Violations are re-checked here rather than trusting an earlier plan.
export async function applyQuarantine(key: CollectionKey) {
  assertLocal();
  const { database, name } = collections[key];
  const source = (await getDb(database)).collection(name);
  const reviews = await getDb(REVIEWS_DB);
  const target = reviews.collection(targetName(key));
  const ledger = reviews.collection(LEDGER);

  let moved = 0;
  const conflicts: string[] = [];
  for (const { doc, issues } of await findViolations(key)) {
    const id = doc._id as never;
    if (await target.findOne({ _id: id }, { projection: { _id: 1 } })) {
      conflicts.push(String(doc._id));
      continue;
    }
    await target.insertOne(doc as never);
    await ledger.insertOne({ source: key, target: `${REVIEWS_DB}.${targetName(key)}`, docId: doc._id, issues, quarantinedAt: new Date() });
    await source.deleteOne({ _id: id });
    moved++;
  }
  return { key, target: `${REVIEWS_DB}.${targetName(key)}`, moved, conflicts };
}
