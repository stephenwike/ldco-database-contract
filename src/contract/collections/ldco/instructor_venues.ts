// Inferred from 69 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";

export const LdcoInstructorVenuesSchema = z.strictObject({
  _id: z.string(),
  instructorId: z.string(),
  venueId: z.string(),
});

export type LdcoInstructorVenues = z.infer<typeof LdcoInstructorVenuesSchema>;
