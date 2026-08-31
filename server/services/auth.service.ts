import { PrismaClient } from '@prisma/client';
import { comparePassword, generateToken, hashPassword } from '../utils/auth';

const prisma = new PrismaClient();

export const loginUser = async (email: string, password: string) => {
    const inputEmail = email.trim().toLowerCase();
    const envAdminEmail = (process.env.ADMIN_EMAIL || '100guadir@gmail.com').trim().toLowerCase();
    const envAdminPassword = process.env.ADMIN_PASSWORD || 'ImpulsoGP2026!';

    // 1. Verificación directa contra credenciales de Administrador en Variables de Entorno
    if (inputEmail === envAdminEmail && password === envAdminPassword) {
        const token = generateToken('admin-main');
        return {
            token,
            user: {
                id: 'admin-main',
                email: envAdminEmail,
                name: 'Administrador ImpulsoGP',
            },
        };
    }

    // 2. Verificación secundaria contra la Base de Datos (si está conectada)
    try {
        const user = await prisma.user.findUnique({ where: { email: inputEmail } });
        if (user) {
            const isValid = await comparePassword(password, user.password);
            if (!isValid) throw new Error('Contraseña incorrecta');

            const token = generateToken(user.id);
            return { token, user: { id: user.id, email: user.email, name: user.name } };
        }
    } catch (dbError: unknown) {
        console.warn('[AUTH DB WARN] No se pudo verificar contra DB:', dbError);
    }

    // 3. Verificación contra almacén de usuarios registrados en memoria
    const { findUserByEmail } = await import('@/lib/usersStore');
    const memoryUser = findUserByEmail(inputEmail);
    if (memoryUser) {
        if (memoryUser.password && memoryUser.password !== password) {
            throw new Error('Contraseña incorrecta.');
        }
        const token = generateToken(memoryUser.id);
        return {
            token,
            user: {
                id: memoryUser.id,
                email: memoryUser.email,
                name: memoryUser.name,
                avatarUrl: memoryUser.avatarUrl,
                provider: memoryUser.provider,
            },
        };
    }

    throw new Error('Credenciales inválidas. Verifica tu correo y contraseña.');
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
