// Inferred from 13 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";

export const LdcoUserVenuesSchema = z.strictObject({
  _id: z.string(),
  userId: z.string(),
  venueId: z.string(),
});

export type LdcoUserVenues = z.infer<typeof LdcoUserVenuesSchema>;
