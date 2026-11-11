// No documents yet; generated from src/contract/declared-fields.ts by scripts/infer-contract.ts.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LdcoReviewsDancesSchema = z.strictObject({
  _id: z.string(), // declared in src/contract/declared-fields.ts
  danceName: z.string(), // declared in src/contract/declared-fields.ts
  choreographers: z.array(z.string()), // declared in src/contract/declared-fields.ts
  difficulty: z.string(), // declared in src/contract/declared-fields.ts
  stepsheet: z.string().optional(), // declared in src/contract/declared-fields.ts
  stepsheetUrls: z.array(z.string()).optional(), // declared in src/contract/declared-fields.ts
  primaryTrack: z.string(), // declared in src/contract/declared-fields.ts
  tracks: z.array(z.string()), // declared in src/contract/declared-fields.ts
  songArtists: z.array(z.strictObject({ song: z.string(), artist: z.string() })).optional(), // declared in src/contract/declared-fields.ts
  reviewKind: z.enum(["unpublished"]).optional(), // declared in src/contract/declared-fields.ts
  unresolvedChoreographers: z.array(z.string()).optional(), // declared in src/contract/declared-fields.ts
  sourceEvent: z.string().optional(), // declared in src/contract/declared-fields.ts
  createdBy: z.string().optional(), // declared in src/contract/declared-fields.ts
  createdAt: bsonDate.optional(), // declared in src/contract/declared-fields.ts
});

export type LdcoReviewsDances = z.infer<typeof LdcoReviewsDancesSchema>;
