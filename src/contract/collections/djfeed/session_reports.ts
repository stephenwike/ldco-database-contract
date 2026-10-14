// Inferred from 91 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate, objectId } from "../../bson";

export const DjfeedSessionReportsSchema = z.strictObject({
  _id: objectId,
  sessionId: z.string(),
  actualDurationMs: z.number(),
  autoClosedAt: bsonDate.nullable(),
  closedAt: bsonDate,
  endsAt: bsonDate,
  extensions: z.array(z.unknown()),
  generatedAt: bsonDate,
  ownerId: z.string(),
  playedTracks: z.array(z.strictObject({
    danceName: z.string(),
    danceId: z.string().nullable(),
    songName: z.string(),
    artist: z.string(),
    difficulty: z.string(),
    stepsheet: z.string().optional(),
    danceType: z.string().nullable(),
    partnerStyle: z.string().nullable(),
    isSongSwap: z.boolean().optional(),
    swapSongName: z.string().nullable().optional(),
    swapArtist: z.string().nullable().optional(),
    playedAt: bsonDate,
    requesters: z.array(z.strictObject({
      clientId: z.string(),
      requesterName: z.string(),
      tipCents: z.number(),
    })),
    totalTips: z.number(),
    requesterCount: z.number(),
  })),
  sessionName: z.string(),
  startedAt: bsonDate,
  stats: z.strictObject({
    totalDancesPlayed: z.number(),
    totalRequests: z.number(),
    totalApproved: z.number(),
    totalSkipped: z.number(),
    totalPending: z.number(),
    approvalRate: z.number().nullable(),
    totalTipCents: z.number(),
    uniqueRequesters: z.number(),
  }),
});

export type DjfeedSessionReports = z.infer<typeof DjfeedSessionReportsSchema>;
