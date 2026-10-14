import { MongoClient, type Db } from "mongodb";

declare global {
  var _ldcoMongoClient: Promise<MongoClient> | undefined;
}

// Read-only by convention: expose only a Db handle and never write through it in this module's callers yet.
export async function getDb(name: string): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set.");
  globalThis._ldcoMongoClient ??= new MongoClient(uri, { readPreference: "secondaryPreferred" }).connect();
  return (await globalThis._ldcoMongoClient).db(name);
}
