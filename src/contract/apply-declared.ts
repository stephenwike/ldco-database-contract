// Applies src/contract/declared-fields.ts on top of an inferred Zod object literal.
// A path inference didn't emit is inserted. A path it did emit is replaced, so a null-only
// field can be widened and a required field can be made optional. The next contract:infer
// keeps these expressions instead of narrowing them back to whatever the sample showed.

export const DECLARED_COMMENT = "// declared in src/contract/declared-fields.ts";

type Segment = { name: string; array: boolean };

export function parseDeclaredPath(path: string): Segment[] {
  return path.split(".").map((part) => {
    if (part.endsWith("[]")) return { name: part.slice(0, -2), array: true };
    if (part.includes("[")) throw new Error(`Unsupported declared path "${path}"`);
    return { name: part, array: false };
  });
}

function skipString(source: string, i: number): number {
  const quote = source[i];
  for (let j = i + 1; j < source.length; j++) {
    if (source[j] === "\\") {
      j++;
      continue;
    }
    if (source[j] === quote) return j;
  }
  throw new Error("Unterminated string in schema source");
}

// `.regex(/…/)` literals can contain braces. They are balanced in today's schemas, but a comma
// inside one would end a field early if the scanners treated it as code.
function skipRegex(source: string, i: number): number | null {
  if (source[i] !== "/") return null;
  let prev = i - 1;
  while (prev >= 0 && source[prev] === " ") prev--;
  if (prev < 0 || !"=(,".includes(source[prev]!)) return null;
  for (let j = i + 1; j < source.length; j++) {
    if (source[j] === "\\") {
      j++;
      continue;
    }
    if (source[j] === "/") return j;
    if (source[j] === "\n") return null;
  }
  return null;
}

