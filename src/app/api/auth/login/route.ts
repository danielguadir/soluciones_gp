import { NextResponse } from 'next/server';
import { loginUser } from '../../../../../server/services/auth.service';

/**
 * POST /api/auth/login
 * Public endpoint for Admin login
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña requeridos.' },
        { status: 400 }
      );
    }

    const data = await loginUser(email, password);
    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Credenciales inválidas.';
    console.error('[NEXT API /api/auth/login ERROR]', error);
    return NextResponse.json(
      { error: errMsg },
      { status: 401 }
    );
  }
}
