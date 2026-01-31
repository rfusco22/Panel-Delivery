import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/jwt';

export async function proxy(request: NextRequest) {
  // Rutas protegidas que requieren autenticación
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token')?.value;

    console.log('[v0] Proxy - Checking auth for:', request.nextUrl.pathname);
    console.log('[v0] Proxy - Token exists:', !!token);

    if (!token) {
      console.log('[v0] Proxy - No token, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const payload = verifySessionToken(token);
    if (!payload) {
      console.log('[v0] Proxy - Invalid token, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    console.log('[v0] Proxy - Valid token for user:', payload.userId);
  }

  return NextResponse.next();
}
