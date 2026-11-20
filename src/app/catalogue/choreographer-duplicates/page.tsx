"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Choreographer pairs the merge rules won't decide: an initial, one letter apart, or an extra name. Same person: keep
// one (the other's dances and spellings move to it, nothing is deleted). Different people: never shown again.

interface Person { _id: string; name: string; aliases: string[]; countries: string[]; dances: number; sample: string[] }
interface Pair { _id: string; kind: string; people: Person[] }
interface List { kinds: Record<string, number>; total: number; pageSize: number; pairs: Pair[] }

const KINDS: Record<string, string> = { initial: "An initial", typo: "One letter apart", "extra name": "An extra name" };
const button = (kind: "primary" | "plain" | "danger" = "plain"): React.CSSProperties => ({
  padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
  border: kind === "plain" ? "1px solid var(--border)" : "none",
  background: kind === "primary" ? "var(--accent)" : kind === "danger" ? "var(--danger-subtle)" : "var(--surface)",
  color: kind === "primary" ? "#fff" : kind === "danger" ? "var(--danger-text)" : "var(--text-secondary)",
});

function PairCard({ p, onDone }: { p: Pair; onDone: (message: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [a, b] = p.people;

  async function decide(body: Record<string, unknown>, message: string) {
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/catalogue/choreographer-duplicates", { method: "POST", body: JSON.stringify(body) });
      const data = await r.json();
      if (!r.ok) { setError(data.error ?? "Couldn't save."); return; }
      onDone(message);
    } catch {
      setError("Couldn't reach the server. Nothing was changed.");
    } finally {
      setBusy(false);
    }
  }

  const side = (c: Person, o: Person) => (
    <div style={{ border: "1px solid var(--border)", borderRadius: 8, padding: 10, background: "var(--surface-raised)", minWidth: 0, display: "grid", gap: 3, alignContent: "start" }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", overflowWrap: "anywhere" }}>{c.name}</div>
      <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{c.dances.toLocaleString()} dances{c.countries.length ? ` · ${c.countries.join(", ")}` : ""}</div>
      {c.aliases.length > 0 && <div style={{ fontSize: 12, color: "var(--text-tertiary)", overflowWrap: "anywhere" }}>also {c.aliases.join(" · ")}</div>}
      {c.sample.length > 0 && <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>e.g. {c.sample.join(", ")}</div>}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
        <button type="button" disabled={busy} style={button("primary")} onClick={() => decide({ action: "same", keepId: c._id, loseId: o._id }, `“${o.name}” merged into “${c.name}”.`)}>Same person: keep this</button>
        <Link href={`/catalogue?choreographerId=${encodeURIComponent(c._id)}&choreographerName=${encodeURIComponent(c.name)}`} target="_blank" style={{ fontSize: 12, color: "var(--text-tertiary)", alignSelf: "center" }}>Their dances ↗</Link>
      </div>
    </div>
  );

  if (!a || !b) return null;
  return (
    <section style={{ border: "1px solid var(--border)", borderRadius: 10, background: "var(--surface)", padding: 12, marginBottom: 10 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: ".03em", marginBottom: 6 }}>{KINDS[p.kind] ?? p.kind}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 8 }}>{side(a, b)}{side(b, a)}</div>
      {error && <p role="alert" style={{ color: "var(--danger)", fontSize: 13, margin: "8px 0 0" }}>{error}</p>}
      <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap", alignItems: "center" }}>
        <button type="button" disabled={busy} style={button("danger")} onClick={() => decide({ action: "different", a: a._id, b: b._id }, "Kept apart; they won't be shown again.")}>Different people</button>
        <button type="button" disabled={busy} style={button()} onClick={() => onDone("")}>Skip</button>
        <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>A merge keeps both names and moves the dances; the other record stays as a pointer.</span>
      </div>
    </section>
  );
}

export default function ChoreographerDuplicatesPage() {
  const [list, setList] = useState<List | null>(null);
  const [kind, setKind] = useState("");
  const [page, setPage] = useState(0);
  const [version, setVersion] = useState(0);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let stale = false;
    fetch(`/api/catalogue/choreographer-duplicates?${new URLSearchParams({ ...(kind ? { kind } : {}), page: String(page) })}`, { cache: "no-store" })
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

  const shown = list?.pairs.filter((p) => !skipped.includes(p._id)) ?? [];
  const pages = list ? Math.max(1, Math.ceil(list.total / list.pageSize)) : 1;
  const chip = (on: boolean): React.CSSProperties => ({ fontSize: 12, padding: "3px 10px", borderRadius: 14, cursor: "pointer", border: `1px solid ${on ? "transparent" : "var(--border)"}`, background: on ? "var(--accent-subtle)" : "var(--surface)", color: on ? "var(--accent-text)" : "var(--text-secondary)" });

  return (
    <div className="page-pad" style={{ maxWidth: 1000 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 4 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>Duplicate choreographers</h1>
        <span style={{ fontSize: 13, color: "var(--text-tertiary)" }}>Names that might be one person. Busiest first; never two people credited on the same dance.</span>
        <Link href="/catalogue" style={{ marginLeft: "auto", fontSize: 13, color: "var(--accent-text)" }}>← Catalogue</Link>
      </div>
      {list && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "12px 0 16px" }}>
          <button type="button" style={chip(!kind)} onClick={() => { setKind(""); setPage(0); }}>All ({Object.values(list.kinds).reduce((s, n) => s + n, 0).toLocaleString()})</button>
          {Object.entries(list.kinds).map(([k, n]) => <button key={k} type="button" style={chip(kind === k)} onClick={() => { setKind(k); setPage(0); }}>{KINDS[k] ?? k} ({n.toLocaleString()})</button>)}
        </div>
      )}
      {note && <p role="status" style={{ fontSize: 13, color: "var(--success-text)", margin: "0 0 12px" }}>{note}</p>}
      {error && <p role="alert" style={{ color: "var(--danger)", fontSize: 13 }}>{error}</p>}
      {!list && !error && <p style={{ fontSize: 13, color: "var(--text-tertiary)" }}>Working out the pairs… (a few seconds the first time)</p>}
      {list && !shown.length && <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>{list.total ? "Nothing left on this page." : "No pairs to review."}</p>}
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
