# Arquitectura del Sistema de Portafolio

Este documento describe la estructura, ubicación y flujo de datos de la sección de **Portafolio** en el proyecto.

## 1. Ubicación de Archivos Clave

- **Interfaz y Datos**: `src/app/portafolio/page.tsx`
  - Aquí reside tanto la lógica de visualización como el array de objetos `projects` que contiene la información de cada aplicación.
- **Activos Multimedia**: `public/images/portfolio/`
  - Carpeta donde se almacenan las capturas de pantalla y logos organizados por carpetas de proyecto (ej: `/inventario`, `/nature-sumaq`).
- **Vista Previa de Servicios**: `src/app/servicios/page.tsx`
  - Sección "Nuestro Trabajo en Acción" que resume los proyectos más destacados.

## 2. Estructura de Datos (`projects`)

Cada proyecto en el portafolio se define como un objeto con las siguientes propiedades:

| Propiedad | Tipo | Descripción |
| :--- | :--- | :--- |
| `title` | `string` | Nombre del proyecto o aplicación. |
| `description` | `string` | Breve explicación de la solución brindada. |
| `icon` | `string` | Identificador del icono (usado en el componente `Svg`). |
| `link` | `string` | URL externa o `#` si no tiene enlace directo. |
| `tech` | `string[]` | Array de tecnologías utilizadas (ej: `["Next.js", "Prisma"]`). |
| `images` | `string[]` | Rutas a las imágenes de vista previa en `public/`. |

## 3. Componentes UX Utilizados

El portafolio se apoya en el **Design System** interno:
- **`Card`**: Contenedor principal con efectos de glassmorphism y hover.
- **`Svg`**: Renderizado dinámico de iconos vectoriales.
- **`Button`**: Acciones para "Explorar Proyecto" o "Solicitar Demo".
- **`Gallery` (Inline)**: Implementada mediante scroll horizontal nativo con `snap-center` para móviles y escritorio.

## 4. Flujo de Trabajo para Agregar un Proyecto

1. **Preparar Imágenes**: Guardar capturas en `public/images/portfolio/[nombre-proyecto]/`.
2. **Actualizar Datos**: Añadir un nuevo objeto al array `projects` en `src/app/portafolio/page.tsx`.
3. **Vincular Icono**: Asegurarse de que el `icon` especificado exista en el sistema de `Svg`.
4. **Verificar Responsividad**: El grid de proyectos se ajusta automáticamente (1 columna en móvil, 2 en escritorio).

---

### Mantenimiento Futuro
Se recomienda mover el array `projects` a un archivo independiente en `src/data/portfolio.ts` si el número de proyectos crece significativamente para mantener el archivo de la página más limpio.
