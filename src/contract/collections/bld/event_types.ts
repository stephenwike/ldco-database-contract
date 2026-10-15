// Inferred from 19 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate, objectId } from "../../bson";

export const BldEventTypesSchema = z.strictObject({
  _id: objectId,
  title: z.string(),
  level: z.string(),
  price: z.string(),
  defaultStartTime: z.string(),
  defaultDurationMinutes: z.number(),
  isActive: z.boolean(),
  venueId: z.string(),
  updatedAt: bsonDate.optional(),
  endDayOffset: z.number().optional(),
  createdAt: bsonDate.optional(),
});

export type BldEventTypes = z.infer<typeof BldEventTypesSchema>;
