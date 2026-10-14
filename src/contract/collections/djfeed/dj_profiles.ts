// Inferred from 2 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate, objectId } from "../../bson";

export const DjfeedDjProfilesSchema = z.strictObject({
  _id: objectId,
  ownerId: z.string(),
  createdAt: bsonDate,
  stripeAccountId: z.string(),
  updatedAt: bsonDate,
  paymentLinks: z.array(z.strictObject({
    label: z.string(),
    url: z.string(),
  })),
  feedTemplates: z.array(z.strictObject({
    id: z.string(),
    name: z.string(),
    designedFor: z.string(),
    slides: z.array(z.strictObject({
      id: z.string(),
      name: z.string(),
      duration: z.number(),
      grid: z.strictObject({
        cols: z.number(),
        rows: z.number(),
      }),
      elements: z.array(z.strictObject({
        id: z.string(),
        type: z.string(),
        col: z.number(),
        row: z.number(),
        colSpan: z.number(),
        rowSpan: z.number(),
        src: z.string().optional(),
      })),
    })),
    createdAt: z.string(),
    updatedAt: z.string().optional(),
  })),
});

export type DjfeedDjProfiles = z.infer<typeof DjfeedDjProfilesSchema>;
