// Inferred from 1 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate, objectId } from "../../bson";

export const LdcoReviewsVerifyUserInstructorSchema = z.strictObject({
  _id: objectId,
  userId: z.string(),
  instructorId: z.string(),
  createdAt: bsonDate,
  resolved: z.boolean(),
  resolution: z.string(),
  resolvedAt: bsonDate,
  resolvedBy: z.string(),
});

export type LdcoReviewsVerifyUserInstructor = z.infer<typeof LdcoReviewsVerifyUserInstructorSchema>;
