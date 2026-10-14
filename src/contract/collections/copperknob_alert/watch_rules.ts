// Inferred from 3 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { objectId } from "../../bson";

export const CopperknobAlertWatchRulesSchema = z.strictObject({
  _id: objectId,
  id: z.string(),
  checkIntervalMinutes: z.number(),
  choreographer: z.string(),
  danceName: z.string(),
  fuzzyThreshold: z.number(),
  lastCheckedAt: z.string(),
});

export type CopperknobAlertWatchRules = z.infer<typeof CopperknobAlertWatchRulesSchema>;
