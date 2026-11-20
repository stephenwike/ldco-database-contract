"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Field, inputStyle } from "@/components/form";

// The linedance test catalogue: what's missing from each dance, and a place to browse and fix it.

interface Stepsheet { url: string; lang: string | null; title?: string }

interface Dance {
  _id: string;
  danceName: string;
  count: number | null;
  wall: number | null;
  levels: string[];
  levelQualifier: string | null;
  phrased: boolean;
  danceType: string;
  levelRaw: string | null;
  choreographerIds: string[];
  credit: string | null;
  songArtists: { song: string; artist: string }[];
  musicRaw: string | null;
  introCounts: number | null;
  hasTags: boolean | null;
  hasRestarts: boolean | null;
  hasBridge: boolean | null;
  choreographedIn: string | null;
  published: string | null;
  publishedSource: string | null;
  publishedBy?: string | null;
  stepsheets: Stepsheet[];
  editedFields?: string[];
  editedBy?: string;
  /** Fields the stepsheet itself leaves blank: shown, but not as gaps. */
  notStated?: string[];
  /** From an event, not on copperknob yet */
  unpublished?: boolean;
  gaps: string[];
}

interface Stats {
  total: number;
  complete: number;
  gaps: { id: string; label: string; core: boolean; count: number }[];
  openMergeCandidates: number;
  choreographers: number;
  languages: { id: string; count: number }[];
  levels: { id: string; name: string; aliases: string[]; count: number }[];
  asOf: string;
}

const GAP_LABELS: Record<string, string> = {
  level: "level", count: "count", wall: "wall", choreographer: "choreographer", song: "song", stepsheet: "stepsheet", published: "date", choreographedIn: "choreographed date",
};
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "2021-08" -> "Aug 2021", "2021" -> "2021". */
const monthYear = (v: string) => { const [y, m] = v.split("-"); return m ? `${MONTH_NAMES[Number(m) - 1]} ${y}` : y; };
const LANGUAGE_NAMES: Record<string, string> = {
  fr: "French", de: "German", nl: "Dutch", zh: "Chinese", es: "Spanish", ca: "Catalan", da: "Danish", it: "Italian", sv: "Swedish", fi: "Finnish", no: "Norwegian", ko: "Korean", ja: "Japanese", pt: "Portuguese", pl: "Polish", hu: "Hungarian", ru: "Russian", cs: "Czech",
};
const languageName = (code: string) => LANGUAGE_NAMES[code] ?? code.toUpperCase();
const SOURCE_LABELS: Record<string, string> = { feed: "from the feed", "feed-archive": "from an archived feed", "sync-time": "from sync time", "id-estimate": "estimated", "id-neighbours": "estimated from neighbouring stepsheets' credits", manual: "set by hand" };

const button = (primary = false): React.CSSProperties => ({
  padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
  border: primary ? "none" : "1px solid var(--border)",
  background: primary ? "var(--accent)" : "var(--surface)",
  color: primary ? "#fff" : "var(--text-secondary)",
});

const formatNumber = (n: number) => n.toLocaleString("en-US");
const percent = (n: number, total: number) => {
  if (!total) return "0%";
  const p = (n / total) * 100;
  return p > 0 && p < 0.1 ? "<0.1%" : `${p.toFixed(1)}%`;
};

function StatTile({ label, count, total, active, onClick }: { label: string; count: number; total: number; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} aria-pressed={active} style={{
      textAlign: "left", padding: "10px 12px", borderRadius: 10, cursor: "pointer",
      border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
      background: active ? "var(--accent-subtle)" : "var(--surface)",
    }}>
      <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginTop: 2 }}>{formatNumber(count)}</div>
      <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{percent(count, total)}</div>
    </button>
  );
}

