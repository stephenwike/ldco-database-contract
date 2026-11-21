// No documents yet; generated from src/contract/declared-fields.ts by scripts/infer-contract.ts.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LdcoLessonsInstructorSettingsSchema = z.strictObject({
  _id: z.string(), // declared in src/contract/declared-fields.ts
  displayName: z.string(), // declared in src/contract/declared-fields.ts
  contactEmail: z.string().nullable(), // declared in src/contract/declared-fields.ts
  signature: z.string(), // declared in src/contract/declared-fields.ts
  website: z.string().nullable(), // declared in src/contract/declared-fields.ts
  timeZone: z.string(), // declared in src/contract/declared-fields.ts
  updatedAt: bsonDate, // declared in src/contract/declared-fields.ts
  updatedBy: z.string(), // declared in src/contract/declared-fields.ts
});

export type LdcoLessonsInstructorSettings = z.infer<typeof LdcoLessonsInstructorSettingsSchema>;
