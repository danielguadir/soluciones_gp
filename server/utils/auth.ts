import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const getJwtSecret = (): string => {
    const secret = process.env.JWT_SECRET;

    if (!secret || secret.length < 32) {
        throw new Error('JWT_SECRET debe estar configurado y tener al menos 32 caracteres');
    }

    return secret;
};

// Generar Token
export const generateToken = (userId: string) => {
    return jwt.sign({ userId }, getJwtSecret(), { expiresIn: '24h' });
};

// Verificar Token
export const verifyToken = (token: string) => {
    return jwt.verify(token, getJwtSecret());
};

// Hash Password
export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
};

// Comparar Password
export const comparePassword = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash);
};
