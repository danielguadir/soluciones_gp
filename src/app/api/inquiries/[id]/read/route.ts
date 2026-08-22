import { NextResponse } from 'next/server';
import { markAsRead } from '../../../../../../server/services/inquiry.service';
import { verifyToken } from '../../../../../../server/utils/auth';

/**
 * PATCH /api/inquiries/[id]/read
 * Protected endpoint to mark inquiry as read
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    try {
      verifyToken(token);
    } catch {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    await markAsRead(id);
    return NextResponse.json({ message: 'Mensaje marcado como leído' }, { status: 200 });
  } catch (error: unknown) {
    console.error('[NEXT API /api/inquiries/[id]/read PATCH ERROR]', error);
    return NextResponse.json({ error: 'Error al marcar mensaje como leído' }, { status: 500 });
  }
}
