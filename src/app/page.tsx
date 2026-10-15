import Link from "next/link";
import { collections, CONTRACT_VERSION } from "@/contract";
import { purposeOf, purposes } from "@/contract/purposes";

export const dynamic = "force-dynamic";

export default function Home() {
  const keys = Object.keys(collections);
  const databases = new Set(keys.map((k) => collections[k as keyof typeof collections].database));
  const unassigned = keys.filter((k) => !purposeOf(k));

  return (
    <main>
      <h1>LDCO Database</h1>
      <p className="lede">
        The contract for the shared MongoDB: {keys.length} collections across {databases.size} databases, organised by
        purpose. Everything here is read-only.
      </p>

      <div className="cards" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="stat">v{CONTRACT_VERSION}</div>
          <p>Contract version that apps' builds check against.</p>
        </div>
        <Link className="card" href="/collections">
          <div className="stat">{keys.length}</div>
          <p>Collections, with live validation against the contract.</p>
        </Link>
        <Link className="card" href="/relationships">
          <div className="stat">→</div>
          <p>Relationships between collections and dangling references.</p>
        </Link>
        <Link className="card" href="/migrations">
          <div className="stat">⇄</div>
          <p>Migrations: status and dry runs.</p>
        </Link>
      </div>

      <h2>Purposes</h2>
      <div className="cards">
        {purposes.map((p) => (
          <Link key={p.id} className="card" href={`/collections#${p.id}`}>
            <h3>
              {p.name} <span className="badge muted">{p.collections.length}</span>
            </h3>
            <p>{p.description}</p>
          </Link>
        ))}
        {unassigned.length ? (
          <Link className="card" href="/collections#unassigned">
            <h3>
              Unassigned <span className="badge warn">{unassigned.length}</span>
            </h3>
            <p>Collections with no purpose yet. Add them to src/contract/purposes.ts.</p>
          </Link>
        ) : null}
      </div>
    </main>
  );
}
