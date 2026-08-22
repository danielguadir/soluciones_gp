export interface InquiryItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// Global in-memory cache for inquiries
// Ensures contact form submissions remain immediately viewable in Admin Panel
// even when Prisma DB is connecting or offline.
const globalInquiriesStore: InquiryItem[] = [
  {
    id: 'demo-inquiry-1',
    name: 'Cliente Demo',
    email: 'contacto@impulsogp.com',
    subject: 'Bienvenido a ImpulsoGP Admin Portal',
    message: 'Este es tu panel de administración. Aquí aparecerán todos los mensajes enviados desde tu sitio web en tiempo real.',
    read: false,
    createdAt: new Date().toISOString(),
  },
];

export const addMemoryInquiry = (item: Omit<InquiryItem, 'id' | 'read' | 'createdAt'>): InquiryItem => {
  const newItem: InquiryItem = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `inq-${Date.now()}`,
    name: item.name,
    email: item.email,
    subject: item.subject,
    message: item.message,
    read: false,
    createdAt: new Date().toISOString(),
  };
  globalInquiriesStore.unshift(newItem);
  return newItem;
};

export const getMemoryInquiries = (): InquiryItem[] => {
  return globalInquiriesStore;
};

export const markMemoryInquiryAsRead = (id: string): boolean => {
  const item = globalInquiriesStore.find((i) => i.id === id);
  if (item) {
    item.read = true;
    return true;
  }
  return false;
};
