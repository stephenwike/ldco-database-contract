import type { Migration } from "../types";

// Favouriting a venue ("My Venue" in line-dance-manager) is stored in ldco.user_venues
// (add-favorite-venue / remove-favorite-venue handlers). ldco.user_favorite_venues is an empty
// collection that no code uses. It is dropped only while it is still empty.
export const migration: Migration = {
  id: "0010-drop-ldco-user-favorite-venues",
  description: "Drop the empty, unused ldco.user_favorite_venues (favourites live in user_venues).",
  database: "ldco",

  async plan(db) {
    const exists = (await db.listCollections({ name: "user_favorite_venues" }).toArray()).length > 0;
    const rows = exists ? await db.collection("user_favorite_venues").countDocuments() : 0;
    return { summary: exists ? `${rows} rows; dropped only if 0.` : "Already dropped.", counts: { rows } };
  },

  async apply(db) {
    const exists = (await db.listCollections({ name: "user_favorite_venues" }).toArray()).length > 0;
    if (!exists) return { summary: "Already dropped.", counts: { dropped: 0 } };
    const rows = await db.collection("user_favorite_venues").countDocuments();
    if (rows) throw new Error(`user_favorite_venues has ${rows} rows; not dropping.`);
    await db.collection("user_favorite_venues").drop();
    return { summary: "Dropped empty ldco.user_favorite_venues.", counts: { dropped: 1 } };
  },
};
