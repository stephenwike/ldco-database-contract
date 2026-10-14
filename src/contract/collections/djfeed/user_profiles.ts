// Inferred from 40 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate, objectId } from "../../bson";

export const DjfeedUserProfilesSchema = z.strictObject({
  _id: objectId,
  id: z.string(),
  email: z.string(),
  name: z.string(),
  updatedAt: bsonDate,
});

export type DjfeedUserProfiles = z.infer<typeof DjfeedUserProfilesSchema>;
