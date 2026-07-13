import { Router } from 'express';
import { Request, Response } from 'express';
import { trackPageview } from '../services/analytics.service';
import { getAdminStats } from '../controllers/analytics.controller';

const router = Router();

// Public: Track pageviews
router.post('/pageview', async (req: Request, res: Response) => {
  try {
    const { page, userAgent, referer } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    await trackPageview(page, ip as string, userAgent, referer);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: 'Error tracking pageview' });
  }
});

// Protected: Admin stats
router.get('/stats', getAdminStats);

export default router;