function ChoreographerPicker({ selected, onAdd }: { selected: string[]; onAdd: (c: { _id: string; name: string }) => void }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<{ _id: string; name: string; aliases: string[] }[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const text = q.trim();
    const timer = setTimeout(() => {
      if (text.length < 2) { setResults([]); return; }
      fetch(`/api/catalogue/choreographers?q=${encodeURIComponent(text)}`)
        .then((r) => (r.ok ? r.json() : []))
        .then(setResults)
        .catch(() => setResults([]));
    }, 250);
    return () => clearTimeout(timer);
  }, [q]);

  async function create() {
    setError("");
    const r = await fetch("/api/catalogue/choreographers", { method: "POST", body: JSON.stringify({ name: q }) });
    const data = await r.json();
    if (!r.ok) { setError(data.error ?? "Couldn't add that name."); return; }
    onAdd(data.choreographer);
    setQ("");
  }

  const exact = results.some((c) => c.name.toLowerCase() === q.trim().toLowerCase());
  return (
    <div style={{ position: "relative" }}>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Add a choreographer…" style={inputStyle} aria-label="Add a choreographer" />
      {q.trim().length >= 2 && (
        <div style={{ marginTop: 4, border: "1px solid var(--border)", borderRadius: 8, background: "var(--surface)", overflow: "hidden" }}>
          {results.filter((c) => !selected.includes(c._id)).map((c) => (
            <button key={c._id} type="button" onClick={() => { onAdd(c); setQ(""); }} style={{ display: "block", width: "100%", textAlign: "left", padding: "6px 10px", border: "none", background: "none", cursor: "pointer", fontSize: 13, color: "var(--text-primary)" }}>
              {c.name}
              {c.aliases?.length > 0 && <span style={{ color: "var(--text-tertiary)", fontSize: 12 }}> · also {c.aliases.slice(0, 2).join(", ")}</span>}
            </button>
          ))}
          {!exact && (
            <button type="button" onClick={create} style={{ display: "block", width: "100%", textAlign: "left", padding: "6px 10px", border: "none", background: "none", cursor: "pointer", fontSize: 13, color: "var(--accent-text)" }}>
              Add “{q.trim()}” as a new choreographer
            </button>
          )}
        </div>
      )}
      {error && <p style={{ color: "var(--danger)", fontSize: 12, marginTop: 4 }}>{error}</p>}
    </div>
  );
}

function YesNoUnknown({ label, value, onChange }: { label: string; value: boolean | null; onChange: (v: boolean | null) => void }) {
  return (
    <Field label={label}>
      <select value={value === null ? "" : value ? "yes" : "no"} onChange={(e) => onChange(e.target.value === "" ? null : e.target.value === "yes")} style={inputStyle}>
        <option value="">Not known</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </Field>
  );
}

