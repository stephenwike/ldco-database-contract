import type { NextAuthOptions } from "next-auth";

// Signing in through ldco-auth (decision 30; line-dance-manager-admin docs/phase-2-sign-in.md): the same LDCO account
// as the website, Line Dance Manager and the DJ Feed, through ldco-auth's OAuth flow with PKCE. Who may do what is
// checked on the server from ldco.user_roles (src/proxy.ts), never taken from the session.
//   LDCO_AUTH_URL             https://auth.beyondlinedance.com
//   LDCO_OAUTH_CLIENT_ID      this app's client in ldco-auth (OAUTH_CLIENT_DATABASE_ID there)
//   LDCO_OAUTH_CLIENT_SECRET  and its secret (OAUTH_CLIENT_DATABASE_SECRET there)
//   NEXTAUTH_SECRET           signs this app's own session cookie; NEXTAUTH_URL is this app's address
// Until all four are set, the app keeps the shared password (ADMIN_PASSWORD), so it can be deployed first.

const LDCO_AUTH_URL = (process.env.LDCO_AUTH_URL ?? "").replace(/\/$/, "");

/** Whether sign-in through ldco-auth is set up; otherwise the shared password still applies. */
export function signInConfigured(): boolean {
  return !!(process.env.LDCO_AUTH_URL && process.env.LDCO_OAUTH_CLIENT_ID && process.env.LDCO_OAUTH_CLIENT_SECRET && process.env.NEXTAUTH_SECRET);
}

/** How long a sign-in lasts before the app asks again. */
export const SESSION_HOURS = 12;

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "ldco",
      name: "LDCO",
      type: "oauth",
      authorization: { url: `${LDCO_AUTH_URL}/api/oauth/authorize`, params: { scope: "openid profile email" } },
      token: `${LDCO_AUTH_URL}/api/oauth/token`,
      userinfo: `${LDCO_AUTH_URL}/api/oauth/userinfo`,
      clientId: process.env.LDCO_OAUTH_CLIENT_ID,
      clientSecret: process.env.LDCO_OAUTH_CLIENT_SECRET,
      // PKCE as well as state: ldco-auth requires it of this client
      checks: ["pkce", "state"],
      idToken: false,
      profile(profile: { sub: string; email: string; name: string }) {
        return { id: profile.sub, email: profile.email, name: profile.name };
      },
    },
  ],
  session: { strategy: "jwt", maxAge: SESSION_HOURS * 3600 },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = { id: String(token.id ?? ""), email: token.email ?? null, name: token.name ?? null } as typeof session.user;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
