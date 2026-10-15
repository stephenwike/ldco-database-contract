// Inferred from 359 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate, objectId } from "../../bson";

export const LdcoLoginEventsSchema = z.strictObject({
  _id: objectId,
  userId: z.string(),
  email: z.string(),
  provider: z.string(),
  app: z.string(),
  ip: z.string().optional(),
  userAgent: z.string().optional(),
  createdAt: bsonDate,
  clientId: z.string().nullable().optional(),
  debugReturnToCookie: z.null().optional(),
  source: z.string().optional(),
});

export type LdcoLoginEvents = z.infer<typeof LdcoLoginEventsSchema>;
