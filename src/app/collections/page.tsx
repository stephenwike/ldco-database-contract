import Link from "next/link";
import { collections } from "@/contract";
import { validateCollection, type CollectionKey } from "@/server/validate";

export const dynamic = "force-dynamic";

type Row = { key: CollectionKey; database: string; report?: Awaited<ReturnType<typeof validateCollection>>; error?: string };

export default async function CollectionsPage({ searchParams }: { searchParams: Promise<{ invalid?: string }> }) {
  const onlyInvalid = (await searchParams).invalid === "1";
  const keys = Object.keys(collections) as CollectionKey[];

  const rows: Row[] = await Promise.all(
    keys.map((key) =>
      validateCollection(key).then(
        (report): Row => ({ key, database: report.database, report }),
        (err: Error): Row => ({ key, database: collections[key].database, error: err.message }),
      ),
    ),
  );

  const byDatabase = new Map<string, Row[]>();
  for (const row of rows) byDatabase.set(row.database, [...(byDatabase.get(row.database) ?? []), row]);
  const violations = (rs: Row[]) => rs.filter((r) => r.error || r.report!.invalid > 0).length;
  const totalViolating = violations(rows);

  return (
    <main style={{ fontFamily: "sans-serif", padding: 24 }}>
      <p>
        <Link href="/">Home</Link>
      </p>
      <h1>Collections</h1>
      <p>
        Read-only. Validates up to 20,000 live documents per collection against the contract. {keys.length} collections,{" "}
        {totalViolating} with violations.{" "}
        {onlyInvalid ? <Link href="/collections">Show all</Link> : <Link href="/collections?invalid=1">Show only collections with violations</Link>}
      </p>

      {[...byDatabase].map(([database, dbRows]) => {
        const shown = onlyInvalid ? dbRows.filter((r) => r.error || r.report!.invalid > 0) : dbRows;
        if (shown.length === 0) return null;
        return (
          <section key={database}>
            <h2>
              {database} ({dbRows.length} collections, {violations(dbRows)} with violations)
            </h2>
            <table cellPadding={6}>
              <thead>
                <tr style={{ textAlign: "left" }}>
                  <th>Collection</th>
                  <th>Documents</th>
                  <th>Invalid</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((r) =>
                  r.error ? (
                    <tr key={r.key}>
                      <td>{r.key}</td>
                      <td colSpan={2}>Error: {r.error}</td>
                    </tr>
                  ) : (
                    <tr key={r.key}>
                      <td>
                        <Link href={`/collections/${r.key}`}>{r.report!.name}</Link>
                      </td>
                      <td>{r.report!.total}</td>
                      <td style={{ color: r.report!.invalid ? "crimson" : "green" }}>{r.report!.invalid}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </section>
        );
      })}
    </main>
  );
}
