import Link from "next/link";
import { redirect } from "next/navigation";
import { getLinedanceDb } from "@/server/write";
import { traceDance, whereDidDanceGo } from "@/server/catalogue/trace";
import RecordAction from "@/components/RecordAction";

// One dance in the linedance catalogue, with everything that points at it (decision 29; from the data desk).
// Edits are made on the Catalogue page; merges are undone here or in Merge history.

export const dynamic = "force-dynamic";

const when = (d?: Date | string | null) => (d ? new Date(d).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "");
const show = (v: unknown) =>
  v == null || (Array.isArray(v) && !v.length) ? <span className="muted">—</span> : Array.isArray(v) ? v.join(", ") : typeof v === "boolean" ? (v ? "yes" : "no") : String(v);
const sheetId = (u: string) => u.split("/stepsheets/")[1]?.split("/")[0] ?? u;

export default async function DanceRecordPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getLinedanceDb();
  const t = await traceDance(db, id);
  if (!t) {
    const went = await whereDidDanceGo(db, id);
    if (went) redirect(`/catalogue/dances/${went.into}?from=${id}`);
    return (
      <>
        <h1>Not found</h1>
        <p className="lede">No dance has the id <code>{id}</code>, and no merge mentions it.</p>
      </>
    );
  }
  const d = t.dance;
  return (
    <>
      <h1>
        {d.danceName}
        {d.unpublished && <span className="badge muted" style={{ marginLeft: 8 }}>not on copperknob yet</span>}
      </h1>
      <p className="lede">
        <code>{d._id}</code>
        {d.editedFields?.length ? <> · edited by hand: {d.editedFields.join(", ")}{d.editedAt ? ` (${when(d.editedAt)}${d.editedBy ? `, ${d.editedBy}` : ""})` : ""}</> : null}
        {" · "}
        <Link href={`/catalogue?q=${encodeURIComponent(d.danceName)}`}>Edit in the Catalogue</Link>
      </p>

      <div className="panel">
        <dl className="facts">
          <dt>Choreographers</dt>
          <dd>
            {t.choreographers.length
              ? t.choreographers.map((c, i) => (
                  <span key={c._id}>
                    {i ? " & " : ""}
                    <Link href={`/catalogue/choreographers/${c._id}`}>{c.name}</Link>
                    {c.mergedInto ? <span className="badge bad" style={{ marginLeft: 4 }}>merged stub</span> : null}
                  </span>
                ))
              : show(null)}
          </dd>
          <dt>Credit (as written)</dt><dd>{show(d.credit)}</dd>
          <dt>Count · wall</dt><dd>{show(d.count)} · {show(d.wall)}</dd>
          <dt>Level</dt>
          <dd>
            {show(d.levels)}
            {d.levelQualifier ? ` (${d.levelQualifier})` : ""}
            {d.phrased ? " · phrased" : ""} <span className="muted">{d.levelRaw ? `as written: ${d.levelRaw}` : ""}</span>
          </dd>
          <dt>Type</dt><dd>{show(d.danceType)}</dd>
          <dt>Intro · tags · restarts · bridge</dt><dd>{show(d.introCounts)} · {show(d.hasTags)} · {show(d.hasRestarts)} · {show(d.hasBridge)}</dd>
          <dt>Songs</dt><dd>{(d.songArtists ?? []).length ? d.songArtists.map((s: { song: string; artist: string }) => `${s.song} – ${s.artist}`).join("; ") : show(null)}</dd>
          <dt>Music (as written)</dt><dd>{show(d.musicRaw)}</dd>
          <dt>Choreographed</dt><dd>{show(d.choreographedIn)}</dd>
          <dt>Published</dt><dd>{show(d.published)} <span className="muted">{d.publishedSource ?? ""}{d.publishedBy ? ` · on copperknob by ${d.publishedBy}` : ""}</span></dd>
          <dt>Year</dt><dd>{show(d.year)} <span className="muted">{d.yearFrom ? `from ${d.yearFrom}` : ""}{d.dateKey ? ` · sorts as ${d.dateKey}` : ""}</span></dd>
          <dt>Rank</dt><dd>{show(d.rank)}</dd>
          <dt>Not stated on the sheet</dt><dd>{show(d.notStated)}</dd>
          <dt>Stepsheets</dt>
          <dd>
            {(d.stepsheets ?? []).length
              ? d.stepsheets.map((s: { url: string; lang: string | null }) => (
                  <span key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{sheetId(s.url)}{s.lang ? ` [${s.lang}]` : ""} ↗</a>{" "}</span>
                ))
              : show(null)}
          </dd>
          <dt>Other ids</dt><dd className="mono">{show(d.ldcoIds)}</dd>
        </dl>
        <details style={{ marginTop: 10 }}>
          <summary className="muted">The whole record</summary>
          <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(d, null, 1)}</pre>
        </details>
      </div>

      <h2>Tracks</h2>
      {t.tracks.length ? (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Track</th><th>Recording</th><th>Links</th></tr></thead>
            <tbody>
              {t.tracks.map((x) => (
                <tr key={x.trackId}>
                  <td>
                    {x.track ? <Link href={`/catalogue/tracks/${x.trackId}`}>{x.track.title} – {x.track.artist}</Link> : <span className="bad-text">missing track {x.trackId}</span>}
                    {x.track?.mergedInto ? <span className="badge bad" style={{ marginLeft: 4 }}>merged stub</span> : null}
                  </td>
                  <td>
                    {x.recording ? <>{x.recording.title} – {x.recording.artist} <span className="muted">{[x.recording.version, x.recording.year].filter(Boolean).join(" · ")} · {x.track?.recordingConfidence}</span></> : <span className="muted">none</span>}
                  </td>
                  <td>
                    {x.links.length
                      ? x.links.map((l) => <div key={String(l._id)}><a href={l.url} target="_blank" rel="noreferrer">{l.provider} ↗</a> <span className="muted">{l.matchedBy} · {l.confidence}</span></div>)
                      : <span className="muted">none</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p className="muted">No track.</p>}

      <h2>Merged into this dance</h2>
      {t.mergedIn.length ? (
        <ul className="plain">
          {t.mergedIn.map((m) => (
            <li key={String(m._id)} className="panel record-row">
              <div>
                <b>{m.doc?.danceName ?? m._id}</b> <span className="muted mono">{String(m._id)}</span>
                <div className="desc">{m.rule} · {m.by ?? "automatic"} · {when(m.at)}{m.gained ? "" : " · older record"}</div>
                <div>{(m.doc?.stepsheets ?? []).map((s: { url: string }) => <a key={s.url} href={s.url} target="_blank" rel="noreferrer">{sheetId(s.url)} ↗ </a>)}</div>
              </div>
              <RecordAction label="Undo" url="/api/catalogue/merges" body={{ kind: "dances", id: String(m._id) }} confirm={`Separate “${m.doc?.danceName}” from this dance again?`} />
            </li>
          ))}
        </ul>
      ) : <p className="muted">Nothing.</p>}

      <h2>Possible duplicates</h2>
      {t.candidates.length ? (
        <ul className="plain">
          {t.candidates.map((c) => (
            <li key={String(c._id)} className="panel record-row">
              <div>
                {c.reason} <span className={`badge ${c.status === "open" ? "warn" : "muted"}`}>{c.status}</span>
                <div>
                  {c.others.map((o: { _id: string; danceName: string | null }) => (
                    <span key={o._id}><Link href={`/catalogue/dances/${o._id}`}>{o.danceName ?? o._id}</Link>{o.danceName ? "" : " (gone)"} · </span>
                  ))}
                </div>
              </div>
              {c.status === "open" && <RecordAction label="Different dances" url={`/api/catalogue/duplicates/${encodeURIComponent(String(c._id))}`} body={{ action: "keep-apart" }} />}
            </li>
          ))}
        </ul>
      ) : <p className="muted">None.</p>}

      {t.undone.length > 0 && (
        <>
          <h2>Undone merges</h2>
          <ul className="plain">
            {t.undone.map((u) => (
              <li key={String(u._id)} className="muted">
                {u.merge?.doc?.danceName} was separated from <Link href={`/catalogue/dances/${u.merge?.into}`}>{u.merge?.into}</Link> · {u.by} · {when(u.at)}
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
