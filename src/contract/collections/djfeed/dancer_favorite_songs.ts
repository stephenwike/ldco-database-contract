// Inferred from 1 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const DjfeedDancerFavoriteSongsSchema = z.strictObject({
  _id: z.string(),
  userId: z.string(),
  trackId: z.string(),
  createdAt: bsonDate,
});

export type DjfeedDancerFavoriteSongs = z.infer<typeof DjfeedDancerFavoriteSongsSchema>;
