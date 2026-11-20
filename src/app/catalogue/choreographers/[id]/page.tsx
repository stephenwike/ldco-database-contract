import Link from "next/link";
import { getLinedanceDb } from "@/server/write";
import { traceChoreographer } from "@/server/catalogue/trace";
import RecordAction from "@/components/RecordAction";
import MergeBox from "@/components/MergeBox";

// One choreographer in the linedance catalogue, with their dances, the records merged into them and the pairs
// reviewed (decision 29; from the data desk).

export const dynamic = "force-dynamic";

const when = (d?: Date | string | null) => (d ? new Date(d).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "");

export default async function ChoreographerRecordPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await traceChoreographer(await getLinedanceDb(), id);
  if (!t) {
    return (
      <>
        <h1>Not found</h1>
        <p className="lede">No choreographer has the id <code>{id}</code>.</p>
      </>
    );
  }
  const p = t.person;
  return (
    <>
      <h1>{p.name}</h1>
      <p className="lede"><code>{p._id}</code> · {t.danceCount.toLocaleString()} dances</p>
      {p.mergedInto && (
        <div className="panel record-row">
          <div>
            {p.splitInto ? (
              <>A two-person credit split into {p.splitInto.map((x: string) => <Link key={x} href={`/catalogue/choreographers/${x}`}>{t.names[x] ?? x} </Link>)}</>
            ) : (
              <>Merged into <Link href={`/catalogue/choreographers/${p.mergedInto}`}>{t.names[p.mergedInto] ?? p.mergedInto}</Link></>
            )}
            <div className="desc">{p.mergedBy ?? "automatic"} · {when(p.mergedAt)}</div>
          </div>
          <RecordAction label="Undo" url="/api/catalogue/merges" body={{ kind: "choreographers", id }} confirm="Separate this record again?" />
        </div>
      )}
      <div className="panel">
        <dl className="facts">
          <dt>Other spellings</dt><dd>{(p.aliases ?? []).join(" · ") || <span className="muted">—</span>}</dd>
          <dt>Countries</dt><dd>{(p.countries ?? []).join(", ") || <span className="muted">—</span>}</dd>
          <dt>Name key</dt><dd className="muted">{p.nameKey}</dd>
          <dt>Other ids</dt><dd className="mono">{(p.ldcoIds ?? []).join(", ") || <span className="muted">—</span>}</dd>
        </dl>
      </div>

      {t.stubs.length > 0 && (
        <>
          <h2>Merged into this person</h2>
          <ul className="plain">
            {t.stubs.map((s) => (
              <li key={String(s._id)} className="panel record-row">
                <div>
                  <Link href={`/catalogue/choreographers/${s._id}`}>{s.name}</Link>{" "}
                  <span className="desc">{s.splitInto ? "split credit" : "same person"} · {s.mergedBy ?? "automatic"} · {when(s.mergedAt)}{s.movedDances ? ` · ${s.movedDances.length} dances moved` : " · older record"}</span>
                </div>
                <RecordAction label="Undo" url="/api/catalogue/merges" body={{ kind: "choreographers", id: String(s._id) }} confirm={`Separate “${s.name}” again?`} />
              </li>
            ))}
          </ul>
        </>
      )}

      {t.reviews.length > 0 && (
        <>
          <h2>Reviewed pairs</h2>
          <ul className="plain">
            {t.reviews.map((r) => {
              const other = String(r._id).split("|").find((x) => x !== id)!;
              return (
                <li key={String(r._id)}>
                  {r.status === "same" ? "Same person as" : "Different person from"} <Link href={`/catalogue/choreographers/${other}`}>{t.names[other] ?? other}</Link>{" "}
                  <span className="muted">{r.note ?? ""} · {r.by} · {when(r.at)}</span>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {!p.mergedInto && (
        <>
          <h2>Merge with another person</h2>
          <div className="panel">
            <MergeBox kind="choreographers" id={id} name={p.name} />
          </div>
        </>
      )}

      <h2>Dances{t.danceCount > t.dances.length ? ` (first ${t.dances.length})` : ""}</h2>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Dance</th><th>With</th><th>Year</th></tr></thead>
          <tbody>
            {t.dances.map((d) => (
              <tr key={String(d._id)}>
                <td><Link href={`/catalogue/dances/${d._id}`}>{d.danceName}</Link></td>
                <td>
                  {(d.choreographerIds ?? []).filter((c: string) => c !== id).map((c: string) => (
                    <Link key={c} href={`/catalogue/choreographers/${c}`}>{t.names[c] ?? c} </Link>
                  ))}
                </td>
                <td>{d.year ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
