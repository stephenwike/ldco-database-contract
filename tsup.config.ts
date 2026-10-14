import { defineConfig } from "tsup";

// Single config so `clean` can't wipe the other entry's output.
export default defineConfig({
  entry: { index: "src/contract/index.ts", "cli/check": "src/cli/check.ts" },
  format: ["esm", "cjs"],
  dts: { entry: { index: "src/contract/index.ts" } },
  platform: "node",
  clean: true,
});
