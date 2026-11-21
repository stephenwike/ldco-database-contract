// No documents yet; generated from src/contract/declared-fields.ts by scripts/infer-contract.ts.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LdcoStripeEventsSchema = z.strictObject({
  _id: z.string(), // declared in src/contract/declared-fields.ts
  type: z.string(), // declared in src/contract/declared-fields.ts
  receivedAt: bsonDate, // declared in src/contract/declared-fields.ts
});

export type LdcoStripeEvents = z.infer<typeof LdcoStripeEventsSchema>;
