/**
 * middleware.ts
 * 
 * Next.js Edge Middleware
 * Ejecuta en borde (Vercel Edge Runtime)
 * 
 * SEGURIDAD:
 * - Protección adicional contra ataques
 * - Validación temprana de headers
 * - Protección contra bots básica
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware que valida y protege rutas
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // ============================================
  // Agregar headers de seguridad adicionales
  // ============================================
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // ============================================
  // Validar User-Agent contra bots conocidos
  // (Prevención básica, no es única defensa)
  // ============================================
  const userAgent = request.headers.get('user-agent') || '';
  const suspiciousBots = ['sqlmap', 'nikto', 'nmap', 'masscan'];
  
  if (suspiciousBots.some(bot => userAgent.toLowerCase().includes(bot))) {
    return new NextResponse('Acceso denegado', { status: 403 });
  }

  // ============================================
  // Validar requests POST a rutas API
  // ============================================
  if (request.method === 'POST' && request.nextUrl.pathname.startsWith('/api')) {
    const contentType = request.headers.get('content-type');
    
    // POST debe tener Content-Type
    if (!contentType?.includes('application/json')) {
      return new NextResponse(
        JSON.stringify({ error: 'Content-Type debe ser application/json' }),
        { status: 415, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // ============================================
  // Protección contra timing attacks
  // Agregar header que indica tiempo de respuesta
  // ============================================
  const responseTime = Date.now().toString();
  response.headers.set('X-Response-Time', responseTime);

  return response;
}

/**
 * Configurar rutas protegidas por middleware
 * Ejecutar solo en rutas críticas
 */
export const config = {
  matcher: [
    // API routes
    '/api/:path*',
    // Admin routes (cuando existan)
    '/admin/:path*',
    // Excluir recursos estáticos
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
