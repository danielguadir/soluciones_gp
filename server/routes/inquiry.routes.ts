import { Router } from 'express';
import { sendInquiry, listInquiries, readInquiry } from '../controllers/inquiry.controller';
import { authenticate } from '../middleware/auth.middleware';
import { createRateLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * Rate limiting específico para POST /inquiries
 * Máximo 5 inquiries por IP cada hora
 * Esto protege contra spam y abuso
 */
const inquiryRateLimiter = createRateLimiter(60 * 60 * 1000, 5, 'Máximo 5 mensajes por hora');

// Public: Send message (con rate limiting)
router.post('/', inquiryRateLimiter, sendInquiry);

// Protected: View/Manage messages (requiere autenticación)
router.get('/', authenticate, listInquiries);
router.patch('/:id/read', authenticate, readInquiry);

export default router;
