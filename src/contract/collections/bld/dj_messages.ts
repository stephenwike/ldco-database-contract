// Inferred from 9 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate, objectId } from "../../bson";

export const BldDjMessagesSchema = z.strictObject({
  _id: objectId,
  sessionId: z.string(),
  ownerId: z.string(),
  text: z.string(),
  status: z.string(),
  duration: z.number(),
  createdAt: bsonDate,
  expiresAt: bsonDate,
  updatedAt: bsonDate.optional(),
});

export type BldDjMessages = z.infer<typeof BldDjMessagesSchema>;
