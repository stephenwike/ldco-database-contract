import { z } from "zod";

export const DanceSchema = z.object({
  _id: z.string(),
  danceName: z.string(),
  choreographers: z.array(z.string()),
  stepsheet: z.string(),
  difficulty: z.string(),
  primaryTrack: z.string(),
  tracks: z.array(z.string()),
});

export type Dance = z.infer<typeof DanceSchema>;
