import { collections } from "../src/contract";
import { applyQuarantine, planQuarantine } from "../src/migrations/quarantine";
import { apply, plan, status } from "../src/migrations/runner";
import type { CollectionKey } from "../src/server/validate";

const [command, id] = process.argv.slice(2);

function collectionKey(key: string): CollectionKey {
  if (!(key in collections)) throw new Error(`Unknown collection "${key}". Use <database>.<collection>, e.g. ldco.dances.`);
  return key as CollectionKey;
}

try {
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
    console.error("Usage: migrate.ts status | plan <id> | apply <id> | quarantine-plan [<db>.<collection>] | quarantine <db>.<collection>");
    process.exitCode = 1;
  }
} catch (err) {
  console.error((err as Error).message);
  process.exitCode = 1;
}
process.exit();
