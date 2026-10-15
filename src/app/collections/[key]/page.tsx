import Link from "next/link";
import { notFound } from "next/navigation";
import { collections } from "@/contract";
import { purposeOf } from "@/contract/purposes";
import { getRelationships } from "@/server/relationships";
import { schemaView } from "@/server/schema";
import { validateCollection, type CollectionKey } from "@/server/validate";

export const dynamic = "force-dynamic";

export default async function CollectionPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!(key in collections)) notFound();

  const report = await validateCollection(key as CollectionKey);
  const schema = schemaView(key as CollectionKey);
  const purpose = purposeOf(key);
  const all = await getRelationships();
  const outgoing = all.filter((r) => r.from.collection === key);
  const incoming = all.filter((r) => r.to === key);

  return (
    <main>
      <div className="crumbs">
        <Link href="/collections">Collections</Link>
        {purpose ? (
          <>
            {" / "}
            <Link href={`/collections#${purpose.id}`}>{purpose.name}</Link>
          </>
        ) : null}
      </div>
      <h1>
        <span className="muted">{report.database}.</span>
        {report.name}
      </h1>
      <p className="lede">
        {report.total.toLocaleString()} documents, {report.sampled.toLocaleString()} validated,{" "}
        <span className={`badge ${report.invalid ? "bad" : "ok"}`}>{report.invalid} invalid</span>{" "}
        <Link href={`/collections/${key}/documents`}>Browse documents →</Link>
      </p>

      <h2>Schema</h2>
      {schema.placeholder ? (
        <p className="muted">
          Placeholder: the collection had no documents when the contract was generated, so its shape is unknown. Any
          fields are accepted.
        </p>
      ) : (
        <>
          <p className="muted" style={{ marginTop: 0 }}>
            {schema.strict
              ? "Strict: fields not listed here are violations."
              : "Loose: fields not listed here are allowed."}
          </p>
          <div className="table-wrap schema">
            <table>
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Type</th>
                  <th>Required</th>
                </tr>
              </thead>
              <tbody>
                {schema.fields.map((f) => (
                  <tr key={f.path}>
                    <td className="mono">
                      <span className="indent" style={{ width: f.depth * 18 }} />
                      {f.depth ? <span className="muted">{f.path.split(".").slice(0, -1).join(".")}.</span> : null}
                      {f.path.split(".").pop()}
                    </td>
                    <td className="mono">
                      {f.type}
                      {f.nullable ? <span className="muted"> | null</span> : null}
                    </td>
                    <td>{f.optional ? <span className="badge muted">optional</span> : <span className="badge ok">required</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <h2>Points at</h2>
      {outgoing.length === 0 ? (
        <p className="muted">No references found.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Field</th>
                <th>Collection</th>
                <th className="num">Distinct values</th>
                <th className="num">Dangling</th>
              </tr>
            </thead>
            <tbody>
              {outgoing.map((r) => (
                <tr key={r.from.path}>
                  <td className="mono">{r.from.path}</td>
                  <td>
                    <Link href={`/collections/${r.to}`}>{r.to}</Link>
                  </td>
                  <td className="num">{r.distinct.toLocaleString()}</td>
                  <td className="num">
                    <span className={`badge ${r.dangling ? "bad" : "ok"}`}>{r.dangling}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2>Pointed at by</h2>
      {incoming.length === 0 ? (
        <p className="muted">Nothing references this collection.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Collection</th>
                <th>Field</th>
                <th className="num">Matching values</th>
              </tr>
            </thead>
            <tbody>
              {incoming.map((r) => (
                <tr key={`${r.from.collection}:${r.from.path}`}>
                  <td>
                    <Link href={`/collections/${r.from.collection}`}>{r.from.collection}</Link>
                  </td>
                  <td className="mono">{r.from.path}</td>
                  <td className="num">
                    {r.matched.toLocaleString()} of {r.distinct.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {report.issueCounts.length ? (
        <>
          <h2>Violations by frequency</h2>
          <div className="table-wrap">
            <table>
              <tbody>
                {report.issueCounts.map(([issue, count]) => (
                  <tr key={issue}>
                    <td className="num" style={{ width: 80 }}>
                      {count}
                    </td>
                    <td className="mono">{issue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Examples</h2>
          {report.examples.map((e) => (
            <details key={e._id} className="panel" style={{ padding: "10px 14px", marginBottom: 8 }}>
              <summary>
                <Link href={`/collections/${key}/documents/${encodeURIComponent(e._id)}`}>{e._id}</Link>{" "}
                <span className="badge bad">{e.issues.length} issues</span>
              </summary>
              <ul className="notes">
                {e.issues.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </details>
          ))}
        </>
      ) : null}
    </main>
  );
}
