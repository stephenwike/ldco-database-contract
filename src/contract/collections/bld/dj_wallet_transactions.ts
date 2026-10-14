// Inferred from 10 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate, objectId } from "../../bson";

export const BldDjWalletTransactionsSchema = z.strictObject({
  _id: objectId,
  ownerId: z.string(),
  type: z.string(),
  amountCents: z.number(),
  requestId: z.string(),
  attendeeId: z.string(),
  createdAt: bsonDate,
});

export type BldDjWalletTransactions = z.infer<typeof BldDjWalletTransactionsSchema>;
