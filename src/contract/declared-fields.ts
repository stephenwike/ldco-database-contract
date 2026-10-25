// Fields that belong in the contract before any document has them (decision 22). The contract is
// inferred from the data, so a new field would otherwise vanish on the next contract:infer until
// real documents carry it. scripts/infer-contract.ts adds each one listed here that it didn't observe.
// Values are zod source text; objectId and bsonDate from ../bson are available.

export const declaredFields: Record<string, Record<string, string>> = {
  // Publish dates at the precision the evidence supports (decision 22, amended). publishedAt is an exact
  // copperknob timestamp (feed or archived feed); published is the date as YYYY, YYYY-MM or YYYY-MM-DD (UTC);
  // publishedSource says where it came from. When publishedAt is set, published is its UTC day and the
  // source is "feed" or "feed-archive".
  "ldco.dances": {
    publishedAt: "bsonDate.optional()",
    published: String.raw`z.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$/).optional()`,
    publishedSource: 'z.enum(["feed", "feed-archive", "sync-time", "id-estimate"]).optional()',
  },
};
