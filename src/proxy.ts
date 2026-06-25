import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = ["/analyze", "/intake", "/preview", "/deploy", "/complete", "/dashboard"];

// NextAuth v5 JWT session cookie names
const SESSION_COOKIE = [
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
  "authjs.session-token",
  "__Secure-authjs.session-token",
];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));

  if (isProtected) {
    const hasSession = SESSION_COOKIE.some((name) => req.cookies.has(name));

    if (!hasSession) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
