// Inferred from 45 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";

export const LdcoInstructorsSchema = z.strictObject({
  _id: z.string(),
  name: z.string(),
  associatedUserId: z.string().optional(),
  userId: z.string().optional(),
});

export type LdcoInstructors = z.infer<typeof LdcoInstructorsSchema>;
