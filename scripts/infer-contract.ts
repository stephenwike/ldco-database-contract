import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { declaredFields } from "../src/contract/declared-fields";
import { getDb } from "../src/server/mongo";

// Infers Zod schemas from live documents and writes src/contract/collections/<db>/<name>.ts.
// Output is a starting point: review mixed-type fields (printed at the end) and decide per field.

type Kind = "string" | "number" | "boolean" | "null" | "date" | "objectId" | "array" | "object" | "unknown";
interface Shape {
  count: number;
  kinds: Map<Kind, number>;
  fields: Map<string, Shape>;
  items?: Shape;
}

const newShape = (): Shape => ({ count: 0, kinds: new Map(), fields: new Map() });

function kindOf(v: unknown): Kind {
  if (v === null || v === undefined) return "null";
  if (typeof v === "string") return "string";
  if (typeof v === "number") return "number";
  if (typeof v === "boolean") return "boolean";
  if (v instanceof Date) return "date";
  if (Array.isArray(v)) return "array";
  const bson = (v as { _bsontype?: string })._bsontype;
  if (bson === "ObjectId") return "objectId";
  if (bson) return "unknown";
  return typeof v === "object" ? "object" : "unknown";
}

function observe(shape: Shape, v: unknown) {
  shape.count++;
  const kind = kindOf(v);
  shape.kinds.set(kind, (shape.kinds.get(kind) ?? 0) + 1);
  if (kind === "object") {
    for (const [key, val] of Object.entries(v as object)) {
      let child = shape.fields.get(key);
      if (!child) shape.fields.set(key, (child = newShape()));
      observe(child, val);
    }
  } else if (kind === "array") {
    shape.items ??= newShape();
    for (const el of v as unknown[]) observe(shape.items, el);
  }
}

const MAX_FIELDS = 40;
const key = (k: string) => (/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k));

function gen(s: Shape, path: string, mixed: string[], indent: string): string {
  const parts: string[] = [];
  for (const kind of s.kinds.keys()) {
    if (kind === "null") continue;
    if (kind === "string") parts.push("z.string()");
    else if (kind === "number") parts.push("z.number()");
    else if (kind === "boolean") parts.push("z.boolean()");
    else if (kind === "date") parts.push("bsonDate");
    else if (kind === "objectId") parts.push("objectId");
    else if (kind === "array") {
      parts.push(s.items && s.items.count ? `z.array(${gen(s.items, `${path}[]`, mixed, indent)})` : "z.array(z.unknown())");
    } else if (kind === "object") {
      if (s.fields.size > MAX_FIELDS) {
        parts.push("z.record(z.string(), z.unknown())");
      } else {
        const objCount = s.kinds.get("object") ?? 0;
        const inner = indent + "  ";
        const lines = [...s.fields].map(([name, child]) => {
          const optional = child.count < objCount ? ".optional()" : "";
          return `${inner}${key(name)}: ${gen(child, `${path}.${name}`, mixed, inner)}${optional},`;
        });
        parts.push(`z.strictObject({\n${lines.join("\n")}\n${indent}})`);
      }
    } else parts.push("z.unknown()");
  }
  const nonNull = [...s.kinds].filter(([k]) => k !== "null");
  if (nonNull.length > 1) {
    mixed.push(`${path}: ${nonNull.map(([k, n]) => `${k} x${n}`).join(", ")}`);
  }
  let expr = parts.length === 0 ? "z.unknown()" : parts.length === 1 ? parts[0] : `z.union([${parts.join(", ")}])`;
  if (s.kinds.has("null")) expr = parts.length ? `${expr}.nullable()` : "z.null()";
  return expr;
}

const pascal = (s: string) => s.split(/[^A-Za-z0-9]+/).filter(Boolean).map((p) => p[0].toUpperCase() + p.slice(1)).join("");

const root = new URL("../src/contract/collections/", import.meta.url);
const admin = (await getDb("admin")).admin();
const databases = (await admin.listDatabases()).databases
  .map((d) => d.name)
  .filter((n) => !["admin", "config", "local"].includes(n))
  .sort();

