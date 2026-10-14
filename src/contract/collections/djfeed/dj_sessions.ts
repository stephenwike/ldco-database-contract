// Inferred from 106 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate, objectId } from "../../bson";

export const DjfeedDjSessionsSchema = z.strictObject({
  _id: objectId,
  ownerId: z.string(),
  name: z.string(),
  slug: z.string(),
  status: z.string(),
  plugin: z.string(),
  startedAt: bsonDate.nullable(),
  endsAt: bsonDate.nullable(),
  closedAt: bsonDate.nullable(),
  partnerDancesEnabled: z.boolean(),
  weightDecayEnabled: z.boolean(),
  weightDecayHalfLifeMinutes: z.number(),
  tippingEnabled: z.boolean(),
  autoClosedAt: bsonDate.optional(),
  fairnessScoringEnabled: z.boolean().optional(),
  durationMinutes: z.number().optional(),
  queueVisibleCount: z.number().optional(),
  feedTemplateId: z.string().optional(),
  feedAppliedAt: z.string().optional(),
  feedAspectRatio: z.string().optional(),
  requestsEnabled: z.boolean().optional(),
  suppressedClientIds: z.array(z.unknown()).optional(),
  addOns: z.array(z.unknown()).optional(),
});

export type DjfeedDjSessions = z.infer<typeof DjfeedDjSessionsSchema>;
