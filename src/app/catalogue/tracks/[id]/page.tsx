import Link from "next/link";
import { getLinedanceDb } from "@/server/write";
import { traceTrack } from "@/server/catalogue/trace";
import RecordAction from "@/components/RecordAction";
import MergeBox from "@/components/MergeBox";

// One track in the linedance catalogue: its recording, links, spellings, dances, merges and possible duplicates
// (decision 29; from the data desk).

export const dynamic = "force-dynamic";

const when = (d?: Date | string | null) => (d ? new Date(d).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "");

export default async function TrackRecordPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await traceTrack(await getLinedanceDb(), id);
  if (!t) {
    return (
      <>
        <h1>Not found</h1>
        <p className="lede">No track has the id <code>{id}</code>.</p>
      </>
    );
  }
  const k = t.track;
  const own = t.mergedLog.find((m) => m._id === id);
  return (
    <>
      <h1>{k.title} – {k.artist}</h1>
      <p className="lede"><code>{k._id}</code> · {t.danceCount.toLocaleString()} dances · {k.matchStatus ?? "no match status"}</p>
      {k.mergedInto && (
        <div className="panel record-row">
          <div>
            Merged into <Link href={`/catalogue/tracks/${k.mergedInto}`}>{t.others[k.mergedInto] ?? k.mergedInto}</Link>
            <div className="desc">{own?.reason ?? ""} · {own?.by ?? "automatic"} · {when(own?.at)}</div>
          </div>
          {own && <RecordAction label="Undo" url="/api/catalogue/merges" body={{ kind: "tracks", id }} confirm="Separate this track again?" />}
        </div>
      )}
      <div className="panel">
        <dl className="facts">
          <dt>Recording</dt>
          <dd>
            {t.recording ? (
              <>
                {t.recording.title} – {t.recording.artist}{" "}
                <span className="muted">
                  {[t.recording.version, t.recording.year, t.recording.disambiguation].filter(Boolean).join(" · ")} · {k.recordingConfidence} ·{" "}
                  <a href={`https://musicbrainz.org/recording/${t.recording.sourceId}`} target="_blank" rel="noreferrer">MusicBrainz ↗</a>
                </span>
              </>
            ) : <span className="muted">none</span>}
          </dd>
          <dt>Song match</dt><dd>{k.songMatch ?? <span className="muted">—</span>}</dd>
          <dt>Versions</dt><dd>{(k.versions ?? []).join(", ") || <span className="muted">—</span>}</dd>
          <dt>Spellings that lead here</dt><dd>{t.aliases.map((a) => String(a._id)).join(" · ") || <span className="muted">—</span>}</dd>
          <dt>Links</dt>
          <dd>
            {t.links.length
              ? t.links.map((l) => (
                  <div key={String(l._id)}><a href={l.url} target="_blank" rel="noreferrer">{l.provider} ↗</a> <span className="muted">{l.matchedBy} · {l.confidence}{l.movedFrom ? ` · moved from ${l.movedFrom}` : ""}</span></div>
                ))
              : <span className="muted">none</span>}
          </dd>
          {t.rejection && (
            <>
              <dt>Recordings found wrong</dt>
              <dd>
                {(t.rejection.recordingIds ?? []).join(", ")}{" "}
                {(t.rejection.recordingIds ?? []).length > 0 && <RecordAction label="Undo the latest" url="/api/catalogue/merges" body={{ kind: "recordings", id }} />}
              </dd>
            </>
          )}
        </dl>
      </div>

      {t.mergedIn.length > 0 && (
        <>
          <h2>Merged into this track</h2>
          <ul className="plain">
            {t.mergedIn.map((m) => {
              const log = t.mergedLog.find((x) => x._id === m._id);
              return (
                <li key={String(m._id)} className="panel record-row">
                  <div>
                    <Link href={`/catalogue/tracks/${m._id}`}>{m.title} – {m.artist}</Link> <span className="desc">{log?.reason ?? ""} · {log?.by ?? "automatic"} · {when(log?.at)}</span>
                  </div>
                  {log && <RecordAction label="Undo" url="/api/catalogue/merges" body={{ kind: "tracks", id: String(m._id) }} confirm={`Separate “${m.title}” again?`} />}
                </li>
              );
            })}
          </ul>
        </>
      )}

      {t.candidates.length > 0 && (
        <>
          <h2>Possible duplicates</h2>
          <ul className="plain">
            {t.candidates.map((c) => {
              const other = c.trackIds.find((x: string) => x !== id);
              return (
                <li key={String(c._id)} className="panel record-row">
                  <div>
                    {c.reason} <span className={`badge ${c.status === "open" ? "warn" : "muted"}`}>{c.status}</span> · <Link href={`/catalogue/tracks/${other}`}>{t.others[other] ?? other}</Link>
                  </div>
                  {c.status === "open" && <RecordAction label="Different songs" url={`/api/catalogue/track-duplicates/${encodeURIComponent(String(c._id))}`} body={{ action: "different" }} />}
                </li>
              );
            })}
          </ul>
        </>
      )}

      {!k.mergedInto && (
        <>
          <h2>Merge with another track</h2>
          <div className="panel">
            <MergeBox kind="tracks" id={id} name={`${k.title} – ${k.artist}`} />
          </div>
        </>
      )}

      <h2>Dances{t.danceCount > t.dances.length ? ` (first ${t.dances.length})` : ""}</h2>
      <ul className="plain">
        {t.dances.map((d) => <li key={String(d._id)}><Link href={`/catalogue/dances/${d._id}`}>{d.danceName}</Link></li>)}
      </ul>
    </>
  );
}
