// Inferred from 22 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate, objectId } from "../../bson";

export const DjfeedBeatBalancesSchema = z.strictObject({
  _id: objectId,
  attendeeId: z.string(),
  beats: z.number(),
  updatedAt: bsonDate,
});

export type DjfeedBeatBalances = z.infer<typeof DjfeedBeatBalancesSchema>;
