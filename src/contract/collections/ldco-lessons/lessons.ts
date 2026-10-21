// Inferred from 1579 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LdcoLessonsLessonsSchema = z.strictObject({
  _id: z.string(),
  danceId: z.string().optional(),
  date: bsonDate,
  eventId: z.string().nullable(),
  instructorId: z.string(),
  lessonId: z.null(),
  venue: z.string(),
  venueId: z.string(),
  danceName: z.string().optional(),
});

export type LdcoLessonsLessons = z.infer<typeof LdcoLessonsLessonsSchema>;
