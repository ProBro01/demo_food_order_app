import express from 'express';
import { db } from '../config/firebase.js';
import { SEED_ORDERS } from '../config/initDatabase.js';

const router = express.Router();

/**
 * @route   GET /api/getorderlist
 * @desc    Fetch all orders from Firestore database and return JSON list
 * @access  Public / Admin
 */
router.get('/getorderlist', async (req, res) => {
  try {
    if (!db) {
      console.warn('⚠️  Firestore db instance not available. Returning fallback seed orders.');
      return res.status(200).json({
        status: 'success',
        source: 'fallback',
        count: SEED_ORDERS.length,
        orders: SEED_ORDERS
      });
    }

    console.log('📡 Fetching order list from Firestore collection: orders...');
    const snapshot = await db.collection('orders').get();

    if (snapshot.empty) {
      return res.status(200).json({
        status: 'success',
        source: 'firestore',
        count: 0,
        orders: []
      });
    }

    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.status(200).json({
      status: 'success',
      source: 'firestore',
      count: orders.length,
      orders: orders
    });
  } catch (error) {
    console.error('❌ Error fetching order list from database:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve order list from database',
      error: error.message
    });
  }
});

export default router;
