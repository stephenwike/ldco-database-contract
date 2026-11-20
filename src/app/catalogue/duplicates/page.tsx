"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Possible duplicate dances in the linedance catalogue, one group at a time: merge the ones that are the same dance into
// one record (losslessly: the others are saved in dance_merges), or mark them different so they're never suggested again.

interface Stepsheet { url: string; lang: string | null }
interface Dance {
  _id: string; danceName: string; count: number | null; wall: number | null; levels: string[]; levelQualifier: string | null; danceType: string;
  choreographers: string[]; songArtists: { song: string; artist: string }[]; choreographedIn: string | null; published: string | null;
  publishedSource: string | null; publishedBy?: string | null; stepsheets: Stepsheet[]; unpublished?: boolean; credit: string | null; editedFields?: string[];
}
interface Candidate { _id: string; reason: string; missing: string[]; suggestedKeep: string | null; dances: Dance[] }
interface List { reasons: { reason: string; n: number }[]; total: number; pageSize: number; candidates: Candidate[] }

/** What each reason means, in plain words. */
const REASONS: Record<string, string> = {
  "same-title-and-credit": "Same name and the same credit, but something else differs",
  "translation-song-differs-or-unknown": "A translation whose song differs from, or is missing on, the original",
  "same-name-and-song-several": "Same name and song, several possible dances",
  "same-name-one": "Same name, one possible dance",
  "same-name-several": "Same name, several possible dances",
  "same-name-and-song-different-choreographer": "Same name and song, different choreographer",
  "translation-several-originals": "A translation with several possible originals",
  "translation-same-language": "Two stepsheets in the same language",
  "same-name-and-choreographer-song-differs": "Same name and choreographer, different song",
  "both-ldco-dances-match-one-staged-dance": "Two catalogue records match one stepsheet",
  "same-name-and-choreographer-several": "Same name and choreographer, several possible dances",
  "same-name-and-choreographer-song-differs-feed": "Same name and choreographer, different song (from the feed)",
};
const reasonText = (r: string) => REASONS[r] ?? r.replace(/-/g, " ");

const button = (kind: "primary" | "plain" | "danger" = "plain"): React.CSSProperties => ({
  padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
  border: kind === "plain" ? "1px solid var(--border)" : "none",
  background: kind === "primary" ? "var(--accent)" : kind === "danger" ? "var(--danger-subtle)" : "var(--surface)",
  color: kind === "primary" ? "#fff" : kind === "danger" ? "var(--danger-text)" : "var(--text-secondary)",
});
const facts = (d: Dance) => [
  d.levels?.length ? `${d.levelQualifier ? `${d.levelQualifier} ` : ""}${d.levels.join(" / ")}` : null,
  d.count != null ? `${d.count} count` : null, d.wall != null ? `${d.wall} wall` : null, d.danceType !== "line" ? d.danceType : null,
].filter(Boolean).join(" · ") || "no level, count or wall";
const song = (d: Dance) => (d.songArtists?.[0] ? `${d.songArtists[0].song} – ${d.songArtists[0].artist}` : "no song");
const when = (d: Dance) => d.choreographedIn ? `choreographed ${d.choreographedIn}` : d.published ? `published ${d.published}` : d.publishedBy ? `on copperknob by ${d.publishedBy}` : "undated";
const sheet = (s: Stepsheet) => s.url.split("/stepsheets/")[1]?.split("/")[0] ?? s.url;

