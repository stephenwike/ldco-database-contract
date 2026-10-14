// Inferred from 484 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LdcoUserFlaggedDancesSchema = z.strictObject({
  _id: z.string(),
  userId: z.string(),
  danceId: z.string(),
  createdAt: bsonDate,
});

export type LdcoUserFlaggedDances = z.infer<typeof LdcoUserFlaggedDancesSchema>;
