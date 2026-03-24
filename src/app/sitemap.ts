import type { MetadataRoute } from 'next';
import { curiosities } from '@/data/curiosities';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.impulsogp.com';

  // Rutas estáticas clave
  const staticRoutes = [
    '',
    '/servicios',
    '/portafolio',
    '/contacto',
    '/curiosidades',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Rutas dinámicas para curiosidades (verificadas con id)
  const curiositiesRoutes = curiosities.map((item) => ({
    url: `${baseUrl}/curiosidades/${item.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...curiositiesRoutes];
}
