// No documents were available to infer from; placeholder until the shape is known.
import { z } from "zod";
import { objectId } from "../../bson";

export const DjfeedDjWalletLocksSchema = z.looseObject({ _id: z.union([z.string(), objectId]) });

export type DjfeedDjWalletLocks = z.infer<typeof DjfeedDjWalletLocksSchema>;
