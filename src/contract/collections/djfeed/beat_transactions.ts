// Inferred from 493 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate, objectId } from "../../bson";

export const DjfeedBeatTransactionsSchema = z.strictObject({
  _id: objectId,
  attendeeId: z.string(),
  type: z.string(),
  beats: z.number(),
  amountCents: z.number().optional(),
  stripePaymentIntentId: z.string().optional(),
  stripeSessionId: z.string().optional(),
  createdAt: bsonDate,
  requestId: z.string().optional(),
  djId: z.string().optional(),
  fromDjId: z.string().optional(),
});

export type DjfeedBeatTransactions = z.infer<typeof DjfeedBeatTransactionsSchema>;
