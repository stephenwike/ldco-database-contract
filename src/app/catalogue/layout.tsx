"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// The catalogue tools (decision 29): editing the live linedance catalogue. Moved from line-dance-manager-admin, whose
// pages style themselves with its colour names; .tools maps those onto this app's (globals.css), dark mode included.
const TABS = [
  { href: "/catalogue", label: "Catalogue" },
  { href: "/catalogue/audit", label: "Audit" },
  { href: "/catalogue/duplicates", label: "Duplicate dances" },
  { href: "/catalogue/track-duplicates", label: "Duplicate tracks" },
  { href: "/catalogue/choreographer-duplicates", label: "Duplicate choreographers" },
  { href: "/catalogue/merges", label: "Merge history" },
];

export default function CatalogueLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <main className="tools">
      <p className="crumbs">Edits here change the live catalogue.</p>
      <nav className="tabs">
        {TABS.map((t) => (
          <Link key={t.href} href={t.href} className={path === t.href ? "active" : undefined}>
            {t.label}
          </Link>
        ))}
      </nav>
      {children}
    </main>
  );
}
