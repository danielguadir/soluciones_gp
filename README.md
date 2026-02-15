# Proyecto Servicios Web - Personal

Este es un monorepo que contiene tanto el Frontend (Next.js) como el Backend (Express).

## Estructura

- **frontend/**: Aplicación Next.js 14+ con App Router y Tailwind CSS.
- **backend/**: Servidor Express con TypeScript, Prisma y Autenticación JWT.
- **docs/**: Documentación del proyecto.
- **shared/**: Código compartido (tipos, utilidades).

## Requisitos

- Node.js v18 o superior.
- NPM.

## Cómo Iniciar

### Backend

1. Entra a la carpeta backend:
   ```bash
   cd backend
   ```
2. Instala dependencias (si no lo has hecho):
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   El servidor correrá en `http://localhost:3001`.

### Frontend

1. Entra a la carpeta frontend:
   ```bash
   cd frontend
   ```
2. Instala dependencias (si no lo has hecho):
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   La aplicación correrá en `http://localhost:3000`.

## Próximos Pasos

- Configurar base de datos en `backend/.env`.
- Crear modelos en `backend/prisma/schema.prisma`.
- Diseñar la interfaz en `frontend/app`.
