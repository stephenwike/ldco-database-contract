// Inferred from 13 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate, objectId } from "../../bson";

export const DjfeedAttendeeNotificationsSchema = z.strictObject({
  _id: objectId,
  recipientId: z.string(),
  type: z.string(),
  fromDjId: z.string(),
  fromName: z.string(),
  beats: z.number(),
  message: z.string(),
  read: z.boolean(),
  createdAt: bsonDate,
});

export type DjfeedAttendeeNotifications = z.infer<typeof DjfeedAttendeeNotificationsSchema>;