function DanceEditor({ dance, names, levels, onSaved, onClose }: {
  dance: Dance;
  names: Record<string, string>;
  levels: Stats["levels"];
  onSaved: (d: Dance, names: Record<string, string>) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState({
    danceName: dance.danceName,
    count: dance.count === null ? "" : String(dance.count),
    wall: dance.wall === null ? "" : String(dance.wall),
    introCounts: dance.introCounts === null ? "" : String(dance.introCounts),
    levels: dance.levels,
    levelQualifier: dance.levelQualifier ?? "",
    phrased: dance.phrased,
    danceType: dance.danceType,
    hasTags: dance.hasTags,
    hasRestarts: dance.hasRestarts,
    hasBridge: dance.hasBridge,
    published: dance.published ?? "",
    choreographedIn: dance.choreographedIn ?? "",
    songArtists: dance.songArtists.length ? dance.songArtists : [] as { song: string; artist: string }[],
    stepsheets: dance.stepsheets,
    choreographerIds: dance.choreographerIds,
  });
  const [localNames, setLocalNames] = useState(names);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = <K extends keyof typeof draft>(k: K, v: (typeof draft)[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const number = (s: string) => (s.trim() === "" ? null : Number(s));

  async function save() {
    setSaving(true);
    setError("");
    const body = {
      ...draft,
      count: number(draft.count),
      wall: number(draft.wall),
      introCounts: number(draft.introCounts),
      levelQualifier: draft.levelQualifier || null,
    };
    try {
      const r = await fetch(`/api/catalogue/dances/${encodeURIComponent(dance._id)}`, { method: "PATCH", body: JSON.stringify(body) });
      const data = await r.json();
      if (!r.ok) { setError(data.error ?? "Couldn't save."); return; }
      onSaved(data.dance, localNames);
    } catch {
      setError("Couldn't reach the server. Nothing was saved.");
    } finally {
      setSaving(false);
    }
  }

  const grid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 };
  const heading: React.CSSProperties = { fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", margin: "16px 0 8px" };
  const chip: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 8px", borderRadius: 14, fontSize: 12, background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-primary)" };
  const small: React.CSSProperties = { border: "none", background: "none", cursor: "pointer", color: "var(--text-tertiary)", fontSize: 14, padding: "0 2px" };

  return (
    <div style={{ padding: 16, borderTop: "1px solid var(--border)", background: "var(--surface-raised)" }}>
      <div style={grid}>
        <div style={{ gridColumn: "1 / -1" }}><Field label="Name"><input value={draft.danceName} onChange={(e) => set("danceName", e.target.value)} style={inputStyle} /></Field></div>
        <Field label="Count"><input inputMode="numeric" value={draft.count} onChange={(e) => set("count", e.target.value)} style={inputStyle} /></Field>
        <Field label="Wall"><input inputMode="numeric" value={draft.wall} onChange={(e) => set("wall", e.target.value)} style={inputStyle} /></Field>
        <Field label="Intro counts"><input inputMode="numeric" value={draft.introCounts} onChange={(e) => set("introCounts", e.target.value)} style={inputStyle} /></Field>
        <Field label="Publish date"><input value={draft.published} placeholder="YYYY, YYYY-MM or YYYY-MM-DD" onChange={(e) => set("published", e.target.value)} style={inputStyle} /></Field>
        <Field label="Choreographed"><input value={draft.choreographedIn} placeholder="YYYY or YYYY-MM" onChange={(e) => set("choreographedIn", e.target.value)} style={inputStyle} /></Field>
      </div>
      {dance.published && dance.publishedSource && <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 6 }}>{dance.published} is {SOURCE_LABELS[dance.publishedSource] ?? dance.publishedSource}.</p>}
      {!dance.published && dance.publishedBy && <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 6 }}>No publish date, but it was on copperknob by {monthYear(dance.publishedBy)} (part of its alphabetical import of older stepsheets).</p>}

      <div style={heading}>Level{dance.levelRaw && <span style={{ fontWeight: 400, color: "var(--text-tertiary)" }}> · the stepsheet says “{dance.levelRaw}”</span>}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
        {levels.map((l) => (
          <label key={l.id} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-primary)" }} title={l.aliases.length ? `Also called ${l.aliases.join(", ")}` : undefined}>
            <input type="checkbox" checked={draft.levels.includes(l.id)} onChange={(e) => set("levels", e.target.checked ? [...draft.levels, l.id] : draft.levels.filter((x) => x !== l.id))} />
            {l.name}
          </label>
        ))}
      </div>
      <div style={grid}>
        <Field label="Qualifier">
          <select value={draft.levelQualifier} onChange={(e) => set("levelQualifier", e.target.value)} style={inputStyle}>
            <option value="">None</option><option value="easy">Easy</option><option value="high">High</option><option value="low">Low</option>
          </select>
        </Field>
        <Field label="Dance type">
          <select value={draft.danceType} onChange={(e) => set("danceType", e.target.value)} style={inputStyle}>
            {["line", "partner", "contra", "circle", "chair"].map((t) => <option key={t} value={t}>{t[0].toUpperCase() + t.slice(1)}</option>)}
          </select>
        </Field>
        <Field label="Phrased">
          <select value={draft.phrased ? "yes" : "no"} onChange={(e) => set("phrased", e.target.value === "yes")} style={inputStyle}>
            <option value="no">No</option><option value="yes">Yes</option>
          </select>
        </Field>
        <YesNoUnknown label="Tags" value={draft.hasTags} onChange={(v) => set("hasTags", v)} />
        <YesNoUnknown label="Restarts" value={draft.hasRestarts} onChange={(v) => set("hasRestarts", v)} />
        <YesNoUnknown label="Bridge" value={draft.hasBridge} onChange={(v) => set("hasBridge", v)} />
      </div>

      <div style={heading}>Choreographers{dance.credit && <span style={{ fontWeight: 400, color: "var(--text-tertiary)" }}> · the stepsheet says “{dance.credit}”</span>}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
        {draft.choreographerIds.map((id) => (
          <span key={id} style={chip}>
            {localNames[id] ?? id}
            <button type="button" aria-label={`Remove ${localNames[id] ?? id}`} style={small} onClick={() => set("choreographerIds", draft.choreographerIds.filter((x) => x !== id))}>×</button>
          </span>
        ))}
      </div>
      <ChoreographerPicker selected={draft.choreographerIds} onAdd={(c) => {
        setLocalNames((n) => ({ ...n, [c._id]: c.name }));
        setDraft((d) => (d.choreographerIds.includes(c._id) ? d : { ...d, choreographerIds: [...d.choreographerIds, c._id] }));
      }} />

      <div style={heading}>Songs{dance.musicRaw && <span style={{ fontWeight: 400, color: "var(--text-tertiary)" }}> · the stepsheet says “{dance.musicRaw}”</span>}</div>
      {draft.songArtists.map((s, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
          <input aria-label="Song" placeholder="Song" value={s.song} onChange={(e) => set("songArtists", draft.songArtists.map((x, j) => (j === i ? { ...x, song: e.target.value } : x)))} style={inputStyle} />
          <input aria-label="Artist" placeholder="Artist" value={s.artist} onChange={(e) => set("songArtists", draft.songArtists.map((x, j) => (j === i ? { ...x, artist: e.target.value } : x)))} style={inputStyle} />
          <button type="button" aria-label="Remove song" style={small} onClick={() => set("songArtists", draft.songArtists.filter((_, j) => j !== i))}>×</button>
        </div>
      ))}
      <button type="button" style={button()} onClick={() => set("songArtists", [...draft.songArtists, { song: "", artist: "" }])}>Add a song</button>

      <div style={heading}>Stepsheets</div>
      {draft.stepsheets.map((s, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
          <input aria-label="Language code" placeholder="lang" value={s.lang ?? ""} onChange={(e) => set("stepsheets", draft.stepsheets.map((x, j) => (j === i ? { ...x, lang: e.target.value || null } : x)))} style={{ ...inputStyle, width: 64, flexShrink: 0 }} />
          <input aria-label="Stepsheet address" placeholder="https://…" value={s.url} onChange={(e) => set("stepsheets", draft.stepsheets.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))} style={inputStyle} />
          {/^https?:\/\//i.test(s.url) && <a href={s.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "var(--accent-text)", flexShrink: 0 }}>Open</a>}
          <button type="button" aria-label="Remove stepsheet" style={small} onClick={() => set("stepsheets", draft.stepsheets.filter((_, j) => j !== i))}>×</button>
        </div>
      ))}
      <button type="button" style={button()} onClick={() => set("stepsheets", [...draft.stepsheets, { url: "", lang: null }])}>Add a stepsheet</button>

      {dance.editedFields?.length ? <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 14 }}>Fixed by hand{dance.editedBy ? ` by ${dance.editedBy}` : ""}: {dance.editedFields.join(", ")}</p> : null}
      {error && <p role="alert" style={{ color: "var(--danger)", fontSize: 13, marginTop: 12 }}>{error}</p>}
      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <button type="button" onClick={save} disabled={saving} style={{ ...button(true), opacity: saving ? 0.7 : 1 }}>{saving ? "Saving…" : "Save"}</button>
        <button type="button" onClick={onClose} style={button()}>Cancel</button>
      </div>
    </div>
  );
}

