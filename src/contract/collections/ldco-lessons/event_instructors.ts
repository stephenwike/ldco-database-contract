// Inferred from 19 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LdcoLessonsEventInstructorsSchema = z.strictObject({
  _id: z.string(),
  instructorId: z.string(),
  eventTypeId: z.string().optional(), // declared in src/contract/declared-fields.ts
  eventId: z.string().optional(), // declared in src/contract/declared-fields.ts
  createdAt: bsonDate,
  role: z.string(),
});

export type LdcoLessonsEventInstructors = z.infer<typeof LdcoLessonsEventInstructorsSchema>;
