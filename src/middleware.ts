import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

const SESSION_COOKIE_NAME = "session_token";

// Define paths that are always public (e.g., login, static assets)
const publicPaths = ['/login', '/favicon.ico'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Check if the path is static or public
  const isPublicPath = publicPaths.includes(pathname);
  const isAuthPath = pathname === '/login';
  const isRootPath = pathname === '/';

  // 2. Get the session token from cookies
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  // 3. Logic for Redirecting

  // If user is on an auth path (like /login) OR root and has a session, redirect them to a dashboard
  if ((isAuthPath || isRootPath) && sessionToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If user is NOT on a public path and DOES NOT have a session, redirect them to /login
  if (!isPublicPath && !sessionToken) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Otherwise, allow the request to proceed
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - any file with an extension (e.g., .webp, .png, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
