// Inferred from 280 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate, objectId } from "../../bson";

export const BldEventsSchema = z.strictObject({
  _id: objectId,
  date: z.string(),
  eventTypeId: objectId,
  startTime: z.string(),
  durationMinutes: z.number(),
  lessons: z.array(z.strictObject({
    time: z.string(),
    dance: z.string().nullable(),
    level: z.string().nullable(),
    link: z.string().nullable(),
    committed: z.boolean(),
    danceId: z.string().nullable().optional(),
  })),
  substitute: z.string().nullable(),
  cancelNote: z.string().nullable(),
  isCancelled: z.boolean(),
  updatedAt: bsonDate.optional(),
  endTime: z.string().optional(),
  endDayOffset: z.number().optional(),
  specialNote: z.string().nullable().optional(),
});

export type BldEvents = z.infer<typeof BldEventsSchema>;
