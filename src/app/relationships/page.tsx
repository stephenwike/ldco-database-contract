import Link from "next/link";
import { getRelationships } from "@/server/relationships";

export const dynamic = "force-dynamic";

export default async function RelationshipsPage() {
  const relationships = await getRelationships();
  const withDangling = relationships.filter((r) => r.dangling > 0);

  return (
    <main style={{ fontFamily: "sans-serif", padding: 24 }}>
      <p>
        <Link href="/">Home</Link>
      </p>
      <h1>Relationships</h1>
      <p>
        Inferred from the data: a field references a collection when most of its string values are ids in that
        collection. {relationships.length} found, {withDangling.length} with dangling references. Cached for 5 minutes.
      </p>
      <table cellPadding={8}>
        <thead>
          <tr style={{ textAlign: "left" }}>
            <th>From</th>
            <th>Field</th>
            <th>To</th>
            <th>Distinct values</th>
            <th>Dangling</th>
            <th>Sample dangling ids</th>
          </tr>
        </thead>
        <tbody>
          {relationships.map((r) => (
            <tr key={`${r.from.collection}:${r.from.path}`}>
              <td>
                <Link href={`/collections/${r.from.collection}`}>{r.from.collection}</Link>
              </td>
              <td>{r.from.path}</td>
              <td>
                <Link href={`/collections/${r.to}`}>{r.to}</Link>
              </td>
              <td>{r.distinct}</td>
              <td style={{ color: r.dangling ? "crimson" : "green" }}>{r.dangling}</td>
              <td>{r.danglingSamples.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
