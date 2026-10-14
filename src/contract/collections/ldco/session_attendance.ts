// Inferred from 144 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LdcoSessionAttendanceSchema = z.strictObject({
  _id: z.string(),
  sessionId: z.string(),
  userId: z.string(),
  firstSeenAt: bsonDate,
  hostId: z.string(),
  lastSeenAt: bsonDate,
});

export type LdcoSessionAttendance = z.infer<typeof LdcoSessionAttendanceSchema>;
