import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

// Interim auth: HTTP Basic with a single shared password. Replace with a standard IdP (e.g. ldco-auth).
export function proxy(request: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return new NextResponse("ADMIN_PASSWORD is not configured.", { status: 503 });

  const header = request.headers.get("authorization") ?? "";
  if (header.startsWith("Basic ")) {
    const decoded = Buffer.from(header.slice(6), "base64").toString();
    const given = decoded.slice(decoded.indexOf(":") + 1);
    if (safeEqual(given, password)) return NextResponse.next();
  }
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="ldco-database"' },
  });
}

// /api/contract has its own bearer-token check and must stay reachable by CI builds.
export const config = {
  matcher: ["/((?!api/contract|_next/static|_next/image|favicon.ico).*)"],
};
