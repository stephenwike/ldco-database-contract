// Inferred from 65855 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LinedanceTracksSchema = z.strictObject({
  _id: z.string(),
  artist: z.string(),
  createdAt: bsonDate,
  danceCount: z.number().optional(),
  key: z.string(),
  matchStatus: z.string().optional(),
  recordingConfidence: z.string().optional(),
  recordingId: z.string().nullable().optional(),
  songMatch: z.string().nullable().optional(),
  title: z.string(),
  updatedAt: bsonDate,
  versions: z.array(z.string()).optional(),
  mergedInto: z.string().optional(),
});

export type LinedanceTracks = z.infer<typeof LinedanceTracksSchema>;
