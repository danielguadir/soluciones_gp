import { NextResponse } from 'next/server';
import { registerUserInMemory } from '@/lib/usersStore';
import { generateToken } from '../../../../../server/utils/auth';

/**
 * POST /api/auth/google
 * Endpoint for Google Sign-In authentication
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, picture } = body;

    // Default fallback if client didn't supply specific Google payload
    const userEmail = email ? email.trim() : 'usuario.google@gmail.com';
    const userName = name ? name.trim() : 'Usuario Google';
    const userPicture = picture || '/images/default-avatar.png';

    const user = registerUserInMemory({
      name: userName,
      email: userEmail,
      avatarUrl: userPicture,
      provider: 'google',
    });

    const token = generateToken(user.id);

    return NextResponse.json(
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
          provider: user.provider,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Error al autenticar con Google.';
    console.error('[NEXT API /api/auth/google ERROR]', error);
    return NextResponse.json({ error: errMsg }, { status: 400 });
  }
}
