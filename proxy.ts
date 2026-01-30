import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/session';

export async function proxy(request: NextRequest) {
  // Rutas protegidas que requieren autenticación
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const session = await getIronSession(request.cookies, sessionOptions);

    if (!session.isLoggedIn) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}
