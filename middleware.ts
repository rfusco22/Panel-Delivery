import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/sessions-memory';

export function middleware(request: NextRequest) {
  // Rutas protegidas que requieren autenticación
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const sessionId = request.cookies.get('session-id')?.value;
    const allCookies = request.cookies.getAll();

    console.log('[v0] Middleware - Checking auth for:', request.nextUrl.pathname);
    console.log('[v0] Middleware - All cookies:', allCookies.map(c => c.name).join(', '));
    console.log('[v0] Middleware - SessionId from cookie:', sessionId);

    if (!sessionId) {
      console.log('[v0] Middleware - No session ID found in cookies, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const session = getSession(sessionId);
    console.log('[v0] Middleware - Session lookup result:', session ? 'Found' : 'Not found');
    
    if (!session) {
      console.log('[v0] Middleware - Invalid/expired session, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    console.log('[v0] Middleware - Valid session for user:', session.userId);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
