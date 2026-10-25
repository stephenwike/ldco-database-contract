// An app's scope: the parts of the contract it uses, declared in its package.json as
// "ldco": { "uses": [...] } (decision 21). Each entry is "*" (everything), "<database>.*" (a whole
// database) or "<database>.<collection>". ldco-db-check only fails a build when a collection in scope
// changed or was removed; an app without a scope is checked against the whole contract.

export type Scope = string[];

export function inScope(key: string, scope: Scope): boolean {
  const [database] = key.split(".", 1);
  return scope.some((entry) => entry === "*" || entry === key || entry === `${database}.*`);
}

/** Scope entries that match none of the given collection keys (usually a typo or a removed collection). */
export function unmatchedEntries(scope: Scope, keys: string[]): string[] {
  return scope.filter((entry) => !keys.some((key) => inScope(key, [entry])));
}

/** Reads "ldco.uses" from a parsed package.json; undefined when the app declares no scope. */
export function scopeFromPackageJson(pkg: unknown): Scope | undefined {
  const uses = (pkg as { ldco?: { uses?: unknown } })?.ldco?.uses;
  if (uses === undefined) return undefined;
  if (!Array.isArray(uses) || !uses.every((u) => typeof u === "string" && u.length > 0)) {
    throw new Error('"ldco.uses" in package.json must be a list of strings like "djfeed.*" or "ldco.dances".');
  }
  return uses;
}
