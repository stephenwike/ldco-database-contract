// Inferred from 5 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";

export const LinedanceLevelsSchema = z.strictObject({
  _id: z.string(),
  name: z.string(),
  rank: z.number(),
  aliases: z.array(z.string()),
});

export type LinedanceLevels = z.infer<typeof LinedanceLevelsSchema>;
