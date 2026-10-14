// Inferred from 12 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LdcoFriendRequestsSchema = z.strictObject({
  _id: z.string(),
  requesterId: z.string(),
  requesteeId: z.string(),
  createdAt: bsonDate.optional(),
  timestamp: bsonDate.optional(),
});

export type LdcoFriendRequests = z.infer<typeof LdcoFriendRequestsSchema>;
