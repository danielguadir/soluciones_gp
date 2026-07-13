/**
 * common/validation.ts
 * 
 * Esquemas de validación centralizados con Zod
 * Reutilizable en frontend y backend
 * 
 * SEGURIDAD:
 * - Validación estricta de entrada
 * - Límites de tamaño por campo
 * - Rechazo de campos inesperados
 * - Sanitización básica
 */

import { z } from 'zod';

// ============================================
// Email validation
// ============================================
export const emailSchema = z
  .string()
  .email('Email inválido')
  .max(254, 'Email muy largo (máximo 254 caracteres)')
  .trim()
  .toLowerCase();

// ============================================
// Contact Form Schema - IMPORTANTE
// ============================================
export const contactFormSchema = z.object({
  nombre: z
    .string()
    .min(2, 'Nombre muy corto (mínimo 2 caracteres)')
    .max(80, 'Nombre muy largo (máximo 80 caracteres)')
    .regex(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s'-]+$/, 'Nombre contiene caracteres inválidos')
    .trim(),
  
  email: emailSchema,
  
  asunto: z
    .string()
    .min(3, 'Asunto muy corto (mínimo 3 caracteres)')
    .max(120, 'Asunto muy largo (máximo 120 caracteres)')
    .regex(/^[a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s\-.,¿?!]+$/, 'Asunto contiene caracteres inválidos')
    .trim(),
  
  mensaje: z
    .string()
    .min(10, 'Mensaje muy corto (mínimo 10 caracteres)')
    .max(2000, 'Mensaje muy largo (máximo 2000 caracteres)')
    .trim(),
}).strict(); // Rechaza campos inesperados

// ============================================
// Auth Schemas
// ============================================
export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(6, 'Contraseña muy corta')
    .max(128, 'Contraseña muy larga'),
}).strict();

export const registerSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(8, 'Contraseña debe tener al menos 8 caracteres')
    .max(128, 'Contraseña muy larga')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  name: z
    .string()
    .min(2, 'Nombre muy corto')
    .max(100, 'Nombre muy largo')
    .regex(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s'-]+$/, 'Nombre contiene caracteres inválidos')
    .trim(),
}).strict();

// ============================================
// Export types for TypeScript
// ============================================
export type ContactForm = z.infer<typeof contactFormSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type RegisterRequest = z.infer<typeof registerSchema>;
