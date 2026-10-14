// Inferred from 27 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate, objectId } from "../../bson";

export const BldDjSessionsSchema = z.strictObject({
  _id: objectId,
  name: z.string(),
  status: z.string(),
  startedAt: bsonDate,
  closedAt: bsonDate,
  partnerDancesEnabled: z.boolean().optional(),
  weightDecayEnabled: z.boolean().optional(),
  weightDecayHalfLifeMinutes: z.number().optional(),
  ownerId: z.string().optional(),
  slug: z.string().optional(),
  plugin: z.string().optional(),
  endsAt: bsonDate.optional(),
  tippingEnabled: z.boolean().optional(),
});

export type BldDjSessions = z.infer<typeof BldDjSessionsSchema>;
