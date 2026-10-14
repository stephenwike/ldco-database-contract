// Inferred from 33 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate, objectId } from "../../bson";

export const LdcoEventRegistrationsSchema = z.strictObject({
  _id: objectId,
  event: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  agreedToWaiver: z.boolean(),
  waiverSignedAt: z.string(),
  waiverSignature: z.string(),
  paymentStatus: z.string(),
  paymentMethod: z.string(),
  requestToken: z.string(),
  createdAt: bsonDate,
  paidAt: bsonDate.optional(),
  attendeeStatus: z.string().optional(),
  emails: z.array(z.strictObject({
    templateId: z.string(),
    subject: z.string(),
    sentAt: z.string(),
  })).optional(),
  requests: z.array(z.strictObject({
    text: z.string(),
    danceId: z.string().nullable(),
  })).optional(),
  updatedAt: bsonDate.optional(),
});

export type LdcoEventRegistrations = z.infer<typeof LdcoEventRegistrationsSchema>;
