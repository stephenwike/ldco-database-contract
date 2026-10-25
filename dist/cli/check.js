#!/usr/bin/env node
import {
  COLLECTION_HASHES,
  CONTRACT_HASH,
  CONTRACT_VERSION,
  inScope,
  scopeFromPackageJson,
  unmatchedEntries
} from "../chunk-OEG2X3WL.js";

// src/cli/check.ts
import { readFileSync } from "fs";
import { join } from "path";
var DEFAULT_URL = "https://ldco-database-contract.vercel.app";
var baseUrl = (process.env.LDCO_DATABASE_URL || DEFAULT_URL).replace(/\/+$/, "");
var UPDATE = "Update with: npm install github:stephenwike/ldco-database-contract (installs main, the latest contract)";
function fail(message) {
  console.error(`
[ldco-db-check] ${message}
`);
  process.exit(1);
}
function readScope() {
  let pkg;
  try {
    pkg = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf8"));
  } catch {
    return void 0;
  }
  try {
    return scopeFromPackageJson(pkg);
  } catch (err) {
    fail(err.message);
  }
}
function checkWhole(latest, scoped = false) {
  if (latest.version !== CONTRACT_VERSION || latest.hash !== CONTRACT_HASH) {
    const hint = scoped ? "" : `This app declares no scope, so any contract change requires an update. Add "ldco": { "uses": [...] }
to package.json (npx ldco-db-scope suggests one) to only be held to the collections it uses.
`;
    fail(`Database contract is out of date.
  installed: ${CONTRACT_VERSION}
  latest:    ${latest.version}
${hint}${UPDATE}`);
  }
  console.log(`[ldco-db-check] Contract ${CONTRACT_VERSION} is current.`);
}
function checkScope(latest, scope) {
  const installed = COLLECTION_HASHES;
  const inScopeInstalled = Object.keys(installed).filter((key) => inScope(key, scope));
  const changed = inScopeInstalled.filter((key) => key in latest.collections && latest.collections[key] !== installed[key]);
  const removed = inScopeInstalled.filter((key) => !(key in latest.collections));
  const added = Object.keys(latest.collections).filter((key) => inScope(key, scope) && !(key in installed));
  for (const entry of unmatchedEntries(scope, [...Object.keys(installed), ...Object.keys(latest.collections)])) {
    console.warn(`[ldco-db-check] Scope entry "${entry}" matches no collection in the contract (typo, or removed?).`);
  }
  if (changed.length || removed.length) {
    fail(
      `Database contract changed for collections this app uses.
  installed: ${CONTRACT_VERSION}
  latest:    ${latest.version}
` + changed.map((k) => `  changed: ${k}
`).join("") + removed.map((k) => `  removed: ${k}
`).join("") + UPDATE
    );
  }
  const note = added.length ? ` New in scope since ${CONTRACT_VERSION}: ${added.join(", ")} (not yet used, so not required).` : "";
  const versions = latest.version === CONTRACT_VERSION ? CONTRACT_VERSION : `${CONTRACT_VERSION} (latest ${latest.version})`;
  console.log(`[ldco-db-check] Contract ${versions}: no changes in this app's scope (${inScopeInstalled.length} collections).${note}`);
}
async function main() {
  if (process.env.LDCO_DATABASE_SKIP_CHECK === "1") {
    console.warn("[ldco-db-check] Skipped (LDCO_DATABASE_SKIP_CHECK=1).");
    return;
  }
  const scope = readScope();
  let latest;
  try {
    const res = await fetch(`${baseUrl}/api/contract/version`, { signal: AbortSignal.timeout(1e4) });
    if (!res.ok) fail(`Contract API responded ${res.status} ${res.statusText}.`);
    latest = await res.json();
  } catch (err) {
    fail(`Could not reach the contract API at ${baseUrl}: ${err.message}`);
  }
  if (!scope) return checkWhole(latest);
  if (!latest.collections) {
    console.warn("[ldco-db-check] The contract API doesn't publish per-collection hashes yet; checking the whole contract.");
    return checkWhole(latest, true);
  }
  checkScope(latest, scope);
}
main();
