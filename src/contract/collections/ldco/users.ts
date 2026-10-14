// Inferred from 80 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LdcoUsersSchema = z.strictObject({
  _id: z.string(),
  name: z.string(),
  email: z.string(),
  image: z.string().optional(),
  emailVerified: z.null().optional(),
  bio: z.string().optional(),
  favorites: z.array(z.string()).optional(),
  flagged: z.array(z.string()).optional(),
  known: z.array(z.string()).optional(),
  refresh: z.array(z.string()).optional(),
  collections: z.array(z.strictObject({
    name: z.string(),
    danceIds: z.array(z.string()),
  })).optional(),
  password: z.string().optional(),
  createdAt: bsonDate.optional(),
  googleId: z.string().optional(),
});

export type LdcoUsers = z.infer<typeof LdcoUsersSchema>;
