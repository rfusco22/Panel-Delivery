import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/session';
import { verifyPassword } from '@/lib/auth';
import { query } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    console.log('[v0] Login attempt for:', email);

    // Validar campos
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Buscar usuario en la BD
    console.log('[v0] Buscando usuario en BD...');
    const users = await query(
      'SELECT id, email, password_hash, full_name, role FROM users WHERE email = ?',
      [email]
    );

    if (!Array.isArray(users) || users.length === 0) {
      console.log('[v0] Usuario no encontrado:', email);
      return NextResponse.json(
        { message: 'Email o contraseña incorrectos' },
        { status: 401 }
      );
    }

    const user = users[0] as any;
    console.log('[v0] Usuario encontrado:', user.email);

    // Verificar contraseña
    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      console.log('[v0] Contraseña incorrecta para:', email);
      return NextResponse.json(
        { message: 'Email o contraseña incorrectos' },
        { status: 401 }
      );
    }

    console.log('[v0] Credenciales válidas para:', email);

    // Crear respuesta primero
    const response = NextResponse.json({
      success: true,
      message: 'Sesión iniciada correctamente',
    });

    // Crear sesión con response.cookies para que las cookies se guarden en la respuesta
    console.log('[v0] Inicializando sesión...');
    const session = await getIronSession(req.cookies, response.cookies, sessionOptions);
    console.log('[v0] Sesión inicializada:', { isLoggedIn: session.isLoggedIn });
    
    session.userId = String(user.id);
    session.userName = user.full_name;
    session.userRole = user.role;
    session.isLoggedIn = true;
    
    console.log('[v0] Sesión configurada antes de save:', {
      isLoggedIn: session.isLoggedIn,
      userId: session.userId,
    });
    
    await session.save();

    console.log('[v0] Sesión guardada para:', email);
    console.log('[v0] Response headers:', response.headers.getSetCookie?.());

    return response;
  } catch (error) {
    console.error('[v0] Login error:', error);
    return NextResponse.json(
      { message: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
