#!/usr/bin/env node
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { COLLECTION_HASHES, scopeFromPackageJson } from "../contract";

// Suggests an app's scope (decision 21) from its code: string literals that name a contract database
// or collection, e.g. db("djfeed"), collection('dj_requests'), process.env.MONGODB_DB || 'djfeed'.
// A collection counts as used when both its name and its database appear somewhere in the app.
// ldco is big and shared, so it is listed collection by collection; other databases become "<db>.*".
// Usage (in the app's root): npx ldco-db-scope [--write]

const SKIP_DIRS = new Set(["node_modules", ".next", ".git", ".vercel", "dist", "build", "coverage", "out", "__tests__", "mongo-seed", "public"]);
const EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"]);
const LIST_BY_COLLECTION = new Set(["ldco"]);

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    let stat;
    try {
      stat = statSync(path);
    } catch {
      return []; // e.g. Windows device names like "nul"
    }
    if (stat.isDirectory()) return SKIP_DIRS.has(name) || name.startsWith(".") ? [] : sourceFiles(path);
    return EXTENSIONS.has(extname(name)) && !/\.(test|spec)\.[cm]?[jt]sx?$/.test(name) ? [path] : [];
  });
}

const root = process.cwd();
const keys = Object.keys(COLLECTION_HASHES);
const databases = new Set(keys.map((k) => k.split(".")[0]));
const names = new Set(keys.map((k) => k.slice(k.indexOf(".") + 1)));

// literal -> first file it appears in
const seen = new Map<string, string>();
for (const file of sourceFiles(root)) {
  const text = readFileSync(file, "utf8");
  for (const [, literal] of text.matchAll(/['"`]([A-Za-z0-9_-]+)['"`]/g)) {
    if ((databases.has(literal) || names.has(literal)) && !seen.has(literal)) seen.set(literal, relative(root, file));
  }
}

const usedDbs = [...databases].filter((d) => seen.has(d)).sort();
const usedKeys = keys.filter((k) => {
  const [db, name] = [k.split(".")[0], k.slice(k.indexOf(".") + 1)];
  return usedDbs.includes(db) && seen.has(name);
});
const scope = usedDbs.flatMap((db) =>
  LIST_BY_COLLECTION.has(db) ? usedKeys.filter((k) => k.startsWith(`${db}.`)) : usedKeys.some((k) => k.startsWith(`${db}.`)) ? [`${db}.*`] : [],
);

console.log(`[ldco-db-scope] Databases referenced: ${usedDbs.join(", ") || "none found"}`);
for (const k of usedKeys) console.log(`  ${k.padEnd(42)} (${seen.get(k.slice(k.indexOf(".") + 1))})`);
const pkgPath = join(root, "package.json");
const raw = readFileSync(pkgPath, "utf8");
const pkg = JSON.parse(raw);
const current = scopeFromPackageJson(pkg);
console.log(`\nSuggested scope:\n  "ldco": { "uses": ${JSON.stringify(scope)} }`);
if (current) console.log(`Current scope:\n  "ldco": { "uses": ${JSON.stringify(current)} }`);
console.log(
  "\nThis is a starting point found by text search: check it, and add anything the app reaches through\n" +
    "variables (e.g. a database name only in an environment variable).",
);

if (process.argv.includes("--write")) {
  if (!scope.length) {
    console.error("[ldco-db-scope] Nothing found; not writing an empty scope (that would check nothing).");
    process.exit(1);
  }
  const indent = /^(\s+)"/m.exec(raw)?.[1] ?? "  ";
  pkg.ldco = { ...(pkg.ldco ?? {}), uses: scope };
  writeFileSync(pkgPath, JSON.stringify(pkg, null, indent) + (raw.endsWith("\n") ? "\n" : ""));
  console.log(`[ldco-db-scope] Wrote "ldco.uses" to package.json.`);
}
