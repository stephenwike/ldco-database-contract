"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

// Sample audit of the linedance catalogue: a random dance next to its stepsheet, each field marked right, wrong or
// "can't tell". Enough marks give each field a measured accuracy, with a 95% range.

type Verdict = "right" | "wrong" | "unsure";
interface FieldStats { id: string; label: string; right: number; wrong: number; unsure: number; accuracy: number | null; low: number | null; high: number | null }
interface Stats { audited: number; fields: FieldStats[] }
interface Next { dance: { _id: string; danceName: string; stepsheets: { url: string; lang: string | null }[] }; values: Record<string, string> }

const FIELD_LABELS: Record<string, string> = { danceName: "Name", count: "Count", wall: "Wall", level: "Level", choreographers: "Choreographers", song: "Song", choreographedIn: "Choreographed date" };
const VERDICT_LABELS: Record<Verdict, string> = { right: "Right", wrong: "Wrong", unsure: "Can't tell" };
const pct = (x: number | null) => (x == null ? "–" : `${(x * 100).toFixed(x > 0.995 && x < 1 ? 1 : 0)}%`);

const button = (primary = false): React.CSSProperties => ({
  padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
  border: primary ? "none" : "1px solid var(--border)",
  background: primary ? "var(--accent)" : "var(--surface)",
  color: primary ? "#fff" : "var(--text-secondary)",
});
const verdictStyle = (v: Verdict, on: boolean): React.CSSProperties => ({
  padding: "4px 10px", borderRadius: 14, fontSize: 12, cursor: "pointer",
  border: `1px solid ${on ? "transparent" : "var(--border)"}`,
  background: on ? (v === "right" ? "var(--success-subtle)" : v === "wrong" ? "var(--danger-subtle)" : "var(--surface-raised)") : "var(--surface)",
  color: on ? (v === "right" ? "var(--success-text)" : v === "wrong" ? "var(--danger-text)" : "var(--text-primary)") : "var(--text-secondary)",
  fontWeight: on ? 600 : 400,
});

