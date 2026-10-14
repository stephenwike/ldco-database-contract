// Inferred from 2 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate, objectId } from "../../bson";

export const DjfeedDjRequesterNicknamesSchema = z.strictObject({
  _id: objectId,
  djId: z.string(),
  clientId: z.string(),
  nickname: z.string(),
  updatedAt: bsonDate,
});

export type DjfeedDjRequesterNicknames = z.infer<typeof DjfeedDjRequesterNicknamesSchema>;
