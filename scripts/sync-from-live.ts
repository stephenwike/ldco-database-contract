import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline/promises";

// Copies live -> local docker Mongo. Live is only read (mongodump); the restore target must be localhost.
const container = process.env.LOCAL_MONGO_CONTAINER ?? "ldco-mongo";
const databases = (process.env.SYNC_DATABASES ?? "ldco,djfeed,bld,copperknob_alert,ldco-events,ldco-reviews,ldco-lessons,music_catalog").split(",").map((d) => d.trim()).filter(Boolean);
const liveUri = process.env.LIVE_MONGODB_URI;
const localEnvUri = process.env.MONGODB_URI;

function die(message: string): never {
  console.error(`[db:sync-local] ${message}`);
  process.exit(1);
}

if (!liveUri) die("LIVE_MONGODB_URI is not set (read-only credentials recommended).");
if (!localEnvUri) die("MONGODB_URI is not set.");

const isLocalHost = (h: string) => h === "localhost" || h === "127.0.0.1";
const liveHost = new URL(liveUri).hostname;
const local = new URL(localEnvUri);
if (isLocalHost(liveHost)) die("LIVE_MONGODB_URI points at localhost; expected the live cluster.");
if (!isLocalHost(local.hostname)) die(`MONGODB_URI host is "${local.hostname}"; refusing to restore to a non-local target.`);

// Inside the container Mongo always listens on 27017.
local.host = "localhost:27017";

// mongodump can't take multiple namespaces, so dump and restore one database per iteration.
const script =
  'set -eo pipefail; for db in $DATABASES; do echo "== $db"; ' +
  'mongodump --uri="$LIVE_URI" --db="$db" --archive | ' +
  'mongorestore --uri="$LOCAL_URI" --archive --drop --nsInclude="$db.*"; done';

console.log(`Source (read-only): ${liveHost}`);
console.log(`Target: container "${container}" (local)`);
console.log(`Databases: ${databases.join(", ")}`);
console.log("Existing local collections that exist in the dump will be DROPPED and replaced.");

if (!process.argv.includes("--yes")) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question('Type "sync" to continue: ');
  rl.close();
  if (answer.trim() !== "sync") die("Aborted.");
}

// URIs go via env, not argv, so credentials stay out of process listings.
const result = spawnSync(
  "docker",
  ["exec", "-e", "LIVE_URI", "-e", "LOCAL_URI", "-e", "DATABASES", container, "bash", "-c", script],
  {
    stdio: "inherit",
    env: { ...process.env, LIVE_URI: liveUri, LOCAL_URI: local.toString(), DATABASES: databases.join(" ") },
  },
);
if (result.status !== 0) die(`docker exec failed (exit ${result.status}). Is the container running?`);
console.log("Sync complete.");
