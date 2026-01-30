import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/session';

export async function GET(req: NextRequest) {
  try {
    const session = await getIronSession(req.cookies, sessionOptions);

    if (!session.isLoggedIn) {
      return NextResponse.json(
        { message: 'No autenticado' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      userId: session.userId,
      userName: session.userName,
      userRole: session.userRole,
    });
  } catch (error) {
    console.error('[v0] Session error:', error);
    return NextResponse.json(
      { message: 'Error al obtener sesión' },
      { status: 500 }
    );
  }
}