function CandidateCard({ c, onDone }: { c: Candidate; onDone: (message: string) => void }) {
  const [keep, setKeep] = useState(c.suggestedKeep ?? c.dances[0]?._id ?? "");
  const [merge, setMerge] = useState<string[]>(c.dances.map((d) => d._id).filter((id) => id !== (c.suggestedKeep ?? c.dances[0]?._id)));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const kept = c.dances.find((d) => d._id === keep);
  const differs = (a: string, b?: string) => (b !== undefined && a !== b ? { background: "var(--warning-subtle)", borderRadius: 3, padding: "0 2px" } : undefined);

  async function decide(body: Record<string, unknown>, message: string) {
    setBusy(true);
    setError("");
    try {
      const r = await fetch(`/api/catalogue/duplicates/${encodeURIComponent(c._id)}`, { method: "POST", body: JSON.stringify(body) });
      const data = await r.json();
      if (!r.ok) { setError(data.error ?? "Couldn't save."); return; }
      onDone(message);
    } catch {
      setError("Couldn't reach the server. Nothing was changed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section style={{ border: "1px solid var(--border)", borderRadius: 10, background: "var(--surface)", padding: 14, marginBottom: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>{reasonText(c.reason)}{c.missing.length ? ` · ${c.missing.length} already gone` : ""}</div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(${c.dances.length > 2 ? 190 : 260}px, 1fr))`, gap: 8 }}>
        {c.dances.map((d) => {
          const isKeep = d._id === keep;
          const on = isKeep || merge.includes(d._id);
          return (
            <div key={d._id} style={{ border: `1px solid ${isKeep ? "var(--accent)" : "var(--border)"}`, borderRadius: 8, padding: 10, background: isKeep ? "var(--accent-subtle)" : "var(--surface-raised)", opacity: on ? 1 : 0.6, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", overflowWrap: "anywhere" }}><span style={differs(d.danceName, kept?.danceName)}>{d.danceName}</span></div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 3 }}><span style={differs(facts(d), kept && facts(kept))}>{facts(d)}</span></div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)" }}><span style={differs(d.choreographers.join(" & "), kept?.choreographers.join(" & "))}>{d.choreographers.join(" & ") || d.credit || "no choreographer"}</span></div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)" }}><span style={differs(song(d), kept && song(kept))}>{song(d)}</span></div>
              <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{when(d)}{d.unpublished ? " · unpublished" : ""}{d.editedFields?.length ? " · fixed by hand" : ""}</div>
              <div style={{ fontSize: 12, marginTop: 4, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {d.stepsheets.map((s) => <a key={s.url} href={s.url} target="_blank" rel="noreferrer" style={{ color: "var(--accent-text)" }}>{sheet(s)}{s.lang ? ` (${s.lang})` : ""} ↗</a>)}
                <Link href={`/catalogue?q=${encodeURIComponent(d.danceName)}`} target="_blank" style={{ color: "var(--text-tertiary)" }}>Catalogue ↗</Link>
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 8, fontSize: 12, color: "var(--text-primary)" }}>
                <label style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  <input type="radio" name={`keep-${c._id}`} checked={isKeep} onChange={() => { setKeep(d._id); setMerge((m) => [...new Set([...m.filter((x) => x !== d._id), keep])]); }} /> Keep this record
                </label>
                {!isKeep && (
                  <label style={{ display: "flex", gap: 4, alignItems: "center" }}>
                    <input type="checkbox" checked={merge.includes(d._id)} onChange={(e) => setMerge((m) => (e.target.checked ? [...m, d._id] : m.filter((x) => x !== d._id)))} /> Same dance
                  </label>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {error && <p role="alert" style={{ color: "var(--danger)", fontSize: 13, margin: "8px 0 0" }}>{error}</p>}
      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap", alignItems: "center" }}>
        <button type="button" disabled={busy || !merge.length} style={{ ...button("primary"), opacity: busy || !merge.length ? 0.6 : 1 }}
          onClick={() => decide({ action: "merge", keepId: keep, mergeIds: merge }, `Merged ${merge.length} into “${kept?.danceName}”.`)}>
          {merge.length ? `Same dance: merge ${merge.length} into the kept record` : "Tick “Same dance” to merge"}
        </button>
        <button type="button" disabled={busy} style={button("danger")} onClick={() => decide({ action: "keep-apart" }, "Kept apart; they won't be suggested again.")}>Different dances</button>
        <button type="button" disabled={busy} style={button()} onClick={() => onDone("")}>Skip</button>
        <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>A merge keeps every stepsheet and saves the merged records, so it can be undone.</span>
      </div>
    </section>
  );
}

export default function DanceDuplicatesPage() {
  const [list, setList] = useState<List | null>(null);
  const [reason, setReason] = useState("");
  const [page, setPage] = useState(0);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const [version, setVersion] = useState(0);
  const load = () => setVersion((v) => v + 1);
  useEffect(() => {
    // An answer that arrives after the filter or page changed again is ignored
    let stale = false;
    fetch(`/api/catalogue/duplicates?${new URLSearchParams({ ...(reason ? { reason } : {}), page: String(page) })}`, { cache: "no-store" })
      .then(async (r) => ({ ok: r.ok, data: await r.json() }))
      .then(({ ok, data }) => {
        if (stale) return;
        if (!ok) { setError(data.error ?? "Couldn't load."); return; }
        setError("");
        setList(data);
      })
      .catch(() => { if (!stale) setError("Couldn't reach the server."); });
    return () => { stale = true; };
  }, [reason, page, version]);

  const shown = list?.candidates.filter((c) => !skipped.includes(c._id)) ?? [];
  const pages = list ? Math.max(1, Math.ceil(list.total / list.pageSize)) : 1;
  const chip = (on: boolean): React.CSSProperties => ({ fontSize: 12, padding: "3px 10px", borderRadius: 14, cursor: "pointer", border: `1px solid ${on ? "transparent" : "var(--border)"}`, background: on ? "var(--accent-subtle)" : "var(--surface)", color: on ? "var(--accent-text)" : "var(--text-secondary)" });

  return (
    <div className="page-pad" style={{ maxWidth: 1100 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 4 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>Duplicate dances</h1>
        <span style={{ fontSize: 13, color: "var(--text-tertiary)" }}>Records that might be one dance. Differences from the kept record are highlighted.</span>
        <Link href="/catalogue" style={{ marginLeft: "auto", fontSize: 13, color: "var(--accent-text)" }}>← Catalogue</Link>
      </div>
      {list && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "12px 0 16px" }}>
          <button type="button" style={chip(!reason)} onClick={() => { setReason(""); setPage(0); }}>All ({list.reasons.reduce((a, r) => a + r.n, 0).toLocaleString()})</button>
          {list.reasons.map((r) => <button key={r.reason} type="button" style={chip(reason === r.reason)} onClick={() => { setReason(r.reason); setPage(0); }} title={r.reason}>{reasonText(r.reason)} ({r.n.toLocaleString()})</button>)}
        </div>
      )}
      {note && <p role="status" style={{ fontSize: 13, color: "var(--success-text)", margin: "0 0 12px" }}>{note}</p>}
      {error && <p role="alert" style={{ color: "var(--danger)", fontSize: 13 }}>{error}</p>}
      {!list && !error && <p style={{ fontSize: 13, color: "var(--text-tertiary)" }}>Loading…</p>}
      {list && !shown.length && <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>{list.total ? "Nothing left on this page." : "No open duplicates here."}</p>}
      {shown.map((c) => <CandidateCard key={c._id} c={c} onDone={(message) => { if (message) { setNote(message); load(); } else setSkipped((s) => [...s, c._id]); }} />)}
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
