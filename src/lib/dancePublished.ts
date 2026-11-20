/**
 * `ldco.dances.published` (decision 22, `@ldco/database` `LdcoDancesSchema`).
 *
 * Optional UTC calendar string: `YYYY`, `YYYY-MM`, or `YYYY-MM-DD`.
 * `publishedAt` is a separate BSON Date (an exact copperknob `pubDate`) and is not written here.
 */

/** Same pattern as `LdcoDancesSchema.published`. */
export const PUBLISH_DATE_PATTERN = /^\d{4}(-\d{2}(-\d{2})?)?$/;

/** Today's calendar day in UTC, `YYYY-MM-DD`. */
export function utcPublishDay(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export function isPublishDate(value: unknown): value is string {
  return typeof value === "string" && PUBLISH_DATE_PATTERN.test(value);
}

/** A stored publish date, or null when the field is missing or not a contract string. */
export function readPublishDate(value: unknown): string | null {
  return isPublishDate(value) ? value : null;
}

export type PublishedWrite =
  | { ok: true; published: string | false }
  | { ok: false; error: string };

/**
 * Map a PATCH `published` value onto the stored field.
 *
 * `true` is the Publish action: store today's UTC day, never the boolean.
 * A contract date string is stored as given.
 *
 * Unpublish is not defined by decision 22 ("nothing recorded" means the field
 * is absent). `false` and `null` keep the 11f1b0c behavior of storing boolean
 * `false` until that is decided.
 */
export function resolvePublished(value: unknown, now: Date = new Date()): PublishedWrite {
  if (value === true) {
    return { ok: true, published: utcPublishDay(now) };
  }
  if (isPublishDate(value)) {
    return { ok: true, published: value };
  }
  if (value === false || value === null) {
    return { ok: true, published: false };
  }
  return {
    ok: false,
    error: "published must be true (publish now) or a UTC date string (YYYY, YYYY-MM, or YYYY-MM-DD)",
  };
}

/**
 * `ldco.dances` clauses for a `published` value that is not a decision-22 date.
 * Includes the boolean `true` / `false` values written by 11f1b0c.
 */
export const unpublishedPublishedConditions: Record<string, unknown>[] = [
  { published: { $exists: false } },
  { published: null },
  { published: true },
  { published: false },
  { published: "" },
  { published: { $not: PUBLISH_DATE_PATTERN } },
];
