"use client";

import { useEffect, useState } from "react";
import type { MatchTier, QueryCost } from "@/server/searchLab";

// What the apps' search (the package's searchDances, with the lab's match points) returns and costs the database, and
// what that comes to at a given number of searches a day. From the harvester's data desk. Atlas prices and limits
// below are approximate list prices (check mongodb.com/pricing); edit them here if they change.

type Measured =
  | {
      wallMs: number;
      queries: QueryCost[];
      top: { _id: string; danceName: string; match: string | null; rank: number | null }[];
      total: number;
      more: boolean;
      totals: { operations: number; keys: number; docs: number; ms: number; bytes: number };
      storageMB: { data: number; storage: number; indexes: number };
    }
  | { error: string };

const FLEX_STEPS: [number, number][] = [[100, 8], [200, 15], [300, 21], [400, 25], [500, 30]]; // ops/sec ceiling, $/month
const TIERS = [
  { id: "m0", name: "M0 (free)", cost: () => 0, storageMB: 512, opsLimit: 100, note: "shared; capped at 100 operations a second" },
  { id: "flex", name: "Flex", cost: (ops: number) => FLEX_STEPS.find(([max]) => ops <= max)?.[1] ?? null, storageMB: 5120, opsLimit: 500, note: "shared; billed by operations a second, $8 up to 100, at most $30 up to 500" },
  { id: "m10", name: "M10", cost: () => 57, storageMB: 10240, opsLimit: null, note: "dedicated, 2 vCPU (burstable), 2 GB memory" },
  { id: "m20", name: "M20", cost: () => 146, storageMB: 20480, opsLimit: null, note: "dedicated, 2 vCPU, 4 GB memory" },
  { id: "m30", name: "M30", cost: () => 389, storageMB: 40960, opsLimit: null, note: "dedicated, 2 vCPU (not burstable), 8 GB memory" },
];
const fmt = (n: number, d = 0) => n.toLocaleString(undefined, { maximumFractionDigits: d });

