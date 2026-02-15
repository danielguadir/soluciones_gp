import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllServices = async () => {
    return await prisma.service.findMany({ where: { active: true } });
};

export const createService = async (title: string, description: string, price?: number) => {
    return await prisma.service.create({
        data: { title, description, price }
    });
};

export const updateService = async (id: string, data: any) => {
    return await prisma.service.update({
        where: { id },
        data
    });
};

export const deleteService = async (id: string) => {
    return await prisma.service.update({
        where: { id },
        data: { active: false } // Soft delete
    });
};
