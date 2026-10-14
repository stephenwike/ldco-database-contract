// Inferred from 3 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate, objectId } from "../../bson";

export const CopperknobAlertProcessedItemsSchema = z.strictObject({
  _id: objectId,
  guid: z.string(),
  danceTitle: z.string(),
  details: z.strictObject({
    method: z.string(),
    score: z.number(),
    choreographer: z.string(),
  }),
  matchedRule: z.string(),
  processedAt: bsonDate,
  status: z.string(),
  submitUrl: z.string(),
  youtubeUrl: z.null(),
});

export type CopperknobAlertProcessedItems = z.infer<typeof CopperknobAlertProcessedItemsSchema>;
