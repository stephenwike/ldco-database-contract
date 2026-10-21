import type { Migration, MigrationReport } from "../types";

// Decisions 17 and 18, for the ldco side of the instructor schedule:
// - Every venue gets an IANA time zone, so ldco-lessons can store UTC times and show them in the venue's
//   local time. All venues are in Colorado today.
// - Venues and weekly lessons get verifiedAt / verifiedBy (null = not validated). Many are test data or at
//   places that have since closed; an instructor's activity validates them, and the instructor dashboard asks
//   about the rest. ldco-lessons' event_types and events get the same fields in migration 0013.
// Only adds missing fields, so a rerun changes nothing.

const TIME_ZONE = "America/Denver";

export const migration: Migration = {
  id: "0014-ldco-venue-time-zone-and-validation",
  description: "Give every ldco venue a time zone (America/Denver) and add verifiedAt/verifiedBy (null = not validated) to ldco venues and lessons.",
  database: "ldco",

  async plan(db): Promise<MigrationReport> {
    const counts = {
      venuesWithoutTimeZone: await db.collection("venues").countDocuments({ timeZone: { $exists: false } }),
      venuesToMarkNotValidated: await db.collection("venues").countDocuments({ verifiedAt: { $exists: false } }),
      lessonsToMarkNotValidated: await db.collection("lessons").countDocuments({ verifiedAt: { $exists: false } }),
    };
    return {
      summary: `${counts.venuesWithoutTimeZone} venues get a time zone; ${counts.venuesToMarkNotValidated} venues and ${counts.lessonsToMarkNotValidated} lessons marked not validated.`,
      counts,
    };
  },

  async apply(db): Promise<MigrationReport> {
    const zoned = await db.collection("venues").updateMany({ timeZone: { $exists: false } }, { $set: { timeZone: TIME_ZONE } });
    const venues = await db.collection("venues").updateMany({ verifiedAt: { $exists: false } }, { $set: { verifiedAt: null, verifiedBy: null } });
    const lessons = await db.collection("lessons").updateMany({ verifiedAt: { $exists: false } }, { $set: { verifiedAt: null, verifiedBy: null } });
    const counts = { venuesGivenTimeZone: zoned.modifiedCount, venuesMarked: venues.modifiedCount, lessonsMarked: lessons.modifiedCount };
    return {
      summary: `${counts.venuesGivenTimeZone} venues given a time zone; ${counts.venuesMarked} venues and ${counts.lessonsMarked} lessons marked not validated.`,
      counts,
    };
  },
};
