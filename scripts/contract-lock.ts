import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { computeContractHash, CONTRACT_VERSION } from "../src/contract";

const lockPath = new URL("../contract.lock.json", import.meta.url);
const mode = process.argv[2];
const hash = computeContractHash();
const lock: { version: string; hash: string } | null = existsSync(lockPath)
  ? JSON.parse(readFileSync(lockPath, "utf8"))
  : null;

if (mode === "--write") {
  if (lock && lock.hash !== hash && lock.version === CONTRACT_VERSION) {
    console.error(`Schema changed but package.json version is still ${CONTRACT_VERSION}. Bump it first.`);
    process.exit(1);
  }
  writeFileSync(lockPath, JSON.stringify({ version: CONTRACT_VERSION, hash: hash }, null, 2) + "\n");
  console.log(`Locked contract ${CONTRACT_VERSION}`);
} else if (mode === "--verify") {
  if (!lock || lock.hash !== hash || lock.version !== CONTRACT_VERSION) {
    console.error("Contract changed without a version bump + lock. Bump version, then run: npm run contract:lock");
    process.exit(1);
  }
  console.log(`Contract ${CONTRACT_VERSION} matches lock.`);
} else {
  console.error("Usage: contract-lock.ts --write | --verify");
  process.exit(1);
}
