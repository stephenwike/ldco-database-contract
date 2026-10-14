// Inferred from 5658 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate, objectId } from "../../bson";

export const DjfeedDjRequestsSchema = z.strictObject({
  _id: objectId,
  sessionId: z.string(),
  ownerId: z.string(),
  danceId: z.string().nullable(),
  danceName: z.string(),
  songName: z.string(),
  artist: z.string(),
  difficulty: z.string(),
  stepsheet: z.string(),
  duration_ms: z.number().nullable(),
  spotifyUri: z.string().nullable(),
  clientId: z.string(),
  requesterName: z.string(),
  notes: z.string(),
  danceType: z.string().nullable(),
  isSongSwap: z.boolean(),
  swapSongName: z.string().nullable(),
  swapArtist: z.string().nullable(),
  tipCents: z.number(),
  isRepeat: z.boolean(),
  status: z.string(),
  queuePosition: z.number().nullable(),
  createdAt: bsonDate,
  updatedAt: bsonDate,
  advancedBy: z.string().optional(),
  playStartedAt: bsonDate.optional(),
  pausedAt: bsonDate.nullable().optional(),
  partnerStyle: z.string().nullable().optional(),
  partnerGroupId: z.string().nullable().optional(),
  localTrackKey: z.string().nullable().optional(),
  catalogTrackId: z.string().nullable().optional(),
  isrcs: z.array(z.string()).optional(),
  tempo: z.number().nullable().optional(),
  playLengthMs: z.number().optional(),
  volumeDb: z.number().optional(),
});

export type DjfeedDjRequests = z.infer<typeof DjfeedDjRequestsSchema>;
