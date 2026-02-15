# 🎨 Design System - Componentes Reutilizables

Sistema de componentes React documentado con **Storybook** para usar en múltiples proyectos.

---

## 📦 ¿Qué contiene?

### **Componentes incluidos:**
- ✅ Button - Botones con variantes
- ✅ Card - Tarjetas de contenido
- ✅ Modal - Modales y diálogos
- ✅ Table - Tablas de datos
- ✅ Avatar - Avatares de usuario
- ✅ Menu - Menús desplegables
- ✅ Pagination - Paginación
- ✅ Progress - Barras de progreso
- ✅ Divider - Divisores
- ✅ Gallery - Galerías de imágenes
- ✅ Wizard - Flujos paso a paso
- ✅ Svg - Icons y símbolos
- ✅ Y muchos más...

### **Cada componente incluye:**
- 📄 Código TypeScript tipado
- 📖 Documentación en Storybook
- ✅ Tests unitarios
- 🎨 Estilos SCSS

---

## 🚀 Paso 1: Ver componentes en Storybook (Opcional)

Para ver visualmente todos los componentes antes de usarlos:

```bash
# Entrar a la carpeta design-system
cd design-system

# Instalar dependencias
npm install

# Abrir Storybook en http://localhost:6006
npm run storybook
```

---

## 📁 Paso 2: Copiar en tu proyecto

### **Opción A: Copiar la carpeta completa (MÁS FÁCIL)**

1. **Copia esta carpeta `design-system/` a tu proyecto**
```bash
# En Windows (PowerShell)
Copy-Item -Path "C:\ruta\design-system" -Destination "tu-proyecto\src\" -Recurse

# O simplemente copy-paste con el explorador
```

2. **Estructura en tu proyecto:**
```
tu-proyecto/
├── src/
│   ├── design-system/     ← Aquí pegas esta carpeta
│   │   ├── components/UXLib/
│   │   ├── stories/
│   │   └── .storybook/
│   └── App.tsx
```

---

## 💻 Paso 3: Usar los componentes en tu proyecto

### **1. Importar componentes:**

```typescript
// Tu archivo (ej: App.tsx)
import { Button, Card, Modal } from '../design-system/components/UXLib'

export function App() {
  return (
    <div>
      <Button>Haz clic aquí</Button>
      <Card>Contenido en tarjeta</Card>
    </div>
  )
}
```

### **2. Importar estilos:**

Los componentes usan SCSS, se incluyen automáticamente cuando importas.

Si necesitas configurar SCSS en tu proyecto:
```bash
npm install sass
```

---

## 📋 Componentes disponibles

### **Button**
```typescript
import { Button } from '../design-system/components/UXLib/Button'

<Button variant="primary" size="md" disabled={false}>
  Click me
</Button>
```

### **Card**
```typescript
import { Card } from '../design-system/components/UXLib/Card'

<Card>
  Contenido de la tarjeta
</Card>
```

### **Modal**
```typescript
import { Modal } from '../design-system/components/UXLib/Modal'

<Modal isOpen={true} onClose={() => {}}>
  Contenido del modal
</Modal>
```

### **Table**
```typescript
import { Table } from '../design-system/components/UXLib/Table'

<Table data={data} columns={columns} />
```

---

## 🔧 Configuración (Si necesitas personalizar)

### **Variables de color (SCSS):**
Están en: `design-system/components/UXLib/styles/variables/_colors.scss`

Para cambiar colores en tu proyecto, edita ese archivo.

### **Tipografía:**
Están en: `design-system/components/UXLib/styles/variables/_fonts.scss`

---

## ❓ ¿Cómo agregar componentes nuevos?

1. Crea una carpeta en `design-system/components/UXLib/MiComponente/`
2. Crea tu componente en `.tsx`
3. Crea un `.stories.tsx` en `design-system/stories/`
4. Ejecuta `npm run storybook` para ver en tiempo real

---

## 📖 Documentación completa

Cada componente tiene documentación detallada en Storybook después de hacer:
```bash
cd design-system
npm install
npm run storybook
```

---

## 🆘 Troubleshooting

### **Error: "Cannot find module"**
```bash
# Instala dependencias del design-system
cd design-system
npm install

# O en tu proyecto principal
npm install
```

### **Estilos SCSS no aplican**
```bash
# Asegúrate que SASS está instalado
npm install sass

# Verifica que el archivo CSS se importa en el componente
```

---

## ✅ Checklist al integrar

- [ ] Copié la carpeta `design-system/` a mi proyecto
- [ ] Instalé dependencias: `npm install`
- [ ] Importé componentes correctamente
- [ ] Los estilos se ven bien
- [ ] Reviré Storybook para ver ejemplos

---

## 📞 Contacto

Si hay dudas sobre componentes, revisa la documentación en Storybook o consulta el código en `design-system/components/UXLib/`

---

**¡Listo! Ya puedes usar estos componentes en tu proyecto.** 🎉
