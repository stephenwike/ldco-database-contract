import { MongoClient, type Db } from "mongodb";

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
 * Who an edit is recorded as. There's one shared password until sign-in through ldco-auth (cms-plan phase 2), so it's
 * a setting: EDITOR_NAME, which should match the admin's username so its audits and reviews carry on.
 */
export const EDITOR = process.env.EDITOR_NAME || "ldco-database";