function DanceRow({ dance, names, levels, open, onToggle, onSaved, onChoreographer }: {
  dance: Dance;
  names: Record<string, string>;
  levels: Stats["levels"];
  open: boolean;
  onToggle: () => void;
  onSaved: (d: Dance, names: Record<string, string>) => void;
  onChoreographer: (id: string, name: string) => void;
}) {
  const levelText = dance.levels.map((id) => levels.find((l) => l.id === id)?.name ?? id).join(" / ");
  const languages = dance.stepsheets.map((s) => s.lang).filter(Boolean) as string[];
  const facts = [
    levelText && `${dance.levelQualifier ? `${dance.levelQualifier[0].toUpperCase()}${dance.levelQualifier.slice(1)} ` : ""}${levelText}`,
    dance.count !== null && `${dance.count} count`,
    dance.wall !== null && `${dance.wall} wall`,
    dance.danceType !== "line" && dance.danceType,
    dance.phrased && "phrased",
    dance.published && `${dance.published}${dance.publishedSource === "id-estimate" || dance.publishedSource === "id-neighbours" ? " (est.)" : ""}`,
    !dance.published && dance.publishedBy && `on copperknob by ${monthYear(dance.publishedBy)}`,
    dance.choreographedIn && `choreographed ${monthYear(dance.choreographedIn)}`,
  ].filter(Boolean).join(" · ");
  const firstSheet = dance.stepsheets[0]?.url;
  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 10, background: "var(--surface)", overflow: "hidden" }}>
      <div style={{ display: "flex", gap: 12, padding: "10px 14px", alignItems: "flex-start" }}>
        <button type="button" onClick={onToggle} aria-expanded={open} style={{ flex: 1, minWidth: 0, textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
            {dance.danceName}
            {dance.editedFields?.length ? <span title="Fixed by hand" style={{ color: "var(--success-text)", fontWeight: 400, fontSize: 12 }}> · edited</span> : null}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{facts || "No details yet"}</div>
          {dance.songArtists[0] && <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 2 }}>{dance.songArtists[0].song} – {dance.songArtists[0].artist}</div>}
        </button>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "flex-end", maxWidth: "45%" }}>
          {languages.map((l, i) => <span key={`${l}${i}`} title={languageName(l)} style={{ fontSize: 11, padding: "2px 6px", borderRadius: 10, background: "var(--accent-subtle)", color: "var(--accent-text)" }}>{l}</span>)}
          {dance.gaps.map((g) => <span key={g} style={{ fontSize: 11, padding: "2px 6px", borderRadius: 10, background: "var(--warning-subtle)", color: "var(--warning-text)" }}>no {GAP_LABELS[g] ?? g}</span>)}
          {dance.unpublished && <span title="From an event; not on copperknob yet" style={{ fontSize: 11, padding: "2px 6px", borderRadius: 10, background: "var(--accent-subtle)", color: "var(--accent-text)" }}>unpublished</span>}
          {dance.notStated?.map((f) => <span key={`ns-${f}`} title="The stepsheet leaves this blank" style={{ fontSize: 11, padding: "2px 6px", borderRadius: 10, background: "var(--surface-raised)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>{GAP_LABELS[f] ?? f} not stated</span>)}
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, padding: "0 14px 10px", fontSize: 12 }}>
        {dance.choreographerIds.map((id) => (
          <button key={id} type="button" onClick={() => onChoreographer(id, names[id] ?? id)} title="Show this choreographer's dances" style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "var(--accent-text)", fontSize: 12 }}>{names[id] ?? id}</button>
        ))}
        {!dance.choreographerIds.length && dance.credit && <span style={{ color: "var(--text-tertiary)" }}>{dance.credit}</span>}
        <a href={`/catalogue/dances/${dance._id}`} style={{ color: "var(--text-tertiary)", marginLeft: "auto" }}>Everything about it</a>
        {firstSheet && <a href={firstSheet} target="_blank" rel="noreferrer" style={{ color: "var(--text-tertiary)" }}>Stepsheet ↗</a>}
      </div>
      {open && <DanceEditor dance={dance} names={names} levels={levels} onSaved={onSaved} onClose={onToggle} />}
    </div>
  );
}

