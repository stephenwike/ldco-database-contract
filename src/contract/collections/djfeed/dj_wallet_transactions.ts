// Inferred from 691 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate, objectId } from "../../bson";

export const DjfeedDjWalletTransactionsSchema = z.strictObject({
  _id: objectId,
  ownerId: z.string(),
  type: z.string(),
  amountCents: z.number(),
  requestId: z.string().optional(),
  attendeeId: z.string().nullable().optional(),
  createdAt: bsonDate,
  stripeSessionId: z.string().optional(),
  senderName: z.string().optional(),
  senderEmail: z.string().optional(),
  originalWalletTxId: z.string().optional(),
  note: z.string().optional(),
  recipientId: z.string().optional(),
  recipientEmail: z.string().optional(),
  beats: z.number().optional(),
  sessionId: z.string().optional(),
  durationMinutes: z.number().optional(),
  addOns: z.array(z.unknown()).optional(),
});

export type DjfeedDjWalletTransactions = z.infer<typeof DjfeedDjWalletTransactionsSchema>;
