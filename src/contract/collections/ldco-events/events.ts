// Inferred from 2 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate, objectId } from "../../bson";

export const LdcoEventsEventsSchema = z.strictObject({
  _id: objectId,
  slug: z.string(),
  active: z.boolean(),
  createdAt: bsonDate,
  date: z.string(),
  dateShort: z.string(),
  shortTitle: z.string(),
  time: z.string(),
  title: z.string(),
  venueAddress: z.string(),
  venueName: z.string(),
  lessonEventId: z.string().optional(), // declared in src/contract/declared-fields.ts
});

export type LdcoEventsEvents = z.infer<typeof LdcoEventsEventsSchema>;
