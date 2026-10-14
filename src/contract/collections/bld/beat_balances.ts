// Inferred from 1 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate, objectId } from "../../bson";

export const BldBeatBalancesSchema = z.strictObject({
  _id: objectId,
  attendeeId: z.string(),
  beats: z.number(),
  updatedAt: bsonDate,
});

export type BldBeatBalances = z.infer<typeof BldBeatBalancesSchema>;
