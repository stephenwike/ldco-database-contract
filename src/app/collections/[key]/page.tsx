import Link from "next/link";
import { notFound } from "next/navigation";
import { collections } from "@/contract";
import { validateCollection, type CollectionKey } from "@/server/validate";

export const dynamic = "force-dynamic";

export default async function CollectionPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!(key in collections)) notFound();

  const report = await validateCollection(key as CollectionKey);

  return (
    <main style={{ fontFamily: "sans-serif", padding: 24 }}>
      <p>
        <Link href="/collections">Back</Link>
      </p>
      <h1>
        {report.database}.{report.name}
      </h1>
      <p>
        {report.total} documents, {report.sampled} sampled, {report.invalid} invalid.
      </p>

      <h2>Issues by frequency</h2>
      {report.issueCounts.length === 0 ? (
        <p>No schema violations in the sample.</p>
      ) : (
        <ul>
          {report.issueCounts.map(([issue, count]) => (
            <li key={issue}>
              {count} x {issue}
            </li>
          ))}
        </ul>
      )}

      <h2>Examples</h2>
      {report.examples.map((e) => (
        <details key={e._id}>
          <summary>{e._id}</summary>
          <ul>
            {e.issues.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </details>
      ))}
    </main>
  );
}
