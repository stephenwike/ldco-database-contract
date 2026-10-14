// Inferred from 8 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate, objectId } from "../../bson";

export const BldEventTemplatesSchema = z.strictObject({
  _id: objectId,
  eventTypeId: objectId,
  name: z.string(),
  lessons: z.array(z.strictObject({
    time: z.string(),
    dance: z.string().nullable(),
    level: z.string().nullable(),
    link: z.null(),
  })),
  createdAt: bsonDate,
  updatedAt: bsonDate,
  isDefault: z.boolean().optional(),
});

export type BldEventTemplates = z.infer<typeof BldEventTemplatesSchema>;
