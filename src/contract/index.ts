import { createHash } from "node:crypto";
import { z } from "zod";
import pkg from "../../package.json";
import { collections } from "./collections";

export * from "./collections";

export const CONTRACT_VERSION: string = pkg.version;

function computeHash(): string {
  const description = Object.entries(collections)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, c]) => [key, c.database, c.name, z.toJSONSchema(c.schema, { unrepresentable: "any" })]);
  return createHash("sha256").update(JSON.stringify(description)).digest("hex");
}

export const CONTRACT_HASH: string = computeHash();
