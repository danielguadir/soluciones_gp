import { Router } from 'express';
import { login } from '../controllers/auth.controller';

const router = Router();

router.post('/login', login);

// REMOVIDO: El endpoint POST /register fue desactivado por seguridad.
// La creación de usuarios admin debe hacerse via script separado.
// Si necesitas reactivarlo en el futuro, requiere:
// 1. Autenticación previa
// 2. Validación con Zod
// 3. Rate limiting específico

export default router;
