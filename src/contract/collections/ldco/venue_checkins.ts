// Inferred from 24 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";

export const LdcoVenueCheckinsSchema = z.strictObject({
  _id: z.string(),
  userId: z.string(),
  venueId: z.string(),
  dateKey: z.string(),
  status: z.string(),
});

export type LdcoVenueCheckins = z.infer<typeof LdcoVenueCheckinsSchema>;
