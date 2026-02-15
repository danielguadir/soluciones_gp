/**
 * common/config.ts
 * 
 * Configuración global del frontend
 * Lee variables de entorno del sistema Next.js
 */

// ============================================
// Google Maps Configuration
// ============================================
export const GPS_GM_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
export const GM_MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || 'default-map-id';

// ============================================
// API Configuration
// ============================================
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// ============================================
// Environment
// ============================================
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

// ============================================
// Feature Flags
// ============================================
export const FEATURES = {
  ENABLE_MAPS: process.env.NEXT_PUBLIC_ENABLE_MAPS === 'true',
  ENABLE_GEOLOCATION: process.env.NEXT_PUBLIC_ENABLE_GEOLOCATION === 'true',
} as const;
