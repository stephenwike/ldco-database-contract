// Inferred from 2 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LdcoUserFollowCollectionsSchema = z.strictObject({
  _id: z.string(),
  userId: z.string(),
  collectionId: z.string(),
  followedAt: bsonDate,
});

export type LdcoUserFollowCollections = z.infer<typeof LdcoUserFollowCollectionsSchema>;
