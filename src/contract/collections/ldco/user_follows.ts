// Inferred from 4 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LdcoUserFollowsSchema = z.strictObject({
  _id: z.string(),
  userId: z.string(),
  followingId: z.string(),
  createdAt: bsonDate,
});

export type LdcoUserFollows = z.infer<typeof LdcoUserFollowsSchema>;
