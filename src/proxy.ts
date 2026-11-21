import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { signInConfigured } from "@/server/auth";
import { allowed } from "@/server/access";

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

// A browser sends a signed-in cookie (or remembered Basic credentials) with requests other sites make too, so a change
// (anything but a read) must come from this app's own pages: the browser's Sec-Fetch-Site, or failing that the Origin.
function fromThisApp(request: NextRequest): boolean {
  if (request.method === "GET" || request.method === "HEAD") return true;
  const site = request.headers.get("sec-fetch-site");
  if (site) return site === "same-origin";
  const origin = request.headers.get("origin");
  return origin !== null && origin === request.nextUrl.origin;
}

const isApi = (request: NextRequest) => request.nextUrl.pathname.startsWith("/api/");

// Signed in through ldco-auth (decision 30): a session, and the admin role in ldco.user_roles, read on the server
// (src/server/access.ts). Pages without a session go to sign-in; API requests get 401; a signed-in user who isn't an
// admin gets 403.
async function signedIn(request: NextRequest): Promise<NextResponse> {
  // NextAuth's own pages and callbacks
  if (request.nextUrl.pathname.startsWith("/api/auth/")) return NextResponse.next();
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const userId = token?.id ? String(token.id) : "";
  if (!userId) {
    if (isApi(request)) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
    const signIn = new URL("/api/auth/signin/ldco", request.nextUrl.origin);
    signIn.searchParams.set("callbackUrl", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(signIn);
  }
  if (!(await allowed(userId, "admin"))) {
    const message = "Your LDCO account isn't an admin here. The owner can make it one on the admin's Users page.";
    return isApi(request)
      ? NextResponse.json({ error: message }, { status: 403 })
      : new NextResponse(`${message}\n\nSign out: /api/auth/signout`, { status: 403, headers: { "content-type": "text/plain; charset=utf-8" } });
  }
  return NextResponse.next();
}

// Until sign-in through ldco-auth is set up: HTTP Basic with the one shared password, as before.
function sharedPassword(request: NextRequest): NextResponse {
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

export async function proxy(request: NextRequest) {
  if (!fromThisApp(request)) return new NextResponse("Changes must come from this app's own pages.", { status: 403 });
  return signInConfigured() ? signedIn(request) : sharedPassword(request);
}

// /api/contract has its own bearer-token check and must stay reachable by CI builds.
export const config = {
  matcher: ["/((?!api/contract|_next/static|_next/image|favicon.ico).*)"],
};
