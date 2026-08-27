# Security Audit

## 1. Resumen ejecutivo
Auditoría defensiva del proyecto ImpulsoGP, con foco en Next.js, API Express, autenticación, formulario de contacto, dependencias, Vercel y GitHub. Se corrigieron controles de autorización administrativa, secreto JWT, CORS, límites de cuerpo, rate limiting, encabezados y validación de entrada.

No se inspeccionaron sistemas externos ni se ejecutaron pruebas contra `impulsogp.com`.

## 2. Alcance
Se revisaron `package.json`, lockfile, configuración de Next/Vercel, App Router, API Express, Prisma, autenticación, formulario de contacto, middleware, variables referenciadas, `.gitignore` y búsquedas de patrones de ejecución o inyección.

## 3. Arquitectura observada
- Next.js App Router en `src/app/`.
- Function/API Express en `api/index.ts` con rutas bajo `/api`.
- PostgreSQL mediante Prisma.
- JWT manual con `jsonwebtoken` y contraseñas con `bcryptjs`.
- Formulario `/contacto` que envía datos al API.
- Despliegue previsto en Vercel mediante `vercel.json`.

## 4. Versión de Next.js y dependencias principales
- Node local: `v24.13.1`.
- npm local: `11.8.0`.
- Next.js: `14.2.35`.
- React y React DOM: `18.3.1`.
- Prisma y `@prisma/client`: `5.10.2`.
- TypeScript: `5.5.2` declarado.
- `npm audit --omit=dev`: 2 vulnerabilidades altas en Next.js/PostCSS.
- `npm audit`: 5 vulnerabilidades altas en el árbol completo; resolverlas automáticamente requiere un salto mayor de Next/tooling y no se aplicó `--force`.

## 5. Hallazgos críticos
### SEC-001
- Severidad: Crítica
- Archivo y línea: `server/utils/auth.ts`, función `getJwtSecret`.
- Evidencia: el secreto JWT se valida al usarlo y se rechazan ausencia y longitudes menores de 32 caracteres.
- Impacto: evita firmar o verificar tokens con una clave predecible.
- Probabilidad: Alta si el despliegue omite la variable.
- Corrección recomendada: configurar `JWT_SECRET` fuerte y único en Vercel por entorno.
- Estado: Corregido en código; requiere verificación de configuración en Vercel.
- Verificación: revisar presencia y longitud sin imprimir el valor; probar login con entorno configurado.

## 6. Hallazgos altos
### SEC-002
- Severidad: Alta
- Archivo y línea: `server/routes/analytics.routes.ts`, ruta `/stats`.
- Evidencia: ahora usa `authenticate` y `requireAdmin`; se eliminó el token administrativo por query string.
- Impacto: evita exponer estadísticas e inquiries mediante URLs o tokens débiles.
- Probabilidad: Alta en la implementación anterior.
- Corrección recomendada: mantener autorización en servidor y consultar el rol real.
- Estado: Corregido.
- Verificación: una petición sin Bearer JWT debe devolver 401; un usuario sin rol ADMIN debe devolver 403.

### SEC-003
- Severidad: Alta
- Archivo y línea: `api/index.ts`, configuración CORS.
- Evidencia: producción solo acepta los dominios explícitos de ImpulsoGP; localhost se permite únicamente fuera de producción.
- Impacto: reduce solicitudes cross-origin no autorizadas.
- Probabilidad: Media.
- Corrección recomendada: mantener la lista explícita y revisar dominios de Preview antes de añadirlos.
- Estado: Corregido.
- Verificación: probar origen autorizado y origen externo no autorizado en un entorno local.

### SEC-004
- Severidad: Alta
- Archivo y línea: `server/controllers/inquiry.controller.ts`, `common/validation.ts`.
- Evidencia: Zod valida nombre, email, asunto y mensaje, rechaza campos inesperados y aplica límites 80/254/120/2000.
- Impacto: reduce abuso, datos malformados e inyección de encabezados en futuras integraciones de correo.
- Probabilidad: Media.
- Estado: Corregido.
- Verificación: pruebas de límites, campos extra y formatos inválidos.

### SEC-005
- Severidad: Alta
- Archivo y línea: `api/index.ts`, `server/middleware/rateLimiter.ts`.
- Evidencia: cuerpo limitado a 512 KB y rate limiting global y específico para inquiries.
- Impacto: reduce spam y consumo abusivo.
- Probabilidad: Alta en un endpoint público.
- Estado: Corregido parcialmente.
- Verificación: comprobar 429 tras superar el límite.
- Riesgo residual: el store por defecto de `express-rate-limit` es local a la instancia; Vercel distribuido requiere Redis/Upstash para protección global.

