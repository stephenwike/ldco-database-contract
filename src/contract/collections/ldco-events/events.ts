// Inferred from 2 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate, objectId } from "../../bson";

export const LdcoEventsEventsSchema = z.strictObject({
  _id: objectId,
  slug: z.string(),
  active: z.boolean(),
  createdAt: bsonDate,
  shortTitle: z.string(),
  title: z.string(),
  // When and where are this special event's (decision 24); the old date / time / venue text was removed by 0019.
  lessonEventId: z.string(), // declared in src/contract/declared-fields.ts
});

export type LdcoEventsEvents = z.infer<typeof LdcoEventsEventsSchema>;
