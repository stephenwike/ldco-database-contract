"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Pairs of tracks sharing a MusicBrainz recording but spelled differently. Same song: merge them. Different songs: keep
// them apart. Wrong recording: one track loses the recording that wrongly tied them (it can be matched again later).

interface Track {
  _id: string; title: string; artist: string; danceCount?: number; recordingId?: string | null; matchStatus?: string;
  recording: { _id: string; title: string; artist?: string; version?: string; length?: number } | null;
  dances: { _id: string; danceName: string }[];
  links: { _id: string; provider: string; url: string; matchedBy: string }[];
}
interface Pair { _id: string; reason: string; tracks: Track[] }
interface List { total: number; pageSize: number; candidates: Pair[] }

const button = (kind: "primary" | "plain" | "danger" = "plain"): React.CSSProperties => ({
  padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
  border: kind === "plain" ? "1px solid var(--border)" : "none",
  background: kind === "primary" ? "var(--accent)" : kind === "danger" ? "var(--danger-subtle)" : "var(--surface)",
  color: kind === "primary" ? "#fff" : kind === "danger" ? "var(--danger-text)" : "var(--text-secondary)",
});
const minutes = (ms?: number) => (ms ? `${Math.floor(ms / 60000)}:${String(Math.round((ms % 60000) / 1000)).padStart(2, "0")}` : null);

