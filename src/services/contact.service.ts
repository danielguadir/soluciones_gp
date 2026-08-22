import { API_BASE_URL } from '@/lib/utils/constants';
import type { ContactForm } from '@/common/validation';

export interface ContactServiceResponse {
  success: boolean;
  message: string;
}

export const contactService = {
  async submitInquiry(data: ContactForm): Promise<ContactServiceResponse> {
    const endpoint = `${API_BASE_URL.replace(/\/$/, '')}/api/inquiries`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const contentType = response.headers.get('content-type') || '';
    let payload: Record<string, unknown> = {};

    if (contentType.includes('application/json')) {
      payload = await response.json();
    } else {
      const text = await response.text();
      console.error('[CONTACT SERVICE] Non-JSON response:', text);
      throw new Error(`El servidor devolvió una respuesta no válida (${response.status}). Intenta más tarde.`);
    }

    if (!response.ok) {
      const errorMsg = typeof payload?.error === 'string' ? payload.error : typeof payload?.message === 'string' ? payload.message : 'No se pudo enviar el mensaje.';
      throw new Error(errorMsg);
    }

    return payload as unknown as ContactServiceResponse;
  },
};