// Remember existing schemas before regenerating: an empty collection keeps its last real schema
// instead of falling back to a placeholder (e.g. ldco.events after its test documents were deleted).
const PLACEHOLDER = "// No documents were available to infer from";
const previous = new Map<string, string>();
function rememberPrevious(database: string, name: string) {
  const url = new URL(`${database}/${name}.ts`, root);
  if (!existsSync(url)) return;
  const text = readFileSync(url, "utf8");
  if (!text.startsWith(PLACEHOLDER)) previous.set(`${database}.${name}`, text);
}
for (const database of databases) {
  for (const c of await (await getDb(database)).listCollections().toArray()) rememberPrevious(database, c.name);
}

rmSync(root, { recursive: true, force: true });
mkdirSync(root, { recursive: true });

const entries: { database: string; name: string; id: string; file: string }[] = [];
const allMixed: string[] = [];

for (const database of databases) {
  const db = await getDb(database);
  mkdirSync(new URL(`${database}/`, root), { recursive: true });
  const names = (await db.listCollections().toArray())
    .filter((c) => c.type !== "view" && !c.name.startsWith("_") && !c.name.startsWith("system."))
    .map((c) => c.name)
    .sort();

  for (const name of names) {
    const shape = newShape();
    for await (const doc of db.collection(name).find()) observe(shape, doc);

    // A mixed _id is real drift; keep only the dominant type so the minority gets flagged.
    const idShape = shape.fields.get("_id");
    if (idShape && idShape.kinds.size > 1) {
      const [dominant] = [...idShape.kinds].sort((a, b) => b[1] - a[1]);
      allMixed.push(`${database}.${name}._id: ${[...idShape.kinds].map(([k, n]) => `${k} x${n}`).join(", ")} (kept ${dominant[0]})`);
      idShape.kinds = new Map([dominant]);
    }

    const id = `${pascal(database)}${pascal(name)}`;
    const kept = !shape.count ? previous.get(`${database}.${name}`) : undefined;
    if (kept) {
      const note = "// Kept from an earlier inference: the collection is currently empty.";
      writeFileSync(new URL(`${database}/${name}.ts`, root), kept.startsWith(note) ? kept : `${note}
${kept}`);
      entries.push({ database, name, id, file: `./${database}/${name}` });
      continue;
    }
    const mixed: string[] = [];
    let body = shape.count
      ? gen(shape, `${database}.${name}`, mixed, "")
      : "z.looseObject({ _id: z.union([z.string(), objectId]) })";
    allMixed.push(...mixed);

    // Fields declared ahead of data (decision 22): add any the documents didn't show, before the closing "})"
    const declared = Object.entries(declaredFields[`${database}.${name}`] ?? {}).filter(([field]) => !shape.fields.has(field));
    if (shape.count && declared.length) {
      const lines = declared.map(([field, expr]) => `  ${field}: ${expr}, // declared in src/contract/declared-fields.ts`).join("\n");
      body = body.replace(/\n\}\)$/, `\n${lines}\n})`);
    }

    const header = shape.count
      ? `// Inferred from ${shape.count} documents by scripts/infer-contract.ts; review before relying on it.`
      : "// No documents were available to infer from; placeholder until the shape is known.";
    const imports = ['import { z } from "zod";'];
    const used = [body.includes("bsonDate") && "bsonDate", body.includes("objectId") && "objectId"].filter(Boolean);
    if (used.length) imports.push(`import { ${used.join(", ")} } from "../../bson";`);

    const file = `${header}\n${imports.join("\n")}\n\nexport const ${id}Schema = ${body};\n\nexport type ${id} = z.infer<typeof ${id}Schema>;\n`;
    writeFileSync(new URL(`${database}/${name}.ts`, root), file);
    entries.push({ database, name, id, file: `./${database}/${name}` });
  }
}

const index =
  "// Generated by scripts/infer-contract.ts.\n" +
  entries.map((e) => `import { ${e.id}Schema } from "${e.file}";`).join("\n") +
  "\n\n" +
  entries.map((e) => `export * from "${e.file}";`).join("\n") +
  "\n\n// Key is `<database>.<collection>`.\nexport const collections = {\n" +
  entries.map((e) => `  "${e.database}.${e.name}": { database: "${e.database}", name: "${e.name}", schema: ${e.id}Schema },`).join("\n") +
  "\n} as const;\n";
writeFileSync(new URL("index.ts", root), index);

console.log(`Wrote ${entries.length} collections across ${databases.length} databases.`);
console.log(`\nMixed-type fields (${allMixed.length}):`);
for (const m of allMixed) console.log(`  ${m}`);
process.exit(0);
