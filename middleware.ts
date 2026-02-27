import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  console.log("Cookie detectada en Middleware:", !!token); // <-- Agrega este log

  const isPublicPath = pathname === '/' || pathname === '/login';

  if (!isPublicPath && !token) {
    // Si estamos en local y falla, podrías estar perdiendo la cookie por el puerto
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si ya tiene token y va a login, mándalo al dashboard (opcional)
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}


// middleware.ts
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};