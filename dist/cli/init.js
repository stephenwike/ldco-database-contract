#!/usr/bin/env node

// src/cli/init.ts
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
var file = join(process.cwd(), "package.json");
if (!existsSync(file)) {
  console.error("[ldco-db-init] No package.json in the current directory.");
  process.exit(1);
}
var pkg = JSON.parse(readFileSync(file, "utf8"));
pkg.scripts ??= {};
var existing = pkg.scripts.prebuild;
if (existing?.includes("ldco-db-check")) {
  console.log("[ldco-db-init] prebuild already runs ldco-db-check.");
} else {
  pkg.scripts.prebuild = existing ? `ldco-db-check && ${existing}` : "ldco-db-check";
  writeFileSync(file, JSON.stringify(pkg, null, 2) + "\n");
  console.log(`[ldco-db-init] prebuild set to: ${pkg.scripts.prebuild}`);
}
console.log("Set LDCO_DATABASE_URL and LDCO_DATABASE_TOKEN in this app's local and Vercel environments.");