function PairCard({ p, onDone }: { p: Pair; onDone: (message: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [a, b] = p.tracks;
  const differs = (x?: string, y?: string) => ((x ?? "").toLowerCase() !== (y ?? "").toLowerCase() ? { background: "var(--warning-subtle)", borderRadius: 3, padding: "0 2px" } : undefined);

  async function decide(body: Record<string, unknown>, message: string) {
    setBusy(true);
    setError("");
    try {
      const r = await fetch(`/api/catalogue/track-duplicates/${encodeURIComponent(p._id)}`, { method: "POST", body: JSON.stringify(body) });
      const data = await r.json();
      if (!r.ok) { setError(data.error ?? "Couldn't save."); return; }
      onDone(message);
    } catch {
      setError("Couldn't reach the server. Nothing was changed.");
    } finally {
      setBusy(false);
    }
  }

  if (!a || !b) return null;
  const side = (t: Track, o: Track) => (
    <div style={{ border: "1px solid var(--border)", borderRadius: 8, padding: 10, background: "var(--surface-raised)", minWidth: 0, display: "grid", gap: 3, alignContent: "start" }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", overflowWrap: "anywhere" }}><span style={differs(t.title, o.title)}>{t.title}</span></div>
      <div style={{ fontSize: 13, color: "var(--text-secondary)" }}><span style={differs(t.artist, o.artist)}>{t.artist}</span></div>
      <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{(t.danceCount ?? 0).toLocaleString()} dances{t.dances.length ? `: ${t.dances.map((d) => d.danceName).join(", ")}` : ""}</div>
      {t.recording && (
        <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
          Recording: {t.recording.title}{t.recording.artist ? ` – ${t.recording.artist}` : ""}{t.recording.version && t.recording.version !== "plain" ? ` (${t.recording.version})` : ""}{minutes(t.recording.length) ? ` · ${minutes(t.recording.length)}` : ""}{" "}
          <a href={`https://musicbrainz.org/recording/${String(t.recordingId).replace("musicbrainz:", "")}`} target="_blank" rel="noreferrer" style={{ color: "var(--accent-text)" }}>MusicBrainz ↗</a>
        </div>
      )}
      {t.links.length > 0 && <div style={{ fontSize: 12, display: "flex", flexWrap: "wrap", gap: 6 }}>{t.links.map((l) => <a key={l._id} href={l.url} target="_blank" rel="noreferrer" style={{ color: "var(--accent-text)" }}>{l.provider} ↗</a>)}</div>}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
        <button type="button" disabled={busy} style={button("primary")} onClick={() => decide({ action: "same", keepId: t._id }, `Merged into “${t.title} – ${t.artist}”.`)}>Same song: keep this</button>
        {t.recordingId && <button type="button" disabled={busy} style={button("danger")} title="This track isn't that recording; remove the match" onClick={() => decide({ action: "wrong-recording", trackId: t._id }, `Removed the recording from “${t.title} – ${t.artist}”.`)}>Wrong recording here</button>}
      </div>
    </div>
  );

  return (
    <section style={{ border: "1px solid var(--border)", borderRadius: 10, background: "var(--surface)", padding: 12, marginBottom: 10 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 8 }}>{side(a, b)}{side(b, a)}</div>
      {error && <p role="alert" style={{ color: "var(--danger)", fontSize: 13, margin: "8px 0 0" }}>{error}</p>}
      <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap", alignItems: "center" }}>
        <button type="button" disabled={busy} style={button("danger")} onClick={() => decide({ action: "different" }, "Kept apart; they won't be suggested again.")}>Different songs</button>
        <button type="button" disabled={busy} style={button()} onClick={() => onDone("")}>Skip</button>
        <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>Merges and removed recordings are kept, so they can be undone.</span>
      </div>
    </section>
  );
}

export default function TrackDuplicatesPage() {
  const [list, setList] = useState<List | null>(null);
  const [page, setPage] = useState(0);
  const [version, setVersion] = useState(0);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let stale = false;
    fetch(`/api/catalogue/track-duplicates?page=${page}`, { cache: "no-store" })
      .then(async (r) => ({ ok: r.ok, data: await r.json() }))
      .then(({ ok, data }) => {
        if (stale) return;
        if (!ok) { setError(data.error ?? "Couldn't load."); return; }
        setError("");
        setList(data);
      })
      .catch(() => { if (!stale) setError("Couldn't reach the server."); });
    return () => { stale = true; };
  }, [page, version]);

  const shown = list?.candidates.filter((c) => !skipped.includes(c._id)) ?? [];
  const pages = list ? Math.max(1, Math.ceil(list.total / list.pageSize)) : 1;

  return (
    <div className="page-pad" style={{ maxWidth: 1000 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 4 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>Duplicate tracks</h1>
        <span style={{ fontSize: 13, color: "var(--text-tertiary)" }}>
          {list ? `${list.total.toLocaleString()} pairs share a recording but are spelled differently. ` : ""}Differences are highlighted.
        </span>
        <Link href="/catalogue" style={{ marginLeft: "auto", fontSize: 13, color: "var(--accent-text)" }}>← Catalogue</Link>
      </div>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "8px 0 16px" }}>
        Same song spelled two ways: keep one. Two different songs that matched one recording: mark the wrong side “Wrong recording”. Two songs that rightly share nothing: “Different songs”.
      </p>
      {note && <p role="status" style={{ fontSize: 13, color: "var(--success-text)", margin: "0 0 12px" }}>{note}</p>}
      {error && <p role="alert" style={{ color: "var(--danger)", fontSize: 13 }}>{error}</p>}
      {!list && !error && <p style={{ fontSize: 13, color: "var(--text-tertiary)" }}>Loading…</p>}
      {list && !shown.length && <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>{list.total ? "Nothing left on this page." : "No open pairs."}</p>}
      {shown.map((p) => <PairCard key={p._id} p={p} onDone={(message) => { if (message) { setNote(message); setVersion((v) => v + 1); } else setSkipped((s) => [...s, p._id]); }} />)}
      {list && list.total > list.pageSize && (
        <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12, color: "var(--text-tertiary)" }}>
          <button type="button" style={button()} disabled={page === 0} onClick={() => { setPage(page - 1); setSkipped([]); }}>Previous</button>
          Page {page + 1} of {pages.toLocaleString()}
          <button type="button" style={button()} disabled={page + 1 >= pages} onClick={() => { setPage(page + 1); setSkipped([]); }}>Next</button>
        </div>
      )}
    </div>
  );
}
