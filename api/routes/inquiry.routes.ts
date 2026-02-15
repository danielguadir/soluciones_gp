import { Router } from 'express';
import { sendInquiry, listInquiries, readInquiry } from '../controllers/inquiry.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public: Send message
router.post('/', sendInquiry);

// Protected: View/Manage messages
router.get('/', authenticate, listInquiries);
router.patch('/:id/read', authenticate, readInquiry);

export default router;
