// Inferred from 11 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate, objectId } from "../../bson";

export const BldBeatTransactionsSchema = z.strictObject({
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
});

export type BldBeatTransactions = z.infer<typeof BldBeatTransactionsSchema>;
