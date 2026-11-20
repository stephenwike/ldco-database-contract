"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// The Dances tools (decision 29): editing the live ldco dances (ldco.dances, its choreographers and tracks), which
// apps still read until decision 28's step 5 retires them. Moved from line-dance-manager-admin; .tools maps its colour
// names onto this app's.
const TABS = [
  { href: "/dances", label: "Dances" },
  { href: "/dances/incomplete", label: "Incomplete" },
  { href: "/dances/duplicates", label: "Possible duplicates" },
  { href: "/dances/bulk", label: "Bulk import" },
];

export default function DancesLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <main className="tools">
      <p className="crumbs">Edits here change the live ldco dances.</p>
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
