import { createHash } from "node:crypto";
import { z } from "zod";
import lock from "../../contract.lock.json";
import pkg from "../../package.json";
import { collections } from "./collections";

export * from "./collections";

export const CONTRACT_VERSION: string = pkg.version;

// Computes the hash from the schemas. Its exact value depends on the zod version doing the
// JSON Schema conversion, so it is only run here (by scripts/contract-lock.ts) and stored in
// contract.lock.json; the prebuild check refuses to build if the two disagree.
export function computeContractHash(): string {
  const description = Object.entries(collections)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, c]) => [key, c.database, c.name, z.toJSONSchema(c.schema, { unrepresentable: "any" })]);
  return createHash("sha256").update(JSON.stringify(description)).digest("hex");
}

// The locked hash, bundled into the package: apps compare this with the API's, and it must not vary
// with whichever zod version an app happens to resolve.
export const CONTRACT_HASH: string = lock.hash;
