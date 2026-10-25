// Builds src/migrations/data/publish-dates/publish-dates.json: a publish date for every dance we can date
// with confidence, at the precision we're sure of (YYYY, YYYY-MM or YYYY-MM-DD, UTC). Reads the local copy
// (npm run db:sync-local first) and the evidence in src/migrations/data/publish-dates/evidence/.
// Method and checks: src/migrations/data/publish-dates/README.md.
//
// Usage: npx tsx --env-file-if-exists=.env.local scripts/build-publish-dates.ts
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { MongoClient } from "mongodb";

const DIR = join("src", "migrations", "data", "publish-dates");
const HOUR = 3_600_000;
const DAY = 24 * HOUR;

/** copperknob-alert's 3-hourly sync running steadily (after the 2026-10-13/14 admin bulk import). */
const STEADY_SYNC_START = Date.UTC(2026, 9, 15);
/** Measured on 74 feed dances: creation came 0.35 to 3.89 h after publishing. */
const SYNC_LAG = 4 * HOUR;
/** The field order copperknob-alert's insert writes (lib/dances.ts since 18f4237). The admin's inserts differ. */
const ALERT_FIELD_ORDER = "_id,danceName,difficulty,choreographers,stepsheet,stepsheetUrls,primaryTrack,tracks,songArtists";
/** The sync runs from a 5-minute cron; its dances are created within seconds of a 5-minute mark. */
const CRON_SLACK_SECONDS = 120;

type Source = "feed" | "feed-archive" | "sync-time" | "id-estimate";
type Row = { danceId: string; published: string; publishedSource: Source; publishedAt?: string };
type Evidence = Record<string, unknown> & { danceId: string; danceName: string };

/** Worst id-interpolation error seen for a given gap between bracketing archive dates (hold-out test, README). */
function errorBound(gapDays: number): number {
  if (gapDays < 90) return 7 * DAY;
  if (gapDays < 200) return 13 * DAY;
  if (gapDays < 400) return 18 * DAY;
  if (gapDays < 700) return 36 * DAY;
  return 71 * DAY;
}

/** The most precise UTC calendar unit containing the whole window, or null if it spans a year boundary. */
function precisionOf(lo: number, hi: number): string | null {
  const a = new Date(lo).toISOString(), b = new Date(hi).toISOString();
  if (a.slice(0, 10) === b.slice(0, 10)) return a.slice(0, 10);
  if (a.slice(0, 7) === b.slice(0, 7)) return a.slice(0, 7);
  if (a.slice(0, 4) === b.slice(0, 4)) return a.slice(0, 4);
  return null;
}

