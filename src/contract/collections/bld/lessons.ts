// Inferred from 1579 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { objectId } from "../../bson";

export const BldLessonsSchema = z.strictObject({
  _id: objectId,
  danceId: z.string().optional(),
  venue: z.string(),
  date: z.string(),
  danceName: z.string().optional(),
});

export type BldLessons = z.infer<typeof BldLessonsSchema>;
