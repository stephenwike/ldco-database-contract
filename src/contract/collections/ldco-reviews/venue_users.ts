// Inferred from 1 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LdcoReviewsVenueUsersSchema = z.strictObject({
  _id: z.string(),
  userId: z.string(),
  venueId: z.string(),
  createdAt: bsonDate,
  requestedBy: z.string(),
});

export type LdcoReviewsVenueUsers = z.infer<typeof LdcoReviewsVenueUsersSchema>;
