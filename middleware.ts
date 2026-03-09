import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Global middleware. Add auth checks, redirects, headers.
 */
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static
     * - _next/image
     * - favicon.ico
     * - public files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
