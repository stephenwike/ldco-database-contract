// Inferred from 10 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate, objectId } from "../../bson";

export const DjfeedFreeAccessSchema = z.strictObject({
  _id: objectId,
  email: z.string(),
  expiresAt: bsonDate.nullable(),
  note: z.string().nullable(),
  createdAt: bsonDate,
});

export type DjfeedFreeAccess = z.infer<typeof DjfeedFreeAccessSchema>;
