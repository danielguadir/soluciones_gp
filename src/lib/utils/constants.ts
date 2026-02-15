/**
 * src/lib/utils/constants.ts
 * 
 * Constantes globales para el frontend
 * Incluye strings, enumeraciones, y configuraciones reutilizables
 */

// ============================================
// API Configuration
// ============================================
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// ============================================
// Paths (Rutas del frontend)
// ============================================
export const ROUTES = {
  HOME: '/',
  DESIGN_SYSTEM: '/design-test',
  SERVICES: '/services',
  INQUIRIES: '/inquiries',
  AUTH: '/auth',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE: '/profile',
} as const;

// ============================================
// HTTP Status Codes
// ============================================
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const;

// ============================================
// Messages / i18n Keys
// ============================================
export const MESSAGES = {
  SUCCESS: 'Operación completada exitosamente',
  ERROR: 'Ocurrió un error al procesar tu solicitud',
  LOADING: 'Cargando...',
  DELETE_CONFIRM: '¿Estás seguro que deseas eliminar este elemento?',
  REQUIRED_FIELD: 'Este campo es requerido',
} as const;

// ============================================
// Component Variants
// ============================================
export const BUTTON_VARIANTS = {
  CONTAINED: 'contained' as const,
  OUTLINED: 'outlined' as const,
  TEXT: 'text' as const,
} as const;

export const FIELD_VARIANTS = {
  OUTLINED: 'outlined' as const,
  STANDARD: 'standard' as const,
} as const;

// ============================================
// Pagination & Table
// ============================================
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

// ============================================
// Design Tokens (Color, Spacing, etc.)
// ============================================
export const DESIGN_TOKENS = {
  SPACING: {
    XS: '4px',
    SM: '8px',
    MD: '12px',
    LG: '16px',
    XL: '24px',
    XXL: '32px',
  },
  BORDER_RADIUS: {
    SMALL: '4px',
    MEDIUM: '8px',
    LARGE: '12px',
    ROUND: '50%',
  },
  SHADOW: {
    LIGHT: '0 1px 3px rgba(0, 0, 0, 0.12)',
    MEDIUM: '0 2px 8px rgba(0, 0, 0, 0.15)',
    HEAVY: '0 8px 16px rgba(0, 0, 0, 0.2)',
  },
} as const;
