// Inferred from 47 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate, objectId } from "../../bson";

export const LdcoEventsEventRegistrationsSchema = z.strictObject({
  _id: objectId,
  address: z.string().nullable(),
  agreedToWaiver: z.boolean(),
  attendeeStatus: z.string().optional(),
  createdAt: bsonDate,
  email: z.string(),
  emails: z.array(z.strictObject({
    templateId: z.string(),
    subject: z.string(),
    sentAt: z.string(),
  })).optional(),
  event: z.string(),
  name: z.string(),
  paidAt: bsonDate.nullable().optional(),
  paymentMethod: z.string(),
  paymentStatus: z.string(),
  phone: z.string().nullable(),
  requestToken: z.string(),
  waiverSignature: z.string(),
  waiverSignedAt: z.string(),
  requests: z.array(z.strictObject({
    text: z.string(),
    danceId: z.string().nullable(),
  })).optional(),
  updatedAt: bsonDate.optional(),
  catering: z.boolean().optional(),
  stripeSessionId: z.null().optional(),
});

export type LdcoEventsEventRegistrations = z.infer<typeof LdcoEventsEventRegistrationsSchema>;
