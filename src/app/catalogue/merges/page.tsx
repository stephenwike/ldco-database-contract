"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Every merge in the linedance catalogue kept what it replaced; this lists them, newest first, and undoes one.

interface Item { id: string; removed: string; removedSheets?: string[]; into: string | null; kept: string | null; why: string; by: string; at: string | null; exact: boolean; split?: boolean }
interface List { total: number; items: Item[] }

const KINDS: { id: string; label: string; what: string }[] = [
  { id: "dances", label: "Dances", what: "A record merged into another dance. Undo brings it back and takes back what the kept dance gained." },
  { id: "tracks", label: "Tracks", what: "A track merged into another. Undo separates them; the pair won't be merged again." },
  { id: "recordings", label: "Recordings", what: "A recording removed from a track on review. Undo gives it, and its links, back." },
  { id: "choreographers", label: "Choreographers", what: "A name merged into another person, or a two-person credit split. Undo separates them again." },
];
const button: React.CSSProperties = { padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text-secondary)" };
const when = (at: string | null) => (at ? new Date(at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "");

export default function MergesPage() {
  const [kind, setKind] = useState("dances");
  const [page, setPage] = useState(0);
  const [version, setVersion] = useState(0);
  const [list, setList] = useState<List | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [result, setResult] = useState<{ ok: boolean; text: string; notes: string[] } | null>(null);

  useEffect(() => {
    let stale = false;
    fetch(`/api/catalogue/merges?kind=${kind}&page=${page}`, { cache: "no-store" })
      .then(async (r) => ({ ok: r.ok, data: await r.json() }))
      .then(({ ok, data }) => {
        if (stale) return;
        if (!ok) { setError(data.error ?? "Couldn't load."); return; }
        setError("");
        setList(data);
      })
      .catch(() => { if (!stale) setError("Couldn't reach the server."); });
    return () => { stale = true; };
  }, [kind, page, version]);

  async function undo(item: Item) {
    if (!window.confirm(`Undo: separate “${item.removed}” from “${item.kept ?? "?"}”?`)) return;
    setBusy(item.id);
    setResult(null);
    try {
      const r = await fetch("/api/catalogue/merges", { method: "POST", body: JSON.stringify({ kind, id: item.id }) });
      const data = await r.json();
      setResult(r.ok ? { ok: true, text: `Undone: “${item.removed}” is separate again.`, notes: data.notes ?? [] } : { ok: false, text: data.error ?? "Couldn't undo.", notes: [] });
      if (r.ok) setVersion((v) => v + 1);
    } catch {
      setResult({ ok: false, text: "Couldn't reach the server. Nothing was changed.", notes: [] });
    } finally {
      setBusy("");
    }
  }

  const pages = list ? Math.max(1, Math.ceil(list.total / 30)) : 1;
  const current = KINDS.find((k) => k.id === kind)!;
  const chip = (on: boolean): React.CSSProperties => ({ fontSize: 13, padding: "5px 12px", cursor: "pointer", border: "none", background: on ? "var(--accent-subtle)" : "var(--surface)", color: on ? "var(--accent-text)" : "var(--text-secondary)", fontWeight: on ? 600 : 400 });

  return (
    <div className="page-pad" style={{ maxWidth: 1000 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 4 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>Merge history</h1>
        <span style={{ fontSize: 13, color: "var(--text-tertiary)" }}>Every merge kept what it replaced, so any of them can be undone.</span>
        <Link href="/catalogue" style={{ marginLeft: "auto", fontSize: 13, color: "var(--accent-text)" }}>← Catalogue</Link>
      </div>
      <div role="tablist" aria-label="Kind of merge" style={{ display: "inline-flex", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", margin: "12px 0 6px" }}>
        {KINDS.map((k) => <button key={k.id} type="button" role="tab" aria-selected={kind === k.id} style={chip(kind === k.id)} onClick={() => { setKind(k.id); setPage(0); setResult(null); }}>{k.label}</button>)}
      </div>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "4px 0 14px" }}>{current.what}</p>

      {result && (
        <div role="status" style={{ border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", marginBottom: 12, background: result.ok ? "var(--success-subtle)" : "var(--danger-subtle)", color: result.ok ? "var(--success-text)" : "var(--danger-text)", fontSize: 13 }}>
          {result.text}
          {result.notes.length > 0 && <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>{result.notes.map((n) => <li key={n}>{n}</li>)}</ul>}
        </div>
      )}
      {error && <p role="alert" style={{ color: "var(--danger)", fontSize: 13 }}>{error}</p>}
      {!list && !error && <p style={{ fontSize: 13, color: "var(--text-tertiary)" }}>Loading…</p>}
      {list && <p style={{ fontSize: 12, color: "var(--text-tertiary)", margin: "0 0 8px" }}>{list.total.toLocaleString()} on record</p>}
      {list && !list.items.length && <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Nothing to undo here.</p>}

      <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 6 }}>
        {list?.items.map((item) => (
          <li key={item.id} style={{ border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", background: "var(--surface)", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 240 }}>
              <div style={{ fontSize: 14, color: "var(--text-primary)", overflowWrap: "anywhere" }}>
                <b>{item.removed}</b> <span style={{ color: "var(--text-tertiary)" }}>{item.split ? "split into" : kind === "recordings" ? "removed from" : "→"}</span> {item.kept ?? <span style={{ color: "var(--text-tertiary)" }}>(gone)</span>}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                {item.why}{item.by ? ` · ${item.by}` : ""}{item.at ? ` · ${when(item.at)}` : ""}
                {!item.exact && <span title="Made before merges recorded every detail; the undo says what it can't restore"> · older record</span>}
              </div>
              {item.removedSheets?.length ? <div style={{ fontSize: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>{item.removedSheets.map((u) => <a key={u} href={u} target="_blank" rel="noreferrer" style={{ color: "var(--accent-text)" }}>{u.split("/stepsheets/")[1]?.split("/")[0] ?? u} ↗</a>)}</div> : null}
            </div>
            <button type="button" style={{ ...button, opacity: busy ? 0.6 : 1 }} disabled={!!busy} onClick={() => undo(item)}>{busy === item.id ? "Undoing…" : "Undo"}</button>
          </li>
        ))}
      </ol>
      {list && list.total > 30 && (
        <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12, color: "var(--text-tertiary)", marginTop: 12 }}>
          <button type="button" style={button} disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
          Page {page + 1} of {pages.toLocaleString()}
          <button type="button" style={button} disabled={page + 1 >= pages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}
