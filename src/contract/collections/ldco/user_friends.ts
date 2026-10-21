// Inferred from 13 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LdcoUserFriendsSchema = z.strictObject({
  _id: z.string(),
  userA: z.string(),
  userB: z.string(),
  timestamp: bsonDate,
});

export type LdcoUserFriends = z.infer<typeof LdcoUserFriendsSchema>;
