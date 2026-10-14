// No documents were available to infer from; placeholder until the shape is known.
import { z } from "zod";
import { objectId } from "../../bson";

export const LdcoReviewsTracksSchema = z.looseObject({ _id: z.union([z.string(), objectId]) });

export type LdcoReviewsTracks = z.infer<typeof LdcoReviewsTracksSchema>;
