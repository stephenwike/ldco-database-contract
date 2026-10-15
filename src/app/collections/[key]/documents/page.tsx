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
    <main>
      <div className="crumbs">
        <Link href="/collections">Collections</Link> / <Link href={`/collections/${key}`}>{key}</Link>
      </div>
      <h1>Documents</h1>
      <p className="lede">
        {field ? (
          <>
            Where <code>{field}</code> = <code>{value}</code>. <Link href={base}>Clear filter</Link>.{" "}
          </>
        ) : null}
        {total.toLocaleString()} documents, page {page} of {pages}. Private fields are masked ({MASKED_FIELD_HINT}).
      </p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>_id</th>
              <th>Preview</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="mono" style={{ whiteSpace: "nowrap" }}>
                  <Link href={`${base}/${encodeURIComponent(r.id)}`}>{r.id}</Link>
                </td>
                <td className="mono muted">{r.preview}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pager">
        {page > 1 ? <Link href={query(page - 1)}>← Previous</Link> : null}
        {page < pages ? <Link href={query(page + 1)}>Next →</Link> : null}
      </div>
    </main>
  );
}
