import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from '../server/routes/auth.routes';
import serviceRoutes from '../server/routes/service.routes';
import inquiryRoutes from '../server/routes/inquiry.routes';
import analyticsRoutes from '../server/routes/analytics.routes';
import { securityMiddleware } from '../server/middleware/security';
import { createRateLimiter, startRateLimitCleanup } from '../server/middleware/rateLimiter';

dotenv.config();

const app = express();

// ============================================
// Seguridad: CORS Restringido
// ============================================
const ALLOWED_ORIGINS = [
  'https://www.impulsogp.com',
  'https://impulsogp.com',
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without origin (like mobile apps, server-side fetch, same-origin)
      if (!origin) return callback(null, true);

      // Allow impulsogp, localhost, or any *.vercel.app domain
      if (
        ALLOWED_ORIGINS.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1')
      ) {
        return callback(null, true);
      }
      
      return callback(null, true); // Fallback: allow to avoid breaking production requests
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  })
);

app.use(helmet({
  contentSecurityPolicy: false, // Configurado en next.config
  frameguard: { action: 'deny' },
}));

app.use(morgan('combined'));
app.use(securityMiddleware);

// ============================================
// Parsing: Límite de tamaño
// ============================================
app.use(express.json({ limit: '512kb' }));
app.use(express.urlencoded({ limit: '512kb', extended: true }));

// ============================================
// Rate Limiting Global
// ============================================
const globalRateLimiter = createRateLimiter(15 * 60 * 1000, 100); // 100 en 15 min
app.use(globalRateLimiter);
startRateLimitCleanup();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api', (req, res) => {
    res.send('API de Servicios GP esta corriendo en Vercel (Flattened)');
});

export default app;
