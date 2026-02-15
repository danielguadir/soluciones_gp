import { Router } from 'express';
import { getServices, create, update, remove } from '../controllers/service.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public
router.get('/', getServices);

// Protected (Admin only)
router.post('/', authenticate, create);
router.put('/:id', authenticate, update);
router.delete('/:id', authenticate, remove);

export default router;
