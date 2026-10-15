import Link from "next/link";
import { notFound } from "next/navigation";
import { migrations } from "@/migrations";
import { ledgerEntry, plan } from "@/migrations/runner";
import type { MigrationReport } from "@/migrations/types";

export const dynamic = "force-dynamic";

function Report({ report }: { report: MigrationReport }) {
  const counts = Object.entries(report.counts ?? {});
  return (
    <>
      <p>{report.summary}</p>
      {counts.length ? (
        <div className="table-wrap" style={{ marginBottom: 12 }}>
          <table>
            <tbody>
              {counts.map(([k, v]) => (
                <tr key={k}>
                  <td className="mono">{k}</td>
                  <td className="num">{v.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {report.sample?.length ? (
        <details>
          <summary className="muted">Sample</summary>
          <pre>{JSON.stringify(report.sample, null, 2)}</pre>
        </details>
      ) : null}
    </>
  );
}

export default async function MigrationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const m = migrations.find((x) => x.id === id);
  if (!m) notFound();

  // plan() is read-only by contract (see src/migrations/types.ts), so it is safe to run on page load.
  const [entry, dryRun] = await Promise.all([
    ledgerEntry(m.id),
    plan(m.id).then(
      (r) => ({ ok: true as const, r }),
      (e: Error) => ({ ok: false as const, error: e.message }),
    ),
  ]);

  return (
    <main>
      <div className="crumbs">
        <Link href="/migrations">Migrations</Link>
      </div>
      <h1 className="mono" style={{ fontSize: 20 }}>
        {m.id}
      </h1>
      <p className="lede">
        {m.description} Database: <code>{m.database}</code>.{" "}
        {entry ? (
          <span className="badge ok">applied {entry.appliedAt.toISOString()}</span>
        ) : (
          <span className="badge warn">pending</span>
        )}
      </p>

      <section className="panel">
        <div className="panel-head">
          <h2 style={{ margin: 0 }}>Dry run (now)</h2>
          <p>Read-only: what applying it would do against the current data.</p>
        </div>
        {dryRun.ok ? <Report report={dryRun.r} /> : <p className="bad-text">Dry run failed: {dryRun.error}</p>}
        {!entry ? (
          <p className="muted">
            To apply (local database only): <code>npm run db:migrate -- apply {m.id}</code>
          </p>
        ) : null}
      </section>

      {entry ? (
        <section className="panel">
          <div className="panel-head">
            <h2 style={{ margin: 0 }}>Result when applied</h2>
            <p>Recorded in the ledger on {entry.appliedAt.toISOString()}.</p>
          </div>
          <Report report={entry.report} />
        </section>
      ) : null}
    </main>
  );
}
