"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { LabSettings, MatchTier } from "@/server/searchLab";
import SearchMetrics from "./SearchMetrics";

// The search lab's controls and results (decision 29; from the harvester's data desk). Results update as anything
// changes. Nothing is saved: when a setting works, it goes into the package (src/catalogue/rank.ts RANK_WEIGHTS and
// RANK_RECENT_MONTHS, src/catalogue/search.ts MATCH_POINTS), and the harvester's rank.mjs for the stored rank.

type Weight = keyof LabSettings["weights"];
interface Row {
  _id: string;
  danceName: string;
  choreographers: string;
  count: number | null;
  wall: number | null;
  levels: string[];
  year: number | null;
  storedRank: number | null;
  labRank: number;
  matchPoints: number;
  score: number;
  matched: MatchTier[];
  parts: Record<string, number>;
  signals: Record<string, number> | null;
}
type Result = { total: number; pageSize: number; ms: number; caps: { usage: number; views: number; languages: number }; rows: Row[] } | { error: string };

const WEIGHT_LABEL: Record<Weight, string> = {
  usage: "Usage (lessons, DJ Feed, users' lists)",
  views: "YouTube views (dance videos)",
  languages: "Translations",
  recency: "Recency (new dances)",
  complete: "Completeness",
};
const MATCH_LABEL: Record<MatchTier, string> = { name: "Exact name", start: "Name starts with", word: "Word in name", choreographer: "Choreographer", song: "Song" };

export default function SearchLab({ defaults, gaps }: { defaults: LabSettings; gaps: { id: string; label: string }[] }) {
  const [q, setQ] = useState("");
  const [gap, setGap] = useState("");
  const [page, setPage] = useState(0);
  const [s, setS] = useState<LabSettings>(defaults);
  const [res, setRes] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    let stale = false;
    const t = setTimeout(() => {
      setBusy(true);
      const params = new URLSearchParams({ q, gap, page: String(page), settings: JSON.stringify(s) });
      fetch(`/api/search-lab?${params}`, { cache: "no-store" })
        .then((r) => r.json())
        .catch((e) => ({ error: String(e) }))
        .then((r: Result) => {
          if (!stale) {
            setRes(r);
            setBusy(false);
          }
        });
    }, 300);
    return () => {
      stale = true;
      clearTimeout(t);
    };
  }, [q, gap, s, page]);

  const setWeight = (k: Weight, v: number) => {
    setS((x) => ({ ...x, weights: { ...x.weights, [k]: v } }));
    setPage(0);
  };
  const setPoints = (k: MatchTier, v: number) => {
    setS((x) => ({ ...x, matchPoints: { ...x.matchPoints, [k]: v } }));
    setPage(0);
  };
  const sum = Object.values(s.weights).reduce((a, b) => a + b, 0);
  const changed = JSON.stringify(s) !== JSON.stringify(defaults);

  return (
    <div className="lab">
      <div className="panel lab-search">
        <input type="search" value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} placeholder="Search text (leave empty to see the plain list)" autoFocus />
        <select value={gap} onChange={(e) => { setGap(e.target.value); setPage(0); }}>
          <option value="">Any dance</option>
          {gaps.map((g) => <option key={g.id} value={g.id}>{g.label}</option>)}
        </select>
      </div>

      <div className="lab-grid">
        <div className="panel">
          <h3>Rank weights</h3>
          {(Object.keys(WEIGHT_LABEL) as Weight[]).map((k) => (
            <label key={k} className="slider">
              <span>{WEIGHT_LABEL[k]}</span>
              <input type="range" min={0} max={1} step={0.01} value={s.weights[k]} onChange={(e) => setWeight(k, Number(e.target.value))} />
              <b>{Math.round(s.weights[k] * 100)}%</b>
            </label>
          ))}
          <label className="slider">
            <span>Recency fades over (months)</span>
            <input type="range" min={1} max={60} step={1} value={s.recentMonths} onChange={(e) => { setS((x) => ({ ...x, recentMonths: Number(e.target.value) })); setPage(0); }} />
            <b>{s.recentMonths}</b>
          </label>
          <p className={Math.abs(sum - 1) > 0.005 ? "bad-text" : "muted"} style={{ fontSize: 13 }}>
            Weights add up to {Math.round(sum * 100)}%{Math.abs(sum - 1) > 0.005 ? `: the highest rank is ${Math.round(sum * 1000)}, not 1000` : ""}.
          </p>
        </div>
        <div className="panel">
          <h3>Match points <span className="muted" style={{ fontWeight: 400 }}>(added to the rank when searching)</span></h3>
          {(Object.keys(MATCH_LABEL) as MatchTier[]).map((k) => (
            <label key={k} className="slider">
              <span>{MATCH_LABEL[k]}</span>
              <input type="range" min={0} max={1000} step={10} value={s.matchPoints[k]} onChange={(e) => setPoints(k, Number(e.target.value))} />
              <b>{s.matchPoints[k]}</b>
            </label>
          ))}
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
            <button type="button" disabled={!changed} onClick={() => { setS(defaults); setPage(0); }}>Reset to the settings in use</button>
            {changed && <span className="badge warn">differs from what&apos;s in use</span>}
          </div>
          {changed && (
            <details style={{ marginTop: 8 }}>
              <summary className="muted">These settings, to copy into the package</summary>
              <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(s, null, 1)}</pre>
            </details>
          )}
        </div>
      </div>

      {res && "error" in res && <p className="bad-text">{res.error}</p>}
      {res && !("error" in res) && (
        <>
          <p className="muted" style={{ fontSize: 13 }}>
            {res.total.toLocaleString()} dances · {res.ms} ms{busy ? " · updating…" : ""} · caps: usage {res.caps.usage}, views {Math.round(res.caps.views).toLocaleString()}, translations {res.caps.languages}
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th className="num">#</th>
                  <th className="num">Score</th>
                  <th>Dance</th>
                  <th className="num">Match</th>
                  <th className="num">Rank</th>
                  <th className="num">In use</th>
                  <th>Where the rank comes from</th>
                </tr>
              </thead>
              <tbody>
                {res.rows.map((d, i) => (
                  <LabRow key={d._id} d={d} n={page * res.pageSize + i + 1} s={s} open={open === d._id} toggle={() => setOpen(open === d._id ? null : d._id)} />
                ))}
              </tbody>
            </table>
          </div>
          <div className="pager">
            {page > 0 && <button type="button" onClick={() => setPage(page - 1)}>← Previous</button>}
            <span className="muted">Page {page + 1} of {Math.max(1, Math.ceil(res.total / res.pageSize)).toLocaleString()}</span>
            {(page + 1) * res.pageSize < res.total && <button type="button" onClick={() => setPage(page + 1)}>Next →</button>}
          </div>
        </>
      )}
      {!res && <p className="muted">Loading…</p>}

      <details open style={{ marginTop: 18 }}>
        <summary>
          <b>What the apps' search returns, and what it costs</b>
        </summary>
        <div style={{ marginTop: 10 }}>
          <SearchMetrics q={q} gap={gap} matchPoints={s.matchPoints} />
        </div>
      </details>
    </div>
  );
}

