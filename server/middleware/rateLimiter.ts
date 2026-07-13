/**
 * server/middleware/rateLimiter.ts
 * 
 * Rate limiting simples por IP
 * Sin dependencias externas (Map en memoria para desarrollo)
 * En producción: migrar a Redis
 * 
 * SEGURIDAD:
 * - Limita por IP del cliente real (tras proxy)
 * - Ventana deslizante
 * - Respuesta genérica sin detalles internos
 */

import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const store: RateLimitStore = {};

/**
 * Crear middleware de rate limiting
 * @param windowMs - Ventana de tiempo en ms
 * @param maxRequests - Máximo de requests en la ventana
 * @param message - Mensaje de error (opcional)
 */
export const createRateLimiter = (
  windowMs: number = 15 * 60 * 1000, // 15 minutos
  maxRequests: number = 100,
  message: string = 'Demasiadas solicitudes. Intenta más tarde.'
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Obtener IP del cliente (considerando proxies)
    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      'unknown';

    const key = `${clientIp}:${req.path}`;
    const now = Date.now();

    // Inicializar o obtener registro
    if (!store[key]) {
      store[key] = { count: 0, resetTime: now + windowMs };
    }

    // Limpiar si expiró la ventana
    if (now > store[key].resetTime) {
      store[key] = { count: 0, resetTime: now + windowMs };
    }

    // Incrementar contador
    store[key].count++;

    // Verificar límite
    if (store[key].count > maxRequests) {
      return res.status(429).json({
        error: message,
        retryAfter: Math.ceil((store[key].resetTime - now) / 1000),
      });
    }

    // Header informativo (opcional)
    res.set('X-RateLimit-Limit', String(maxRequests));
    res.set('X-RateLimit-Remaining', String(Math.max(0, maxRequests - store[key].count)));
    res.set('X-RateLimit-Reset', String(store[key].resetTime));

    next();
  };
};

/**
 * Limpiar registros expirados cada cierto tiempo
 * Prevenir memory leak
 */
export const startRateLimitCleanup = (intervalMs: number = 60 * 1000) => {
  setInterval(() => {
    const now = Date.now();
    for (const key in store) {
      if (now > store[key].resetTime) {
        delete store[key];
      }
    }
  }, intervalMs);
};
