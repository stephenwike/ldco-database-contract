#!/usr/bin/env node
"use strict";

// src/cli/init.ts
var import_node_fs = require("fs");
var import_node_path = require("path");
var file = (0, import_node_path.join)(process.cwd(), "package.json");
if (!(0, import_node_fs.existsSync)(file)) {
  console.error("[ldco-db-init] No package.json in the current directory.");
  process.exit(1);
}
var pkg = JSON.parse((0, import_node_fs.readFileSync)(file, "utf8"));
pkg.scripts ??= {};
var existing = pkg.scripts.prebuild;
if (existing?.includes("ldco-db-check")) {
  console.log("[ldco-db-init] prebuild already runs ldco-db-check.");
} else {
  pkg.scripts.prebuild = existing ? `ldco-db-check && ${existing}` : "ldco-db-check";
  (0, import_node_fs.writeFileSync)(file, JSON.stringify(pkg, null, 2) + "\n");
  console.log(`[ldco-db-init] prebuild set to: ${pkg.scripts.prebuild}`);
}
console.log("Set LDCO_DATABASE_URL and LDCO_DATABASE_TOKEN in this app's local and Vercel environments.");