function LabRow({ d, n, s, open, toggle }: { d: Row; n: number; s: LabSettings; open: boolean; toggle: () => void }) {
  const contrib = (Object.keys(s.weights) as Weight[]).map((k) => ({ k, pts: Math.round(1000 * s.weights[k] * (d.parts?.[k] ?? 0)) }));
  const delta = d.storedRank == null ? null : d.labRank - d.storedRank;
  return (
    <>
      <tr onClick={toggle} style={{ cursor: "pointer" }}>
        <td className="num muted">{n}</td>
        <td className="num"><b>{d.score}</b></td>
        <td>
          <Link href={`/catalogue?q=${encodeURIComponent(d.danceName)}`} onClick={(e) => e.stopPropagation()}>{d.danceName}</Link>
          <div className="desc">{d.choreographers}{d.year ? ` · ${d.year}` : ""}</div>
        </td>
        <td className="num">{d.matchPoints ? <>+{d.matchPoints}<div className="desc">{d.matched.join(", ")}</div></> : <span className="muted">—</span>}</td>
        <td className="num">{d.labRank}</td>
        <td className="num muted">
          {d.storedRank ?? "—"}
          {delta ? <div className={delta > 0 ? "ok-text" : "bad-text"}>{delta > 0 ? "+" : ""}{delta}</div> : null}
        </td>
        <td>
          <div className="bars">{contrib.map((c) => c.pts > 0 && <span key={c.k} className={`bar bar-${c.k}`} style={{ width: `${c.pts / 10}%` }} title={`${c.k}: ${c.pts}`} />)}</div>
          <div className="desc">{contrib.filter((c) => c.pts).map((c) => `${c.k} ${c.pts}`).join(" · ") || "no signals"}</div>
        </td>
      </tr>
      {open && (
        <tr>
          <td colSpan={7} className="desc">
            Signals: usage points {d.signals?.usage ?? 0}, YouTube views {(d.signals?.views ?? 0).toLocaleString()}, translations {d.signals?.languages ?? 0}, missing facts {d.signals?.gaps ?? 0}.{" "}
            Scaled 0–1: {Object.entries(d.parts ?? {}).map(([k, v]) => `${k} ${Number(v).toFixed(2)}`).join(", ")}.{" "}
            {d.count ?? "?"} counts, {d.wall ?? "?"} walls, {d.levels.join(", ") || "no level"}.
          </td>
        </tr>
      )}
    </>
  );
}
