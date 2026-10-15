import { z } from "zod";
import { collections } from "@/contract";
import type { CollectionKey } from "./validate";

// A flat, display-friendly view of a collection's contract schema, from the same JSON Schema
// that feeds the contract hash.

type Json = {
  type?: string | string[];
  bsonType?: string;
  properties?: Record<string, Json>;
  required?: string[];
  additionalProperties?: boolean | Json;
  items?: Json;
  anyOf?: Json[];
  enum?: unknown[];
  const?: unknown;
};

export interface SchemaField {
  path: string;
  depth: number;
  type: string;
  optional: boolean;
  nullable: boolean;
}

export interface SchemaView {
  strict: boolean;
  fields: SchemaField[];
  placeholder: boolean;
}

function describe(s: Json): { type: string; nullable: boolean; object?: Json; array?: Json } {
  if (s.bsonType) return { type: s.bsonType === "objectId" ? "ObjectId" : s.bsonType === "date" ? "Date" : s.bsonType, nullable: false };
  if (s.enum) return { type: s.enum.map((v) => JSON.stringify(v)).join(" | "), nullable: false };
  if (s.const !== undefined) return { type: JSON.stringify(s.const), nullable: false };
  if (s.anyOf) {
    const parts = s.anyOf.map(describe);
    const nullable = parts.some((p) => p.nullable || p.type === "null");
    const kinds = parts.filter((p) => p.type !== "null");
    const object = kinds.find((p) => p.object)?.object;
    const array = kinds.find((p) => p.array)?.array;
    return { type: kinds.map((p) => p.type).join(" | ") || "null", nullable, object, array };
  }
  const types = Array.isArray(s.type) ? s.type : s.type ? [s.type] : [];
  const nullable = types.includes("null");
  const main = types.filter((t) => t !== "null");
  if (main.length === 1 && main[0] === "object") return { type: "object", nullable, object: s };
  if (main.length === 1 && main[0] === "array") {
    const inner = s.items ? describe(s.items) : { type: "unknown", nullable: false };
    return { type: `${inner.type}[]`, nullable, array: s.items };
  }
  return { type: main.join(" | ") || "unknown", nullable };
}

function walk(obj: Json, prefix: string, depth: number, out: SchemaField[]) {
  const required = new Set(obj.required ?? []);
  for (const [name, prop] of Object.entries(obj.properties ?? {})) {
    const path = prefix ? `${prefix}.${name}` : name;
    const d = describe(prop);
    out.push({ path, depth, type: d.type, optional: !required.has(name), nullable: d.nullable });
    if (d.object) walk(d.object, path, depth + 1, out);
    else if (d.array) {
      const item = describe(d.array);
      if (item.object) walk(item.object, `${path}[]`, depth + 1, out);
    }
  }
}

export function schemaView(key: CollectionKey): SchemaView {
  const json = z.toJSONSchema(collections[key].schema, { unrepresentable: "any" }) as Json;
  const fields: SchemaField[] = [];
  walk(json, "", 0, fields);
  return {
    strict: json.additionalProperties === false,
    fields,
    placeholder: fields.length <= 1 && json.additionalProperties !== false,
  };
}
