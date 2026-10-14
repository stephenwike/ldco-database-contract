// Inferred from 11 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate, objectId } from "../../bson";

export const DjfeedDjDirectMessagesSchema = z.strictObject({
  _id: objectId,
  senderId: z.string(),
  recipientId: z.string().optional(),
  text: z.string(),
  status: z.string(),
  createdAt: bsonDate,
  expiresAt: bsonDate.nullable(),
  recipientClientId: z.string().optional(),
});

export type DjfeedDjDirectMessages = z.infer<typeof DjfeedDjDirectMessagesSchema>;
