import Link from "next/link";
import { notFound } from "next/navigation";
import { collections } from "@/contract";
import { getRelationships } from "@/server/relationships";
import { validateCollection, type CollectionKey } from "@/server/validate";

export const dynamic = "force-dynamic";

export default async function CollectionPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!(key in collections)) notFound();

  const report = await validateCollection(key as CollectionKey);
  const all = await getRelationships();
  const outgoing = all.filter((r) => r.from.collection === key);
  const incoming = all.filter((r) => r.to === key);

  return (
    <main style={{ fontFamily: "sans-serif", padding: 24 }}>
      <p>
        <Link href="/collections">Back</Link>
      </p>
      <h1>
        {report.database}.{report.name}
      </h1>
      <p>
        {report.total} documents, {report.sampled} sampled, {report.invalid} invalid.{" "}
        <Link href={`/collections/${key}/documents`}>Browse documents</Link>
      </p>

      <h2>Points at</h2>
      {outgoing.length === 0 ? (
        <p>No references found.</p>
      ) : (
        <ul>
          {outgoing.map((r) => (
            <li key={r.from.path}>
              <code>{r.from.path}</code> {"->"} <Link href={`/collections/${r.to}`}>{r.to}</Link> ({r.distinct} distinct,{" "}
              <span style={{ color: r.dangling ? "crimson" : "green" }}>{r.dangling} dangling</span>)
            </li>
          ))}
        </ul>
      )}

      <h2>Pointed at by</h2>
      {incoming.length === 0 ? (
        <p>Nothing references this collection.</p>
      ) : (
        <ul>
          {incoming.map((r) => (
            <li key={`${r.from.collection}:${r.from.path}`}>
              <Link href={`/collections/${r.from.collection}`}>{r.from.collection}</Link>.<code>{r.from.path}</code> (
              {r.matched} of {r.distinct} values match)
            </li>
          ))}
        </ul>
      )}

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
          <summary>
            <Link href={`/collections/${key}/documents/${encodeURIComponent(e._id)}`}>{e._id}</Link>
          </summary>
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
