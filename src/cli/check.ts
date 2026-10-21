#!/usr/bin/env node
import { CONTRACT_HASH, CONTRACT_VERSION } from "../contract";

// The published contract API. LDCO_DATABASE_URL overrides it (e.g. http://localhost:3100 for local testing).
const DEFAULT_URL = "https://ldco-database-contract.vercel.app";
const baseUrl = (process.env.LDCO_DATABASE_URL || DEFAULT_URL).replace(/\/+$/, "");

function fail(message: string): never {
  console.error(`\n[ldco-db-check] ${message}\n`);
  process.exit(1);
}

async function main() {
  if (process.env.LDCO_DATABASE_SKIP_CHECK === "1") {
    console.warn("[ldco-db-check] Skipped (LDCO_DATABASE_SKIP_CHECK=1).");
    return;
  }
  let latest: { version: string; hash: string };
  try {
    // Public endpoint (version and hash only), so no token is needed.
    const res = await fetch(`${baseUrl}/api/contract/version`, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) fail(`Contract API responded ${res.status} ${res.statusText}.`);
    latest = await res.json();
  } catch (err) {
    fail(`Could not reach the contract API at ${baseUrl}: ${(err as Error).message}`);
  }

  if (latest.version !== CONTRACT_VERSION || latest.hash !== CONTRACT_HASH) {
    fail(
      `Database contract is out of date.\n` +
        `  installed: ${CONTRACT_VERSION}\n` +
        `  latest:    ${latest.version}\n` +
        `Update with: npm install github:stephenwike/ldco-database-contract (installs main, the latest contract)`,
    );
  }
  console.log(`[ldco-db-check] Contract ${CONTRACT_VERSION} is current.`);
}

main();
