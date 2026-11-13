// Inferred from 38352 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LinedanceTrackLinksSchema = z.strictObject({
  _id: z.string(),
  checkedAt: bsonDate.nullable(), // declared in src/contract/declared-fields.ts
  confidence: z.enum(["high", "probable"]), // declared in src/contract/declared-fields.ts
  createdAt: bsonDate,
  matchedBy: z.string(),
  provider: z.enum(["spotify", "apple"]), // declared in src/contract/declared-fields.ts
  providerId: z.string(),
  recordingId: z.string().nullable(),
  source: z.string(),
  trackId: z.string(),
  updatedAt: bsonDate,
  url: z.string(),
  confirmedBy: z.array(z.string()).optional(),
  kind: z.string().optional(),
  rank: z.number().optional(),
  movedFrom: z.string().optional(), // declared in src/contract/declared-fields.ts
});

export type LinedanceTrackLinks = z.infer<typeof LinedanceTrackLinksSchema>;
