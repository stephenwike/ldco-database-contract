import Link from "next/link";
import { getServerSession } from "next-auth";
import { CONTRACT_VERSION } from "@/contract";
import { authOptions, signInConfigured } from "@/server/auth";
import "./globals.css";

export const metadata = { title: "LDCO Database" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Who is signed in, once sign-in goes through ldco-auth (decision 30)
  const user = signInConfigured() ? (await getServerSession(authOptions))?.user : null;
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
            <Link href="/catalogue">Catalogue</Link>
            <Link href="/dances">Dances</Link>
            <Link href="/search-lab">Search lab</Link>
            <span className="version">
              contract v{CONTRACT_VERSION}
              {user && (
                <>
                  {" · "}
                  {user.name || user.email} · <a href="/api/auth/signout">Sign out</a>
                </>
              )}
            </span>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
