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
    <main style={{ fontFamily: "sans-serif", padding: 24 }}>
      <p>
        <Link href={`/collections/${key}/documents`}>Back to {key} documents</Link>
      </p>
      <h1>
        {key} / {id}
      </h1>
      <p>Private fields are masked ({MASKED_FIELD_HINT}).</p>

      <h2>Contract validation</h2>
      {doc.issues.length === 0 ? (
        <p style={{ color: "green" }}>Valid.</p>
      ) : (
        <ul style={{ color: "crimson" }}>
          {doc.issues.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      )}

      <h2>Document</h2>
      <pre style={{ background: "#f4f4f4", padding: 12, overflow: "auto" }}>{doc.masked}</pre>
    </main>
  );
}
