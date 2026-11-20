import { NextResponse } from "next/server";

/**
 * A parsed JSON object. Field types stay loose because each route checks its own keys.
 * `null`, arrays, and primitives are not objects.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JsonBody = Record<string, any>;

const NOT_AN_OBJECT = { error: "JSON body must be an object" };

/** A JSON object. `null`, arrays, and primitives are not objects. */
export function isJsonObject(value: unknown): value is JsonBody {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/**
 * Read a JSON object from the request.
 * Invalid JSON and non-objects return 400 before the caller touches a database.
 */
export async function readJsonObject(req: { json(): Promise<unknown> }): Promise<JsonBody | NextResponse> {
  let parsed: unknown;
  try {
    parsed = await req.json();
  } catch {
    return NextResponse.json(NOT_AN_OBJECT, { status: 400 });
  }
  if (!isJsonObject(parsed)) {
    return NextResponse.json(NOT_AN_OBJECT, { status: 400 });
  }
  return parsed;
}
