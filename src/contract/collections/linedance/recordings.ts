// Inferred from 41092 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LinedanceRecordingsSchema = z.strictObject({
  _id: z.string(),
  artist: z.string(),
  createdAt: bsonDate,
  disambiguation: z.string(),
  durationMs: z.number().nullable(),
  fetchedAt: bsonDate,
  isrcs: z.array(z.string()),
  releaseCount: z.number(),
  source: z.string(),
  sourceId: z.string(),
  title: z.string(),
  version: z.string(),
  year: z.number().nullable(),
});

export type LinedanceRecordings = z.infer<typeof LinedanceRecordingsSchema>;
