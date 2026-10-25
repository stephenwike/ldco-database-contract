#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { COLLECTION_HASHES, CONTRACT_HASH, CONTRACT_VERSION, inScope, scopeFromPackageJson, unmatchedEntries, type Scope } from "../contract";

// The published contract API. LDCO_DATABASE_URL overrides it (e.g. http://localhost:3100 for local testing).
const DEFAULT_URL = "https://ldco-database-contract.vercel.app";
const baseUrl = (process.env.LDCO_DATABASE_URL || DEFAULT_URL).replace(/\/+$/, "");
const UPDATE = "Update with: npm install github:stephenwike/ldco-database-contract (installs main, the latest contract)";

interface Latest {
  version: string;
  hash: string;
  collections?: Record<string, string>;
}

function fail(message: string): never {
  console.error(`\n[ldco-db-check] ${message}\n`);
  process.exit(1);
}

// The app's scope (decision 21) from its package.json, run from the app's root as npm does for prebuild.
function readScope(): Scope | undefined {
  let pkg: unknown;
  try {
    pkg = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf8"));
  } catch {
    return undefined;
  }
  try {
    return scopeFromPackageJson(pkg);
  } catch (err) {
    fail((err as Error).message);
  }
}

function checkWhole(latest: Latest, scoped = false) {
  if (latest.version !== CONTRACT_VERSION || latest.hash !== CONTRACT_HASH) {
    const hint = scoped
      ? ""
      : `This app declares no scope, so any contract change requires an update. Add "ldco": { "uses": [...] }\n` +
        `to package.json (npx ldco-db-scope suggests one) to only be held to the collections it uses.\n`;
    fail(`Database contract is out of date.\n  installed: ${CONTRACT_VERSION}\n  latest:    ${latest.version}\n${hint}${UPDATE}`);
  }
  console.log(`[ldco-db-check] Contract ${CONTRACT_VERSION} is current.`);
}

function checkScope(latest: Latest & { collections: Record<string, string> }, scope: Scope) {
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
      `Database contract changed for collections this app uses.\n  installed: ${CONTRACT_VERSION}\n  latest:    ${latest.version}\n` +
        changed.map((k) => `  changed: ${k}\n`).join("") +
        removed.map((k) => `  removed: ${k}\n`).join("") +
        UPDATE,
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
  let latest: Latest;
  try {
    // Public endpoint (version and hashes only), so no token is needed.
    const res = await fetch(`${baseUrl}/api/contract/version`, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) fail(`Contract API responded ${res.status} ${res.statusText}.`);
    latest = await res.json();
  } catch (err) {
    fail(`Could not reach the contract API at ${baseUrl}: ${(err as Error).message}`);
  }

  if (!scope) return checkWhole(latest);
  if (!latest.collections) {
    console.warn("[ldco-db-check] The contract API doesn't publish per-collection hashes yet; checking the whole contract.");
    return checkWhole(latest, true);
  }
  checkScope(latest as Latest & { collections: Record<string, string> }, scope);
}

main();
