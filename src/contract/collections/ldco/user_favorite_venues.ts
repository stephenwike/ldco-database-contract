// No documents were available to infer from; placeholder until the shape is known.
import { z } from "zod";
import { objectId } from "../../bson";

export const LdcoUserFavoriteVenuesSchema = z.looseObject({ _id: z.union([z.string(), objectId]) });

export type LdcoUserFavoriteVenues = z.infer<typeof LdcoUserFavoriteVenuesSchema>;
