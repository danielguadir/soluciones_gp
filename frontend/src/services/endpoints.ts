/**
 * src/services/endpoints.ts
 * 
 * Servicios específicos para cada módulo
 * Utiliza el apiClient centralizado
 */

import { apiClient } from './api';
import type { User, AuthResponse, Service, Inquiry, PaginatedResponse } from '@/types';

// ============================================
// Auth Services
// ============================================
export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    if (response.data?.token) {
      apiClient.setToken(response.data.token);
    }
    return response.data!;
  },

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', {
      name,
      email,
      password,
    });
    if (response.data?.token) {
      apiClient.setToken(response.data.token);
    }
    return response.data!;
  },

  async logout(): Promise<void> {
    apiClient.clearToken();
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data!;
  },
};

// ============================================
// Service Services
// ============================================
export const servicesService = {
  async getServices(page = 1, pageSize = 10): Promise<PaginatedResponse<Service>> {
    const response = await apiClient.get<PaginatedResponse<Service>>('/services', {
      params: { page, pageSize },
    });
    return response.data!;
  },

  async getServiceById(id: string): Promise<Service> {
    const response = await apiClient.get<Service>(`/services/${id}`);
    return response.data!;
  },

  async createService(data: Partial<Service>): Promise<Service> {
    const response = await apiClient.post<Service>('/services', data);
    return response.data!;
  },

  async updateService(id: string, data: Partial<Service>): Promise<Service> {
    const response = await apiClient.put<Service>(`/services/${id}`, data);
    return response.data!;
  },

  async deleteService(id: string): Promise<void> {
    await apiClient.delete(`/services/${id}`);
  },
};

// ============================================
// Inquiry Services
// ============================================
export const inquiriesService = {
  async getInquiries(page = 1, pageSize = 10): Promise<PaginatedResponse<Inquiry>> {
    const response = await apiClient.get<PaginatedResponse<Inquiry>>('/inquiries', {
      params: { page, pageSize },
    });
    return response.data!;
  },

  async getInquiryById(id: string): Promise<Inquiry> {
    const response = await apiClient.get<Inquiry>(`/inquiries/${id}`);
    return response.data!;
  },

  async createInquiry(data: Partial<Inquiry>): Promise<Inquiry> {
    const response = await apiClient.post<Inquiry>('/inquiries', data);
    return response.data!;
  },

  async updateInquiry(id: string, data: Partial<Inquiry>): Promise<Inquiry> {
    const response = await apiClient.put<Inquiry>(`/inquiries/${id}`, data);
    return response.data!;
  },

  async deleteInquiry(id: string): Promise<void> {
    await apiClient.delete(`/inquiries/${id}`);
  },

  async closeInquiry(id: string): Promise<Inquiry> {
    const response = await apiClient.patch<Inquiry>(`/inquiries/${id}`, { status: 'CLOSED' });
    return response.data!;
  },
};
