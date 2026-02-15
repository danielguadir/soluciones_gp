# Arquitectura del Backend (Express + MVC)

Para que el proyecto sea **escalable**, separamos las responsabilidades así:

## 1. Routes (`src/routes/`)
**"La Recepcionista"**
- Solo define las URLs (`/api/services`, `/api/auth`).
- No tiene lógica. Solo apunta al Controlador correcto.

## 2. Controllers (`src/controllers/`)
**"El Gerente"**
- Recibe la petición (Request) y la Respuesta (Response).
- Valida que lleguen los datos correctos.
- **Llama al Servicio** para que haga el trabajo sucio.
- Retorna la respuesta al usuario (200 OK, 400 Error).
- **Ejemplo**: `createService` verifica que venga el "título" y el "precio".

## 3. Services (`src/services/`)
**"El Especialista (Lógica de Negocio)"**
- Aquí está la **lógica pura**.
- No sabe qué es "HTTP", ni "Req", ni "Res". Solo recibe datos y devuelve datos.
- Interactúa con la Base de Datos (Prisma).
- **Ejemplo**: `createServiceInDB` guarda en Prisma y quizás envía un email de confirmación.

## 4. Prisma (`prisma/schema.prisma`)
**"El Archivo"**
- Define cómo son tus datos (Tablas y Relaciones).

---

### Flujo de Datos
Usuario -> Ruta -> Controlador -> Servicio -> Base de Datos