export default function SearchMetrics({ q, gap, matchPoints }: { q: string; gap: string; matchPoints: Record<MatchTier, number> }) {
  const [m, setM] = useState<Measured | null>(null);
  // Starting values: about 2.5k users (2026-11-13 estimate: ~100 searches a day now from ~130 active people, mostly
  // finding dances to request on the DJ Feed, which happens during evening events)
  const [perDay, setPerDay] = useState(3000);
  const [peakShare, setPeakShare] = useState(25);
  const [clusterMB, setClusterMB] = useState(0);
  const [slowdown, setSlowdown] = useState(1);

  useEffect(() => {
    let stale = false;
    const t = setTimeout(() => {
      const params = new URLSearchParams({ q, gap, settings: JSON.stringify({ matchPoints }) });
      fetch(`/api/search-lab/metrics?${params}`, { cache: "no-store" })
        .then((r) => r.json())
        .catch((e) => ({ error: String(e) }))
        .then((r: Measured) => {
          if (stale) return;
          setM(r);
          if (!("error" in r)) setClusterMB((mb) => mb || r.storageMB.storage);
        });
    }, 400);
    return () => {
      stale = true;
      clearTimeout(t);
    };
  }, [q, gap, matchPoints]);

  if (!m) return <div className="panel muted">Measuring…</div>;
  if ("error" in m) return <div className="panel bad-text">{m.error}</div>;
  const t = m.totals;
  const peakPerSec = (perDay * (peakShare / 100)) / 3600;
  const peakOps = peakPerSec * t.operations;
  const avgOps = (perDay * t.operations) / 86400;
  // Database time at the busiest hour, as a share of one CPU core
  const peakCore = (peakPerSec * t.ms * slowdown) / 1000;
  const gbMonth = (t.bytes * perDay * 30) / 1e9;
  const readsDay = (t.keys + t.docs) * perDay;

  return (
    <div className="panel">
      <h3>What the apps get</h3>
      <p className="muted" style={{ fontSize: 13, margin: "0 0 8px" }}>
        The package&apos;s searchDances with the match points above and the stored rank: {fmt(m.total)}
        {m.more ? "+" : ""} dances. The first ten:
      </p>
      <ol style={{ margin: "0 0 12px", paddingLeft: 22, fontSize: 14 }}>
        {m.top.map((d) => (
          <li key={d._id}>
            {d.danceName} <span className="muted">{d.match ? `· ${d.match}` : ""} · rank {d.rank ?? "—"}</span>
          </li>
        ))}
      </ol>

      <h3>What one search costs</h3>
      <p className="muted" style={{ fontSize: 13, margin: "0 0 8px" }}>
        MongoDB&apos;s explain of every query that search makes, on the database this app reads (live). One search = one page of results.
      </p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Query</th>
              <th className="num">Index entries read</th>
              <th className="num">Records read</th>
              <th className="num">Returned</th>
              <th className="num">ms</th>
              <th>How</th>
            </tr>
          </thead>
          <tbody>
            {m.queries.map((x, i) => (
              <tr key={i}>
                <td>
                  {x.label}
                  {x.wasteful && <span className="badge bad" style={{ marginLeft: 6 }} title="Reads far more than it returns: it scans rather than seeks">scans</span>}
                </td>
                <td className="num">{fmt(x.keys)}</td>
                <td className="num">{fmt(x.docs)}</td>
                <td className="num">{fmt(x.returned)}</td>
                <td className="num">{x.ms}</td>
                <td className="mono muted" style={{ fontSize: 11 }}>{x.plan}</td>
              </tr>
            ))}
            <tr>
              <td><b>Per search</b> ({t.operations} operations)</td>
              <td className="num"><b>{fmt(t.keys)}</b></td>
              <td className="num"><b>{fmt(t.docs)}</b></td>
              <td></td>
              <td className="num"><b>{t.ms}</b></td>
              <td className="muted">{fmt(t.bytes / 1024, 1)} KB sent back · {m.wallMs} ms end to end</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 style={{ marginTop: 16 }}>At scale</h3>
      <div className="lab-grid">
        <div>
          <label className="slider"><span>Searches a day</span><input type="range" min={100} max={500000} step={100} value={perDay} onChange={(e) => setPerDay(Number(e.target.value))} /><b>{fmt(perDay)}</b></label>
          <label className="slider"><span>Share in the busiest hour</span><input type="range" min={4} max={50} step={1} value={peakShare} onChange={(e) => setPeakShare(Number(e.target.value))} /><b>{peakShare}%</b></label>
          <label className="slider"><span>Cluster storage (MB)</span><input type="range" min={50} max={20000} step={50} value={clusterMB} onChange={(e) => setClusterMB(Number(e.target.value))} /><b>{fmt(clusterMB)}</b></label>
          <label className="slider"><span>CPU slowdown vs where this ran</span><input type="range" min={1} max={8} step={0.5} value={slowdown} onChange={(e) => setSlowdown(Number(e.target.value))} /><b>{slowdown}×</b></label>
          <p className="muted" style={{ fontSize: 13 }}>
            Storage starts at linedance&apos;s ({m.storageMB.storage} MB stored, {m.storageMB.indexes} MB of indexes). Times come from the cluster this app reads, so 1× needs no
            allowance unless you&apos;re pricing a smaller tier.
          </p>
        </div>
        <div className="cards" style={{ alignContent: "start" }}>
          <div className="card"><div className="stat">{fmt(peakOps, 1)}</div><p>operations/sec, busiest hour</p></div>
          <div className="card"><div className="stat">{fmt(avgOps, 2)}</div><p>operations/sec, on average</p></div>
          <div className="card"><div className="stat">{fmt(peakCore * 100, 1)}%</div><p>of one CPU core, busiest hour</p></div>
          <div className="card"><div className="stat">{fmt(readsDay / 1e6, 1)}M</div><p>index entries + records read a day</p></div>
          <div className="card"><div className="stat">{fmt(gbMonth, 2)} GB</div><p>sent to apps a month</p></div>
        </div>
      </div>
      <div className="table-wrap" style={{ marginTop: 10 }}>
        <table>
          <thead>
            <tr>
              <th>Atlas tier</th>
              <th>Operations</th>
              <th>Storage</th>
              <th>CPU</th>
              <th className="num">About $/month</th>
            </tr>
          </thead>
          <tbody>
            {TIERS.map((tier) => {
              const opsOk = tier.opsLimit == null || peakOps <= tier.opsLimit;
              const storeOk = clusterMB <= tier.storageMB;
              const cpuOk = tier.opsLimit != null || peakCore < (tier.id === "m30" ? 1.4 : 0.8);
              const cost = tier.cost(peakOps);
              return (
                <tr key={tier.id}>
                  <td><b>{tier.name}</b><div className="desc">{tier.note}</div></td>
                  <td className={opsOk ? "ok-text" : "bad-text"}>{tier.opsLimit == null ? "no set limit" : `${fmt(peakOps, 1)} of ${tier.opsLimit}/sec`}</td>
                  <td className={storeOk ? "ok-text" : "bad-text"}>{fmt(clusterMB)} of {fmt(tier.storageMB)} MB</td>
                  <td className={cpuOk ? "ok-text" : "bad-text"}>{tier.opsLimit != null ? <span className="muted">shared</span> : `${fmt(peakCore * 100, 0)}% of a core at peak`}</td>
                  <td className="num">{opsOk && storeOk && cost != null ? `$${cost}` : "won't fit"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="muted" style={{ fontSize: 13 }}>
        Searching is only part of the load: the apps&apos; other reads, the feed&apos;s writes and backups share the same cluster. Prices and limits are approximate list prices
        (mongodb.com/pricing).
      </p>
    </div>
  );
}
