// No documents yet; generated from src/contract/declared-fields.ts by scripts/infer-contract.ts.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LdcoReviewsInstructorsSchema = z.strictObject({
  _id: z.string(), // declared in src/contract/declared-fields.ts
  name: z.string(), // declared in src/contract/declared-fields.ts
  bio: z.string(), // declared in src/contract/declared-fields.ts
  image: z.string(), // declared in src/contract/declared-fields.ts
  userId: z.string(), // declared in src/contract/declared-fields.ts
  createdAt: bsonDate, // declared in src/contract/declared-fields.ts
  updatedAt: bsonDate, // declared in src/contract/declared-fields.ts
});

export type LdcoReviewsInstructors = z.infer<typeof LdcoReviewsInstructorsSchema>;
