#!/usr/bin/env node
import {
  CONTRACT_HASH,
  CONTRACT_VERSION
} from "../chunk-JKBFNMVP.js";

// src/cli/check.ts
var DEFAULT_URL = "https://ldco-database-contract.vercel.app";
var baseUrl = (process.env.LDCO_DATABASE_URL || DEFAULT_URL).replace(/\/+$/, "");
function fail(message) {
  console.error(`
[ldco-db-check] ${message}
`);
  process.exit(1);
}
async function main() {
  if (process.env.LDCO_DATABASE_SKIP_CHECK === "1") {
    console.warn("[ldco-db-check] Skipped (LDCO_DATABASE_SKIP_CHECK=1).");
    return;
  }
  let latest;
  try {
    const res = await fetch(`${baseUrl}/api/contract/version`, { signal: AbortSignal.timeout(1e4) });
    if (!res.ok) fail(`Contract API responded ${res.status} ${res.statusText}.`);
    latest = await res.json();
  } catch (err) {
    fail(`Could not reach the contract API at ${baseUrl}: ${err.message}`);
  }
  if (latest.version !== CONTRACT_VERSION || latest.hash !== CONTRACT_HASH) {
    fail(
      `Database contract is out of date.
  installed: ${CONTRACT_VERSION}
  latest:    ${latest.version}
Update with: npm install github:stephenwike/ldco-database-contract (installs main, the latest contract)`
    );
  }
  console.log(`[ldco-db-check] Contract ${CONTRACT_VERSION} is current.`);
}
main();
