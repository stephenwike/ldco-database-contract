// Inferred from 797 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LdcoDanceTracksSchema = z.strictObject({
  _id: z.string(),
  danceId: z.string(),
  trackId: z.string(),
  isPrimary: z.boolean(),
  createdAt: bsonDate,
});

export type LdcoDanceTracks = z.infer<typeof LdcoDanceTracksSchema>;
