import Link from "next/link";
import { getLinedanceDb } from "@/server/write";
import { searchChoreographerList } from "@/server/catalogue/trace";

// Finding a choreographer by name, other spelling or id, to open their record (decision 29; from the data desk).

export const dynamic = "force-dynamic";

export default async function ChoreographersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q ?? "").trim();
  const people = q ? await searchChoreographerList(await getLinedanceDb(), q) : [];
  return (
    <>
      <h1>Choreographers</h1>
      <form className="record-search">
        <input type="search" name="q" defaultValue={q} placeholder="Name, other spelling or id" autoFocus />
        <button type="submit">Find</button>
      </form>
      {q && !people.length && <p className="muted">Nobody matches “{q}”.</p>}
      {people.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th className="num">Dances</th><th>Countries</th><th>Other spellings</th></tr></thead>
            <tbody>
              {people.map((p) => (
                <tr key={String(p._id)}>
                  <td>
                    <Link href={`/catalogue/choreographers/${p._id}`}>{p.name}</Link>
                    {p.mergedInto ? <span className="badge bad" style={{ marginLeft: 6 }}>merged</span> : null}
                  </td>
                  <td className="num">{p.danceCount.toLocaleString()}</td>
                  <td>{(p.countries ?? []).join(", ")}</td>
                  <td className="muted">{(p.aliases ?? []).join(" · ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
