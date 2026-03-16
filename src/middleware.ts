import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// El nombre de la cookie debe coincidir con el definido en `lib/session.ts`
const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "sadu-uneg-session";

// Define paths that are always public (e.g., login, static assets)
const publicPaths = ['/login', '/favicon.ico'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  // 3. Logic for Redirecting

  // Si el usuario tiene una sesión y está en la página de login, lo redirigimos a la página principal.
  if (session && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url)); // Redirige a la página principal si ya hay sesión
  }

  // Si el usuario no tiene sesión y no está en una ruta pública, lo redirigimos a la página de login.
  const isPublic = publicPaths.some(path => pathname.startsWith(path));
  if (!session && !isPublic) {
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
