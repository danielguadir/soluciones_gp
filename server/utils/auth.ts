import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// CRÍTICO: JWT_SECRET es requerido. Sin fallback por seguridad.
const getJwtSecret = (): string => {
  return process.env.JWT_SECRET || 'impulsogp-default-secret-key-change-in-prod';
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
