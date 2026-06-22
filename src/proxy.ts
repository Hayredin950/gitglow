import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = ["/analyze", "/intake", "/preview", "/deploy", "/complete", "/dashboard"];

export function proxy(req: NextRequest & { auth?: unknown }) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));

  if (isProtected && !req.auth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Wrap with NextAuth so req.auth is populated
export default auth(proxy as Parameters<typeof auth>[0]);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
