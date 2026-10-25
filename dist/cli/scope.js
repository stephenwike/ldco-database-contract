#!/usr/bin/env node
import {
  COLLECTION_HASHES,
  scopeFromPackageJson
} from "../chunk-COIMSJCV.js";

// src/cli/scope.ts
import { readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { extname, join, relative } from "path";
var SKIP_DIRS = /* @__PURE__ */ new Set(["node_modules", ".next", ".git", ".vercel", "dist", "build", "coverage", "out", "__tests__", "mongo-seed", "public"]);
var EXTENSIONS = /* @__PURE__ */ new Set([".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"]);
var LIST_BY_COLLECTION = /* @__PURE__ */ new Set(["ldco"]);
function sourceFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    let stat;
    try {
      stat = statSync(path);
    } catch {
      return [];
    }
    if (stat.isDirectory()) return SKIP_DIRS.has(name) || name.startsWith(".") ? [] : sourceFiles(path);
    return EXTENSIONS.has(extname(name)) && !/\.(test|spec)\.[cm]?[jt]sx?$/.test(name) ? [path] : [];
  });
}
var root = process.cwd();
var keys = Object.keys(COLLECTION_HASHES);
var databases = new Set(keys.map((k) => k.split(".")[0]));
var names = new Set(keys.map((k) => k.slice(k.indexOf(".") + 1)));
var seen = /* @__PURE__ */ new Map();
for (const file of sourceFiles(root)) {
  const text = readFileSync(file, "utf8");
  for (const [, literal] of text.matchAll(/['"`]([A-Za-z0-9_-]+)['"`]/g)) {
    if ((databases.has(literal) || names.has(literal)) && !seen.has(literal)) seen.set(literal, relative(root, file));
  }
}
var usedDbs = [...databases].filter((d) => seen.has(d)).sort();
var usedKeys = keys.filter((k) => {
  const [db, name] = [k.split(".")[0], k.slice(k.indexOf(".") + 1)];
  return usedDbs.includes(db) && seen.has(name);
});
var scope = usedDbs.flatMap(
  (db) => LIST_BY_COLLECTION.has(db) ? usedKeys.filter((k) => k.startsWith(`${db}.`)) : usedKeys.some((k) => k.startsWith(`${db}.`)) ? [`${db}.*`] : []
);
console.log(`[ldco-db-scope] Databases referenced: ${usedDbs.join(", ") || "none found"}`);
for (const k of usedKeys) console.log(`  ${k.padEnd(42)} (${seen.get(k.slice(k.indexOf(".") + 1))})`);
var pkgPath = join(root, "package.json");
var raw = readFileSync(pkgPath, "utf8");
var pkg = JSON.parse(raw);
var current = scopeFromPackageJson(pkg);
console.log(`
Suggested scope:
  "ldco": { "uses": ${JSON.stringify(scope)} }`);
if (current) console.log(`Current scope:
  "ldco": { "uses": ${JSON.stringify(current)} }`);
console.log(
  "\nThis is a starting point found by text search: check it, and add anything the app reaches through\nvariables (e.g. a database name only in an environment variable)."
);
if (process.argv.includes("--write")) {
  if (!scope.length) {
    console.error("[ldco-db-scope] Nothing found; not writing an empty scope (that would check nothing).");
    process.exit(1);
  }
  const indent = /^(\s+)"/m.exec(raw)?.[1] ?? "  ";
  pkg.ldco = { ...pkg.ldco ?? {}, uses: scope };
  writeFileSync(pkgPath, JSON.stringify(pkg, null, indent) + (raw.endsWith("\n") ? "\n" : ""));
  console.log(`[ldco-db-scope] Wrote "ldco.uses" to package.json.`);
}
