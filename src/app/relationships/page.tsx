import Link from "next/link";
import { getRelationships } from "@/server/relationships";

export const dynamic = "force-dynamic";

export default async function RelationshipsPage({ searchParams }: { searchParams: Promise<{ dangling?: string }> }) {
  const onlyDangling = (await searchParams).dangling === "1";
  const relationships = await getRelationships();
  const withDangling = relationships.filter((r) => r.dangling > 0);
  const shown = onlyDangling ? withDangling : relationships;

  return (
    <main>
      <h1>Relationships</h1>
      <p className="lede">
        Inferred from the data: a field references a collection when most of its string values are ids in that
        collection. {relationships.length} found,{" "}
        {withDangling.length ? (
          <span className="badge bad">{withDangling.length} with dangling references</span>
        ) : (
          <span className="badge ok">none dangling</span>
        )}
        . Cached for 5 minutes.{" "}
        {onlyDangling ? (
          <Link href="/relationships">Show all</Link>
        ) : (
          <Link href="/relationships?dangling=1">Show only dangling</Link>
        )}
      </p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>From</th>
              <th>Field</th>
              <th>To</th>
              <th className="num">Distinct values</th>
              <th className="num">Dangling</th>
              <th>Sample dangling ids</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={`${r.from.collection}:${r.from.path}`}>
                <td>
                  <Link href={`/collections/${r.from.collection}`}>{r.from.collection}</Link>
                </td>
                <td className="mono">{r.from.path}</td>
                <td>
                  <Link href={`/collections/${r.to}`}>{r.to}</Link>
                </td>
                <td className="num">{r.distinct.toLocaleString()}</td>
                <td className="num">
                  <span className={`badge ${r.dangling ? "bad" : "ok"}`}>{r.dangling}</span>
                </td>
                <td className="mono">
                  {r.danglingSamples.map((id, i) => (
                    <span key={id}>
                      {i > 0 ? ", " : null}
                      <Link
                        href={`/collections/${r.from.collection}/documents?field=${encodeURIComponent(r.from.path)}&value=${encodeURIComponent(id)}`}
                      >
                        {id}
                      </Link>
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
