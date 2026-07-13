import { Request, Response } from 'express';
import { createInquiry, getInquiries, markAsRead } from '../services/inquiry.service';
import { validateRequest } from '../utils/validation';
import { contactFormSchema } from '../../common/validation';

/**
 * POST /api/inquiries
 * 
 * Validación:
 * - Zod schema
 * - Límites de longitud
 * - Rechazo de campos inesperados
 * - Rate limiting: 5 requests por IP en 1 hora
 */
export const sendInquiry = async (req: Request, res: Response) => {
    try {
        // Validar con Zod antes de procesar
        const data = await validateRequest(req, res, contactFormSchema);
        if (!data) return; // validateRequest ya envió error

        // Crear inquiry en BD con asunto incluido
        await createInquiry(data.nombre, data.email, data.asunto, data.mensaje);
        
        // Respuesta genérica y consistente con la contracta API global
        res.status(201).json({
            success: true,
            message: '¡Gracias por tu mensaje! Nos pondremos en contacto pronto.',
        });
    } catch (error: any) {
        console.error('[INQUIRY ERROR]', error.message);
        res.status(500).json({
            error: 'Error al procesar tu mensaje. Intenta más tarde.',
        });
    }
};

/**
 * GET /api/inquiries
 * Solo para usuarios autenticados (protegido por middleware)
 */
export const listInquiries = async (req: Request, res: Response) => {
    try {
        const messages = await getInquiries();
        res.json(messages);
    } catch (error: any) {
        console.error('[LIST INQUIRIES ERROR]', error.message);
        res.status(500).json({ error: 'Error al obtener mensajes' });
    }
};

/**
 * PATCH /api/inquiries/:id/read
 * Solo para usuarios autenticados
 */
export const readInquiry = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        // Validar que id sea UUID válido (Prisma lo validará)
        if (!id || typeof id !== 'string' || id.length !== 36) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        await markAsRead(id);
        res.json({ message: 'Mensaje marcado como leído' });
    } catch (error: any) {
        console.error('[READ INQUIRY ERROR]', error.message);
        res.status(400).json({ error: 'Error al marcar como leído' });
    }
};
