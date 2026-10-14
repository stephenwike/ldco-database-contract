// Inferred from 2186 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";

export const LdcoTracksSchema = z.strictObject({
  _id: z.string(),
  isrc: z.string().optional(),
  name: z.string(),
  artists: z.array(z.string()),
  uri: z.string(),
  duration_ms: z.number().optional(),
  explicit: z.boolean().optional(),
  preview_url: z.string().nullable().optional(),
  is_playable: z.boolean().optional(),
  url: z.string().optional(),
});

export type LdcoTracks = z.infer<typeof LdcoTracksSchema>;
