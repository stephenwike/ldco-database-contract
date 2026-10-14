// Inferred from 107 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";

export const LdcoLessonsSchema = z.strictObject({
  _id: z.string(),
  lessonday: z.string(),
  lessonstart: z.string(),
  instructors: z.array(z.string()),
  duration: z.string(),
  lessoncost: z.string(),
  notes: z.string(),
  difficulty: z.string(),
  venueid: z.string(),
});

export type LdcoLessons = z.infer<typeof LdcoLessonsSchema>;
