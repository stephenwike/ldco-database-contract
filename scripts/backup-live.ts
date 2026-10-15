import { spawn } from "node:child_process";
import { createWriteStream, mkdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Backs up live to backups/<timestamp>/<db>.archive.gz (gitignored), one gzip archive per database.
// Live is only read (mongodump, run inside the local Mongo container so its tools match live).
// Restore one database: docker exec -i ldco-mongo mongorestore --uri="<uri>" --archive --gzip --drop --nsInclude="<db>.*" < <file>
const container = process.env.LOCAL_MONGO_CONTAINER ?? "ldco-mongo";
const databases = (process.env.SYNC_DATABASES ?? "ldco,djfeed,bld,copperknob_alert,ldco-events,ldco-reviews,music_catalog")
  .split(",")
  .map((d) => d.trim())
  .filter(Boolean);
const liveUri = process.env.LIVE_MONGODB_URI;

function die(message: string): never {
  console.error(`[db:backup-live] ${message}`);
  process.exit(1);
}

if (!liveUri) die("LIVE_MONGODB_URI is not set (read-only credentials are enough).");
const liveHost = new URL(liveUri).hostname;
if (liveHost === "localhost" || liveHost === "127.0.0.1") die("LIVE_MONGODB_URI points at localhost; expected the live cluster.");

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const dir = join("backups", stamp);
mkdirSync(dir, { recursive: true });
console.log(`Backing up ${liveHost} -> ${dir}`);

const files: Record<string, number> = {};
for (const db of databases) {
  const file = join(dir, `${db}.archive.gz`);
  // URI via env, not argv, so credentials stay out of process listings.
  const child = spawn("docker", ["exec", "-e", "LIVE_URI", container, "sh", "-c", `mongodump --uri="$LIVE_URI" --db="${db}" --archive --gzip`], {
    env: { ...process.env, LIVE_URI: liveUri },
    stdio: ["ignore", "pipe", "inherit"],
  });
  const out = createWriteStream(file);
  child.stdout.pipe(out);
  const code: number = await new Promise((resolve) => child.on("close", resolve));
  await new Promise((resolve) => out.close(resolve));
  if (code !== 0) die(`mongodump of ${db} failed (exit ${code}). Is the container running?`);
  files[db] = statSync(file).size;
  console.log(`  ${db}: ${(files[db] / 1024).toFixed(0)} KB`);
}

writeFileSync(join(dir, "manifest.json"), JSON.stringify({ source: liveHost, createdAt: new Date().toISOString(), databases: files }, null, 2));
console.log(`Backup complete: ${dir}`);
