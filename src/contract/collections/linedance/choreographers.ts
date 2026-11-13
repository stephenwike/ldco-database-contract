// Inferred from 19553 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LinedanceChoreographersSchema = z.strictObject({
  _id: z.string(),
  name: z.string(),
  nameKey: z.string(),
  aliases: z.array(z.string()),
  countries: z.array(z.string()),
  nameWords: z.array(z.string()).optional(), // declared in src/contract/declared-fields.ts
  ldcoIds: z.array(z.string()).optional(),
  mergedAt: bsonDate.optional(),
  mergedInto: z.string().optional(),
  splitInto: z.array(z.string()).optional(),
});

export type LinedanceChoreographers = z.infer<typeof LinedanceChoreographersSchema>;