function matchingBrace(source: string, open: number): number {
  let depth = 0;
  for (let i = open; i < source.length; i++) {
    if (source.startsWith("//", i)) {
      const nl = source.indexOf("\n", i);
      i = nl === -1 ? source.length : nl;
      continue;
    }
    const quote = source[i];
    if (quote === '"' || quote === "'" || quote === "`") {
      i = skipString(source, i);
      continue;
    }
    const regexEnd = skipRegex(source, i);
    if (regexEnd !== null) {
      i = regexEnd;
      continue;
    }
    if (source[i] === "{") depth++;
    else if (source[i] === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }
  throw new Error("Unbalanced brace in schema source");
}

function findSchemaObject(source: string, from: number, to: number): number {
  const slice = source.slice(from, to);
  const match = /z\.(?:strict|loose)Object\(\{/.exec(slice);
  if (!match) throw new Error("No Zod object found for a declared field");
  return from + match.index + match[0].length - 1;
}

interface FieldLoc {
  colon: number;
  valueEnd: number;
}

function findField(source: string, open: number, close: number, name: string): FieldLoc | undefined {
  let depth = 1;
  for (let i = open + 1; i < close; i++) {
    if (source.startsWith("//", i)) {
      const nl = source.indexOf("\n", i);
      i = nl === -1 ? source.length : nl;
      continue;
    }
    const quote = source[i];
    if (quote === '"' || quote === "'" || quote === "`") {
      i = skipString(source, i);
      continue;
    }
    const regexEnd = skipRegex(source, i);
    if (regexEnd !== null) {
      i = regexEnd;
      continue;
    }
    if (depth === 1 && (source[i - 1] === "\n" || source[i - 1] === "{")) {
      const match = /^(\s*)([A-Za-z_$][\w$]*)\s*:/.exec(source.slice(i));
      if (match && match[2] === name) {
        const colon = i + match[0].length - 1;
        return { colon, valueEnd: endOfValue(source, colon + 1) };
      }
    }
    const c = source[i];
    if (c === "(" || c === "{" || c === "[") depth++;
    else if (c === ")" || c === "}" || c === "]") depth--;
  }
  return undefined;
}

function endOfValue(source: string, start: number): number {
  let depth = 0;
  for (let i = start; i < source.length; i++) {
    if (source.startsWith("//", i)) {
      const nl = source.indexOf("\n", i);
      i = nl === -1 ? source.length : nl;
      continue;
    }
    const quote = source[i];
    if (quote === '"' || quote === "'" || quote === "`") {
      i = skipString(source, i);
      continue;
    }
    const regexEnd = skipRegex(source, i);
    if (regexEnd !== null) {
      i = regexEnd;
      continue;
    }
    const c = source[i];
    if (c === "(" || c === "{" || c === "[") depth++;
    else if (c === ")" || c === "}" || c === "]") {
      if (depth === 0) throw new Error("Declared field value ended before its comma");
      depth--;
    } else if (c === "," && depth === 0) return i;
  }
  throw new Error("Declared field value has no comma");
}

function fieldIndent(source: string, open: number, close: number): string {
  const match = /\n(\s+)\S/.exec(source.slice(open, close));
  return match ? match[1] : "  ";
}

function withComment(expr: string): string {
  return `${expr}, ${DECLARED_COMMENT}`;
}

function applyOne(source: string, path: string, expr: string): string {
  const segments = parseDeclaredPath(path);
  let open = findSchemaObject(source, 0, source.length);
  let close = matchingBrace(source, open);

  for (let i = 0; i < segments.length - 1; i++) {
    const segment = segments[i];
    const field = findField(source, open, close, segment.name);
    if (!field) throw new Error(`Declared path "${path}" misses "${segment.name}"`);
    const value = source.slice(field.colon + 1, field.valueEnd);
    if (segment.array && !value.includes("z.array(")) {
      throw new Error(`Declared path "${path}" expects an array at "${segment.name}"`);
    }
    // The first object in the value is the element object of an array, or the object itself.
    open = findSchemaObject(source, field.colon + 1, field.valueEnd);
    close = matchingBrace(source, open);
  }

  const leaf = segments[segments.length - 1];
  if (leaf.array) throw new Error(`Declared path "${path}" must end on a field`);
  const existing = findField(source, open, close, leaf.name);
  if (!existing) {
    // The closing brace keeps its own indent. Insert the field before that indent so the
    // new line doesn't swallow the spaces that belong to `}`.
    let at = close;
    while (at > open && (source[at - 1] === " " || source[at - 1] === "\t")) at--;
    const indent = fieldIndent(source, open, close);
    const line = `${indent}${leaf.name}: ${withComment(expr)}\n`;
    return source.slice(0, at) + line + source.slice(at);
  }

  const current = source.slice(existing.colon + 1, existing.valueEnd).trim();
  const lineEnd = source.indexOf("\n", existing.valueEnd);
  const tail = source.slice(existing.valueEnd + 1, lineEnd === -1 ? source.length : lineEnd);
  if (current === expr && tail.includes(DECLARED_COMMENT)) return source;
  const end = tail.includes(DECLARED_COMMENT) || /^\s*\/\//.test(tail) ? (lineEnd === -1 ? source.length : lineEnd) : existing.valueEnd + 1;
  return source.slice(0, existing.colon + 1) + ` ${withComment(expr)}` + source.slice(end);
}

export function applyDeclaredFields(body: string, fields: Record<string, string>): string {
  let result = body;
  for (const [path, expr] of Object.entries(fields)) result = applyOne(result, path, expr);
  return result;
}

function ensureBsonImport(source: string, body: string): string {
  const need = [body.includes("bsonDate") ? "bsonDate" : "", body.includes("objectId") ? "objectId" : ""].filter(Boolean);
  const importRe = /import \{([^}]+)\} from "\.\.\/\.\.\/bson";\n/;
  if (need.length === 0) return source.replace(importRe, "");
  const line = `import { ${need.join(", ")} } from "../../bson";\n`;
  if (importRe.test(source)) return source.replace(importRe, line);
  return source.replace('import { z } from "zod";\n', `import { z } from "zod";\n${line}`);
}

// Rewrites one generated collection module so its schema literal includes `fields`.
export function applyDeclaredToModule(source: string, fields: Record<string, string>): string {
  const match = /export const (\w+Schema) = ([\s\S]*?);\n\nexport type /.exec(source);
  if (!match) throw new Error("Could not find `export const …Schema` in collection module");
  const body = applyDeclaredFields(match[2], fields);
  const replaced =
    source.slice(0, match.index) +
    `export const ${match[1]} = ${body};\n\nexport type ` +
    source.slice(match.index + match[0].length);
  return ensureBsonImport(replaced, body);
}
