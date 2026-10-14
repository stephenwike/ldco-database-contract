import { createHash } from "node:crypto";
import { z } from "zod";
import pkg from "../../package.json";
import { DanceSchema } from "./collections/dances";
import { TrackSchema } from "./collections/tracks";

export * from "./collections/dances";
export * from "./collections/tracks";

// Add every shared collection here; the key is the contract name, `name` is the Mongo collection.
export const collections = {
  dances: { database: "ldco", name: "dances", schema: DanceSchema },
  tracks: { database: "ldco", name: "tracks", schema: TrackSchema },
} as const;

export const CONTRACT_VERSION: string = pkg.version;

function computeHash(): string {
  const description = Object.entries(collections)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, c]) => [key, c.database, c.name, z.toJSONSchema(c.schema)]);
  return createHash("sha256").update(JSON.stringify(description)).digest("hex");
}

export const CONTRACT_HASH: string = computeHash();
