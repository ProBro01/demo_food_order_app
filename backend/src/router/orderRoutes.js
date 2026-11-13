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

/**
 * Validates the schema of an incoming dining order:
 * Required:
 * - tableNumber: String (non-empty)
 * - items: Array of ordered items (non-empty)
 * - totalAmount: Number (> 0)
 * Optional / Defaulted:
 * - id: String
 * - guestCount: Number (default: 2)
 * - placeAt / placedAt: String
 * - status: String (default: 'Pending')
 * - specialInstructions: String
 */
export function validateOrder(data) {
  const errors = [];

  if (!data || typeof data !== 'object') {
    return {
      isValid: false,
      errors: ['Request body must be a valid JSON object.'],
      sanitized: null
    };
  }

  // 1. tableNumber validation
  if (!data.tableNumber || typeof data.tableNumber !== 'string' || !data.tableNumber.trim()) {
    errors.push('Field "tableNumber" is required and must be a non-empty string (e.g. "Table 1").');
  }

  // 2. items validation
  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    errors.push('Field "items" is required and must be a non-empty array of dishes.');
  } else {
    data.items.forEach((item, index) => {
      if (!item || typeof item !== 'object') {
        errors.push(`Item at index ${index} must be an object.`);
      } else {
        if (!item.name || typeof item.name !== 'string' || !item.name.trim()) {
          errors.push(`Item at index ${index} must have a valid "name".`);
        }
        const qty = parseInt(item.quantity, 10);
        if (isNaN(qty) || qty <= 0) {
          errors.push(`Item at index ${index} must have a positive "quantity".`);
        }
        const price = parseFloat(item.price !== undefined ? item.price : item.unitPrice);
        if (isNaN(price) || price < 0) {
          errors.push(`Item at index ${index} must have a valid "price".`);
        }
      }
    });
  }

  // 3. totalAmount validation
  const parsedTotal = parseFloat(data.totalAmount !== undefined ? data.totalAmount : data.total);
  if (data.totalAmount === undefined && data.total === undefined) {
    errors.push('Field "totalAmount" is required.');
  } else if (isNaN(parsedTotal) || parsedTotal <= 0) {
    errors.push('Field "totalAmount" must be a valid number greater than 0.');
  }

  if (errors.length > 0) {
    return { isValid: false, errors, sanitized: null };
  }

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const orderId = data.id && String(data.id).trim() 
    ? String(data.id).trim() 
    : `ORD-${Math.floor(100 + Math.random() * 900)}`;

  const sanitized = {
    id: orderId,
    tableNumber: String(data.tableNumber).trim(),
    guestCount: typeof data.guestCount === 'number' && data.guestCount > 0 
      ? data.guestCount 
      : (parseInt(data.guestCount, 10) || 2),
    placeAt: data.placeAt ? String(data.placeAt).trim() : (data.placedAt ? String(data.placedAt).trim() : currentTime),
    placedAt: data.placedAt ? String(data.placedAt).trim() : (data.placeAt ? String(data.placeAt).trim() : currentTime),
    status: data.status && typeof data.status === 'string' ? data.status.trim() : 'Pending',
    specialInstructions: data.specialInstructions 
      ? String(data.specialInstructions).trim() 
      : (data.notes ? String(data.notes).trim() : ''),
    totalAmount: Number(parsedTotal.toFixed(2)),
    items: data.items.map((item, idx) => ({
      id: item.id ? String(item.id) : `item-${idx + 1}`,
      name: String(item.name).trim(),
      quantity: parseInt(item.quantity, 10) || 1,
      price: Number(parseFloat(item.price !== undefined ? item.price : (item.unitPrice || 0)).toFixed(2)),
      isVeg: Boolean(item.isVeg),
      addons: Array.isArray(item.addons)
        ? item.addons.map(a => typeof a === 'string' ? a : (a?.name || String(a)))
        : (Array.isArray(item.selectedAddons) ? item.selectedAddons.map(a => a?.name || String(a)) : []),
      itemsStatus: item.itemsStatus || item.itemStatus || 'Pending',
      itemStatus: item.itemStatus || item.itemsStatus || 'Pending'
    }))
  };

  return { isValid: true, errors: [], sanitized };
}

/**
 * @route   POST /api/register_order
 * @desc    Register a new order for a particular table number and save to Firestore
 * @access  Public / Customer / Admin
 */
router.post('/register_order', async (req, res) => {
  try {
    const { isValid, errors, sanitized } = validateOrder(req.body);

    if (!isValid) {
      return res.status(400).json({
        status: 'error',
        message: 'Order validation failed',
        errors
      });
    }

    if (!db) {
      console.warn('⚠️  Firestore db instance not available. Registering order in mock mode.');
      return res.status(201).json({
        status: 'success',
        source: 'mock',
        message: `Order ${sanitized.id} registered for ${sanitized.tableNumber} (Offline mode)`,
        order: sanitized
      });
    }

    console.log(`📡 Registering order ${sanitized.id} for table: "${sanitized.tableNumber}" in Firestore collection: orders...`);
    await db.collection('orders').doc(sanitized.id).set(sanitized);

    console.log(`✨ Successfully registered order ${sanitized.id} on ${sanitized.tableNumber}!`);

    return res.status(201).json({
      status: 'success',
      source: 'firestore',
      message: `Order registered successfully on ${sanitized.tableNumber}`,
      order: sanitized
    });
  } catch (error) {
    console.error('❌ Error registering order in Firestore:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to register order in database',
      error: error.message
    });
  }
});

export default router;
