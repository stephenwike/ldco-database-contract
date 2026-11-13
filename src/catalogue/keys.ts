// How the linedance catalogue keys names (decision 28). Copies of ldco-harvester's scripts/lib/catalogue.mjs
// (keyOf, nameKeyOf) and scripts/lib/rank.mjs (nameWordsOf): a dance or person written by any app must get the
// same keys the harvester gives, or searches miss it. Change them together.

/** Lower case, accents and punctuation gone, "&" as "and", single spaces: "Boot Scootin' Boogie" → "boot scootin boogie". */
export const keyOf = (s: unknown): string =>
  String(s ?? "")
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

/** A dance's nameKey: keyOf its name, leaving out a bracketed part in another script ("Ali (阿里)" → "ali"). */
export function nameKeyOf(name: string): string {
  const latin = String(name ?? "").replace(/[([]([^)\]]*)[)\]]/g, (all: string, inner: string) =>
    /[^\p{Script=Latin}\p{N}\p{P}\p{S}\p{Z}]/u.test(inner) ? " " : all,
  );
  return keyOf(latin) || keyOf(name);
}

/** The distinct words of a nameKey, stored as nameWords for the indexed word search. */
export const nameWordsOf = (nameKey: string): string[] => [...new Set(String(nameKey ?? "").split(" ").filter(Boolean))];
