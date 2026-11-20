import Link from "next/link";
import { getLinedanceDb } from "@/server/write";
import { searchTrackList } from "@/server/catalogue/trace";

// Finding a track by title ("title - artist" narrows by artist) or id, to open its record (decision 29; from the
// data desk).

export const dynamic = "force-dynamic";

export default async function TracksPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q ?? "").trim();
  const tracks = q ? await searchTrackList(await getLinedanceDb(), q) : [];
  return (
    <>
      <h1>Tracks</h1>
      <form className="record-search">
        <input type="search" name="q" defaultValue={q} placeholder="Title, or title - artist, or id" autoFocus />
        <button type="submit">Find</button>
      </form>
      {q && !tracks.length && <p className="muted">No track matches “{q}”.</p>}
      {tracks.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Track</th><th className="num">Dances</th><th>Match</th></tr></thead>
            <tbody>
              {tracks.map((t) => (
                <tr key={String(t._id)}>
                  <td>
                    <Link href={`/catalogue/tracks/${t._id}`}>{t.title} – {t.artist}</Link>
                    {t.mergedInto ? <span className="badge bad" style={{ marginLeft: 6 }}>merged</span> : null}
                  </td>
                  <td className="num">{(t.danceCount ?? 0).toLocaleString()}</td>
                  <td className="muted">{t.matchStatus ?? ""}{t.recordingId ? " · recording" : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
