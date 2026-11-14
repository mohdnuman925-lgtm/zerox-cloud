import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import serviceRoutes from './routes/services.js';
import billingRoutes from './routes/billing.js';
import ticketRoutes from './routes/tickets.js';
import adminRoutes from './routes/admin.js';
import { getDB } from './db.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_PATH = path.join(__dirname, '..', 'dist');

const app = express();
const PORT = process.env.PORT || 5050;

// Security: Disable X-Powered-By header to prevent technology fingerprinting
app.disable('x-powered-by');

// Security Headers Middleware (Clickjacking, MIME sniffing, HSTS, XSS protection)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self' https: http: ws: wss:; frame-ancestors 'none';"
  );
  next();
});

// Strict CORS for target domains: zeroxcloud.site, zeroxxcloud.site, n.stake.bond, localhost, vercel
const allowedOrigins = [
  'https://zeroxcloud.site',
  'https://www.zeroxcloud.site',
  'https://zeroxxcloud.site',
  'https://www.zeroxxcloud.site',
  'https://n.stake.bond',
  'https://www.n.stake.bond',
  'http://localhost:5050',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.zeroxcloud.site') ||
      origin.endsWith('.zeroxxcloud.site') ||
      origin.endsWith('.stake.bond') ||
      origin.endsWith('.vercel.app') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1')
    ) {
      return callback(null, true);
    }
    return callback(new Error('Blocked by CORS security policy: origin not allowed'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Payload size limit to prevent memory exhaustion / DoS attacks
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// Apply Global Rate Limiting to all API routes
app.use('/api', apiRateLimiter);

// Initialize Database safely
try {
  getDB();
} catch (err) {
  console.warn('Initial DB load warning:', err.message);
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'ZEROX CLOUD API',
    domains: ['zeroxcloud.site', 'zeroxxcloud.site', 'n.stake.bond'],
    version: '2.4.0',
    timestamp: new Date().toISOString()
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/admin', adminRoutes);

// 404 for undefined API endpoints
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.originalUrl });
});

// Serve Frontend Static Files when running standalone Node server
if (fs.existsSync(DIST_PATH)) {
  app.use(express.static(DIST_PATH));
}

// SPA Fallback for client routing (non-API)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(DIST_PATH, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send('ZEROX CLOUD API is online. Frontend static build pending or served independently.');
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Only listen directly when executed directly as main script and not in serverless (e.g. Vercel)
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT || process.env.IS_SERVERLESS);
const isMainScript = Boolean(process.argv[1] && (process.argv[1].endsWith('server\\index.js') || process.argv[1].endsWith('server/index.js')));

if (isMainScript && !isServerless) {
  app.listen(PORT, () => {
    console.log(`[ZEROX CLOUD] Backend server running on http://localhost:${PORT}`);
  });
}

export default app;
export { app };