function stepsheetKey(url: string): string | null {
  const m = url.match(/stepsheets\/([A-Za-z0-9]+)\//) ?? url.match(/stepsheetid=(\d+)/i) ?? url.match(/-ID(\d+)\.aspx/i);
  return m ? m[1].toUpperCase() : null;
}

function idTime(id: string): number | null {
  return /^[0-9a-f]{24}$/.test(id) ? parseInt(id.slice(0, 8), 16) * 1000 : null;
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri || !/localhost|127\.0\.0\.1/.test(uri)) throw new Error("Point MONGODB_URI at the local copy (npm run db:sync-local).");

  const archive: Record<string, string> = JSON.parse(readFileSync(join(DIR, "evidence", "feed-archive-dates.json"), "utf8"));
  const feed: { link: string; pub: string }[] = JSON.parse(readFileSync(join(DIR, "evidence", "copperknob-feed-2026-10-25.json"), "utf8"));
  const current = new Map(feed.map((f) => [stepsheetKey(f.link), f.pub] as const).filter(([k]) => k));

  // Numeric stepsheet ids rise with publish date: archive anchors sorted by id
  const anchors = Object.entries(archive)
    .filter(([k]) => /^\d+$/.test(k))
    .map(([k, v]) => ({ id: Number(k), t: Date.parse(v) }))
    .sort((a, b) => a.id - b.id);

  /** Publish window for a numeric id from the anchors around it (optionally ignoring the id's own anchor). */
  function idWindow(id: number, excludeSelf = false): { lo: number; hi: number; est: number } | null {
    const pts = excludeSelf ? anchors.filter((p) => p.id !== id) : anchors;
    const j = pts.findIndex((p) => p.id >= id);
    if (j <= 0) return null;
    const a = pts[j - 1], b = pts[j];
    if (b.id === id) return { lo: b.t, hi: b.t, est: b.t };
    const est = a.t + ((b.t - a.t) * (id - a.id)) / (b.id - a.id);
    const err = errorBound((b.t - a.t) / DAY);
    return { lo: Math.max(a.t, est - err), hi: Math.min(b.t, est + err), est };
  }

  const client = await new MongoClient(uri).connect();
  const rows: Row[] = [];
  const evidence: Evidence[] = [];
  const skipped: Record<string, number> = {};
  const skip = (why: string) => (skipped[why] = (skipped[why] ?? 0) + 1);
  const now = Date.now();

  try {
    const dances = client.db("ldco").collection("dances").find({});
    for await (const d of dances) {
      const danceId = String(d._id);
      const danceName = String(d.danceName ?? "");
      if (d.publishedAt) { skip("already has publishedAt"); continue; }
      const url = String(Array.isArray(d.stepsheet) ? d.stepsheet[0] ?? "" : d.stepsheet ?? "");
      const key = stepsheetKey(url);

      // 1. Copperknob's own timestamp: today's feed, then archived copies of it
      const feedPub = key ? current.get(key) : undefined;
      if (feedPub) {
        rows.push({ danceId, published: feedPub.slice(0, 10), publishedSource: "feed", publishedAt: feedPub });
        evidence.push({ danceId, danceName, method: "current feed pubDate", stepsheet: url });
        continue;
      }
      const archivePub = key ? archive[key] : undefined;
      if (archivePub) {
        // A re-listed revision would carry a later date than its stepsheet number predicts
        if (/^\d+$/.test(key!)) {
          const w = idWindow(Number(key), true);
          const t = Date.parse(archivePub);
          if (w && (t < w.lo - DAY || t > w.hi + DAY)) { skip("archive date disagrees with stepsheet number"); continue; }
        }
        rows.push({ danceId, published: archivePub.slice(0, 10), publishedSource: "feed-archive", publishedAt: archivePub });
        evidence.push({ danceId, danceName, method: "earliest pubDate in archived feed copies", stepsheet: url });
        continue;
      }

      // 2. Created by copperknob-alert's steady sync: published at most SYNC_LAG before creation
      const t = idTime(danceId);
      if (t !== null && t >= STEADY_SYNC_START && t <= now) {
        const fields = Object.keys(d).slice(0, 9).join(",");
        const secondsAfterMark = (t / 1000) % 300;
        if (fields !== ALERT_FIELD_ORDER || secondsAfterMark > CRON_SLACK_SECONDS) { skip("created after 2026-10-15 but not by the sync"); continue; }
        const published = precisionOf(t - SYNC_LAG, t);
        if (!published) { skip("sync window spans a year boundary"); continue; }
        rows.push({ danceId, published, publishedSource: "sync-time" });
        evidence.push({ danceId, danceName, method: "sync creation time", createdAt: new Date(t).toISOString(), window: [new Date(t - SYNC_LAG).toISOString(), new Date(t).toISOString()], fieldOrder: "copperknob-alert", secondsAfterCronMark: secondsAfterMark });
        continue;
      }

      // 3. Numeric stepsheet id between two archive dates
      if (key && /^\d+$/.test(key)) {
        const w = idWindow(Number(key));
        if (!w || Number(key) > anchors[anchors.length - 1].id) { skip("numeric id outside the archive's range"); continue; }
        const published = precisionOf(w.lo, w.hi);
        if (!published) { skip("id estimate spans a year boundary"); continue; }
        rows.push({ danceId, published, publishedSource: "id-estimate" });
        evidence.push({ danceId, danceName, method: "numeric stepsheet id between archive dates", stepsheet: url, estimate: new Date(w.est).toISOString(), window: [new Date(w.lo).toISOString(), new Date(w.hi).toISOString()] });
        continue;
      }
      skip("no reliable signal");
    }
  } finally {
    await client.close();
  }

  rows.sort((a, b) => a.danceId.localeCompare(b.danceId));
  evidence.sort((a, b) => a.danceId.localeCompare(b.danceId));
  writeFileSync(join(DIR, "publish-dates.json"), JSON.stringify(rows, null, 1) + "\n");
  writeFileSync(join(DIR, "evidence", "per-dance.json"), JSON.stringify(evidence, null, 1) + "\n");

  const bySource: Record<string, Record<string, number>> = {};
  for (const r of rows) {
    const p = r.published.length === 10 ? "day" : r.published.length === 7 ? "month" : "year";
    (bySource[r.publishedSource] ??= {})[p] = (bySource[r.publishedSource]?.[p] ?? 0) + 1;
  }
  console.log(`Wrote ${rows.length} dances to ${join(DIR, "publish-dates.json")}`);
  console.log(JSON.stringify(bySource));
  console.log("Skipped:", JSON.stringify(skipped));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
