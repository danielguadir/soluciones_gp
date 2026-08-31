import { NextResponse } from 'next/server';
import { registerUserInMemory } from '@/lib/usersStore';
import { generateToken } from '../../../../../server/utils/auth';

/**
 * POST /api/auth/register
 * Public endpoint for user registration (Email & Password)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Por favor completa todos los campos requeridos (nombre, correo y contraseña).' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres.' },
        { status: 400 }
      );
    }

    const newUser = registerUserInMemory({
      name: name.trim(),
      email: email.trim(),
      password,
      provider: 'credentials',
    });

    const token = generateToken(newUser.id);

    return NextResponse.json(
      {
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          avatarUrl: newUser.avatarUrl,
          provider: newUser.provider,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Error al registrar el usuario.';
    console.error('[NEXT API /api/auth/register ERROR]', error);
    return NextResponse.json({ error: errMsg }, { status: 400 });
  }
}
