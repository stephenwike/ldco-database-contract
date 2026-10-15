import { ObjectId } from "mongodb";
import { collections } from "@/contract";
import { maskDocument } from "./mask";
import { getDb } from "./mongo";
import type { CollectionKey } from "./validate";

export const PAGE_SIZE = 25;
const SAFE_FIELD = /^[A-Za-z0-9_.[\]-]+$/;

function target(key: CollectionKey) {
  const { database, name, schema } = collections[key];
  return { schema, database, name };
}

// Field comes from the URL, so it is restricted to plain path characters (no `$` operators); value is always a string.
function buildFilter(field?: string, value?: string) {
  if (!field || value === undefined) return {};
  if (!SAFE_FIELD.test(field)) throw new Error("Invalid field name.");
  return { [field.replace(/\[\]/g, "")]: value };
}

export async function listDocuments(key: CollectionKey, page: number, field?: string, value?: string) {
  const { database, name } = target(key);
  const col = (await getDb(database)).collection(name);
  const filter = buildFilter(field, value);
  const total = field ? await col.countDocuments(filter) : await col.estimatedDocumentCount();
  const docs = await col
    .find(filter)
    .sort({ _id: 1 })
    .skip((page - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .toArray();
  return {
    total,
    pages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    rows: docs.map((d) => ({ id: String(d._id), preview: JSON.stringify(maskDocument(d)).slice(0, 160) })),
  };
}

export async function getDocument(key: CollectionKey, id: string) {
  const { database, name, schema } = target(key);
  const col = (await getDb(database)).collection(name);
  let doc = await col.findOne({ _id: id as never });
  if (!doc && /^[0-9a-f]{24}$/i.test(id)) doc = await col.findOne({ _id: new ObjectId(id) as never });
  if (!doc) return null;

  const result = schema.safeParse(doc);
  return {
    masked: JSON.stringify(maskDocument(doc), null, 2),
    issues: result.success ? [] : result.error.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`),
  };
}
