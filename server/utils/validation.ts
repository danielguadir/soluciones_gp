/**
 * server/utils/validation.ts
 * 
 * Utilidades de validación para backend
 * Manejo centralizado de errores de validación
 */

import { z, ZodError } from 'zod';
import { Request, Response } from 'express';

/**
 * Validar y parsear body con esquema Zod
 * Retorna datos validados o null si hay error
 * Envía respuesta de error al cliente automáticamente
 */
export const validateRequest = async <T>(
  req: Request,
  res: Response,
  schema: z.ZodSchema<T>
): Promise<T | null> => {
  try {
    return await schema.parseAsync(req.body);
  } catch (error) {
    if (error instanceof ZodError) {
      // Respuesta genérica que no revela estructura interna
      res.status(400).json({
        error: 'Datos inválidos',
        message: 'Los datos proporcionados no cumplen con el formato requerido.',
        // En desarrollo, podríamos agregar details, pero en producción NO
        ...(process.env.NODE_ENV === 'development' && {
          details: error.issues.map((e: z.ZodIssue) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        }),
      });
      return null;
    }
    throw error;
  }
};
/**
 * Parsear sin respuesta automática (para uso interno)
 */
export const safeParse = async <T>(
  data: unknown,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; error: ZodError }> => {
  try {
    const data_result = await schema.parseAsync(data);
    return { success: true, data: data_result };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error };
    }
    throw error;
  }
};

