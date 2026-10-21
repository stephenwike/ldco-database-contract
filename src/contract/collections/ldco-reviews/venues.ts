// Inferred from 1 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LdcoReviewsVenuesSchema = z.strictObject({
  _id: z.string(),
  venuename: z.string(),
  venueaddress: z.string(),
  geolocation: z.array(z.number()),
  phone: z.string(),
  website: z.string(),
  contactName: z.string(),
  contactEmail: z.string(),
  contactPhone: z.string(),
  createdAt: bsonDate,
  timeZone: z.string(),
  verifiedAt: z.null(),
  verifiedBy: z.null(),
});

export type LdcoReviewsVenues = z.infer<typeof LdcoReviewsVenuesSchema>;
