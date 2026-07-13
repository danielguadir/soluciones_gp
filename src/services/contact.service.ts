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

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload?.error || payload?.message || 'No se pudo enviar el mensaje.');
    }

    return payload as ContactServiceResponse;
  },
};
