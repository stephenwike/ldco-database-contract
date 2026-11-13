// Inferred from 438 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LinedanceTrackMergesSchema = z.strictObject({
  _id: z.string(),
  at: bsonDate,
  into: z.string(),
  key: z.string().nullable(), // declared in src/contract/declared-fields.ts
  reason: z.string(),
  by: z.string().optional(), // declared in src/contract/declared-fields.ts
  movedDances: z.array(z.string()).optional(), // declared in src/contract/declared-fields.ts
});

export type LinedanceTrackMerges = z.infer<typeof LinedanceTrackMergesSchema>;
