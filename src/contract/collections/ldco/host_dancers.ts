// Inferred from 18 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LdcoHostDancersSchema = z.strictObject({
  _id: z.string(),
  hostId: z.string(),
  userId: z.string(),
  firstSeenAt: bsonDate,
  lastSeenAt: bsonDate,
  sessionCount: z.number(),
  lastSessionId: z.string(),
});

export type LdcoHostDancers = z.infer<typeof LdcoHostDancersSchema>;
