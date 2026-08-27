/**
 * server/middleware/rateLimiter.ts
 * 
 * Rate limiting por IP con express-rate-limit.
 * En producción distribuida, configurar un store compartido (Redis/Upstash).
 * 
 * SEGURIDAD:
 * - Limita por IP del cliente real (tras proxy)
 * - Ventana deslizante
 * - Respuesta genérica sin detalles internos
 */

import rateLimit from 'express-rate-limit';

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
  return rateLimit({
    windowMs,
    limit: maxRequests,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: message },
  });
};
