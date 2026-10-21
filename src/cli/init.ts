#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Run inside a consuming app to wire the mandatory contract check into its build.
const file = join(process.cwd(), "package.json");
if (!existsSync(file)) {
  console.error("[ldco-db-init] No package.json in the current directory.");
  process.exit(1);
}

const pkg = JSON.parse(readFileSync(file, "utf8"));
pkg.scripts ??= {};
const existing: string | undefined = pkg.scripts.prebuild;

if (existing?.includes("ldco-db-check")) {
  console.log("[ldco-db-init] prebuild already runs ldco-db-check.");
} else {
  pkg.scripts.prebuild = existing ? `ldco-db-check && ${existing}` : "ldco-db-check";
  writeFileSync(file, JSON.stringify(pkg, null, 2) + "\n");
  console.log(`[ldco-db-init] prebuild set to: ${pkg.scripts.prebuild}`);
}

console.log("No environment variables needed: the check calls the public https://ldco-database-contract.vercel.app/api/contract/version. Set LDCO_DATABASE_URL only to test against another contract API.");
