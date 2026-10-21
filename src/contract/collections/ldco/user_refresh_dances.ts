// Inferred from 511 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LdcoUserRefreshDancesSchema = z.strictObject({
  _id: z.string(),
  userId: z.string(),
  danceId: z.string(),
  createdAt: bsonDate,
});

export type LdcoUserRefreshDances = z.infer<typeof LdcoUserRefreshDancesSchema>;
