import { MongoClient, type Db } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions, signInConfigured } from "./auth";

declare global {
  var _ldcoWriteClient: Promise<MongoClient> | undefined;
}

// The connection the data tools edit through (decision 29). Separate from mongo.ts, which the browser pages read
// through and which reads from secondaries: the tools read from the primary, so a page reloaded after a save shows it.
//   MONGODB_WRITE_URI   a user that can write the databases the tools edit
//   unset               falls back to MONGODB_URI only when that points at this computer (local development)
function writeUri(): string {
  const uri = process.env.MONGODB_WRITE_URI;
  if (uri) return uri;
  const local = process.env.MONGODB_URI;
  if (local && /localhost|127\.0\.0\.1/.test(local)) return local;
  throw new Error("MONGODB_WRITE_URI is not set, so the data tools can't edit.");
}

export async function getWriteDb(name: string): Promise<Db> {
  globalThis._ldcoWriteClient ??= new MongoClient(writeUri()).connect().catch((e) => {
    globalThis._ldcoWriteClient = undefined;
    throw e;
  });
  return (await globalThis._ldcoWriteClient).db(name);
}

/** The linedance catalogue (decision 28). */
export const getLinedanceDb = () => getWriteDb("linedance");

/**
 * Who an edit is recorded as: the signed-in user's name (decision 30). While the shared password still applies
 * (sign-in through ldco-auth not set up yet), the EDITOR_NAME setting, which matches the admin's old username so
 * audits and reviews made before carry on.
 */
export async function editor(): Promise<string> {
  if (signInConfigured()) {
    const user = (await getServerSession(authOptions))?.user;
    if (user?.name || user?.email) return String(user.name || user.email);
  }
  return process.env.EDITOR_NAME || "ldco-database";
}

/** The ldco database (published dances, choreographers, tracks), for the Dances tools. */
export const getMainDb = () => getWriteDb("ldco");

/** ldco-reviews, where unpublished dances wait (decision 26). */
export const getReviewDb = () => getWriteDb("ldco-reviews");
