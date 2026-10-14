// Inferred from 1 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const BldSpotifyTokensSchema = z.strictObject({
  _id: z.string(),
  access_token: z.string(),
  expires_at: z.number(),
  refresh_token: z.string(),
  updatedAt: bsonDate,
});

export type BldSpotifyTokens = z.infer<typeof BldSpotifyTokensSchema>;
