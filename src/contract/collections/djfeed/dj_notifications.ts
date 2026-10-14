// Inferred from 8 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate, objectId } from "../../bson";

export const DjfeedDjNotificationsSchema = z.strictObject({
  _id: objectId,
  ownerId: z.string(),
  type: z.string(),
  amountCents: z.number(),
  senderName: z.string(),
  senderEmail: z.string(),
  read: z.boolean(),
  createdAt: bsonDate,
});

export type DjfeedDjNotifications = z.infer<typeof DjfeedDjNotificationsSchema>;
