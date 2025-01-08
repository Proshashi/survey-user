import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Token is automatically handled by withAuth
    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/login",
      error: "/login",
    },
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: [
    "/survey/:path*",
    // Exclude root path, auth-related and public paths
    "/((?!$|/|auth|login|api|_next/static|_next/image|favicon.ico).*)",
  ],
};
