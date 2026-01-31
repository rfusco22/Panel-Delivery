import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'No autenticado' },
        { status: 401 }
      );
    }

    const payload = verifySessionToken(token);
    if (!payload) {
      return NextResponse.json(
        { message: 'Token inválido' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      userId: payload.userId,
      userName: payload.userName,
      userRole: payload.userRole,
    });
  } catch (error) {
    console.error('[v0] Session error:', error);
    return NextResponse.json(
      { message: 'Error al obtener sesión' },
      { status: 500 }
    );
  }
}
