// Fields that belong in the contract before any document has them (decision 22). The contract is
// inferred from the data, so a new field would otherwise vanish on the next contract:infer until
// real documents carry it. scripts/infer-contract.ts adds each one listed here that it didn't observe.
// Values are zod source text; objectId and bsonDate from ../bson are available.

export const declaredFields: Record<string, Record<string, string>> = {
  // When the stepsheet was published on copperknob (the feed item's pubDate). Real dates only: set by
  // copperknob-alert's sync for dances that come through the feed; older dances leave it unset.
  "ldco.dances": { publishedAt: "bsonDate.optional()" },
};
