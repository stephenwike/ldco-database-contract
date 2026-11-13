// Inferred from 125022 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LinedanceDancesSchema = z.strictObject({
  _id: z.string(),
  danceName: z.string(),
  nameKey: z.string(),
  count: z.number().nullable(),
  wall: z.number().nullable(),
  levels: z.array(z.string()),
  levelQualifier: z.enum(["easy", "high", "low"]).nullable(), // declared in src/contract/declared-fields.ts
  phrased: z.boolean(),
  danceType: z.enum(["line", "partner", "contra", "circle", "chair"]), // declared in src/contract/declared-fields.ts
  levelRaw: z.string().nullable(),
  choreographerIds: z.array(z.string()),
  credit: z.string().nullable(),
  songArtists: z.array(z.strictObject({
    song: z.string(),
    artist: z.string(),
  })),
  musicRaw: z.string().nullable(),
  bpm: z.number().nullable().optional(),
  introCounts: z.number().nullable().optional(),
  hasTags: z.boolean().nullable().optional(),
  hasRestarts: z.boolean().nullable().optional(),
  hasBridge: z.boolean().nullable().optional(),
  choreographedIn: z.string().nullable().optional(),
  published: z.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$/).nullable(), // declared in src/contract/declared-fields.ts
  publishedSource: z.enum(["feed", "feed-archive", "sync-time", "id-estimate", "id-neighbours"]).nullable(), // declared in src/contract/declared-fields.ts
  stepsheets: z.array(z.strictObject({
    url: z.string(),
    lang: z.string().nullable(),
    title: z.string().optional(),
  })),
  tracks: z.array(z.strictObject({ trackId: z.string(), versionNote: z.string().optional(), recordingId: z.string().optional() })).optional(), // declared in src/contract/declared-fields.ts
  notStated: z.array(z.string()).optional(),
  publishedBy: z.string().optional(),
  rank: z.number().optional(), // declared in src/contract/declared-fields.ts
  rankSignals: z.strictObject({ usage: z.number(), views: z.number(), languages: z.number(), recency: z.number(), gaps: z.number() }).optional(), // declared in src/contract/declared-fields.ts
  nameWords: z.array(z.string()).optional(), // declared in src/contract/declared-fields.ts
  dateKey: z.string().nullable().optional(),
  year: z.number().nullable().optional(),
  yearFrom: z.enum(["choreographed", "published"]).nullable().optional(), // declared in src/contract/declared-fields.ts
  editedAt: bsonDate.optional(),
  editedBy: z.string().optional(),
  editedFields: z.array(z.string()).optional(),
  mergedFrom: z.array(z.string()).optional(),
  ldcoIds: z.array(z.string()).optional(),
  unpublished: z.boolean().optional(),
  unpublishedSource: z.strictObject({
    event: z.string(),
    createdBy: z.string(),
    createdAt: bsonDate,
  }).optional(),
  addedFrom: z.strictObject({
    pendingDanceId: z.string(),
    submittedByUserId: z.string(),
    submittedAt: bsonDate,
  }).optional(),
  createdAt: bsonDate.optional(),
});

export type LinedanceDances = z.infer<typeof LinedanceDancesSchema>;
