// Inferred from 2 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LdcoEventsSchema = z.strictObject({
  _id: z.string(),
  venueId: z.string(),
  title: z.string(),
  description: z.string(),
  eventDay: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  createdAt: bsonDate,
  updatedAt: bsonDate,
  createdBy: z.string(),
});

export type LdcoEvents = z.infer<typeof LdcoEventsSchema>;
