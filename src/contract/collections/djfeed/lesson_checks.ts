// Hand-written for decision 20 (no documents to infer from yet); re-run contract:infer once it has data.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const DjfeedLessonChecksSchema = z.strictObject({
  _id: z.string(),
  userId: z.string(),
  feedLessonId: z.string(),
  answer: z.enum(["known", "refresh", "not_taken"]),
  answeredAt: bsonDate,
});

export type DjfeedLessonChecks = z.infer<typeof DjfeedLessonChecksSchema>;
