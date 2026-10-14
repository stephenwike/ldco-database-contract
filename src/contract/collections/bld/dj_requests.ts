// Inferred from 1765 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate, objectId } from "../../bson";

export const BldDjRequestsSchema = z.strictObject({
  _id: objectId,
  sessionId: z.string(),
  danceId: z.string().nullable(),
  danceName: z.string(),
  songName: z.string(),
  artist: z.string(),
  difficulty: z.string(),
  stepsheet: z.string(),
  duration_ms: z.number().nullable(),
  clientId: z.string(),
  requesterName: z.string(),
  notes: z.string(),
  status: z.string(),
  queuePosition: z.number(),
  createdAt: bsonDate,
  updatedAt: bsonDate,
  playStartedAt: bsonDate.optional(),
  pausedAt: bsonDate.nullable().optional(),
  danceType: z.string().nullable().optional(),
  isRepeat: z.boolean().optional(),
  partnerStyle: z.string().optional(),
  spotifyUri: z.string().nullable().optional(),
  isSongSwap: z.boolean().optional(),
  swapSongName: z.string().nullable().optional(),
  swapArtist: z.string().nullable().optional(),
  tipCents: z.number().optional(),
  advancedBy: z.string().optional(),
  ownerId: z.string().optional(),
});

export type BldDjRequests = z.infer<typeof BldDjRequestsSchema>;
