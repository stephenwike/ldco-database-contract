// Inferred from 1786 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LinedanceMergeCandidatesSchema = z.strictObject({
  _id: z.string(),
  danceIds: z.array(z.string()),
  reason: z.string(),
  confidence: z.null(),
  status: z.string(),
  resolvedAt: bsonDate.optional(),
  resolvedBy: z.string().optional(),
});

export type LinedanceMergeCandidates = z.infer<typeof LinedanceMergeCandidatesSchema>;
