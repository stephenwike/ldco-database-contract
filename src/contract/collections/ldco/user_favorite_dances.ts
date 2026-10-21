// Inferred from 551 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LdcoUserFavoriteDancesSchema = z.strictObject({
  _id: z.string(),
  userId: z.string(),
  danceId: z.string(),
  createdAt: bsonDate,
});

export type LdcoUserFavoriteDances = z.infer<typeof LdcoUserFavoriteDancesSchema>;
