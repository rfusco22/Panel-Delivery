import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/session';

export async function proxy(request: NextRequest) {
  // Rutas protegidas que requieren autenticación
  if (request.nextUrl.pathname.startsWith('/admin')) {
    try {
      console.log('[v0] Proxy - Request cookies:', request.cookies.getAll());
      
      // En middleware, solo pasamos request.cookies para leer la sesión
      const session = await getIronSession(request.cookies, sessionOptions);

      console.log('[v0] Proxy - Validating session for:', request.nextUrl.pathname);
      console.log('[v0] Proxy - Session:', { isLoggedIn: session.isLoggedIn, userId: session.userId });
      console.log('[v0] Proxy - Session keys:', Object.keys(session));

      if (!session.isLoggedIn) {
        console.log('[v0] Proxy - No session, redirecting to login');
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (error) {
      console.error('[v0] Proxy - Session validation error:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}
