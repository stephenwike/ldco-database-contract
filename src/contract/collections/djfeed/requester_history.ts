// Inferred from 1173 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate, objectId } from "../../bson";

export const DjfeedRequesterHistorySchema = z.strictObject({
  _id: objectId,
  clientId: z.string(),
  sessionId: z.string(),
  ownerId: z.string(),
  requesterName: z.string(),
  requests: z.array(z.strictObject({
    danceName: z.string(),
    danceId: z.string().nullable(),
    status: z.string(),
    tipCents: z.number(),
    createdAt: bsonDate,
  })),
  sessionDate: bsonDate,
  sessionName: z.string(),
});

export type DjfeedRequesterHistory = z.infer<typeof DjfeedRequesterHistorySchema>;
