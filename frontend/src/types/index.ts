/**
 * src/types/index.ts
 * 
 * Definiciones de tipos principales para la aplicación
 * Incluye modelos de datos que corresponden a prisma schema
 */

// ============================================
// User / Auth Types
// ============================================
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ============================================
// Service Types
// ============================================
export interface Service {
  id: string;
  name: string;
  description?: string;
  price?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceCategory {
  id: string;
  name: string;
  services?: Service[];
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Inquiry Types
// ============================================
export interface Inquiry {
  id: string;
  title: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
  userId: string;
  serviceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InquiryResponse {
  id: string;
  content: string;
  inquiryId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Generic API Response
// ============================================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// Generic Request Types
// ============================================
export interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number>;
}

// ============================================
// UI State Types
// ============================================
export interface UiState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export interface FormState {
  values: Record<string, unknown>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
}
