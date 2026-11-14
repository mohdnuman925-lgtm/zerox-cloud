import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import serviceRoutes from './routes/services.js';
import billingRoutes from './routes/billing.js';
import ticketRoutes from './routes/tickets.js';
import adminRoutes from './routes/admin.js';
import { getDB } from './db.js';

import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_PATH = path.join(__dirname, '..', 'dist');

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// Initialize Database
getDB();

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'ZEROX CLOUD API',
    version: '2.4.0',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/admin', adminRoutes);

// Serve Frontend Static Files
app.use(express.static(DIST_PATH));

// SPA Fallback for client routing
app.get('*', (req, res) => {
  res.sendFile(path.join(DIST_PATH, 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

app.listen(PORT, () => {
  console.log(`[ZEROX CLOUD] Backend server running on http://localhost:${PORT}`);
});
