// No documents yet; generated from src/contract/declared-fields.ts by scripts/infer-contract.ts.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LdcoReviewsInstructorVenuesSchema = z.strictObject({
  _id: z.string(), // declared in src/contract/declared-fields.ts
  instructorId: z.string(), // declared in src/contract/declared-fields.ts
  venueId: z.string(), // declared in src/contract/declared-fields.ts
  createdAt: bsonDate, // declared in src/contract/declared-fields.ts
  updatedAt: bsonDate, // declared in src/contract/declared-fields.ts
});

export type LdcoReviewsInstructorVenues = z.infer<typeof LdcoReviewsInstructorVenuesSchema>;
