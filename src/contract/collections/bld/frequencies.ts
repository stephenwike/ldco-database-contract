// Inferred from 7 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate, objectId } from "../../bson";

export const BldFrequenciesSchema = z.strictObject({
  _id: objectId,
  eventTypeId: objectId,
  kind: z.string(),
  byDay: z.array(z.string()).optional(),
  startTime: z.string(),
  durationMinutes: z.number(),
  startDate: z.string().optional(),
  isActive: z.boolean().optional(),
  updatedAt: bsonDate.optional(),
  weekday: z.string().optional(),
  nth: z.number().optional(),
  endDate: z.string().optional(),
  createdAt: bsonDate.optional(),
});

export type BldFrequencies = z.infer<typeof BldFrequenciesSchema>;
