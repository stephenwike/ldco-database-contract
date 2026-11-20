import { GAPS } from "@/catalogue";
import { LAB_DEFAULTS } from "@/server/searchLab";
import SearchLab from "@/components/searchLab/SearchLab";

export const dynamic = "force-dynamic";

export default function SearchLabPage() {
  return (
    <main>
      <h1>Search lab</h1>
      <p className="lede">
        Try the dance search and the relevance rank with other weights, on the live catalogue. Results update as you change anything. Nothing is saved or
        written: a setting that works goes into the package (<code>RANK_WEIGHTS</code>, <code>RANK_RECENT_MONTHS</code>, <code>MATCH_POINTS</code>), so every app
        that searches gets it.
      </p>
      <SearchLab defaults={LAB_DEFAULTS} gaps={GAPS.map((g) => ({ id: g.id, label: g.label }))} />
    </main>
  );
}
