# Guía de Arquitectura Fullstack e Infrestructura

Este documento describe las tecnologías principales que sostienen el ecosistema de **ImpulsoGP** y el propósito de cada una.

## 1. Lenguajes y Tipado (TS & JS)

### TypeScript (TS)
- **Para qué:** Definición de interfaces (`Project`, `Service`), tipado estricto y prevención de errores en tiempo de desarrollo.
- **Por qué aquí:** Aseguramos que, por ejemplo, si añadimos un nuevo proyecto en `portfolio.ts`, el compilador nos avise si olvidamos una propiedad obligatoria como el `title`.
- **Ubicación:** `**/*.ts` y `**/*.tsx`.

### JavaScript (JS)
- **Para qué:** Ejecución de lógica en el cliente y scripts de configuración básicos.
- **Por qué aquí:** Es la base sobre la que corre todo, pero usamos TS por encima para mayor seguridad.

## 2. Gestión de Datos y Base de Datos (Prisma)

### Prisma ORM
- **Para qué:** "Traductor" entre nuestro código de TypeScript y la base de Datos SQL.
- **Por qué aquí:** Nos permite crear tablas, relaciones y consultas complejas (como el inventario de equipos) de forma limpia y moderna sin escribir SQL puro.
- **Ubicación:** `/prisma/schema.prisma`.

## 3. Despliegue e Infraestructura (Vercel & Hostinger)

### Vercel (Front-end & Serverless)
- **Para qué:** Hosting principal de la aplicación Next.js.
- **Por qué aquí:** Ofrece despliegues automáticos (Builds) cada vez que hacemos un `git push`, optimización de imágenes nativa y garantiza que la página cargue en menos de 1 segundo en cualquier parte del mundo.
- **Dominio:** `www.impulsogp.com` (apuntando a Vercel).

### Hostinger (Dominios & Email)
- **Para qué:** Registrador de dominios y gestión de correos corporativos.
- **Por qué aquí:** Mantenemos la propiedad de los dominios y la configuración de correo profesional (ej: `contacto@impulsogp.com`) en una plataforma robusta.

## 4. Framework Principal (Next.js 14)
- **Para qué:** Estructura de rutas, renderizado híbrido (SSR/SSG) y optimización SEO.
- **Por qué aquí:** Es el estándar de oro para aplicaciones web de alto rendimiento.

## 5. Sistema de Diseño (Design System)
- **Para qué:** Mantener la coherencia visual con componentes base reutilizables.
- **Por qué aquí:** Permite que todas las páginas (Portafolio, Servicios, Inicio) hereden los mismos estilos, botones y animaciones, facilitando el mantenimiento.
- **Ubicación:** `/design-system`.

---

### Resumen de Flujo de Trabajo
Cada vez que modificamos el código en VS Code:
1. Guardamos archivos locales.
2. Realizamos `git push` a GitHub.
3. Vercel detecta el cambio, ejecuta `npm run build` y actualiza la página web en vivo en cuestión de segundos.
