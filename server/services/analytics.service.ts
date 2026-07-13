import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const trackPageview = async (
  page: string,
  ip?: string,
  userAgent?: string,
  referer?: string
) => {
  try {
    return await prisma.pageview.create({
      data: {
        page,
        ip,
        userAgent,
        referer,
      },
    });
  } catch (error: any) {
    console.error('[PAGEVIEW ERROR]', error.message);
  }
};

export const getPageviewStats = async () => {
  try {
    const stats = await prisma.pageview.groupBy({
      by: ['page'],
      _count: true,
      orderBy: {
        _count: {
          page: 'desc',
        },
      },
    });

    return stats.map(s => ({
      page: s.page,
      views: s._count,
    }));
  } catch (error) {
    console.error('[STATS ERROR]', error);
    return [];
  }
};

export const getTotalPageviews = async () => {
  try {
    return await prisma.pageview.count();
  } catch (error) {
    console.error('[TOTAL VIEWS ERROR]', error);
    return 0;
  }
};
