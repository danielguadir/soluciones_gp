# API Endpoints

Base URL: `http://localhost:3001/api`

## Auth
- `POST /auth/login`: Iniciar sesión (Retorna JWT).
- `POST /auth/register`: Crear primer admin (Desactivar en prod).

## Services (Servicios)
- `GET /services`: Listar todos los servicios (Público).
- `POST /services`: Crear servicio (Requiere Token).
- `PUT /services/:id`: Actualizar servicio (Requiere Token).
- `DELETE /services/:id`: Eliminar servicio (Requiere Token).

## Inquiries (Mensajes de Contacto)
- `POST /inquiries`: Enviar mensaje (Público).
- `GET /inquiries`: Ver mensajes (Requiere Token).
- `PATCH /inquiries/:id/read`: Marcar como leído (Requiere Token).
