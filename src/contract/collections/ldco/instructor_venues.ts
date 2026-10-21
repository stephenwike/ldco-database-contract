// Inferred from 71 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LdcoInstructorVenuesSchema = z.strictObject({
  _id: z.string(),
  instructorId: z.string(),
  venueId: z.string(),
  createdAt: bsonDate.optional(),
  updatedAt: bsonDate.optional(),
});

export type LdcoInstructorVenues = z.infer<typeof LdcoInstructorVenuesSchema>;
