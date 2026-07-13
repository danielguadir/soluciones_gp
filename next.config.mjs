/** @type {import('next').NextConfig} */

const nextConfig = {
  // ============================================
  // Security Headers
  // ============================================
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), usb=()',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          // CSP restrictiva (fase 2 para nonces)
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.impulsogp.com https://www.google-analytics.com; frame-ancestors 'none'; form-action 'self';",
          },
        ],
      },
    ];
  },

  // ============================================
  // Security: Disable poweredByHeader
  // ============================================
  poweredByHeader: false,

  // ============================================
  // Remove source maps from production
  // ============================================
  productionBrowserSourceMaps: false,

  // ============================================
  // Image Optimization Security
  // ============================================
  images: {
    // Solo dominios permitidos
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.impulsogp.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
      },
    ],
  },
};

export default nextConfig;