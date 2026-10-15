// Kept from an earlier inference: the collection is currently empty.
// Inferred from 2 test documents (since deleted by migration 0011); the venue-events feature in line-dance-manager still writes this shape. Re-run contract:infer once real events exist.
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
