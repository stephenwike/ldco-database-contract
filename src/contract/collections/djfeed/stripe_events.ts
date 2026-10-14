// Inferred from 13 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const DjfeedStripeEventsSchema = z.strictObject({
  _id: z.string(),
  type: z.string(),
  receivedAt: bsonDate,
});

export type DjfeedStripeEvents = z.infer<typeof DjfeedStripeEventsSchema>;
