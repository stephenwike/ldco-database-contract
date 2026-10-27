// Inferred from 2325 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LdcoDancesSchema = z.strictObject({
  _id: z.string(),
  difficulty: z.string(),
  tracks: z.array(z.string()),
  primaryTrack: z.string(),
  danceName: z.string(),
  choreographers: z.array(z.string()),
  stepsheet: z.string().optional(),
  stepsheetUrls: z.array(z.string()).optional(),
  songArtists: z.array(z.strictObject({
    song: z.string(),
    artist: z.string(),
  })).optional(),
  publishedAt: bsonDate.optional(), // declared in src/contract/declared-fields.ts
  published: z.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$/).optional(), // declared in src/contract/declared-fields.ts
  publishedSource: z.enum(["feed", "feed-archive", "sync-time", "id-estimate"]).optional(), // declared in src/contract/declared-fields.ts
  reviewed: z.boolean().optional(), // declared in src/contract/declared-fields.ts
  reviewedAt: bsonDate.optional(), // declared in src/contract/declared-fields.ts
  reviewedBy: z.string().optional(), // declared in src/contract/declared-fields.ts
});

export type LdcoDances = z.infer<typeof LdcoDancesSchema>;
