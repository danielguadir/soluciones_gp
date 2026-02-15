import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createInquiry = async (name: string, email: string, message: string) => {
    return await prisma.inquiry.create({
        data: { name, email, message }
    });
};

export const getInquiries = async () => {
    return await prisma.inquiry.findMany({
        orderBy: { createdAt: 'desc' }
    });
};

export const markAsRead = async (id: string) => {
    return await prisma.inquiry.update({
        where: { id },
        data: { read: true }
    });
};
