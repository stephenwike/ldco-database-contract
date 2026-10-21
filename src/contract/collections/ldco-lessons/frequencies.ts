// Inferred from 7 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LdcoLessonsFrequenciesSchema = z.strictObject({
  _id: z.string(),
  byDay: z.array(z.string()).optional(),
  createdAt: bsonDate,
  durationMinutes: z.number(),
  eventTypeId: z.string(),
  isActive: z.boolean().optional(),
  kind: z.string(),
  startDate: z.string().optional(),
  startTime: z.string(),
  updatedAt: bsonDate,
  endDate: z.string().optional(),
  nth: z.number().optional(),
  weekday: z.string().optional(),
});

export type LdcoLessonsFrequencies = z.infer<typeof LdcoLessonsFrequenciesSchema>;
