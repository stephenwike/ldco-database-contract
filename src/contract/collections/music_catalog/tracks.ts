// Inferred from 36340 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const MusicCatalogTracksSchema = z.strictObject({
  _id: z.string(),
  artist: z.string(),
  createdAt: bsonDate,
  disambiguation: z.string(),
  durationMs: z.number().nullable(),
  isrcs: z.array(z.string()),
  nArtist: z.string(),
  nTitle: z.string(),
  rank: z.number(),
  rankedAt: bsonDate.optional(),
  source: z.string(),
  sourceId: z.string(),
  title: z.string(),
  updatedAt: bsonDate,
  variantKey: z.string(),
  words: z.array(z.string()),
  year: z.number().nullable(),
});

export type MusicCatalogTracks = z.infer<typeof MusicCatalogTracksSchema>;
