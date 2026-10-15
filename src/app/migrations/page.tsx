import Link from "next/link";
import { migrations } from "@/migrations";
import { ledgerEntry } from "@/migrations/runner";

export const dynamic = "force-dynamic";

export default async function MigrationsPage() {
  const rows = await Promise.all(migrations.map(async (m) => ({ m, entry: await ledgerEntry(m.id) })));
  const pending = rows.filter((r) => !r.entry).length;
  const host = new URL(process.env.MONGODB_URI ?? "mongodb://unknown").hostname;

  return (
    <main>
      <h1>Migrations</h1>
      <p className="lede">
        Code-defined data changes, applied in order. Status is read from each database&apos;s <code>_migrations</code>{" "}
        ledger on <code>{host}</code>.{" "}
        {pending ? <span className="badge warn">{pending} pending</span> : <span className="badge ok">all applied</span>}{" "}
        Dry runs are read-only; applying is done from the CLI (<code>npm run db:migrate -- apply &lt;id&gt;</code>), which
        only runs against a local database.
      </p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Migration</th>
              <th>Database</th>
              <th>Status</th>
              <th>What it does</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ m, entry }) => (
              <tr key={m.id}>
                <td className="mono" style={{ whiteSpace: "nowrap" }}>
                  <Link href={`/migrations/${m.id}`}>{m.id}</Link>
                </td>
                <td>{m.database}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  {entry ? (
                    <span className="badge ok" title={entry.appliedAt.toISOString()}>
                      applied {entry.appliedAt.toISOString().slice(0, 10)}
                    </span>
                  ) : (
                    <span className="badge warn">pending</span>
                  )}
                </td>
                <td className="muted">{m.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
