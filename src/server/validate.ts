import { collections } from "@/contract";
import { getDb } from "./mongo";

export type CollectionKey = keyof typeof collections;

export interface ValidationReport {
  key: CollectionKey;
  database: string;
  name: string;
  total: number;
  sampled: number;
  invalid: number;
  issueCounts: [string, number][];
  examples: { _id: string; issues: string[] }[];
}

const SAMPLE_LIMIT = 20000;
const EXAMPLE_LIMIT = 10;

export async function validateCollection(key: CollectionKey): Promise<ValidationReport> {
  const { database, name, schema } = collections[key];
  const col = (await getDb(database)).collection(name);

  const total = await col.estimatedDocumentCount();
  const docs = await col.find({}).limit(SAMPLE_LIMIT).toArray();

  const counts = new Map<string, number>();
  const examples: ValidationReport["examples"] = [];
  let invalid = 0;

  for (const doc of docs) {
    const result = schema.safeParse(doc);
    if (result.success) continue;
    invalid++;
    const issues = result.error.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`);
    for (const issue of issues) counts.set(issue, (counts.get(issue) ?? 0) + 1);
    if (examples.length < EXAMPLE_LIMIT) examples.push({ _id: String(doc._id), issues });
  }

  return {
    key,
    database,
    name,
    total,
    sampled: docs.length,
    invalid,
    issueCounts: [...counts.entries()].sort((a, b) => b[1] - a[1]),
    examples,
  };
}
