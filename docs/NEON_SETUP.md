# Guía Paso a Paso: Crear Base de Datos en Neon (PostgreSQL)

Neon es una base de datos moderna, rápida y tiene una capa gratuita generosa perfecta para este proyecto.

## 1. Crear Cuenta
1. Ve a [neon.tech](https://neon.tech/).
2. Haz clic en **"Sign Up"**.
3. Puedes registrarte con **GitHub** o **Google** (recomendado para rapidez).

## 2. Crear Proyecto
1. Una vez dentro, verás un botón **"Create Project"**.
2. **Name**: Ponle `proyecto-servicios` o `mi-portafolio`.
3. **Postgres Version**: Deja la que viene por defecto (15 o 16).
4. **Cloud Provider**: Deja el predeterminado (usualmente AWS en US East).
5. Haz clic en **"Create Project"**.

## 3. Obtener la "Connection String" (La Llave)
¡Esta es la parte importante!

1. Apenas se crea el proyecto, verás un panel que dice **"Connection Details"**.
2. Busca donde dice **"Connection String"** o selecciona la pestaña **"Prisma"** si aparece.
3. Verás un código largo que se ve así:
   ```
   postgres://usuario:contraseña@ep-dry-...hostname.../neondb?sslmode=require
   ```
4. **Copia todo ese código**. Tienes un botón de copiar al lado.

## 4. Guardar la Llave
Ahora vuelve a este chat y:
- **Pega la Connection String** aquí para que yo la configure.
- O crea un archivo llamado `.env` en la carpeta `backend` y pégalo así:
  ```env
  DATABASE_URL="postgres://tu_usuario:tu_contraseña@..."
  ```

¡Listo! Con eso tu backend tendrá memoria.
