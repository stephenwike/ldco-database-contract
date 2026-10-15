// Inferred from 68 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";

export const LdcoVenuesSchema = z.strictObject({
  _id: z.string(),
  venuename: z.string(),
  venueaddress: z.string(),
  geolocation: z.array(z.number()),
  phone: z.string(),
  website: z.string(),
  city: z.string().optional(),
  state: z.string().optional(),
});

export type LdcoVenues = z.infer<typeof LdcoVenuesSchema>;
