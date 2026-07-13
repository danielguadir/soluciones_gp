import { useEffect } from 'react';

/**
 * Hook para trackear pageviews
 * Envía la página actual al backend para analytics
 */
export const usePageTracking = () => {
  useEffect(() => {
    const trackPageview = async () => {
      try {
        await fetch('/api/analytics/pageview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page: window.location.pathname,
            userAgent: navigator.userAgent,
            referer: document.referrer,
          }),
        });
      } catch (error) {
        console.error('[TRACKING ERROR]', error);
      }
    };

    trackPageview();
  }, []);
};
