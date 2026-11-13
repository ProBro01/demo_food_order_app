import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './config/firebase.js';
import { initDatabase, getCollectionsStatus } from './config/initDatabase.js';
import orderRoutes from './router/orderRoutes.js';
import customerItemRoutes from './router/customerItemRoutes.js';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// Enable CORS for frontend requests
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

// Request body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    name: 'CraveBite Food Delivery API',
    version: '1.0.0',
    status: 'online',
    healthCheck: '/api/health',
    schemaStatus: '/api/schema/status'
  });
});

// Health check API endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Backend server is running smoothly',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    service: 'cravebite-backend',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Schema and Collections status endpoint
app.get('/api/schema/status', async (req, res) => {
  try {
    const status = await getCollectionsStatus();
    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Mount modular routers from router folder
app.use('/api', orderRoutes);
app.use('/api', customerItemRoutes);

// Fetch all orders from Firestore
app.get('/api/orders', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ status: 'error', message: 'Firestore not available' });
    }
    const snapshot = await db.collection('orders').get();
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ status: 'success', count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Fetch all customer items from Firestore
app.get('/api/customer-items', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ status: 'error', message: 'Firestore not available' });
    }
    const snapshot = await db.collection('customer_items').get();
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ status: 'success', count: items.length, items });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

// Start listening and run collection initialization
app.listen(PORT, async () => {
  console.log(`🚀 CraveBite Backend Server listening on http://localhost:${PORT}`);
  console.log(`🩺 Health check available at: http://localhost:${PORT}/api/health`);
  console.log(`📋 Orders API available at: http://localhost:${PORT}/api/getorderlist`);
  console.log(`🍔 Customer Items API available at: http://localhost:${PORT}/api/get_customer_items`);
  console.log(`🍽️  Register Item API available at: http://localhost:${PORT}/api/register_customer_item (POST)`);
  console.log(`📊 Schema status available at: http://localhost:${PORT}/api/schema/status`);

  // Auto-initialize collections on startup
  await initDatabase();
});
