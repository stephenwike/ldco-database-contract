// Inferred from 340 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate, objectId } from "../../bson";

export const LdcoLoginEventsSchema = z.strictObject({
  _id: objectId,
  userId: z.string(),
  email: z.string(),
  provider: z.string(),
  app: z.string(),
  ip: z.string(),
  userAgent: z.string(),
  createdAt: bsonDate,
  clientId: z.string().nullable().optional(),
  debugReturnToCookie: z.null().optional(),
});

export type LdcoLoginEvents = z.infer<typeof LdcoLoginEventsSchema>;
