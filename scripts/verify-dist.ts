import { spawnSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";

// dist/ is committed so apps can install the package from GitHub without running a build on install
// (pnpm 10 and newer npm refuse install scripts from git dependencies unless each app allowlists
// them). This rebuilds the package into a temporary folder and fails if dist/ differs, so a stale
// dist can't be published. Fix with: npm run package:build, then commit dist/.

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });
}

const read = (path: string) => readFileSync(path, "utf8").replace(/\r\n/g, "\n");

const out = mkdtempSync(join(tmpdir(), "ldco-dist-"));
try {
  const result = spawnSync("npx", ["tsup", "--out-dir", out], { stdio: "pipe", shell: true, encoding: "utf8" });
  if (result.status !== 0) {
    console.error(result.stdout, result.stderr);
    throw new Error("tsup failed");
  }
  const fresh = files(out).map((f) => relative(out, f)).sort();
  const committed = files("dist").map((f) => relative("dist", f)).sort();
  const problems = [
    ...fresh.filter((f) => !committed.includes(f)).map((f) => `missing from dist: ${f}`),
    ...committed.filter((f) => !fresh.includes(f)).map((f) => `extra in dist: ${f}`),
    ...fresh.filter((f) => committed.includes(f) && read(join(out, f)) !== read(join("dist", f))).map((f) => `out of date: ${f}`),
  ];
  if (problems.length) {
    console.error(`dist/ doesn't match the source:\n  ${problems.join("\n  ")}\nRun npm run package:build and commit dist/.`);
    process.exit(1);
  }
  console.log(`dist/ is up to date (${fresh.length} files).`);
} finally {
  rmSync(out, { recursive: true, force: true });
}
