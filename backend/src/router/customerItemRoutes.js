import express from 'express';
import { db } from '../config/firebase.js';
import { SEED_CUSTOMER_ITEMS } from '../config/initDatabase.js';

const router = express.Router();

/**
 * Validates the schema of a customer_item:
 * Required:
 * - name: String (non-empty)
 * - category: String (non-empty)
 * - price: Number (positive > 0)
 * - isVeg: Boolean
 * Optional / Validated:
 * - id: String
 * - restaurant: String
 * - rating: Number
 * - reviews: Number
 * - deliveryTime: String
 * - image: String
 * - dietary: Array of Strings
 * - calories: String
 * - description: String
 * - customizable: Array of Objects with .name (and optional .price)
 */
export function validateCustomerItem(data) {
  const errors = [];

  if (!data || typeof data !== 'object') {
    return {
      isValid: false,
      errors: ['Request body must be a valid JSON object.'],
      sanitized: null
    };
  }

  // 1. Name validation
  if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
    errors.push('Field "name" is required and must be a non-empty string.');
  }

  // 2. Category validation
  if (!data.category || typeof data.category !== 'string' || !data.category.trim()) {
    errors.push('Field "category" is required and must be a non-empty string.');
  }

  // 3. Price validation
  const parsedPrice = parseFloat(data.price);
  if (data.price === undefined || data.price === null || isNaN(parsedPrice) || parsedPrice <= 0) {
    errors.push('Field "price" is required and must be a valid number greater than 0.');
  }

  // 4. isVeg validation
  if (typeof data.isVeg !== 'boolean') {
    errors.push('Field "isVeg" is required and must be a boolean (true or false).');
  }

  // 5. dietary validation
  if (data.dietary !== undefined && !Array.isArray(data.dietary)) {
    errors.push('Field "dietary" must be an Array of strings.');
  } else if (Array.isArray(data.dietary) && data.dietary.some(d => typeof d !== 'string')) {
    errors.push('All elements in "dietary" array must be strings.');
  }

  // 6. customizable validation
  if (data.customizable !== undefined && !Array.isArray(data.customizable)) {
    errors.push('Field "customizable" must be an Array of objects.');
  } else if (Array.isArray(data.customizable)) {
    data.customizable.forEach((addon, idx) => {
      if (typeof addon !== 'object' || addon === null || !addon.name || typeof addon.name !== 'string' || !addon.name.trim()) {
        errors.push(`Customizable item at index ${idx} must be an object with a "name" string property.`);
      }
    });
  }

  // 7. description validation
  if (data.description !== undefined && typeof data.description !== 'string') {
    errors.push('Field "description" must be a string.');
  }

  // 8. image validation
  if (data.image !== undefined && typeof data.image !== 'string') {
    errors.push('Field "image" must be a string URL.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: errors.length === 0 ? {
      id: data.id ? String(data.id).trim() : `item-${Date.now()}`,
      name: data.name.trim(),
      category: data.category.trim().toLowerCase(),
      restaurant: data.restaurant ? String(data.restaurant).trim() : 'CraveBite Kitchen',
      price: Number(parsedPrice.toFixed(2)),
      rating: typeof data.rating === 'number' ? data.rating : 4.8,
      reviews: typeof data.reviews === 'number' ? data.reviews : 1,
      deliveryTime: data.deliveryTime ? String(data.deliveryTime).trim() : '20-30 min',
      image: data.image ? String(data.image).trim() : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      isVeg: Boolean(data.isVeg),
      dietary: Array.isArray(data.dietary) ? data.dietary.map(d => String(d).trim()).filter(Boolean) : [],
      calories: data.calories ? String(data.calories).trim() : '450 kcal',
      description: data.description ? String(data.description).trim() : '',
      customizable: Array.isArray(data.customizable) ? data.customizable.map(a => ({
        name: String(a.name).trim(),
        price: typeof a.price === 'number' ? Number(a.price.toFixed(2)) : parseFloat(a.price) || 0
      })) : []
    } : null
  };
}

/**
 * @route   POST /api/register_customer_item
 * @desc    Validate and push a new customer_item into the Firestore database
 * @access  Public / Admin
 */
router.post('/register_customer_item', async (req, res) => {
  try {
    const { isValid, errors, sanitized } = validateCustomerItem(req.body);

    if (!isValid) {
      return res.status(400).json({
        status: 'error',
        message: 'Schema validation failed for customer_item',
        errors
      });
    }

    if (!db) {
      console.warn('⚠️  Firestore db instance not available. Returning validated item in mock mode.');
      return res.status(201).json({
        status: 'success',
        source: 'mock',
        message: 'Customer item validated successfully (Firestore offline mode)',
        item: sanitized
      });
    }

    console.log(`📡 Pushing new customer item to Firestore collection: customer_items (${sanitized.name})...`);
    await db.collection('customer_items').doc(sanitized.id).set(sanitized);

    console.log(`✨ Successfully registered customer item: ${sanitized.name} with ID: ${sanitized.id}`);

    return res.status(201).json({
      status: 'success',
      source: 'firestore',
      message: 'Customer item registered in database successfully',
      item: sanitized
    });
  } catch (error) {
    console.error('❌ Error registering customer item in Firestore:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to register customer item in database',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/get_customer_items
 * @desc    Fetch all customer food items from the customer_items table in Firestore and send in JSON format
 * @access  Public / Customer / Admin
 */
router.get(['/get_customer_items', '/get_customer_item'], async (req, res) => {
  try {
    if (!db) {
      console.warn('⚠️  Firestore db instance not available. Returning fallback customer items.');
      return res.status(200).json({
        status: 'success',
        source: 'fallback',
        count: SEED_CUSTOMER_ITEMS.length,
        customer_items: SEED_CUSTOMER_ITEMS,
        items: SEED_CUSTOMER_ITEMS
      });
    }

    console.log('📡 Fetching customer items from Firestore collection: customer_items...');
    const snapshot = await db.collection('customer_items').get();

    if (snapshot.empty) {
      return res.status(200).json({
        status: 'success',
        source: 'firestore',
        count: 0,
        customer_items: [],
        items: []
      });
    }

    const customerItems = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.status(200).json({
      status: 'success',
      source: 'firestore',
      count: customerItems.length,
      customer_items: customerItems,
      items: customerItems
    });
  } catch (error) {
    console.error('❌ Error fetching customer items from database:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve customer items from database',
      error: error.message
    });
  }
});

export default router;
