import { getDb } from "@/server/mongo";
import { migrations } from "./index";
import type { Migration, MigrationReport } from "./types";

const LEDGER = "_migrations";

// Until backups and review exist, migrations only run against a local database.
export function assertLocal() {
  const host = new URL(process.env.MONGODB_URI ?? "mongodb://invalid").hostname;
  if (host !== "localhost" && host !== "127.0.0.1") {
    throw new Error(`Refusing to run migrations: MONGODB_URI host "${host}" is not local.`);
  }
}

async function appliedIds(database: string): Promise<Set<string>> {
  const db = await getDb(database);
  const rows = await db.collection<{ _id: string }>(LEDGER).find().toArray();
  return new Set(rows.map((r) => r._id));
}

export async function status() {
  const result: { id: string; description: string; applied: boolean }[] = [];
  for (const m of migrations) {
    result.push({ id: m.id, description: m.description, applied: (await appliedIds(m.database)).has(m.id) });
  }
  return result;
}

export function find(id: string): Migration {
  const m = migrations.find((x) => x.id === id);
  if (!m) throw new Error(`Unknown migration "${id}".`);
  return m;
}

export async function plan(id: string): Promise<MigrationReport> {
  const m = find(id);
  return m.plan(await getDb(m.database));
}

export async function apply(id: string): Promise<MigrationReport> {
  assertLocal();
  const m = find(id);
  if ((await appliedIds(m.database)).has(m.id)) throw new Error(`${m.id} is already applied.`);
  const db = await getDb(m.database);
  const report = await m.apply(db);
  await db.collection<{ _id: string }>(LEDGER).insertOne({ _id: m.id, appliedAt: new Date(), report } as never);
  return report;
}

export interface LedgerEntry {
  appliedAt: Date;
  report: MigrationReport;
}

// What was recorded when a migration was applied, or null if it hasn't been.
export async function ledgerEntry(id: string): Promise<LedgerEntry | null> {
  const m = find(id);
  const db = await getDb(m.database);
  const row = await db.collection<{ _id: string; appliedAt: Date; report: MigrationReport }>(LEDGER).findOne({ _id: m.id });
  return row ? { appliedAt: row.appliedAt, report: row.report } : null;
}
