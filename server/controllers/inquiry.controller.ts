import { Request, Response } from 'express';
import { createInquiry, getInquiries, markAsRead } from '../services/inquiry.service';

export const sendInquiry = async (req: Request, res: Response) => {
    try {
        const { name, email, message } = req.body;
        const inquiry = await createInquiry(name, email, message);
        res.json({ message: 'Mensaje enviado correctamente', inquiry });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const listInquiries = async (req: Request, res: Response) => {
    try {
        const messages = await getInquiries();
        res.json(messages);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const readInquiry = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await markAsRead(id as string);
        res.json({ message: 'Mensaje marcado como leído' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
