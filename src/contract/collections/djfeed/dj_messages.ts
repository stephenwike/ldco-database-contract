// Inferred from 87 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate, objectId } from "../../bson";

export const DjfeedDjMessagesSchema = z.strictObject({
  _id: objectId,
  sessionId: z.string(),
  ownerId: z.string(),
  text: z.string(),
  status: z.string(),
  duration: z.number().nullable(),
  createdAt: bsonDate,
  expiresAt: bsonDate.nullable(),
  updatedAt: bsonDate.optional(),
  sendToAll: z.boolean().optional(),
});

export type DjfeedDjMessages = z.infer<typeof DjfeedDjMessagesSchema>;
