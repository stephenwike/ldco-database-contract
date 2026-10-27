// Inferred from 19 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LdcoLessonsEventTypesSchema = z.strictObject({
  _id: z.string(),
  createdAt: bsonDate,
  createdBy: z.string(),
  defaultDurationMinutes: z.number(),
  defaultStartTime: z.string().nullable(),
  isActive: z.boolean(),
  level: z.string(),
  price: z.string(),
  title: z.string(),
  updatedAt: bsonDate,
  venueId: z.string(),
  verifiedAt: bsonDate.nullable(), // declared in src/contract/declared-fields.ts
  verifiedBy: z.string().nullable(), // declared in src/contract/declared-fields.ts
});

export type LdcoLessonsEventTypes = z.infer<typeof LdcoLessonsEventTypesSchema>;
