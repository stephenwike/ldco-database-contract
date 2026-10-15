import { randomUUID } from "node:crypto";
import { ObjectId } from "mongodb";
import { getDb } from "@/server/mongo";
import type { Migration, MigrationReport } from "../types";

// One venue list (decision 14, venues row in docs/database-layout.md): bld.venues (Stephen's
// personal instructor site) merges into ldco.venues (line-dance-manager).
// - 5 bld venues already exist in ldco.venues (matched by address); they keep their ldco record
//   and gain bld's city/state.
// - 11 are added, reusing the bld id as a string id. Addresses are normalised and coordinates were
//   looked up once with Mapbox (all exact matches) on 2026-10-15.
// - Adams County Fairgrounds and Riverdale Regional Park are the same place; they become one venue.
// - bld.event_types.venueId is re-pointed to the ldco id (as a string), then bld.venues is dropped.
// - "My venues" for Stephen's instructor record (instructor_venues) are the venues he currently
//   teaches at: Charlie's, Barnum and Glenarm.

const MATCHED: Record<string, string> = {
  "694f55089fad7f908b6be157": "685446c22d8653b899869dae", // Barnum Rec Center
  "694f55089fad7f908b6be156": "382c2df6b1ff828d4b22ff6f", // Charlie's Denver
  "694f55089fad7f908b6be158": "c803d539104754c597d6a71b", // Highland(s) Recreation Center
  "694f55089fad7f908b6be160": "eb523fec195af08f3b8ce87b", // Stampede
  "6a3ca8971bf18e04353be473": "8649172006c54a2d5a7d567d", // VFW Post #4171
};

const MERGED: Record<string, string> = {
  "6a6bf7ea1a0fccca4c8896c3": "6a2245b3588a1f3b3474e120", // Adams County Fairgrounds -> Riverdale Regional Park
};

const NEW: Record<string, { address: string; geolocation: [number, number] }> = {
  "694f55089fad7f908b6be155": { address: "19557 E Parker Square Dr, Parker, CO 80134", geolocation: [-104.761549, 39.50904] },
  "694f55089fad7f908b6be159": { address: "5031 W 46th Ave, Denver, CO 80212", geolocation: [-105.05142, 39.781375] },
  "694f55089fad7f908b6be15a": { address: "701 S Franklin St, Denver, CO 80209", geolocation: [-104.970404, 39.702646] },
  "694f55089fad7f908b6be15b": { address: "4655 Humboldt St, Denver, CO 80216", geolocation: [-104.971476, 39.781239] },
  "694f55089fad7f908b6be15c": { address: "5302 S Federal Cir, Littleton, CO 80123", geolocation: [-105.028534, 39.61953] },
  "694f55089fad7f908b6be15d": { address: "3777 Lafayette St, Denver, CO 80205", geolocation: [-104.97134, 39.769461] },
  "694f55089fad7f908b6be15e": { address: "2422 Busch Ave, Colorado Springs, CO 80904", geolocation: [-104.868066, 38.834635] },
  "694f55089fad7f908b6be15f": { address: "1570 N Clarkson St, Denver, CO 80218", geolocation: [-104.977191, 39.741333] },
  "69aa49260a7750f056e60745": { address: "2800 Glenarm Pl, Denver, CO 80205", geolocation: [-104.975311, 39.755083] },
  "6a2245b3588a1f3b3474e120": { address: "9755 Henderson Rd, Brighton, CO 80601", geolocation: [-104.874005, 39.930145] },
  "6a5266d15e39fc6d4a7b0e9e": { address: "15200 W 6th Ave, Golden, CO 80401", geolocation: [-105.170451, 39.723009] },
};

const STEPHEN_INSTRUCTOR = "f5e37f5a-e74e-4d68-985e-397b00c2f09b";
const CURRENT_VENUES = ["382c2df6b1ff828d4b22ff6f", "685446c22d8653b899869dae", "69aa49260a7750f056e60745"]; // Charlie's, Barnum, Glenarm

interface BldVenue { _id: ObjectId; name: string; address?: string; city?: string; state?: string; website?: string; description?: string; image?: string }

// bld venue id (hex) -> ldco venue id
function target(bldId: string): string {
  return MATCHED[bldId] ?? (MERGED[bldId] ? MERGED[bldId] : bldId);
}

async function load() {
  const bld = await getDb("bld");
  const exists = (await bld.listCollections({ name: "venues" }).toArray()).length > 0;
  const venues = exists ? await bld.collection<BldVenue>("venues").find().toArray() : [];
  return { bld, exists, venues };
}

