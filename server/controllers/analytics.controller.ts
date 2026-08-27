import { Request, Response } from 'express';
import { getPageviewStats, getTotalPageviews } from '../services/analytics.service';
import { getInquiries } from '../services/inquiry.service';

export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const [pageviews, totalViews, inquiries] = await Promise.all([
      getPageviewStats(),
      getTotalPageviews(),
      getInquiries(),
    ]);

    const unreadCount = inquiries.filter(i => !i.read).length;

    res.json({
      totalPageviews: totalViews,
      pageviews,
      totalInquiries: inquiries.length,
      unreadInquiries: unreadCount,
      inquiries,
    });
  } catch (error: any) {
    console.error('[ADMIN STATS ERROR]', error);
    res.status(500).json({ error: 'Error al obtener stats' });
  }
};
