// Inferred from 722 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";

export const LdcoChoreographersSchema = z.strictObject({
  _id: z.string(),
  name: z.string(),
  copperknobUrl: z.string().optional(),
  lastImportedAt: z.string().optional(),
  associatedUserId: z.string().optional(),
});

export type LdcoChoreographers = z.infer<typeof LdcoChoreographersSchema>;