export const migration: Migration = {
  id: "0012-merge-bld-venues-into-ldco",
  description: "Merge bld.venues into ldco.venues (5 matched, 11 added, 2 merged), re-point bld.event_types.venueId, link Stephen's current venues, drop bld.venues.",
  database: "ldco",

  async plan(db): Promise<MigrationReport> {
    const { bld, exists, venues } = await load();
    if (!exists) return { summary: "bld.venues is already gone.", counts: {} };
    const unknown = venues.filter((v) => { const id = String(v._id); return !MATCHED[id] && !MERGED[id] && !NEW[id]; });
    const eventTypes = await bld.collection("event_types").countDocuments({ venueId: { $type: "objectId" } });
    const linked = await db.collection("instructor_venues").countDocuments({ instructorId: STEPHEN_INSTRUCTOR, venueId: { $in: CURRENT_VENUES } });
    return {
      summary: `${venues.length} bld venues: ${Object.keys(MATCHED).length} matched, ${Object.keys(NEW).length} to add, ${Object.keys(MERGED).length} merged, ${unknown.length} unknown. ${eventTypes} event types to re-point.`,
      counts: {
        bldVenues: venues.length,
        matched: Object.keys(MATCHED).length,
        toAdd: Object.keys(NEW).length,
        merged: Object.keys(MERGED).length,
        unknownBldVenues: unknown.length,
        eventTypesToRepoint: eventTypes,
        currentVenuesAlreadyLinked: linked,
      },
      sample: unknown.map((v) => ({ _id: String(v._id), name: v.name })),
    };
  },

  async apply(db): Promise<MigrationReport> {
    const { bld, exists, venues } = await load();
    if (!exists) return { summary: "bld.venues is already gone.", counts: {} };
    const unknown = venues.filter((v) => { const id = String(v._id); return !MATCHED[id] && !MERGED[id] && !NEW[id]; });
    if (unknown.length) throw new Error(`Unmapped bld venues: ${unknown.map((v) => v.name).join(", ")}; add them to this migration.`);

    const ldcoVenues = db.collection<Record<string, unknown> & { _id: string }>("venues");
    let added = 0;
    let enriched = 0;
    for (const v of venues) {
      const id = String(v._id);
      const extra = { city: v.city, state: v.state, ...(v.description ? { description: v.description } : {}), ...(v.image ? { image: v.image } : {}) };
      if (NEW[id]) {
        const res = await ldcoVenues.updateOne(
          { _id: id },
          {
            $setOnInsert: {
              venuename: v.name,
              venueaddress: NEW[id].address,
              geolocation: NEW[id].geolocation,
              phone: "",
              website: v.website ?? "",
              ...extra,
            },
          },
          { upsert: true },
        );
        added += res.upsertedCount;
      } else if (MATCHED[id]) {
        const res = await ldcoVenues.updateOne({ _id: MATCHED[id], city: { $exists: false } }, { $set: extra });
        enriched += res.modifiedCount;
      }
    }

    // Every event type must point at a venue that now exists in ldco.venues
    let repointed = 0;
    for (const et of await bld.collection("event_types").find({ venueId: { $type: "objectId" } }).toArray()) {
      const to = target(String(et.venueId));
      if (!(await ldcoVenues.findOne({ _id: to }, { projection: { _id: 1 } }))) throw new Error(`Event type ${et._id}: venue ${to} missing in ldco.venues.`);
      await bld.collection("event_types").updateOne({ _id: et._id }, { $set: { venueId: to } });
      repointed++;
    }

    let linked = 0;
    for (const venueId of CURRENT_VENUES) {
      const res = await db.collection<{ _id: string }>("instructor_venues").updateOne(
        { instructorId: STEPHEN_INSTRUCTOR, venueId },
        { $setOnInsert: { _id: randomUUID(), instructorId: STEPHEN_INSTRUCTOR, venueId } },
        { upsert: true },
      );
      linked += res.upsertedCount;
    }

    await bld.collection("venues").drop();
    return {
      summary: `${added} venues added, ${enriched} matched venues given city/state, ${repointed} event types re-pointed, ${linked} instructor venue links added; bld.venues dropped.`,
      counts: { added, enriched, repointed, instructorVenuesLinked: linked },
      sample: [{ mapping: Object.fromEntries(venues.map((v) => [String(v._id), target(String(v._id))])) }],
    };
  },
};
