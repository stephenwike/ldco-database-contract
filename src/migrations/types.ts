import type { Db } from "mongodb";

export interface MigrationReport {
  summary: string;
  counts: Record<string, number>;
  sample?: unknown[];
}

export interface Migration {
  id: string;
  description: string;
  database: string;
  // Must be strictly read-only; this is what a dry run executes.
  plan(db: Db): Promise<MigrationReport>;
  // Must be idempotent so a partial failure can simply be rerun.
  apply(db: Db): Promise<MigrationReport>;
}
