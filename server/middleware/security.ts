/**
 * server/middleware/security.ts
 * 
 * Middleware centralizado de seguridad
 * Limpieza de headers, validación básica
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Middleware de seguridad básica
 * - Limpia headers peligrosos
 * - Valida Content-Length
 * - Agrega headers defensivos
 */
export const securityMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Remover headers de servidor innecesarios
  res.removeHeader('X-Powered-By');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Validar Content-Length (prevenir oversized payloads)
  const contentLength = req.get('Content-Length');
  if (contentLength && parseInt(contentLength) > 1024 * 1024) {
    // 1MB max
    return res.status(413).json({
      error: 'Payload muy grande',
    });
  }

  next();
};

/**
 * Middleware que log requestos de forma segura
 * Sin datos sensibles
 */
export const safeLoggingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  // Hook en finish para logear
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`
    );
  });

  next();
};
