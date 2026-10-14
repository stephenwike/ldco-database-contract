// Inferred from 17 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { objectId } from "../../bson";

export const BldVenuesSchema = z.strictObject({
  _id: objectId,
  name: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
});

export type BldVenues = z.infer<typeof BldVenuesSchema>;
