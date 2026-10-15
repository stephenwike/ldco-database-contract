import type { Migration } from "../types";

// Two venue events Stephen created while testing line-dance-manager's venue dashboard.
// Only these exact documents (matched by id and title) are deleted; the collection stays for the feature.
const TEST_EVENTS = [
  { _id: "69a2b930d00f248c594988d4", title: "gfd" },
  { _id: "69a2bc7cd00f248c594988da", title: "aagh" },
];

const filter = { $or: TEST_EVENTS };

export const migration: Migration = {
  id: "0011-delete-test-venue-events",
  description: "Delete the two test venue events (\"gfd\", \"aagh\") from ldco.events.",
  database: "ldco",

  async plan(db) {
    const found = await db.collection("events").countDocuments(filter as never);
    return { summary: `${found} of ${TEST_EVENTS.length} test events to delete.`, counts: { found } };
  },

  async apply(db) {
    const res = await db.collection("events").deleteMany(filter as never);
    return { summary: `${res.deletedCount} test events deleted.`, counts: { deleted: res.deletedCount } };
  },
};
