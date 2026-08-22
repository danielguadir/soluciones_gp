import { NextResponse } from 'next/server';
import { contactFormSchema } from '@/common/validation';
import { createInquiry, getInquiries } from '../../../../server/services/inquiry.service';
import { sendInquiryNotification } from '../../../../server/services/email.service';
import { verifyToken } from '../../../../server/utils/auth';
import { addMemoryInquiry, getMemoryInquiries } from '@/lib/inquiriesStore';

/**
 * POST /api/inquiries
 * Public endpoint to submit a contact inquiry
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = contactFormSchema.safeParse(body);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message || 'Datos de formulario inválidos.';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { nombre, email, asunto, mensaje } = validationResult.data;

    // Save in memory store so it is instantly viewable in Admin Panel
    addMemoryInquiry({
      name: nombre,
      email,
      subject: asunto,
      message: mensaje,
    });

    // Try saving in Prisma database if database is configured
    try {
      await createInquiry(nombre, email, asunto, mensaje);
    } catch (dbError) {
      console.warn('[NEXT API] Database write skipped or failed (using memory store):', dbError);
    }

    // Trigger email notification via Resend asynchronously
    sendInquiryNotification(nombre, email, asunto, mensaje).catch(e =>
      console.error('[NEXT API] Email error:', e)
    );

    return NextResponse.json(
      {
        success: true,
        message: '¡Gracias por tu mensaje! Nos pondremos en contacto pronto.',
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Error interno al procesar el mensaje.';
    console.error('[NEXT API /api/inquiries POST ERROR]', error);
    return NextResponse.json(
      { error: errMsg },
      { status: 500 }
    );
  }
}

/**
 * GET /api/inquiries
 * Protected endpoint for Admin Dashboard to list inquiries
 */
export async function GET(request: Request) {
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

    const memoryList = getMemoryInquiries();

    try {
      const dbList = await getInquiries();
      if (Array.isArray(dbList) && dbList.length > 0) {
        // Merge DB list and Memory list without duplicates by ID or timestamp
        const combined = [...dbList, ...memoryList];
        const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
        return NextResponse.json(unique, { status: 200 });
      }
    } catch (dbErr) {
      console.warn('[NEXT API] Fetching from DB skipped, serving memory store:', dbErr);
    }

    return NextResponse.json(memoryList, { status: 200 });
  } catch (error: unknown) {
    console.error('[NEXT API /api/inquiries GET ERROR]', error);
    return NextResponse.json({ error: 'Error al obtener mensajes' }, { status: 500 });
  }
}
