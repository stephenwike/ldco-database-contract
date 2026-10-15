import Link from "next/link";
import { notFound } from "next/navigation";
import { collections } from "@/contract";
import { listDocuments } from "@/server/documents";
import { MASKED_FIELD_HINT } from "@/server/mask";
import type { CollectionKey } from "@/server/validate";

export const dynamic = "force-dynamic";

export default async function DocumentsPage({
  params,
  searchParams,
}: {
  params: Promise<{ key: string }>;
  searchParams: Promise<{ page?: string; field?: string; value?: string }>;
}) {
  const { key } = await params;
  if (!(key in collections)) notFound();
  const { page: pageParam, field, value } = await searchParams;
  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);

  const result = await listDocuments(key as CollectionKey, page, field, value).catch(() => null);
  if (!result) notFound();
  const { total, pages, rows } = result;
  const base = `/collections/${key}/documents`;
  const query = (p: number) =>
    `${base}?page=${p}${field ? `&field=${encodeURIComponent(field)}&value=${encodeURIComponent(value ?? "")}` : ""}`;

  return (
    <main style={{ fontFamily: "sans-serif", padding: 24 }}>
      <p>
        <Link href={`/collections/${key}`}>Back to {key}</Link>
      </p>
      <h1>{key} documents</h1>
      <p>
        {field ? (
          <>
            Where <code>{field}</code> = <code>{value}</code>. <Link href={base}>Clear filter</Link>.{" "}
          </>
        ) : null}
        {total} documents, page {page} of {pages}. Private fields are masked ({MASKED_FIELD_HINT}).
      </p>
      <table cellPadding={6}>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>
                <Link href={`${base}/${encodeURIComponent(r.id)}`}>{r.id}</Link>
              </td>
              <td style={{ fontFamily: "monospace", fontSize: 12 }}>{r.preview}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        {page > 1 ? <Link href={query(page - 1)}>Previous</Link> : null}
        {page > 1 && page < pages ? " | " : null}
        {page < pages ? <Link href={query(page + 1)}>Next</Link> : null}
      </p>
    </main>
  );
}
