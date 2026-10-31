import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline/promises";

// Resets the sandbox (test) cluster from live: every listed database there is dropped and replaced with a fresh
// copy of live, so each test run starts from real-looking data and nothing a test wrote is kept. Live is only read
// (mongodump). Runs mongodump / mongorestore inside the local docker Mongo container, like db:sync-local.
// See line-dance-dj-feed/docs/SANDBOX.md.
//
//   LIVE_MONGODB_URI     live, read-only credentials recommended
//   SANDBOX_MONGODB_URI  the test cluster, with write access
//   SANDBOX_DATABASES    optional, comma-separated (default: the same list as db:sync-local)
const container = process.env.LOCAL_MONGO_CONTAINER ?? "ldco-mongo";
const databases = (process.env.SANDBOX_DATABASES ?? process.env.SYNC_DATABASES ?? "ldco,djfeed,bld,copperknob_alert,ldco-events,ldco-reviews,ldco-lessons,music_catalog")
  .split(",").map((d) => d.trim()).filter(Boolean);
const liveUri = process.env.LIVE_MONGODB_URI;
const sandboxUri = process.env.SANDBOX_MONGODB_URI;

function die(message: string): never {
  console.error(`[db:sync-sandbox] ${message}`);
  process.exit(1);
}

if (!liveUri) die("LIVE_MONGODB_URI is not set (read-only credentials recommended).");
if (!sandboxUri) die("SANDBOX_MONGODB_URI is not set (the test cluster, with write access).");

const hostOf = (uri: string) => new URL(uri.replace(/^mongodb(\+srv)?:\/\//, "http://")).hostname;
const liveHost = hostOf(liveUri);
const sandboxHost = hostOf(sandboxUri);
const isLocalHost = (h: string) => h === "localhost" || h === "127.0.0.1";
if (isLocalHost(liveHost)) die("LIVE_MONGODB_URI points at localhost; expected the live cluster.");
if (isLocalHost(sandboxHost)) die("SANDBOX_MONGODB_URI points at localhost; use db:sync-local for the local copy.");
// The one thing this script must never do.
if (sandboxHost === liveHost) die(`SANDBOX_MONGODB_URI is the live cluster (${liveHost}). Refusing.`);

const script =
  'set -eo pipefail; for db in $DATABASES; do echo "== $db"; ' +
  'mongodump --uri="$LIVE_URI" --db="$db" --archive | ' +
  'mongorestore --uri="$SANDBOX_URI" --archive --drop --nsInclude="$db.*"; done';

console.log(`Source (read-only): ${liveHost}`);
console.log(`Target (sandbox):   ${sandboxHost}`);
console.log(`Databases: ${databases.join(", ")}`);
console.log("Everything in those databases on the sandbox is DROPPED and replaced with live's copy.");

if (!process.argv.includes("--yes")) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(`Type the sandbox host (${sandboxHost}) to continue: `);
  rl.close();
  if (answer.trim() !== sandboxHost) die("Aborted.");
}

// URIs go via env, not argv, so credentials stay out of process listings.
const result = spawnSync(
  "docker",
  ["exec", "-e", "LIVE_URI", "-e", "SANDBOX_URI", "-e", "DATABASES", container, "bash", "-c", script],
  {
    stdio: "inherit",
    env: { ...process.env, LIVE_URI: liveUri, SANDBOX_URI: sandboxUri, DATABASES: databases.join(" ") },
  },
);
if (result.status !== 0) die(`docker exec failed (exit ${result.status}). Is the container running?`);
console.log("Sandbox reset from live.");
