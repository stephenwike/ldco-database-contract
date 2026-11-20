"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// A button on a record page that posts to one of the catalogue routes (undo a merge, keep a pair apart) and reloads
// the page to show the result. The routes do the work and their checks; this only asks first and reports errors.
export default function RecordAction({ label, url, body, confirm }: { label: string; url: string; body: object; confirm?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    if (confirm && !window.confirm(confirm)) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) setError(json.error ?? `Failed (${res.status})`);
      else router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <span className="record-action">
      <button type="button" onClick={run} disabled={busy}>
        {busy ? "…" : label}
      </button>
      {error && <span className="bad-text"> {error}</span>}
    </span>
  );
}
