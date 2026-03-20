import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions } from './lib/session';
import { Session } from './schemas/auth';

// Define paths that are always public (e.g., login, static assets)
const publicPaths = ['/login', '/favicon.ico'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();
  const session = await getIronSession<Session>(request, response, sessionOptions);

  // Verificamos también la cookie del token que usa el cliente (api.ts)
  const hasSessionToken = request.cookies.has("session_token");

  // 3. Logic for Redirecting
  // El usuario está realmente autenticado solo si tiene sesión Y el token para la API
  const isAuthenticated = session.username && hasSessionToken;

  // 3. Logic for Redirecting

  // Si el usuario tiene una sesión y está en la página de login, lo redirigimos a la página principal.
  if (isAuthenticated && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url)); // Redirige a la página principal si ya hay sesión
  }

  // Si el usuario no tiene sesión y no está en una ruta pública, lo redirigimos a la página de login.
  const isPublic = publicPaths.some(path => pathname.startsWith(path));
  if (!isAuthenticated && !isPublic) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Otherwise, allow the request to proceed
  return response;
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
