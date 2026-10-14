import { apply, plan, status } from "../src/migrations/runner";

const [command, id] = process.argv.slice(2);

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
  } else {
    console.error("Usage: migrate.ts status | plan <id> | apply <id>");
    process.exitCode = 1;
  }
} catch (err) {
  console.error((err as Error).message);
  process.exitCode = 1;
}
process.exit();