function CataloguePage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const gaps = params.get("gaps")?.split(",").filter(Boolean) ?? [];
  const q = params.get("q") ?? "";
  const lang = params.get("lang") ?? "";
  const level = params.get("level") ?? "";
  const danceType = params.get("danceType") ?? "";
  const choreographerId = params.get("choreographerId") ?? "";
  const choreographerName = params.get("choreographerName") ?? "";
  const page = Number(params.get("page")) || 0;
  const queryKey = params.toString();

  const [stats, setStats] = useState<Stats | null>(null);
  const [statsError, setStatsError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [result, setResult] = useState<{ total: number; pageSize: number; dances: Dance[]; choreographers: Record<string, string> } | null>(null);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [search, setSearch] = useState(q);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadStats = useCallback((fresh: boolean) => {
    return fetch(`/api/catalogue/stats${fresh ? "?fresh=1" : ""}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((s: Stats) => { setStats(s); setStatsError(false); })
      .catch(() => setStatsError(true))
      .finally(() => setRefreshing(false));
  }, []);

  useEffect(() => { void loadStats(false); }, [loadStats]);

  useEffect(() => {
    let stale = false;
    const query = new URLSearchParams(queryKey);
    query.delete("choreographerName");
    fetch(`/api/catalogue/dances?${query}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => { if (!stale) { setResult(data); setListError(false); setLoading(false); } })
      .catch(() => { if (!stale) { setListError(true); setLoading(false); } });
    return () => { stale = true; };
  }, [queryKey]);

  function update(changes: Record<string, string | null>) {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(changes)) { if (v) next.set(k, v); else next.delete(k); }
    if (!("page" in changes)) next.delete("page");
    if (next.toString() === queryKey) return;
    setOpenId(null);
    setLoading(true);
    router.replace(`${pathname}?${next}`, { scroll: false });
  }

  function onSearch(text: string) {
    setSearch(text);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => update({ q: text.trim() || null }), 300);
  }

  const toggleGap = (id: string) => update({ gaps: (gaps.includes(id) ? gaps.filter((g) => g !== id) : [...gaps, id]).join(",") || null });

  function onSaved(saved: Dance, names: Record<string, string>) {
    setResult((r) => r && { ...r, choreographers: { ...r.choreographers, ...names }, dances: r.dances.map((d) => (d._id === saved._id ? saved : d)) });
    setOpenId(null);
    recount();
  }

  function recount() {
    setRefreshing(true);
    void loadStats(true);
  }

  const total = stats?.total ?? 0;
  const pages = result ? Math.ceil(result.total / result.pageSize) : 0;
  const filtered = gaps.length > 0 || q || lang || level || danceType || choreographerId;
  const core = stats?.gaps.filter((g) => g.core) ?? [];
  const other = stats?.gaps.filter((g) => !g.core) ?? [];
  const tileGrid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 8 };

  return (
    <div className="page-pad" style={{ maxWidth: 1000 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 4 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>Catalogue</h1>
        <span style={{ fontSize: 13, color: "var(--text-tertiary)" }}>The linedance database. No app reads it yet, but fixes here save straight to it.</span>
      </div>

      {statsError && !stats && <p role="alert" style={{ color: "var(--danger)", fontSize: 13, margin: "16px 0" }}>Couldn’t load the numbers.</p>}
      {!stats && !statsError && <p style={{ fontSize: 13, color: "var(--text-tertiary)", margin: "16px 0" }}>Counting the catalogue…</p>}
      {stats && (
        <section style={{ margin: "16px 0 20px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "baseline", marginBottom: 6 }}>
            <span style={{ fontSize: 14, color: "var(--text-primary)" }}>
              <strong>{formatNumber(stats.complete)}</strong> of {formatNumber(total)} dances have everything ({percent(stats.complete, total)})
            </span>
            <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{formatNumber(stats.choreographers)} choreographers · {formatNumber(stats.openMergeCandidates)} possible duplicates</span>
            <button type="button" onClick={recount} disabled={refreshing} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "var(--accent-text)" }}>{refreshing ? "Counting…" : "Recount"}</button>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: "var(--border)", overflow: "hidden", marginBottom: 14 }} role="img" aria-label={`${percent(stats.complete, total)} complete`}>
            <div style={{ height: "100%", width: percent(stats.complete, total).replace("<", ""), background: "var(--success)" }} />
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 6 }}>Missing</div>
          <div style={tileGrid}>{core.map((g) => <StatTile key={g.id} label={g.label.replace(/^No (.)/, (_, c: string) => c.toUpperCase())} count={g.count} total={total} active={gaps.includes(g.id)} onClick={() => toggleGap(g.id)} />)}</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", margin: "12px 0 6px" }}>Worth a look</div>
          <div style={tileGrid}>{other.map((g) => <StatTile key={g.id} label={g.label} count={g.count} total={total} active={gaps.includes(g.id)} onClick={() => toggleGap(g.id)} />)}</div>
        </section>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        <input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Search by name, or paste a stepsheet address" aria-label="Search dances" style={{ ...inputStyle, flex: "1 1 240px", width: "auto" }} />
        <select aria-label="Level" value={level} onChange={(e) => update({ level: e.target.value || null })} style={{ ...inputStyle, width: "auto" }}>
          <option value="">Any level</option>
          {stats?.levels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
        <select aria-label="Dance type" value={danceType} onChange={(e) => update({ danceType: e.target.value || null })} style={{ ...inputStyle, width: "auto" }}>
          <option value="">Any type</option>
          {["line", "partner", "contra", "circle", "chair"].map((t) => <option key={t} value={t}>{t[0].toUpperCase() + t.slice(1)}</option>)}
        </select>
        <select aria-label="Translation language" value={lang} onChange={(e) => update({ lang: e.target.value || null })} style={{ ...inputStyle, width: "auto" }}>
          <option value="">Any translation</option>
          {stats?.languages.map((l) => <option key={l.id} value={l.id}>{languageName(l.id)} ({formatNumber(l.count)})</option>)}
        </select>
      </div>

      {filtered && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", marginBottom: 10, fontSize: 12 }}>
          {choreographerId && <span style={{ color: "var(--text-secondary)" }}>By {choreographerName || choreographerId}</span>}
          <button type="button" onClick={() => { setSearch(""); update({ gaps: null, q: null, lang: null, level: null, danceType: null, choreographerId: null, choreographerName: null }); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--accent-text)", fontSize: 12, padding: 0 }}>Clear filters</button>
        </div>
      )}

      {listError && <p role="alert" style={{ color: "var(--danger)", fontSize: 13 }}>Couldn’t load the dances.</p>}
      {!listError && result && (
        <p aria-live="polite" style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 8 }}>
          {loading ? "Loading…" : `${formatNumber(result.total)} ${result.total === 1 ? "dance" : "dances"}${pages > 1 ? ` · page ${page + 1} of ${formatNumber(pages)}` : ""}`}
        </p>
      )}
      {!result && !listError && <p style={{ fontSize: 13, color: "var(--text-tertiary)" }}>Loading dances…</p>}
      {result && !result.dances.length && !loading && <p style={{ fontSize: 13, color: "var(--text-tertiary)", padding: "24px 0", textAlign: "center" }}>No dances match these filters.</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: 8, opacity: loading ? 0.6 : 1 }}>
        {result?.dances.map((d) => (
          <DanceRow
            key={d._id}
            dance={d}
            names={result.choreographers}
            levels={stats?.levels ?? []}
            open={openId === d._id}
            onToggle={() => setOpenId(openId === d._id ? null : d._id)}
            onSaved={onSaved}
            onChoreographer={(id, name) => update({ choreographerId: id, choreographerName: name })}
          />
        ))}
      </div>

      {pages > 1 && (
        <div style={{ display: "flex", gap: 8, justifyContent: "center", margin: "16px 0" }}>
          <button type="button" disabled={page === 0} onClick={() => update({ page: page > 1 ? String(page - 1) : null })} style={{ ...button(), opacity: page === 0 ? 0.5 : 1 }}>Previous</button>
          <button type="button" disabled={page + 1 >= pages} onClick={() => update({ page: String(page + 1) })} style={{ ...button(), opacity: page + 1 >= pages ? 0.5 : 1 }}>Next</button>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="page-pad"><p style={{ fontSize: 13, color: "var(--text-tertiary)" }}>Loading…</p></div>}>
      <CataloguePage />
    </Suspense>
  );
}
