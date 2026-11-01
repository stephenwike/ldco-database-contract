// Inferred from 1 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate, objectId } from "../../bson";

export const LdcoReviewsVerifyUserInstructorSchema = z.strictObject({
  _id: z.union([z.string(), objectId]), // declared in src/contract/declared-fields.ts
  userId: z.string(),
  instructorId: z.string(),
  createdAt: bsonDate,
  resolved: z.boolean(),
  resolution: z.enum(["approve", "deny"]).optional(), // declared in src/contract/declared-fields.ts
  resolvedAt: bsonDate.optional(), // declared in src/contract/declared-fields.ts
  resolvedBy: z.string().optional(), // declared in src/contract/declared-fields.ts
  kind: z.enum(["claim", "new-profile"]).optional(), // declared in src/contract/declared-fields.ts
  provisionalInstructorId: z.string().optional(), // declared in src/contract/declared-fields.ts
  requestedName: z.string().optional(), // declared in src/contract/declared-fields.ts
  note: z.string().optional(), // declared in src/contract/declared-fields.ts
});

export type LdcoReviewsVerifyUserInstructor = z.infer<typeof LdcoReviewsVerifyUserInstructorSchema>;
