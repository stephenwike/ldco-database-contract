import { createHash } from "node:crypto";
import { z } from "zod";
// Named imports so the bundler includes only these values, not the whole files: otherwise any
// package.json edit (e.g. a new script) would change the published package build.
import { collections as lockedCollectionHashes, hash as lockedHash } from "../../contract.lock.json";
import { version } from "../../package.json";
import { collections } from "./collections";

export * from "./collections";
export * from "./scope";

export const CONTRACT_VERSION: string = version;

// Computes the hash from the schemas. Its exact value depends on the zod version doing the
// JSON Schema conversion, so it is only run here (by scripts/contract-lock.ts) and stored in
// contract.lock.json; the prebuild check refuses to build if the two disagree.
export function computeContractHash(): string {
  const description = Object.entries(collections)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, c]) => [key, c.database, c.name, z.toJSONSchema(c.schema, { unrepresentable: "any" })]);
  return createHash("sha256").update(JSON.stringify(description)).digest("hex");
}

// One hash per collection, computed the same way, so an app's check can compare only the collections
// in its scope (decision 21). Also only run by scripts/contract-lock.ts; the locked values ship below.
export function computeCollectionHashes(): Record<string, string> {
  return Object.fromEntries(
    Object.entries(collections)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, c]) => [
        key,
        createHash("sha256")
          .update(JSON.stringify([key, c.database, c.name, z.toJSONSchema(c.schema, { unrepresentable: "any" })]))
          .digest("hex"),
      ]),
  );
}

// The locked hash, bundled into the package: apps compare this with the API's, and it must not vary
// with whichever zod version an app happens to resolve.
export const CONTRACT_HASH: string = lockedHash;

/** Locked hash of each collection, keyed "<database>.<collection>". */
export const COLLECTION_HASHES: Record<string, string> = lockedCollectionHashes;
