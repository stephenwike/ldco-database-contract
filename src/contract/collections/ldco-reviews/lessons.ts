// Inferred from 16 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { objectId } from "../../bson";

export const LdcoReviewsLessonsSchema = z.strictObject({
  _id: objectId,
  lessonday: z.string(),
  lessonstart: z.string(),
  instructors: z.array(z.string()),
  duration: z.string(),
  lessoncost: z.string(),
  notes: z.string(),
  difficulty: z.string(),
  venueid: z.string(),
});

export type LdcoReviewsLessons = z.infer<typeof LdcoReviewsLessonsSchema>;
