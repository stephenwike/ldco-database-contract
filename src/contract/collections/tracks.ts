import { z } from "zod";

export const TrackSchema = z.object({
  _id: z.string(),
  name: z.string(),
  artists: z.array(z.string()),
  isrc: z.string(),
  uri: z.string(),
  duration_ms: z.number(),
  explicit: z.boolean(),
});

export type Track = z.infer<typeof TrackSchema>;
