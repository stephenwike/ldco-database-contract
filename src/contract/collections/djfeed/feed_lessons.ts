// Hand-written for decision 20 (no documents to infer from yet); re-run contract:infer once it has data.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const DjfeedFeedLessonsSchema = z.strictObject({
  _id: z.string(),
  sessionId: z.string(),
  hostId: z.string(),
  danceId: z.string(),
  startedAt: bsonDate,
});

export type DjfeedFeedLessons = z.infer<typeof DjfeedFeedLessonsSchema>;
