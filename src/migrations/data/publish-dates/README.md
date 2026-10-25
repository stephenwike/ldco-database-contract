# Publish dates for ldco.dances (backfill data, 2026-10-25)

`publish-dates.json` holds one row per dance we can date with confidence, at the precision we're sure of:

```
{ danceId, published: "YYYY" | "YYYY-MM" | "YYYY-MM-DD" (UTC), publishedSource, publishedAt? }
```

Rebuild it with `npx tsx --env-file-if-exists=.env.local scripts/build-publish-dates.ts` after `npm run db:sync-local`.
It only covers dances without `publishedAt`. `evidence/per-dance.json` records, for each row, how it was dated
and the window it came from.

## Rule

Each source gives a window the publish time must fall in. `published` is the most precise UTC unit (day, month
or year) that contains the whole window. A window crossing a year boundary gives no row. When `publishedAt` is
set, `published` is its UTC day.

## Sources (counts from the live copy of 2026-10-25, 2,708 dances)

| `publishedSource` | Rows | Precision | Window |
|---|---|---|---|
| `feed` | 74 | day + `publishedAt` | Copperknob's RSS `pubDate` today (`evidence/copperknob-feed-2026-10-25.json`, 77 items, 2026-10-23 to 25). copperknob-alert's next sync sets `publishedAt` on these itself |
| `feed-archive` | 58 | day + `publishedAt` | The earliest `pubDate` for the stepsheet in 119 Wayback Machine copies of the same feed, 2011 to 2026 (`evidence/feed-archive-snapshots.txt`; extracted to `evidence/feed-archive-dates.json`, 6,572 stepsheets) |
| `sync-time` | 339 | 336 day, 3 month | [creation − 4 h, creation] for dances copperknob-alert's sync created from 2026-10-15 |
| `id-estimate` | 1,002 | 272 month, 730 year | A numeric stepsheet id between two archived ids (see below) |

Skipped: 1,070 with no reliable signal (letter-code stepsheets not in any feed copy, including the 2026-10-13/14
bulk import), 108 numeric ids outside the archive's range (older than February 2011, or after the last numeric
id), 56 estimates spanning a year boundary, 1 dance created after 2026-10-15 that failed the sync checks.

## Checks

**The sync's lag.** On the 74 dances in today's feed, `_id` creation came 0.35 to 3.89 h after `pubDate`
(median 2.0 h), never before. The sync publishes feed dances every ~3 hours (copperknob-alert
`shouldRunDancesSync(3)`), so 4 h covers it.

**Sync-created, not bulk-imported (the 339 `sync-time` rows).** The admin's inserts also use ObjectId hex ids,
so two independent checks separate them; a dance must pass both:
- *Field order.* MongoDB keeps fields in insertion order. copperknob-alert writes
  `_id,danceName,difficulty,choreographers,stepsheet,stepsheetUrls,primaryTrack,tracks,songArtists` (unchanged
  since 18f4237, 2026-10-14). The admin's bulk import writes `difficulty` after `stepsheetUrls`, and its
  single-dance create has no `stepsheetUrls`.
- *Cron timing.* The sync runs from a 5-minute cron, so its dances are created within seconds of a 5-minute mark.
  An import can happen at any time.

Results:

| Group | Field order | Seconds after a 5-minute mark |
|---|---|---|
| The 74 feed-proven dances | all copperknob-alert's | at most 40 |
| The 339 `sync-time` rows | all copperknob-alert's | at most 46 |
| One excluded dance ("Stalking Ur Moves", created 2026-10-15T03:40) | different | – |
| The 2026-10-13/14 batch | 707 of 842 in bulk-import order | random (0 to 299) |

The 2026-10-13/14 batch is therefore the admin bulk import, and it's excluded.

**Numeric ids track publish dates.** Across the 6,495 numeric ids in the archive (82188 to 207815, 2011-02 to
2026-02), there's one inversion. Copperknob switched to letter codes in 2026. Letter codes are not dated:
copperknob appears to have re-keyed old stepsheets too (e.g. "Timber").

**Estimate error.** Hold-out test: archive days were hidden and their ids predicted from the surrounding days.
Worst error by gap between the bracketing anchors:

| Gap between anchors | Worst error |
|---|---|
| < 90 d | 7 d |
| < 200 d | 13 d |
| < 400 d | 18 d |
| < 700 d | 36 d |
| larger | 71 d |

An estimate's window is estimate ± that bound, clipped to the two anchor dates (publish order follows id order).

**Revisions.** A re-listed revision in an archived feed copy would carry a later date than its id predicts. Each
`feed-archive` date was checked against the window from the other anchors; none disagreed.

## Sorting

Sort by the end of the period in app code: `"2026-01"` → 2026-01-31T23:59:59.999Z. Break ties by stepsheet
number, which keeps true order within a period. MongoDB's string sort puts `"2026"` before `"2026-01"`, i.e.
start of period.
