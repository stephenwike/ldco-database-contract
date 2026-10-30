// Inferred from 140 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate, objectId } from "../../bson";

export const DjfeedDjSessionsSchema = z.strictObject({
  _id: objectId,
  ownerId: z.string(),
  name: z.string(),
  slug: z.string().optional(),
  status: z.string(),
  plugin: z.string().optional(),
  startedAt: bsonDate.nullable(),
  endsAt: bsonDate.nullable().optional(),
  closedAt: bsonDate.nullable(),
  partnerDancesEnabled: z.boolean().optional(),
  weightDecayEnabled: z.boolean().optional(),
  weightDecayHalfLifeMinutes: z.number().optional(),
  tippingEnabled: z.boolean().optional(),
  autoClosedAt: bsonDate.optional(),
  fairnessScoringEnabled: z.boolean().optional(),
  durationMinutes: z.number().nullable().optional(), // declared in src/contract/declared-fields.ts
  queueVisibleCount: z.number().optional(),
  feedTemplateId: z.string().optional(),
  feedAppliedAt: z.string().optional(),
  feedAspectRatio: z.string().optional(),
  requestsEnabled: z.boolean().optional(),
  suppressedClientIds: z.array(z.unknown()).optional(),
  addOns: z.array(z.unknown()).optional(),
  migratedFrom: z.string().optional(),
  shareTimeZone: z.string().optional(),
  shareToken: z.string().optional(),
  privateEvent: z.boolean().optional(),
  extensions: z.array(z.unknown()).optional(), // declared in src/contract/declared-fields.ts
});

export type DjfeedDjSessions = z.infer<typeof DjfeedDjSessionsSchema>;
