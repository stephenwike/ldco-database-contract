// Inferred from 1991 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LinedanceTrackMergeCandidatesSchema = z.strictObject({
  _id: z.string(),
  createdAt: bsonDate,
  reason: z.string(),
  status: z.string(),
  trackIds: z.array(z.string()),
  updatedAt: bsonDate,
});

export type LinedanceTrackMergeCandidates = z.infer<typeof LinedanceTrackMergeCandidatesSchema>;
