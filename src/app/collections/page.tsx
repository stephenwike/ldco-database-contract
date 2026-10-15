import Link from "next/link";
import { collections } from "@/contract";
import { describe } from "@/contract/descriptions";
import { purposeOf, purposes } from "@/contract/purposes";
import { validateCollection, type CollectionKey } from "@/server/validate";

export const dynamic = "force-dynamic";

type Row = { key: CollectionKey; database: string; report?: Awaited<ReturnType<typeof validateCollection>>; error?: string };

interface Group {
  id: string;
  title: string;
  description?: string;
  notes?: string[];
  rows: Row[];
}

const isViolating = (r: Row) => !!r.error || r.report!.invalid > 0;

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ invalid?: string; view?: string }>;
}) {
  const { invalid, view } = await searchParams;
  const onlyInvalid = invalid === "1";
  const byDatabase = view === "database";
  const keys = Object.keys(collections) as CollectionKey[];

  const rows: Row[] = await Promise.all(
    keys.map((key) =>
      validateCollection(key).then(
        (report): Row => ({ key, database: report.database, report }),
        (err: Error): Row => ({ key, database: collections[key].database, error: err.message }),
      ),
    ),
  );
  const rowByKey = new Map(rows.map((r) => [r.key as string, r]));

  let groups: Group[];
  if (byDatabase) {
    const map = new Map<string, Row[]>();
    for (const r of rows) map.set(r.database, [...(map.get(r.database) ?? []), r]);
    groups = [...map].sort(([a], [b]) => a.localeCompare(b)).map(([db, rs]) => ({ id: db, title: db, rows: rs }));
  } else {
    groups = purposes.map((p) => ({
      id: p.id,
      title: p.name,
      description: p.description,
      notes: p.notes,
      rows: p.collections.map((k) => rowByKey.get(k)).filter((r): r is Row => !!r),
    }));
    const unassigned = rows.filter((r) => !purposeOf(r.key));
    if (unassigned.length) {
      groups.push({
        id: "unassigned",
        title: "Unassigned",
        description: "No purpose yet: add these to src/contract/purposes.ts.",
        rows: unassigned,
      });
    }
  }

  const totalViolating = rows.filter(isViolating).length;
  const href = (next: { invalid?: boolean; view?: string }) => {
    const params = new URLSearchParams();
    const v = next.view ?? (byDatabase ? "database" : undefined);
    if (v === "database") params.set("view", "database");
    if (next.invalid ?? onlyInvalid) params.set("invalid", "1");
    const q = params.toString();
    return `/collections${q ? `?${q}` : ""}`;
  };

  return (
    <main>
      <h1>Collections</h1>
      <p className="lede">
        {keys.length} collections, validated live against the contract (up to 20,000 documents each).{" "}
        {totalViolating ? (
          <span className="badge bad">{totalViolating} with violations</span>
        ) : (
          <span className="badge ok">no violations</span>
        )}{" "}
        {onlyInvalid ? (
          <Link href={href({ invalid: false })}>Show all</Link>
        ) : (
          <Link href={href({ invalid: true })}>Show only collections with violations</Link>
        )}
      </p>

      <div className="tabs">
        <Link href={href({ view: "purpose" })} className={byDatabase ? "" : "active"}>
          By purpose
        </Link>
        <Link href={href({ view: "database" })} className={byDatabase ? "active" : ""}>
          By database
        </Link>
      </div>

      {groups.map((g) => {
        const shown = onlyInvalid ? g.rows.filter(isViolating) : g.rows;
        if (!shown.length) return null;
        const violating = g.rows.filter(isViolating).length;
        return (
          <section key={g.id} id={g.id} className="panel">
            <div className="panel-head">
              <h2 style={{ margin: 0 }}>{g.title}</h2>
              <span className="badge muted">{g.rows.length} collections</span>
              {violating ? <span className="badge bad">{violating} with violations</span> : null}
            </div>
            {g.description ? <p className="muted" style={{ margin: "0 0 8px" }}>{g.description}</p> : null}
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Collection</th>
                    {byDatabase ? <th>Purpose</th> : <th>Database</th>}
                    <th className="num">Documents</th>
                    <th className="num">Invalid</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((r) => (
                    <tr key={r.key}>
                      <td>
                        <Link href={`/collections/${r.key}`}>{collections[r.key].name}</Link>
                        <div className="desc">{describe(r.key) ?? "No description yet."}</div>
                      </td>
                      <td className="muted">{byDatabase ? (purposeOf(r.key)?.name ?? "Unassigned") : r.database}</td>
                      {r.error ? (
                        <td colSpan={2} className="bad-text">
                          Error: {r.error}
                        </td>
                      ) : (
                        <>
                          <td className="num">{r.report!.total.toLocaleString()}</td>
                          <td className="num">
                            <span className={`badge ${r.report!.invalid ? "bad" : "ok"}`}>{r.report!.invalid}</span>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {g.notes?.length ? (
              <ul className="notes">
                {g.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            ) : null}
          </section>
        );
      })}
    </main>
  );
}
