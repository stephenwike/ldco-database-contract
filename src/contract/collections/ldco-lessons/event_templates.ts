// Inferred from 8 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LdcoLessonsEventTemplatesSchema = z.strictObject({
  _id: z.string(),
  createdAt: bsonDate,
  eventTypeId: z.string(),
  isDefault: z.boolean(),
  lessons: z.array(z.strictObject({
    time: z.string(),
    dance: z.string().nullable(),
    level: z.string().nullable(),
    link: z.string().nullable(), // declared in src/contract/declared-fields.ts
  })),
  name: z.string(),
  updatedAt: bsonDate,
});

export type LdcoLessonsEventTemplates = z.infer<typeof LdcoLessonsEventTemplatesSchema>;