## 7. Hallazgos medios
### SEC-006
- Severidad: Media
- Archivo y línea: `next.config.mjs`, `api/index.ts`.
- Evidencia: encabezados defensivos, `poweredByHeader: false`, CSP explícita y patrones de imagen limitados.
- Impacto: reduce exposición del navegador y framing.
- Estado: Corregido con CSP compatible que aún usa `unsafe-inline` para scripts/styles.
- Pendiente: migrar a nonces/hashes tras inventariar scripts de terceros.

### SEC-007
- Severidad: Media
- Archivo y línea: `package.json`, lockfile.
- Evidencia: Next actualizado de `14.2.15` a `14.2.35`; los avisos restantes afectan tooling/transitivas y `npm audit fix` propone una actualización mayor.
- Estado: Parcialmente corregido.
- Pendiente: planificar migración probada a la versión mayor vigente, con revisión de React, ESLint, Prisma y build.

## 8. Hallazgos bajos
### SEC-008
- Severidad: Baja
- Archivo y línea: `tsconfig.json`.
- Evidencia: `strict: true` habilitado.
- Impacto: mejora detección temprana de errores.
- Estado: Corregido; TypeScript pasa actualmente.

## 9. Falsos positivos o puntos no aplicables
- No se encontró uso confirmado de `eval`, `new Function`, `child_process`, SQL concatenado o `dangerouslySetInnerHTML` en el código revisado.
- Prisma usa consultas estructuradas; no se observó SQL manual.
- No se verificó compromiso del dominio ni se realizó escaneo externo.
- La ausencia de archivos locales de GitHub Actions/Dependabot debe verificarse en el repositorio remoto si no están presentes en el checkout.

## 10. Correcciones realizadas
- Validación estricta centralizada con Zod.
- JWT sin fallback predecible y con longitud mínima.
- Autenticación Bearer robusta y autorización por rol en servidor.
- Eliminación del registro público de administradores.
- CORS explícito por entorno.
- Límites de cuerpo y rate limiting.
- Encabezados de seguridad y `poweredByHeader` desactivado.
- Restricción de dominios remotos de imágenes.
- Next actualizado al último parche compatible de la rama 14.

## 11. Correcciones pendientes
- Migración mayor de Next.js con pruebas de compatibilidad.
- Store distribuido para rate limiting en Vercel.
- MFA para administradores.
- Cookies HttpOnly/Secure si se sustituye localStorage para sesiones.
- Añadir honeypot o Turnstile proporcional al volumen real del formulario.
- Confirmar configuración de Vercel por entorno y protección de Previews.

## 12. Secretos que deben rotarse
No se imprimieron ni se detectaron valores de secretos. Verificar y rotar `JWT_SECRET`, `DATABASE_URL` y cualquier clave de proveedor configurada en Vercel si fueron compartidas fuera del gestor de secretos.

## 13. Pruebas ejecutadas
- `node --version`.
- `npm --version`.
- `npm list next react react-dom`.
- `npm outdated`.
- `npm audit`.
- `npm audit --omit=dev`: 2 vulnerabilidades altas residuales en Next.js/PostCSS.
- `npx tsc --noEmit`: pasa tras las correcciones actuales.
- `npm run lint`: requiere revisión de configuración/reglas existentes y warnings de imágenes.
- `npm run build`: debe repetirse después de esta última ronda de cambios.

## 14. Riesgos residuales
- La autorización depende de que `JWT_SECRET` esté configurado correctamente en cada entorno.
- El rate limiting sin store compartido no ofrece una cuota global entre instancias Vercel.
- CSP mantiene `unsafe-inline` por compatibilidad.
- No se verificaron permisos, logs, dominios ni variables directamente dentro del panel de Vercel.

## 15. Recomendaciones para Vercel
- Separar variables Development, Preview y Production.
- No exponer secretos con `NEXT_PUBLIC_`.
- Proteger Previews y limitar usuarios con acceso.
- Configurar un store Redis/Upstash para rate limiting distribuido.
- Revisar logs sin contenido de formularios ni tokens.
- Definir región y límites de función según PostgreSQL.

## 16. Recomendaciones para GitHub
- Usar `permissions: contents: read` por defecto.
- Revisar workflows con `pull_request_target` y secretos.
- Fijar Actions por SHA cuando sea viable.
- Activar Dependabot para npm y GitHub Actions.
- Separar validación de pull requests y despliegue de producción con aprobación manual.

## 17. Plan de mantenimiento mensual
1. Ejecutar `npm audit` y revisar advisories sin aplicar `--force` automáticamente.
2. Revisar `npm outdated` y changelogs de Next, React, Prisma y Node.
3. Actualizar Actions y dependencias con PR separado.
4. Revisar variables y accesos de Vercel.
5. Probar autenticación, autorización, formulario, rate limiting y rutas públicas.
6. Revisar logs en busca de datos personales o secretos.
7. Recalcular la CSP cuando cambien analítica, mapas o widgets.
