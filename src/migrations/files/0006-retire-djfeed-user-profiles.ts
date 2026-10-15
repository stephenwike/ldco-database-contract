import type { Db } from "mongodb";
import { getDb } from "@/server/mongo";
import type { Migration } from "../types";

// djfeed.user_profiles was a copy of each DJ Feed user's id, name and email, refreshed at sign-in.
// Names and emails now come from ldco.users, and "which user signed in to which app, when" is
// ldco.login_events (written by ldco-auth). Before dropping user_profiles, keep every DJ Feed
// sign-in it knows about that login_events doesn't: a user with no DJ Feed login event, or a
// later sign-in than the latest one recorded.
const SOURCE = "djfeed.user_profiles";
const DJFEED_CLIENT = /^djfeed_/;
const TOLERANCE_MS = 60_000;

interface Profile { id: string; email?: string; updatedAt?: Date }
interface LoginEvent { userId: string; email?: string; provider: string; app: string; clientId: string | null; createdAt: Date; source?: string }

async function load(db: Db) {
  const djfeed = await getDb("djfeed");
  const exists = (await djfeed.listCollections({ name: "user_profiles" }).toArray()).length > 0;
  const profiles = exists ? await djfeed.collection<Profile>("user_profiles").find().toArray() : [];
  const events = db.collection<LoginEvent>("login_events");

  // Name the app the way ldco-auth does for DJ Feed sign-ins
  const sample = await events.findOne({ clientId: DJFEED_CLIENT }, { sort: { createdAt: -1 } });
  const app = sample?.app ?? "DanceCard DJ Feed";
  const clientId = sample?.clientId ?? null;

  const missing: LoginEvent[] = [];
  for (const p of profiles) {
    if (!p.updatedAt) continue;
    const latest = await events.findOne(
      { userId: p.id, $or: [{ clientId: DJFEED_CLIENT }, { app }] },
      { sort: { createdAt: -1 } },
    );
    if (latest && latest.createdAt.getTime() >= p.updatedAt.getTime() - TOLERANCE_MS) continue;
    missing.push({ userId: p.id, email: p.email, provider: "backfill", app, clientId, createdAt: p.updatedAt, source: SOURCE });
  }
  return { djfeed, exists, profiles, missing };
}

export const migration: Migration = {
  id: "0006-retire-djfeed-user-profiles",
  description: "Backfill DJ Feed sign-ins from djfeed.user_profiles into ldco.login_events, then drop user_profiles.",
  database: "ldco",

  async plan(db) {
    const { exists, profiles, missing } = await load(db);
    return {
      summary: exists
        ? `${missing.length} of ${profiles.length} profiles add a login event; then djfeed.user_profiles is dropped.`
        : "djfeed.user_profiles is already gone.",
      counts: { profiles: profiles.length, loginEventsToAdd: missing.length },
      sample: missing.slice(0, 3).map((e) => ({ userId: e.userId, createdAt: e.createdAt, app: e.app })),
    };
  },

  async apply(db) {
    const { djfeed, exists, missing } = await load(db);
    if (!exists) return { summary: "djfeed.user_profiles is already gone.", counts: { added: 0 } };
    if (missing.length) await db.collection<LoginEvent>("login_events").insertMany(missing);
    await djfeed.collection("user_profiles").drop();
    return { summary: `${missing.length} login events added; djfeed.user_profiles dropped.`, counts: { added: missing.length } };
  },
};
