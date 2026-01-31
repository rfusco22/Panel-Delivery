import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/sessions-memory';

export async function proxy(request: NextRequest) {
  // Rutas protegidas que requieren autenticación
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const sessionId = request.cookies.get('session-id')?.value;

    console.log('[v0] Proxy - Checking auth for:', request.nextUrl.pathname);
    console.log('[v0] Proxy - SessionId exists:', !!sessionId);

    if (!sessionId) {
      console.log('[v0] Proxy - No session, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const session = getSession(sessionId);
    if (!session) {
      console.log('[v0] Proxy - Invalid/expired session, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    console.log('[v0] Proxy - Valid session for user:', session.userId);
  }

  return NextResponse.next();
}
