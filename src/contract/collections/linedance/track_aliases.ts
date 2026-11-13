// Inferred from 65855 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LinedanceTrackAliasesSchema = z.strictObject({
  _id: z.string(),
  createdAt: bsonDate,
  source: z.string(),
  trackId: z.string(),
});

export type LinedanceTrackAliases = z.infer<typeof LinedanceTrackAliasesSchema>;
