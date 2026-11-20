"use client";

import { useEffect, useState } from "react";

// ── Dance duplicate types ──────────────────────────────────────────────────────

interface DanceSummary {
  id: string;
  danceName: string;
  difficulty: string;
  choreographerIds: string[];
  choreographerNames: string[];
  stepsheet: string;
  hasPrimaryTrack: boolean;
}

interface DuplicateGroup {
  normalizedName: string;
  dances: DanceSummary[];
}

// ── Choreographer duplicate types ─────────────────────────────────────────────

interface ChorGroup {
  ids: string[];
  names: string[];
  copperknobUrls: (string | null)[];
  danceCounts: number[];
  reason: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function difficultyColor(d: string) {
  switch (d?.toLowerCase()) {
    case "beginner": return "#16a34a";
    case "intermediate": return "var(--accent)";
    case "advanced": return "#dc2626";
    default: return "var(--text-muted)";
  }
}

function sharedChoreographers(a: DanceSummary, b: DanceSummary): string[] {
  const setA = new Set(a.choreographerIds);
  return b.choreographerIds.filter(id => setA.has(id));
}

type Section = "dances" | "choreographers" | "tracks";

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DuplicatesPage() {
  const [section, setSection] = useState<Section>("dances");

  // Dance state
  const [groups, setGroups] = useState<DuplicateGroup[]>([]);
  const [danceLoading, setDanceLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Choreographer state
  const [chorGroups, setChorGroups] = useState<ChorGroup[]>([]);
  const [chorLoading, setChorLoading] = useState(false);
  const [chorLoaded, setChorLoaded] = useState(false);
  const [merging, setMerging] = useState(false);
  const [mergeTarget, setMergeTarget] = useState<{ groupIdx: number; keepIdx: number } | null>(null);
  const [mergeError, setMergeError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dances/duplicates")
      .then(r => r.json())
      .then((data: DuplicateGroup[]) => { setGroups(data); setDanceLoading(false); })
      .catch(() => setDanceLoading(false));
  }, []);

  function handleSection(s: Section) {
    setSection(s);
    if (s === "choreographers" && !chorLoaded) loadChorDuplicates();
  }

  async function loadChorDuplicates() {
    setChorLoading(true);
    try {
      const res = await fetch("/api/choreographers/duplicates");
      if (res.ok) setChorGroups(await res.json());
    } finally {
      setChorLoading(false);
      setChorLoaded(true);
    }
  }

  async function deleteDance(id: string) {
    setDeleting(id);
    try {
      const res = await fetch(`/api/dances/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setGroups(prev =>
        prev
          .map(g => ({ ...g, dances: g.dances.filter(d => d.id !== id) }))
          .filter(g => {
            const remaining = g.dances;
            if (remaining.length < 2) return false;
            for (let i = 0; i < remaining.length; i++) {
              for (let j = i + 1; j < remaining.length; j++) {
                if (sharedChoreographers(remaining[i], remaining[j]).length > 0) return true;
              }
            }
            return false;
          })
      );
    } finally {
      setDeleting(null);
      setConfirmDelete(null);
    }
  }

  async function mergeChoreographer(groupIdx: number, keepIdx: number) {
    const group = chorGroups[groupIdx];
    setMerging(true);
    setMergeError(null);

    const keepId = group.ids[keepIdx];
    const deleteIds = group.ids.filter((_, i) => i !== keepIdx);

    try {
      for (const deleteId of deleteIds) {
        const res = await fetch("/api/choreographers/merge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keepId, deleteId }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? "Merge failed");
        }
      }
      setChorGroups(prev => prev.filter((_, i) => i !== groupIdx));
      setMergeTarget(null);
    } catch (e) {
      setMergeError(e instanceof Error ? e.message : "Merge failed");
    } finally {
      setMerging(false);
    }
  }

  return (
    <div className="page-pad" style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 6px" }}>
          Possible Duplicates
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0 }}>
          Find and clean up duplicate entries across dances, choreographers, and tracks.
        </p>
      </div>

      {/* Section tabs */}
      <div style={{
        display: "flex", background: "var(--surface-raised)",
        borderRadius: 10, padding: 4, marginBottom: 24, gap: 4,
        border: "1px solid var(--border)", width: "fit-content",
      }}>
        {(["dances", "choreographers", "tracks"] as Section[]).map(s => (
          <button key={s} onClick={() => handleSection(s)} style={{
            padding: "8px 20px", borderRadius: 7, border: "none",
            background: section === s ? "var(--surface)" : "transparent",
            boxShadow: section === s ? "0 1px 3px rgba(0,0,0,0.1), 0 0 0 1px var(--border)" : "none",
            fontSize: 13, fontWeight: section === s ? 600 : 400,
            color: section === s ? "var(--text-primary)" : "var(--text-secondary)",
            cursor: "pointer", textTransform: "capitalize", transition: "all 0.15s",
          }}>{s}</button>
        ))}
      </div>

      {/* ── Dances section ─────────────────────────────────────────── */}
      {section === "dances" && (
        <>
          {danceLoading ? (
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Scanning for duplicates…</p>
          ) : groups.length === 0 ? (
            <EmptyState icon="✓" title="No dance duplicates found!" sub="All dance names look unique." />
          ) : (
            <>
              <SectionMeta count={groups.length} label="duplicate group" />
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {groups.map(group => (
                  <div key={group.normalizedName} style={{
                    background: "var(--surface)", borderRadius: 12,
                    border: "1px solid var(--border)", overflow: "hidden",
                  }}>
                    <div style={{
                      padding: "10px 16px", borderBottom: "1px solid var(--border)",
                      background: "var(--surface-raised)",
                      display: "flex", alignItems: "center", gap: 10,
                    }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                        Normalized: &ldquo;{group.normalizedName}&rdquo;
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: "#fff8ed", color: "#d97706" }}>
                        {group.dances.length} entries
                      </span>
                    </div>
                    {group.dances.map((dance, i) => {
                      const isConfirming = confirmDelete === dance.id;
                      const isDeleting = deleting === dance.id;
                      return (
                        <div key={dance.id} style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "14px 16px", gap: 12, flexWrap: "wrap",
                          borderTop: i > 0 ? "1px solid var(--border)" : "none",
                        }}>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 2px" }}>
                              {dance.danceName}
                            </p>
                            <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0 }}>
                              {dance.choreographerNames.length > 0 ? dance.choreographerNames.join(", ") : "Unknown choreographer"}
                              {dance.stepsheet && (
                                <a href={dance.stepsheet} target="_blank" rel="noopener noreferrer"
                                  style={{ marginLeft: 8, color: "var(--accent)", textDecoration: "none", fontSize: 11 }}>
                                  ↗ stepsheet
                                </a>
                              )}
                            </p>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, flexWrap: "wrap" }}>
                            {dance.difficulty && (
                              <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, border: `1px solid ${difficultyColor(dance.difficulty)}`, color: difficultyColor(dance.difficulty) }}>
                                {dance.difficulty}
                              </span>
                            )}
                            {dance.hasPrimaryTrack && <Chip label="has track" green />}
                            {dance.stepsheet && <Chip label="has stepsheet" green />}
                            {isConfirming ? (
                              <>
                                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Delete?</span>
                                <button onClick={() => deleteDance(dance.id)} disabled={isDeleting} style={dangerBtn}>
                                  {isDeleting ? "Deleting…" : "Yes, delete"}
                                </button>
                                <button onClick={() => setConfirmDelete(null)} style={ghostBtn}>Cancel</button>
                              </>
                            ) : (
                              <button onClick={() => setConfirmDelete(dance.id)} style={deleteChipBtn}>Delete</button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* ── Choreographers section ─────────────────────────────────── */}
      {section === "choreographers" && (
        <>
          {chorLoading ? (
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Scanning choreographers…</p>
          ) : chorGroups.length === 0 && chorLoaded ? (
            <EmptyState icon="✓" title="No choreographer duplicates found!" sub="All choreographer names look unique." />
          ) : (
            <>
              <SectionMeta count={chorGroups.length} label="possible duplicate" />
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 20 }}>
                Detected by similar spelling or one name containing the other. Select which name to keep when merging.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {chorGroups.map((group, groupIdx) => {
                  const isMerging = mergeTarget?.groupIdx === groupIdx;
                  return (
                    <div key={group.ids.join("-")} style={{
                      background: "var(--surface)", borderRadius: 12,
                      border: "1px solid var(--border)", overflow: "hidden",
                    }}>
                      <div style={{
                        padding: "10px 16px", borderBottom: "1px solid var(--border)",
                        background: "var(--surface-raised)",
                        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
                      }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                          {group.reason}
                        </span>
                        {!isMerging && (
                          <button onClick={() => { setMergeTarget({ groupIdx, keepIdx: -1 }); setMergeError(null); }} style={{
                            fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 6,
                            border: "1px solid var(--accent)", background: "var(--accent-subtle)",
                            color: "var(--accent-text)", cursor: "pointer",
                          }}>Merge…</button>
                        )}
                      </div>

                      {group.names.map((name, idx) => (
                        <div key={group.ids[idx]} style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "12px 16px", gap: 12, flexWrap: "wrap",
                          borderTop: idx > 0 ? "1px solid var(--border)" : "none",
                          background: isMerging && mergeTarget?.keepIdx === idx ? "var(--accent-subtle)" : undefined,
                          transition: "background 0.15s",
                        }}>
                          <div>
                            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 2px", display: "flex", alignItems: "center", gap: 6 }}>
                              {name}
                              <a
                                href={group.copperknobUrls[idx] ?? `https://www.copperknob.co.uk/choreographers?Search=${encodeURIComponent(name)}`}
                                target="_blank" rel="noopener noreferrer"
                                title={group.copperknobUrls[idx] ? "Choreographer page" : "Search on Copperknob"}
                                style={{ fontSize: 11, color: "var(--accent)", textDecoration: "none", fontWeight: 400 }}
                              >
                                ↗ Copperknob
                              </a>
                            </p>
                            <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0 }}>
                              {group.danceCounts[idx]} dance{group.danceCounts[idx] !== 1 ? "s" : ""}
                            </p>
                          </div>
                          {isMerging && (
                            <button
                              onClick={() => setMergeTarget({ groupIdx, keepIdx: idx })}
                              style={{
                                fontSize: 12, fontWeight: 600, padding: "5px 14px", borderRadius: 7,
                                border: mergeTarget?.keepIdx === idx ? "2px solid var(--accent)" : "1px solid var(--border)",
                                background: mergeTarget?.keepIdx === idx ? "var(--accent)" : "transparent",
                                color: mergeTarget?.keepIdx === idx ? "#fff" : "var(--text-secondary)",
                                cursor: "pointer", transition: "all 0.15s",
                              }}
                            >
                              {mergeTarget?.keepIdx === idx ? "✓ Keep this" : "Keep this"}
                            </button>
                          )}
                        </div>
                      ))}

                      {isMerging && (
                        <div style={{
                          padding: "12px 16px", borderTop: "1px solid var(--border)",
                          background: "var(--surface-raised)",
                          display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
                        }}>
                          {mergeTarget.keepIdx >= 0 ? (
                            <>
                              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                                Merge {group.names.filter((_, i) => i !== mergeTarget.keepIdx).join(", ")} into <strong>{group.names[mergeTarget.keepIdx]}</strong>?
                              </span>
                              <button
                                onClick={() => mergeChoreographer(groupIdx, mergeTarget.keepIdx)}
                                disabled={merging}
                                style={{ ...dangerBtn, background: "var(--accent)", border: "none" }}
                              >
                                {merging ? "Merging…" : "Confirm Merge"}
                              </button>
                              <button onClick={() => setMergeTarget(null)} style={ghostBtn}>Cancel</button>
                            </>
                          ) : (
                            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                              ← Select which name to keep
                            </span>
                          )}
                          {mergeError && <span style={{ fontSize: 12, color: "var(--danger-text)" }}>{mergeError}</span>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}

      {/* ── Tracks section (placeholder) ───────────────────────────── */}
      {section === "tracks" && (
        <div style={{
          padding: 48, textAlign: "center", background: "var(--surface)",
          borderRadius: 12, border: "1px dashed var(--border)",
        }}>
          <p style={{ fontSize: 28, marginBottom: 8 }}>🎵</p>
          <p style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 6px" }}>Track deduplication coming soon</p>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>
            Will detect duplicate song/artist entries and let you merge them across dances.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Small components ──────────────────────────────────────────────────────────

function SectionMeta({ count, label }: { count: number; label: string }) {
  if (count === 0) return null;
  return (
    <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>
      <span style={{ fontWeight: 700, color: "var(--warning-text)" }}>{count}</span>{" "}
      {label}{count !== 1 ? "s" : ""} found
    </p>
  );
}

function EmptyState({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <div style={{ padding: 48, textAlign: "center", background: "var(--surface)", borderRadius: 12, border: "1px solid var(--border)" }}>
      <p style={{ fontSize: 28, marginBottom: 8 }}>{icon}</p>
      <p style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 4px" }}>{title}</p>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>{sub}</p>
    </div>
  );
}

function Chip({ label, green }: { label: string; green?: boolean }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
      background: green ? "#f0fdf4" : "var(--surface-raised)",
      color: green ? "#16a34a" : "var(--text-secondary)",
    }}>{label}</span>
  );
}

const dangerBtn: React.CSSProperties = {
  padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600,
  border: "none", background: "#dc2626", color: "#fff", cursor: "pointer",
};

const ghostBtn: React.CSSProperties = {
  padding: "6px 10px", borderRadius: 8, fontSize: 12,
  border: "1px solid var(--border)", background: "none",
  color: "var(--text-secondary)", cursor: "pointer",
};

const deleteChipBtn: React.CSSProperties = {
  padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600,
  border: "1px solid #fca5a5", background: "#fef2f2", color: "#dc2626", cursor: "pointer",
};
