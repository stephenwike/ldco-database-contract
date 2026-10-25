import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { computeCollectionHashes, computeContractHash, CONTRACT_VERSION } from "../src/contract";

const lockPath = new URL("../contract.lock.json", import.meta.url);
const mode = process.argv[2];
const hash = computeContractHash();
const collections = computeCollectionHashes();
const lock: { version: string; hash: string; collections?: Record<string, string> } | null = existsSync(lockPath)
  ? JSON.parse(readFileSync(lockPath, "utf8"))
  : null;
const sameCollections = (a: Record<string, string> | undefined) => JSON.stringify(a ?? {}) === JSON.stringify(collections);

if (mode === "--write") {
  if (lock && lock.hash !== hash && lock.version === CONTRACT_VERSION) {
    console.error(`Schema changed but package.json version is still ${CONTRACT_VERSION}. Bump it first.`);
    process.exit(1);
  }
  writeFileSync(lockPath, JSON.stringify({ version: CONTRACT_VERSION, hash, collections }, null, 2) + "\n");
  console.log(`Locked contract ${CONTRACT_VERSION} (${Object.keys(collections).length} collections)`);
} else if (mode === "--verify") {
  if (!lock || lock.hash !== hash || lock.version !== CONTRACT_VERSION || !sameCollections(lock.collections)) {
    console.error("Contract changed without a version bump + lock. Bump version, then run: npm run contract:lock");
    process.exit(1);
  }
  console.log(`Contract ${CONTRACT_VERSION} matches lock.`);
} else {
  console.error("Usage: contract-lock.ts --write | --verify");
  process.exit(1);
}
