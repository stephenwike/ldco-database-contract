import Link from "next/link";
import { CONTRACT_VERSION } from "@/contract";
import "./globals.css";

export const metadata = { title: "LDCO Database" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <nav>
            <Link href="/" className="brand">
              LDCO Database
            </Link>
            <Link href="/collections">Collections</Link>
            <Link href="/relationships">Relationships</Link>
            <Link href="/migrations">Migrations</Link>
            <span className="version">contract v{CONTRACT_VERSION}</span>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
