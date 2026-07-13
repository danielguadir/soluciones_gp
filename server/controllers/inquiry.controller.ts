import { Request, Response } from 'express';
import { createInquiry, getInquiries, markAsRead } from '../services/inquiry.service';
import { sendInquiryNotification } from '../services/email.service';
import { validateRequest } from '../utils/validation';
import { contactFormSchema } from '../../common/validation';

export const sendInquiry = async (req: Request, res: Response) => {
    try {
        const data = await validateRequest(req, res, contactFormSchema);
        if (!data) return;

        // Guardar en BD
        await createInquiry(data.nombre, data.email, data.asunto, data.mensaje);
        
        // Enviar email (no-blocking)
        sendInquiryNotification(data.nombre, data.email, data.asunto, data.mensaje).catch(e => 
            console.error('[BACKGROUND] Email fallido:', e)
        );
        
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

export const listInquiries = async (req: Request, res: Response) => {
    try {
        const messages = await getInquiries();
        res.json(messages);
    } catch (error: any) {
        console.error('[LIST INQUIRIES ERROR]', error.message);
        res.status(500).json({ error: 'Error al obtener mensajes' });
    }
};

export const readInquiry = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
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
