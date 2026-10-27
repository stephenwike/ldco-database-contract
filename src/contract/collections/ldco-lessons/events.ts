// Inferred from 280 documents by scripts/infer-contract.ts; review before relying on it.
import { z } from "zod";
import { bsonDate } from "../../bson";

export const LdcoLessonsEventsSchema = z.strictObject({
  _id: z.string(),
  cancelNote: z.string().nullable(),
  createdAt: bsonDate,
  date: z.string(),
  endAt: bsonDate,
  eventTypeId: z.string().nullable().optional(), // declared in src/contract/declared-fields.ts
  isCancelled: z.boolean(),
  lessons: z.array(z.strictObject({
    _id: z.string(),
    startAt: bsonDate,
    dance: z.string().nullable(),
    danceId: z.string().nullable(),
    level: z.string().nullable(),
    link: z.string().nullable(),
    committed: z.boolean(),
    skipped: z.boolean(),
  })),
  specialNote: z.string().nullable(),
  startAt: bsonDate,
  substitute: z.string().nullable(),
  substituteInstructorId: z.string().nullable(), // declared in src/contract/declared-fields.ts
  timeZone: z.string(),
  updatedAt: bsonDate,
  verifiedAt: bsonDate.nullable(), // declared in src/contract/declared-fields.ts
  verifiedBy: z.string().nullable(), // declared in src/contract/declared-fields.ts
  title: z.string().optional(), // declared in src/contract/declared-fields.ts
  venueId: z.string().optional(), // declared in src/contract/declared-fields.ts
  createdBy: z.string().optional(), // declared in src/contract/declared-fields.ts
});

export type LdcoLessonsEvents = z.infer<typeof LdcoLessonsEventsSchema>;
