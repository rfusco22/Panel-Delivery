import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/session';

export async function proxy(request: NextRequest) {
  // Rutas protegidas que requieren autenticación
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const response = NextResponse.next();
    const session = await getIronSession(request.cookies, response.cookies, sessionOptions);

    console.log('[v0] Proxy - Validating session for:', request.nextUrl.pathname);
    console.log('[v0] Proxy - Session:', { isLoggedIn: session.isLoggedIn, userId: session.userId });

    if (!session.isLoggedIn) {
      console.log('[v0] Proxy - No session, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return response;
  }

  return NextResponse.next();
}
