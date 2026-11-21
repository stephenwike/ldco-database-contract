// No documents yet; generated from src/contract/declared-fields.ts by scripts/infer-contract.ts.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LdcoSubscriptionsSchema = z.strictObject({
  _id: z.string(), // declared in src/contract/declared-fields.ts
  stripeCustomerId: z.string().nullable(), // declared in src/contract/declared-fields.ts
  stripeSubscriptionId: z.string().nullable(), // declared in src/contract/declared-fields.ts
  priceId: z.string().nullable(), // declared in src/contract/declared-fields.ts
  status: z.enum(["incomplete", "incomplete_expired", "trialing", "active", "past_due", "canceled", "unpaid", "paused"]).nullable(), // declared in src/contract/declared-fields.ts
  currentPeriodEnd: bsonDate.nullable(), // declared in src/contract/declared-fields.ts
  cancelAtPeriodEnd: z.boolean(), // declared in src/contract/declared-fields.ts
  freeUntil: bsonDate.nullable(), // declared in src/contract/declared-fields.ts
  freeReason: z.string().nullable(), // declared in src/contract/declared-fields.ts
  freeGrantedBy: z.string().nullable(), // declared in src/contract/declared-fields.ts
  updatedAt: bsonDate, // declared in src/contract/declared-fields.ts
});

export type LdcoSubscriptions = z.infer<typeof LdcoSubscriptionsSchema>;
