import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createInterface } from "node:readline/promises";
import { collections } from "../src/contract";
import { applyQuarantine, planQuarantine } from "../src/migrations/quarantine";
import { apply, plan, status } from "../src/migrations/runner";
import type { CollectionKey } from "../src/server/validate";

const live = process.argv.includes("--live");
const [command, id] = process.argv.slice(2).filter((a) => a !== "--live");
const BACKUP_MAX_AGE_MS = 24 * 60 * 60 * 1000;

function collectionKey(key: string): CollectionKey {
  if (!(key in collections)) throw new Error(`Unknown collection "${key}". Use <database>.<collection>, e.g. ldco.dances.`);
  return key as CollectionKey;
}

async function ask(question: string) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(question);
  rl.close();
  return answer.trim();
}

// The newest backups/<stamp>/manifest.json for this host, if any (written by db:backup-live).
function latestBackup(host: string) {
  if (!existsSync("backups")) return null;
  const manifests = readdirSync("backups")
    .map((d) => join("backups", d, "manifest.json"))
    .filter(existsSync)
    .map((f) => ({ file: f, ...(JSON.parse(readFileSync(f, "utf8")) as { source: string; createdAt: string }) }))
    .filter((m) => m.source === host)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return manifests[0] ?? null;
}

// --live: status and plan read live with LIVE_MONGODB_URI (read-only is enough). apply needs
// LIVE_WRITE_MONGODB_URI for the same cluster, a backup from the last 24 hours, and typed confirmation.
async function useLive() {
  if (command?.startsWith("quarantine")) throw new Error("Quarantine runs against a local database only.");
  const readUri = process.env.LIVE_MONGODB_URI;
  if (!readUri) throw new Error("LIVE_MONGODB_URI is not set.");
  const host = new URL(readUri).hostname;
  if (command !== "apply") {
    process.env.MONGODB_URI = readUri;
    console.log(`[live] Reading ${host}`);
    return;
  }
  const writeUri = process.env.LIVE_WRITE_MONGODB_URI;
  if (!writeUri) throw new Error("LIVE_WRITE_MONGODB_URI is not set (a user that can write; kept separate from the read-only sync user).");
  if (new URL(writeUri).hostname !== host) throw new Error("LIVE_WRITE_MONGODB_URI and LIVE_MONGODB_URI point at different hosts.");
  const backup = latestBackup(host);
  if (!backup || Date.now() - Date.parse(backup.createdAt) > BACKUP_MAX_AGE_MS) {
    throw new Error(`No backup of ${host} from the last 24 hours. Run npm run db:backup-live first.`);
  }
  console.log(`[live] Applying ${id} to ${host}. Latest backup: ${backup.file} (${backup.createdAt}).`);
  if ((await ask(`Type the live host (${host}) to continue: `)) !== host) throw new Error("Aborted.");
  if ((await ask(`Type the migration id (${id}) to confirm: `)) !== id) throw new Error("Aborted.");
  process.env.MONGODB_URI = writeUri;
  process.env.LDCO_MIGRATE_LIVE_HOST = host;
}

try {
  if (live) await useLive();
  if (command === "status") {
    for (const s of await status()) console.log(`${s.applied ? "[applied]" : "[pending]"} ${s.id} - ${s.description}`);
  } else if (command === "plan" && id) {
    console.log(JSON.stringify(await plan(id), null, 2));
  } else if (command === "apply" && id) {
    console.log("Dry run first:");
    console.log(JSON.stringify(await plan(id), null, 2));
    console.log("Applying...");
    console.log(JSON.stringify(await apply(id), null, 2));
  } else if (command === "quarantine-plan") {
    // Without a key, survey every collection outside ldco-reviews and list only those with violations.
    const keys = id ? [collectionKey(id)] : (Object.keys(collections) as CollectionKey[]).filter((k) => collections[k].database !== "ldco-reviews");
    for (const key of keys) {
      const p = await planQuarantine(key);
      if (!id && !p.candidates.length && !p.conflicts.length) continue;
      console.log(`${key} -> ${p.target}: ${p.candidates.length} to move, ${p.conflicts.length} conflicts`);
      for (const c of p.candidates.slice(0, 10)) console.log(`  ${c._id}: ${c.issues.join("; ")}`);
      if (p.conflicts.length) console.log(`  conflicts (already in target, not moved): ${p.conflicts.join(", ")}`);
    }
  } else if (command === "quarantine" && id) {
    console.log(JSON.stringify(await applyQuarantine(collectionKey(id)), null, 2));
  } else {
    console.error(
      "Usage: migrate.ts [--live] status | plan <id> | apply <id>\n" +
        "       migrate.ts quarantine-plan [<db>.<collection>] | quarantine <db>.<collection>   (local only)",
    );
    process.exitCode = 1;
  }
} catch (err) {
  console.error((err as Error).message);
  process.exitCode = 1;
}
process.exit();
