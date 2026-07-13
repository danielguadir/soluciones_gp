import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Crear inquiry en BD
 * Los datos ya fueron validados con Zod en el controller
 * 
 * @param name - Nombre validado (2-80 chars, chars específicos)
 * @param email - Email validado (RFC 5321)
 * @param message - Mensaje validado (10-2000 chars)
 */
export const createInquiry = async (name: string, email: string, message: string) => {
    try {
        return await prisma.inquiry.create({
            data: {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                message: message.trim(),
            },
        });
    } catch (error: any) {
        console.error('[DB ERROR]', error.message);
        throw new Error('Error al guardar mensaje en BD');
    }
};

/**
 * Obtener todos los inquiries (solo para admin)
 * Ordenados por fecha descendente
 */
export const getInquiries = async () => {
    try {
        return await prisma.inquiry.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                message: true,
                read: true,
                createdAt: true,
                // NO incluir el message completo en listado masivo
            },
        });
    } catch (error: any) {
        console.error('[DB ERROR]', error.message);
        throw new Error('Error al obtener inquiries');
    }
};

/**
 * Marcar inquiry como leído
 */
export const markAsRead = async (id: string) => {
    try {
        // Validar que exista antes de actualizar
        const inquiry = await prisma.inquiry.findUnique({ where: { id } });
        if (!inquiry) {
            throw new Error('Inquiry no encontrado');
        }

        return await prisma.inquiry.update({
            where: { id },
            data: { read: true },
        });
    } catch (error: any) {
        console.error('[DB ERROR]', error.message);
        throw error;
    }
};
