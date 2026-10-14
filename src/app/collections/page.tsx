import Link from "next/link";
import { collections } from "@/contract";
import { validateCollection, type CollectionKey } from "@/server/validate";

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const keys = Object.keys(collections) as CollectionKey[];
  const results = await Promise.all(
    keys.map((key) =>
      validateCollection(key).then(
        (report) => ({ key, report }),
        (err: Error) => ({ key, error: err.message }),
      ),
    ),
  );

  return (
    <main style={{ fontFamily: "sans-serif", padding: 24 }}>
      <h1>Collections</h1>
      <p>Read-only. Validates up to 20,000 live documents per collection against the contract.</p>
      <table cellPadding={8}>
        <thead>
          <tr style={{ textAlign: "left" }}>
            <th>Collection</th>
            <th>Documents</th>
            <th>Sampled</th>
            <th>Invalid</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) =>
            "error" in r ? (
              <tr key={r.key}>
                <td>{r.key}</td>
                <td colSpan={3}>Error: {r.error}</td>
              </tr>
            ) : (
              <tr key={r.key}>
                <td>
                  <Link href={`/collections/${r.key}`}>
                    {r.report.database}.{r.report.name}
                  </Link>
                </td>
                <td>{r.report.total}</td>
                <td>{r.report.sampled}</td>
                <td style={{ color: r.report.invalid ? "crimson" : "green" }}>{r.report.invalid}</td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </main>
  );
}
