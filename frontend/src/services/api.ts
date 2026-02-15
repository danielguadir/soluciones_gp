/**
 * src/services/api.ts
 * 
 * Cliente API centralizado para todas las llamadas al backend
 * Maneja autenticación, errores, reintentos y transformación de datos
 */

import { API_BASE_URL, HTTP_STATUS } from '@/lib/utils/constants';
import type { ApiResponse, FetchOptions } from '@/types';

// ============================================
// API Client Class
// ============================================
class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.loadToken();
  }

  /**
   * Carga el token de localStorage (si existe)
   */
  private loadToken(): void {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken');
    }
  }

  /**
   * Guarda el token en localStorage
   */
  setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  /**
   * Limpia el token
   */
  clearToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  /**
   * Método privado para hacer requests
   */
  private async request<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      params,
    } = options;

    // Construir URL con parámetros
    let url = `${this.baseUrl}${endpoint}`;
    if (params) {
      const queryString = new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {} as Record<string, string>)
      ).toString();
      if (queryString) url += `?${queryString}`;
    }

    // Configurar headers
    const finalHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...headers,
    };

    // Agregar token de autenticación si existe
    if (this.token) {
      finalHeaders['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        method,
        headers: finalHeaders,
        body: body ? JSON.stringify(body) : undefined,
      });

      const data: ApiResponse<T> = await response.json();

      // Manejo de errores HTTP
      if (!response.ok) {
        if (response.status === HTTP_STATUS.UNAUTHORIZED) {
          this.clearToken();
          // Redirigir a login si es necesario
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
        }
        throw new Error(data.message || `HTTP Error: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  /**
   * GET request
   */
  get<T>(endpoint: string, options?: Omit<FetchOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  post<T>(endpoint: string, body?: unknown, options?: Omit<FetchOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  /**
   * PUT request
   */
  put<T>(endpoint: string, body?: unknown, options?: Omit<FetchOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  /**
   * PATCH request
   */
  patch<T>(endpoint: string, body?: unknown, options?: Omit<FetchOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  /**
   * DELETE request
   */
  delete<T>(endpoint: string, options?: Omit<FetchOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Exportar instancia única
export const apiClient = new ApiClient();
