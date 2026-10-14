// Inferred from 2 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LdcoPendingDancesSchema = z.strictObject({
  _id: z.string(),
  danceName: z.string(),
  songTitle: z.string(),
  artist: z.string(),
  choreographer: z.string(),
  count: z.null(),
  wall: z.null(),
  difficulty: z.string(),
  stepsheetUrl: z.string().nullable(),
  submittedByUserId: z.string(),
  submittedAt: bsonDate,
  status: z.string(),
});

export type LdcoPendingDances = z.infer<typeof LdcoPendingDancesSchema>;
