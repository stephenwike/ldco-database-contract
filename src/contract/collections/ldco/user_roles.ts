// No documents yet; generated from src/contract/declared-fields.ts by scripts/infer-contract.ts.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LdcoUserRolesSchema = z.strictObject({
  _id: z.string(), // declared in src/contract/declared-fields.ts
  roles: z.array(z.enum(["owner", "admin"])), // declared in src/contract/declared-fields.ts
  grantedBy: z.string(), // declared in src/contract/declared-fields.ts
  grantedAt: bsonDate, // declared in src/contract/declared-fields.ts
});

export type LdcoUserRoles = z.infer<typeof LdcoUserRolesSchema>;
