// Inferred from 1 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";

export const LdcoVenueUsersSchema = z.strictObject({
  _id: z.string(),
  userId: z.string(),
  venueId: z.string(),
  requestedBy: z.string(),
});

export type LdcoVenueUsers = z.infer<typeof LdcoVenueUsersSchema>;
