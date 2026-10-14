// Inferred from 63 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LdcoDanceCollectionsSchema = z.strictObject({
  _id: z.string(),
  name: z.string(),
  danceIds: z.array(z.string()),
  createdBy: z.string(),
  createdAt: bsonDate.nullable(),
  updatedAt: bsonDate.nullable(),
  isPrivate: z.boolean().optional(),
  archived: z.boolean().optional(),
  archivedAt: bsonDate.nullable().optional(),
  isArchived: z.boolean().optional(),
  isCopyable: z.boolean().optional(),
  pendingDanceIds: z.array(z.string()).optional(),
});

export type LdcoDanceCollections = z.infer<typeof LdcoDanceCollectionsSchema>;