export default function AuditPage() {
  const [next, setNext] = useState<Next | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [done, setDone] = useState(false);
  const [results, setResults] = useState<Record<string, Verdict>>({});
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/catalogue/audit", { cache: "no-store" });
      const data = await r.json();
      if (!r.ok) { setError(data.error ?? "Couldn't load a dance."); return; }
      setNext(data.next);
      setStats(data.stats);
      setDone(!data.next);
      setResults({});
      setNote("");
    } catch {
      setError("Couldn't reach the server.");
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function save() {
    if (!next) return;
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/catalogue/audit", { method: "POST", body: JSON.stringify({ danceId: next.dance._id, results, note }) });
      const data = await r.json();
      if (!r.ok) { setError(data.error ?? "Couldn't save."); setBusy(false); return; }
      await load();
    } catch {
      setError("Couldn't reach the server. Nothing was saved.");
      setBusy(false);
    }
  }

  const sheet = next?.dance.stepsheets.find((s) => !s.lang) ?? next?.dance.stepsheets[0];
  const marked = Object.keys(results).length;
  const cell: React.CSSProperties = { padding: "6px 10px", borderBottom: "1px solid var(--border)", fontSize: 13, textAlign: "right" };

  return (
    <div className="page-pad" style={{ maxWidth: 900 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 4 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>Audit</h1>
        <span style={{ fontSize: 13, color: "var(--text-tertiary)" }}>Check a random dance against its stepsheet. Each mark makes the accuracy figures below more certain.</span>
        <Link href="/catalogue" style={{ marginLeft: "auto", fontSize: 13, color: "var(--accent-text)" }}>← Catalogue</Link>
      </div>

      {stats && (
        <section style={{ margin: "16px 0 24px", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
            <caption style={{ textAlign: "left", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>
              {stats.audited} {stats.audited === 1 ? "dance" : "dances"} audited. Accuracy counts right and wrong marks; the range is where the true figure lies, 95% of the time.
            </caption>
            <thead>
              <tr>{["Field", "Right", "Wrong", "Can't tell", "Accuracy", "95% range"].map((h, i) => <th key={h} style={{ ...cell, textAlign: i ? "right" : "left", fontSize: 12, color: "var(--text-tertiary)", fontWeight: 600 }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {stats.fields.map((f) => (
                <tr key={f.id}>
                  <td style={{ ...cell, textAlign: "left", color: "var(--text-primary)" }}>{f.label}</td>
                  <td style={cell}>{f.right}</td>
                  <td style={cell}>{f.wrong}</td>
                  <td style={cell}>{f.unsure}</td>
                  <td style={{ ...cell, fontWeight: 600, color: "var(--text-primary)" }}>{pct(f.accuracy)}</td>
                  <td style={{ ...cell, color: "var(--text-tertiary)" }}>{f.low == null ? "–" : `${pct(f.low)} – ${pct(f.high)}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {error && <p role="alert" style={{ color: "var(--danger)", fontSize: 13, margin: "12px 0" }}>{error}</p>}
      {done && <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>You’ve audited every dance with a stepsheet.</p>}
      {!next && !done && !error && <p style={{ fontSize: 13, color: "var(--text-tertiary)" }}>Picking a dance…</p>}

      {next && (
        <section style={{ border: "1px solid var(--border)", borderRadius: 10, background: "var(--surface)", padding: 16 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 12, marginBottom: 12 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)" }}>{next.dance.danceName}</h2>
            {sheet && <a href={sheet.url} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: "var(--accent-text)" }}>Open the stepsheet ↗</a>}
            <Link href={`/catalogue?q=${encodeURIComponent(next.dance.danceName)}`} target="_blank" style={{ fontSize: 13, color: "var(--text-tertiary)" }}>Fix it in the Catalogue ↗</Link>
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {Object.entries(next.values).map(([field, value]) => (
              <div key={field} style={{ display: "grid", gridTemplateColumns: "minmax(110px, 160px) 1fr auto", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>{FIELD_LABELS[field] ?? field}</span>
                <span style={{ fontSize: 14, color: value === "missing" || value === "not stated" ? "var(--text-tertiary)" : "var(--text-primary)", fontStyle: value === "missing" || value === "not stated" ? "italic" : "normal", minWidth: 0, overflowWrap: "anywhere" }}>{value}</span>
                <span style={{ display: "flex", gap: 4, flexWrap: "wrap" }} role="group" aria-label={`${FIELD_LABELS[field] ?? field}: is it right?`}>
                  {(["right", "wrong", "unsure"] as Verdict[]).map((v) => (
                    <button key={v} type="button" aria-pressed={results[field] === v} onClick={() => setResults((r) => (r[field] === v ? Object.fromEntries(Object.entries(r).filter(([k]) => k !== field)) : { ...r, [field]: v }))} style={verdictStyle(v, results[field] === v)}>{VERDICT_LABELS[v]}</button>
                  ))}
                </span>
              </div>
            ))}
          </div>
          <label style={{ display: "block", marginTop: 14, fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>
            Note (optional)
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="What's wrong, if anything" style={{ display: "block", width: "100%", marginTop: 4, padding: 8, borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text-primary)", fontSize: 13, fontWeight: 400 }} />
          </label>
          <div style={{ display: "flex", gap: 8, marginTop: 14, alignItems: "center", flexWrap: "wrap" }}>
            <button type="button" onClick={save} disabled={busy || !marked} style={{ ...button(true), opacity: busy || !marked ? 0.6 : 1 }}>{busy ? "Saving…" : "Save and next"}</button>
            <button type="button" onClick={load} disabled={busy} style={button()}>Skip</button>
            <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{marked} of {Object.keys(next.values).length} marked</span>
          </div>
        </section>
      )}
    </div>
  );
}
