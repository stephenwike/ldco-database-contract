// Inferred from 927 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LinedanceDanceMergesSchema = z.strictObject({
  _id: z.string(),
  into: z.string(),
  rule: z.string(),
  doc: z.record(z.string(), z.unknown()), // declared in src/contract/declared-fields.ts
  at: bsonDate,
  by: z.string().optional(), // declared in src/contract/declared-fields.ts
  candidateId: z.string().optional(), // declared in src/contract/declared-fields.ts
  gained: z.strictObject({ stepsheets: z.array(z.string()), ids: z.array(z.string()), filled: z.record(z.string(), z.unknown()), before: z.record(z.string(), z.unknown()) }).optional(), // declared in src/contract/declared-fields.ts
});

export type LinedanceDanceMerges = z.infer<typeof LinedanceDanceMergesSchema>;
