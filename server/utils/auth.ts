import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// CRÍTICO: JWT_SECRET es requerido. Sin fallback por seguridad.
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    'CRÍTICO: La variable de entorno JWT_SECRET no está configurada. ' +
    'Esto es requerido para seguridad en producción.'
  );
}

// Generar Token
export const generateToken = (userId: string) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
};

// Verificar Token
export const verifyToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET);
};

// Hash Password
export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
};

// Comparar Password
export const comparePassword = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash);
};
