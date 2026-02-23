# Documentación del Frontend (Sistema de Diseño)

Este documento explica cómo está estructurada la parte visual del proyecto, cómo usar los componentes y cómo realizar importaciones correctamente.

## 1. Estructura del Sistema de Diseño (`/design-system`)

El proyecto utiliza un sistema de diseño propio ubicado en la raíz, separado de la lógica de la aplicación para mantener la pureza visual y permitir su reutilización.

- **`components/UXLib/`**: Contiene la librería de componentes principales (Button, Card, Modal, etc.).
- **`styles/`**: Contiene la configuración global de estilos usando SCSS.
  - `variables/`: Definición de colores, fuentes y espaciados.
  - `components/`: Estilos específicos para cada componente de la librería.

---

## 2. Componentes: El Botón (`Button`)

El botón es uno de los componentes más utilizados. Está diseñado para ser flexible y consistente.

### Importación
Para usar el botón (u otros componentes), siempre importa desde el punto central del design system:

```tsx
import { Button } from '@/design-system';
```

### Propiedades Comunes (Props)

| Prop | Tipo | Descripción |
| :--- | :--- | :--- |
| `nameBtn` | `string` | El texto que aparecerá dentro del botón. |
| `variant` | `'contained' \| 'outlined' \| 'text' \| 'ghost'` | El estilo visual (por defecto: `contained`). |
| `color` | `string` | Color personalizado (ej: `#ff0000`). |
| `icon` | `string` | Nombre del icono a mostrar. |
| `iconPosition` | `'left' \| 'right' \| 'center'` | Posición del icono respecto al texto. |
| `onClick` | `function` | Acción a ejecutar al hacer clic. |

### Ejemplo de uso
```tsx
<Button 
  nameBtn="Enviar Mensaje" 
  variant="contained" 
  icon="send" 
  iconPosition="right" 
  onClick={() => console.log('Enviado')}
/>
```

---

## 3. Sistema de Importaciones (`@/`)

Usamos **Path Alias** para que las importaciones sean limpias y no dependan de rutas relativas complejas (como `../../../`).

- **`@/design-system`**: Acceso directo a todos los componentes visuales.
- **`@/common`**: Componentes o utilidades compartidas.
- **`@/app`**: Referencia a la carpeta `src/app` donde están las páginas.

**Regla de oro:** Si es un componente visual de la librería, impórtalo siempre desde `@/design-system`.

---

## 4. Estilos y Diseño

### Tailwind CSS
Usamos Tailwind para el diseño rápido y responsivo en las páginas (`src/app`). 
- Los colores de marca están definidos en `tailwind.config.js` bajo el objeto `brand`.
- Ejemplo: `className="bg-brand-primary text-white"`

### SCSS (Sass)
Los componentes de la librería (`UXLib`) usan SCSS para estilos más complejos, efectos (como el *ripple* del botón) y temas (claro/oscuro).

---

## 5. Resumen de Flujo Visual
1. **Componente atomizado**: Definido en `design-system/components/UXLib`.
2. **Exportación**: Agregado a `design-system/index.ts`.
3. **Uso**: Importado en cualquier página de `src/app` usando el alias `@/design-system`.
