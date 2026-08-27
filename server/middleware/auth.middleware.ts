import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../utils/auth';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
    user?: { userId: string };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No autorizado' });
    }

    const token = authHeader.slice('Bearer '.length).trim();
    if (!token) {
        return res.status(401).json({ error: 'No autorizado' });
    }

    try {
        const decoded = verifyToken(token);
        if (typeof decoded !== 'object' || !decoded || typeof decoded.userId !== 'string') {
            return res.status(401).json({ error: 'No autorizado' });
        }

        req.user = { userId: decoded.userId };
        next();
    } catch {
        return res.status(401).json({ error: 'No autorizado' });
    }
};

export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user?.userId) {
        return res.status(401).json({ error: 'No autorizado' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: { role: true },
        });

        if (user?.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Prohibido' });
        }

        next();
    } catch {
        return res.status(500).json({ error: 'Error de autorización' });
    }
};
