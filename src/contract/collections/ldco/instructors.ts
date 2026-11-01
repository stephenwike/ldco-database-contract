// Inferred from 45 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LdcoInstructorsSchema = z.strictObject({
  _id: z.string(),
  name: z.string(),
  associatedUserId: z.string().optional(),
  userId: z.string().optional(),
  bio: z.string().optional(), // declared in src/contract/declared-fields.ts
  image: z.string().optional(), // declared in src/contract/declared-fields.ts
  createdAt: bsonDate.optional(), // declared in src/contract/declared-fields.ts
  updatedAt: bsonDate.optional(), // declared in src/contract/declared-fields.ts
});

export type LdcoInstructors = z.infer<typeof LdcoInstructorsSchema>;
