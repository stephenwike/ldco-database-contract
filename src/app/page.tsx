import Link from "next/link";
import { CONTRACT_VERSION } from "@/contract";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main style={{ fontFamily: "sans-serif", padding: 24 }}>
      <p>LDCO database contract v{CONTRACT_VERSION}</p>
      <Link href="/collections">Collections</Link>
      {" | "}
      <Link href="/relationships">Relationships</Link>
    </main>
  );
}
