// Inferred from 6 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";

export const LdcoUserLessonsSchema = z.strictObject({
  _id: z.string(),
  userId: z.string(),
  lessonId: z.string(),
});

export type LdcoUserLessons = z.infer<typeof LdcoUserLessonsSchema>;
