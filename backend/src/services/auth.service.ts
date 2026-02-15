import { PrismaClient } from '@prisma/client';
import { comparePassword, generateToken, hashPassword } from '../utils/auth';

const prisma = new PrismaClient();

export const loginUser = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) throw new Error('Usuario no encontrado');

    const isValid = await comparePassword(password, user.password);
    if (!isValid) throw new Error('Contraseña incorrecta');

    const token = generateToken(user.id);
    return { token, user: { id: user.id, email: user.email, name: user.name } };
};

export const registerAdmin = async (email: string, password: string, name: string) => {
    const existingdev = await prisma.user.findUnique({ where: { email } });
    if (existingdev) throw new Error('El usuario ya existe');

    const hashedPassword = await hashPassword(password);

    return await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            role: 'ADMIN'
        }
    });
};
