"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Kind = "dances" | "choreographers" | "tracks";
const WHAT: Record<Kind, string> = { dances: "dance", choreographers: "choreographer", tracks: "track" };

/**
 * Merge this record with another one, either way round (decision 29; from the data desk). Find the other by name or
 * id, then choose which one is kept. The merge writes what the review pages write, so Merge history can undo it.
 */
export default function MergeBox({ kind, id, name }: { kind: Kind; id: string; name: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [list, setList] = useState<{ _id: string; label: string }[]>([]);
  const [other, setOther] = useState<{ id: string; label: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (q.trim().length < 2) {
      setList([]);
      return;
    }
    let stale = false;
    const t = setTimeout(() => {
      fetch(`/api/catalogue/pick?${new URLSearchParams({ kind, q })}`, { cache: "no-store" })
        .then((r) => r.json())
        .then((r) => {
          if (!stale && Array.isArray(r)) setList(r.filter((x: { _id: string }) => x._id !== id));
        })
        .catch(() => {});
    }, 200);
    return () => {
      stale = true;
      clearTimeout(t);
    };
  }, [q, kind, id]);

  async function merge(keepId: string, loseId: string, keepLabel: string, loseLabel: string) {
    if (!window.confirm(`Merge “${loseLabel}” into “${keepLabel}”? “${keepLabel}” is kept; Merge history can undo it.`)) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/catalogue/merge", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ kind, keepId, loseId }) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error ?? `Failed (${res.status})`);
        return;
      }
      setOther(null);
      setQ("");
      if (keepId === id) router.refresh();
      else router.push(`/catalogue/${kind}/${keepId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mergebox">
      {!other ? (
        <>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Find the other ${WHAT[kind]} by name or id…`} />
          {list.length > 0 && (
            <ul className="plain mergebox-list">
              {list.map((x) => (
                <li key={x._id}>
                  <button type="button" onClick={() => setOther({ id: x._id, label: x.label })}>{x.label}</button>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <div>
          <p style={{ margin: "0 0 8px" }}>
            With <Link href={`/catalogue/${kind}/${other.id}`} target="_blank">{other.label}</Link>{" "}
            <button type="button" onClick={() => setOther(null)} disabled={busy}>change</button>
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" disabled={busy} onClick={() => merge(id, other.id, name, other.label)}>Keep this one, merge the other in</button>
            <button type="button" disabled={busy} onClick={() => merge(other.id, id, other.label, name)}>Merge this into the other</button>
          </div>
        </div>
      )}
      {error && <p className="bad-text" style={{ margin: "8px 0 0" }}>{error}</p>}
    </div>
  );
}
