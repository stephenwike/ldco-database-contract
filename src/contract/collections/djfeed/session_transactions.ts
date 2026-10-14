// Inferred from 3 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate, objectId } from "../../bson";

export const DjfeedSessionTransactionsSchema = z.strictObject({
  _id: objectId,
  ownerId: z.string(),
  type: z.string(),
  sessionId: z.string(),
  sessionName: z.string(),
  durationMinutes: z.number(),
  amountCents: z.number(),
  stripeSessionId: z.string(),
  stripePaymentIntentId: z.string(),
  createdAt: bsonDate,
});

export type DjfeedSessionTransactions = z.infer<typeof DjfeedSessionTransactionsSchema>;
