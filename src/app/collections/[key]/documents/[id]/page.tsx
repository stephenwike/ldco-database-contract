import Link from "next/link";
import { notFound } from "next/navigation";
import { collections } from "@/contract";
import { getDocument } from "@/server/documents";
import { MASKED_FIELD_HINT } from "@/server/mask";
import type { CollectionKey } from "@/server/validate";

export const dynamic = "force-dynamic";

function decode(id: string) {
  try {
    return decodeURIComponent(id);
  } catch {
    return id;
  }
}

export default async function DocumentPage({ params }: { params: Promise<{ key: string; id: string }> }) {
  const { key, id: rawId } = await params;
  if (!(key in collections)) notFound();
  const id = decode(rawId);

  const doc = await getDocument(key as CollectionKey, id);
  if (!doc) notFound();

  return (
    <main>
      <div className="crumbs">
        <Link href="/collections">Collections</Link> / <Link href={`/collections/${key}`}>{key}</Link> /{" "}
        <Link href={`/collections/${key}/documents`}>Documents</Link>
      </div>
      <h1 className="mono" style={{ fontSize: 20 }}>
        {id}
      </h1>
      <p className="lede">
        {doc.issues.length === 0 ? (
          <span className="badge ok">valid against the contract</span>
        ) : (
          <span className="badge bad">{doc.issues.length} contract violations</span>
        )}{" "}
        Private fields are masked ({MASKED_FIELD_HINT}).
      </p>

      {doc.issues.length ? (
        <div className="panel">
          <h3>Violations</h3>
          <ul className="notes bad-text">
            {doc.issues.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <pre>{doc.masked}</pre>
    </main>
  );
}
