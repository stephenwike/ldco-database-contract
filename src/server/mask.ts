// Fields whose values are never shown in the UI, at any depth.
const PRIVATE_KEY = /password|passwd|secret|token|webhook|email|^ip$|ipaddress|user_?agent|google_?id|signature|phone/i;

export const MASKED_FIELD_HINT = "password, secret, token, webhook, email, ip, userAgent, googleId, signature, phone";

// Returns a JSON-safe copy with private values replaced by a placeholder; null/undefined stay visible.
export function maskDocument(value: unknown, key = ""): unknown {
  if (value === null || value === undefined) return value;
  if (PRIVATE_KEY.test(key)) return `[masked ${Array.isArray(value) ? "array" : typeof value}]`;
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map((v) => maskDocument(v, key));
  if (typeof value === "object") {
    const bson = (value as { _bsontype?: string })._bsontype;
    if (bson === "ObjectId") return { $oid: String(value) };
    if (bson) return `[${bson}] ${String(value)}`;
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, maskDocument(v, k)]));
  }
  return value;
}
