import { db } from './firebase.js';

// Initial seed orders matching schema:
// id, tableNumber, guestCount, placeAt, status, specialInstructions, totalAmount, items: Array, items.id, items.name, items.quantity, items.price, items.isVeg, addons: Array of strings, itemsStatus
export const SEED_ORDERS = [
  {
    id: 'ORD-101',
    tableNumber: 'Table 3',
    guestCount: 2,
    placeAt: '12:24 PM',
    status: 'Preparing',
    specialInstructions: 'Extra napkins and water with lemon please.',
    totalAmount: 46.48,
    items: [
      {
        id: 'item-1',
        name: 'Truffle Bacon Smash Burger',
        quantity: 2,
        price: 14.99,
        isVeg: false,
        addons: ['Extra Cheddar Cheese', 'Crispy Bacon Strip'],
        itemsStatus: 'Preparing',
        itemStatus: 'Preparing'
      },
      {
        id: 'item-2',
        name: 'Iced Spanish Latte & Cold Foam',
        quantity: 2,
        price: 5.75,
        isVeg: true,
        addons: ['Oat Milk Sub'],
        itemsStatus: 'Ready to Serve',
        itemStatus: 'Ready to Serve'
      }
    ]
  },
  {
    id: 'ORD-102',
    tableNumber: 'Table 7',
    guestCount: 4,
    placeAt: '12:35 PM',
    status: 'Pending',
    specialInstructions: 'Make the pizza well-done / crispy crust.',
    totalAmount: 51.70,
    items: [
      {
        id: 'item-3',
        name: 'Fiery Pepperoni & Hot Honey Pizza',
        quantity: 1,
        price: 18.20,
        isVeg: false,
        addons: ['Ranch Dipping Sauce', 'Hot Honey Cup'],
        itemsStatus: 'Pending',
        itemStatus: 'Pending'
      },
      {
        id: 'item-4',
        name: 'Artisan Margherita Pizza',
        quantity: 1,
        price: 16.50,
        isVeg: true,
        addons: ['Garlic Butter Crust'],
        itemsStatus: 'Pending',
        itemStatus: 'Pending'
      },
      {
        id: 'item-5',
        name: 'Fresh Mango Passionfruit Smoothie',
        quantity: 2,
        price: 6.50,
        isVeg: true,
        addons: [],
        itemsStatus: 'Pending',
        itemStatus: 'Pending'
      }
    ]
  },
  {
    id: 'ORD-103',
    tableNumber: 'Table 1',
    guestCount: 1,
    placeAt: '12:10 PM',
    status: 'Ready to Serve',
    specialInstructions: 'No onions in the bowl.',
    totalAmount: 27.20,
    items: [
      {
        id: 'item-6',
        name: 'Mediterranean Salmon Quinoa Bowl',
        quantity: 1,
        price: 17.95,
        isVeg: false,
        addons: ['Hass Avocado Half'],
        itemsStatus: 'Ready to Serve',
        itemStatus: 'Ready to Serve'
      },
      {
        id: 'item-7',
        name: 'Fresh Mango Passionfruit Smoothie',
        quantity: 1,
        price: 6.50,
        isVeg: true,
        addons: ['Add Chia Seeds'],
        itemsStatus: 'Ready to Serve',
        itemStatus: 'Ready to Serve'
      }
    ]
  },
  {
    id: 'ORD-104',
    tableNumber: 'Table 5',
    guestCount: 3,
    placeAt: '12:18 PM',
    status: 'Preparing',
    specialInstructions: 'Allergies: peanut allergy on Pad Thai (skip peanuts).',
    totalAmount: 52.45,
    items: [
      {
        id: 'item-8',
        name: 'Spicy Shoyu Tonkotsu Ramen',
        quantity: 2,
        price: 15.25,
        isVeg: false,
        addons: ['Extra Ajitsuke Egg', 'Bamboo Shoots'],
        itemsStatus: 'Preparing',
        itemStatus: 'Preparing'
      },
      {
        id: 'item-9',
        name: 'Golden Vegetable Pad Thai',
        quantity: 1,
        price: 14.00,
        isVeg: true,
        addons: ['Add Jumbo Prawns (4 pcs)'],
        itemsStatus: 'Preparing',
        itemStatus: 'Preparing'
      }
    ]
  },
  {
    id: 'ORD-105',
    tableNumber: 'Table 12',
    guestCount: 2,
    placeAt: '11:55 AM',
    status: 'Completed',
    specialInstructions: 'Bill requested split 50/50.',
    totalAmount: 41.20,
    items: [
      {
        id: 'item-10',
        name: 'Crispy Baja Fish Tacos',
        quantity: 2,
        price: 13.50,
        isVeg: false,
        addons: ['Handmade Guacamole'],
        itemsStatus: 'Completed',
        itemStatus: 'Completed'
      },
      {
        id: 'item-11',
        name: 'Molten Belgian Chocolate Lava Cake',
        quantity: 1,
        price: 8.95,
        isVeg: true,
        addons: ['Extra Vanilla Gelato Scoop'],
        itemsStatus: 'Completed',
        itemStatus: 'Completed'
      }
    ]
  }
];

// Initial seed customer items matching schema:
// Id, name, category, restaurant, price, rating, reviews, deliveryTime, image, isVeg, dietary: Array of String, calories, description, custmizable: array of objects, customizable.name
export const SEED_CUSTOMER_ITEMS = [
  {
    id: 'f1',
    name: 'Truffle Bacon Smash Burger',
    category: 'burgers',
    restaurant: 'Burger Theory & Co.',
    price: 14.99,
    rating: 4.9,
    reviews: 342,
    deliveryTime: '20-25 min',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    dietary: ['Bestseller', 'Chef Special'],
    calories: '680 kcal',
    description: 'Double Angus beef patties, applewood smoked bacon, melted Swiss cheese, caramelized onions, and black truffle aioli on a toasted brioche bun.',
    customizable: [
      { name: 'Extra Cheddar Cheese', price: 1.50 },
      { name: 'Crispy Bacon Strip', price: 2.00 },
      { name: 'Fried Jalapeños', price: 1.00 },
      { name: 'Truffle Mayo Dip', price: 1.25 }
    ]
  },
  {
    id: 'f2',
    name: 'Artisan Margherita Pizza',
    category: 'pizza',
    restaurant: 'Bella Napoli Woodfire',
    price: 16.50,
    rating: 4.8,
    reviews: 512,
    deliveryTime: '25-35 min',
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    dietary: ['Vegetarian', 'Classic'],
    calories: '720 kcal',
    description: 'San Marzano tomato sauce, fresh buffalo mozzarella, fragrant Genovese basil leaves, and a drizzle of extra virgin olive oil on 48h cold-fermented dough.',
    customizable: [
      { name: 'Extra Buffalo Mozzarella', price: 2.50 },
      { name: 'Kalamata Olives', price: 1.50 },
      { name: 'Chili Infused Honey', price: 1.00 },
      { name: 'Garlic Butter Crust', price: 1.75 }
    ]
  },
  {
    id: 'f3',
    name: 'Spicy Shoyu Tonkotsu Ramen',
    category: 'asian',
    restaurant: 'Ramen Jin House',
    price: 15.25,
    rating: 4.9,
    reviews: 428,
    deliveryTime: '25-30 min',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    dietary: ['Spicy', 'Popular'],
    calories: '610 kcal',
    description: '16-hour rich pork bone broth infused with black garlic chili oil, springy house-made noodles, braised chashu pork belly, marinated ramen egg, and nori.',
    customizable: [
      { name: 'Extra Ajitsuke Egg', price: 1.75 },
      { name: 'Extra Chashu Pork (2 pcs)', price: 3.50 },
      { name: 'Bamboo Shoots (Menma)', price: 1.20 },
      { name: 'Extra Chili Bomb', price: 0.75 }
    ]
  },
  {
    id: 'f4',
    name: 'Crispy Baja Fish Tacos',
    category: 'mexican',
    restaurant: 'La Taqueria del Sol',
    price: 13.50,
    rating: 4.7,
    reviews: 289,
    deliveryTime: '20-30 min',
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    dietary: ['Seafood', 'Trending'],
    calories: '520 kcal',
    description: 'Three warm corn tortillas stuffed with beer-battered wild cod, crunchy purple slaw, pico de gallo, pickled red onions, and lime crema.',
    customizable: [
      { name: 'Handmade Guacamole', price: 2.50 },
      { name: 'Side of Tortilla Chips & Salsa', price: 3.00 },
      { name: 'Smoked Chipotle Salsa', price: 1.00 }
    ]
  },
  {
    id: 'f5',
    name: 'Mediterranean Salmon Quinoa Bowl',
    category: 'healthy',
    restaurant: 'Green Roots Organics',
    price: 17.95,
    rating: 4.8,
    reviews: 195,
    deliveryTime: '15-25 min',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    dietary: ['Gluten-Free', 'High Protein'],
    calories: '490 kcal',
    description: 'Pan-seared Atlantic salmon fillet over fluffy organic quinoa, roasted chickpeas, cucumber, cherry tomatoes, kalamata olives, and lemon-tahini vinaigrette.',
    customizable: [
      { name: 'Hass Avocado Half', price: 2.00 },
      { name: 'Feta Cheese Crumbles', price: 1.50 },
      { name: 'Extra Salmon Fillet', price: 5.50 }
    ]
  },
  {
    id: 'f6',
    name: 'Fiery Pepperoni & Hot Honey Pizza',
    category: 'pizza',
    restaurant: 'Bella Napoli Woodfire',
    price: 18.20,
    rating: 4.9,
    reviews: 640,
    deliveryTime: '25-35 min',
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    dietary: ['Bestseller', 'Spicy'],
    calories: '810 kcal',
    description: 'Crispy curled artisan pepperoni cups, whole-milk mozzarella, crushed red pepper flakes, and hot habanero-infused honey drizzle.',
    customizable: [
      { name: 'Ranch Dipping Sauce', price: 1.25 },
      { name: 'Extra Pepperoni', price: 2.75 },
      { name: 'Hot Honey Cup', price: 1.50 }
    ]
  },
  {
    id: 'f7',
    name: 'Crispy Korean Fried Chicken Burger',
    category: 'burgers',
    restaurant: 'Seoul Street Bites',
    price: 13.90,
    rating: 4.8,
    reviews: 380,
    deliveryTime: '20-30 min',
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    dietary: ['Spicy', 'Popular'],
    calories: '640 kcal',
    description: 'Ultra-crunchy double-fried chicken thigh glazed in sweet gochujang sauce, kimchi slaw, pickled daikon radish, and toasted sesame on milk bread.',
    customizable: [
      { name: 'Extra Kimchi Slaw', price: 1.25 },
      { name: 'Cheese Fondue Dip', price: 2.00 },
      { name: 'Seasoned French Fries', price: 3.50 }
    ]
  },
  {
    id: 'f8',
    name: 'Golden Vegetable Pad Thai',
    category: 'asian',
    restaurant: 'Bangkok Nights Bistro',
    price: 14.00,
    rating: 4.6,
    reviews: 210,
    deliveryTime: '20-25 min',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    dietary: ['Vegetarian', 'Gluten-Free'],
    calories: '530 kcal',
    description: 'Wok-tossed rice noodles with crispy organic tofu, scrambled egg ribbons, bean sprouts, crushed peanuts, scallions, and tangy tamarind lime glaze.',
    customizable: [
      { name: 'Add Jumbo Prawns (4 pcs)', price: 4.00 },
      { name: 'Add Free-Range Chicken', price: 3.00 },
      { name: 'Extra Crushed Peanuts', price: 0.75 }
    ]
  },
  {
    id: 'f9',
    name: 'Loaded Carnitas Burrito Supreme',
    category: 'mexican',
    restaurant: 'La Taqueria del Sol',
    price: 14.50,
    rating: 4.7,
    reviews: 315,
    deliveryTime: '20-30 min',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    dietary: ['Chef Special'],
    calories: '780 kcal',
    description: 'Slow-braised citrus pork carnitas, cilantro-lime rice, black beans, monterey jack cheese, roasted corn salsa, and Mexican crema wrapped in a giant flour tortilla.',
    customizable: [
      { name: 'Side of Queso Dip', price: 2.75 },
      { name: 'Fresh Guacamole', price: 2.25 },
      { name: 'Make it Wet (Ranchero sauce)', price: 1.75 }
    ]
  },
  {
    id: 'f10',
    name: 'Avocado Green Goddess Superbowl',
    category: 'healthy',
    restaurant: 'Green Roots Organics',
    price: 13.95,
    rating: 4.8,
    reviews: 168,
    deliveryTime: '15-20 min',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    dietary: ['Vegan', 'Gluten-Free'],
    calories: '410 kcal',
    description: 'Fresh massaged kale, baby spinach, hass avocado cubes, edamame, shaved cucumber, toasted pumpkin seeds, and green goddess herb dressing.',
    customizable: [
      { name: 'Marinated Organic Tofu', price: 2.50 },
      { name: 'Hemp Seeds & Chia', price: 1.00 },
      { name: 'Warm Grilled Chicken', price: 3.50 }
    ]
  },
  {
    id: 'f11',
    name: 'Molten Belgian Chocolate Lava Cake',
    category: 'desserts',
    restaurant: 'Sweet Indulgence Bakery',
    price: 8.95,
    rating: 4.9,
    reviews: 580,
    deliveryTime: '15-20 min',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    dietary: ['Vegetarian', 'Bestseller'],
    calories: '450 kcal',
    description: 'Decadent dark chocolate soufflé cake with a warm flowing liquid fudge core, dusted with powdered sugar and served with Madagascar vanilla bean gelato.',
    customizable: [
      { name: 'Extra Vanilla Gelato Scoop', price: 2.25 },
      { name: 'Warm Salted Caramel Drizzle', price: 1.00 },
      { name: 'Fresh Raspberry Compote', price: 1.50 }
    ]
  },
  {
    id: 'f12',
    name: 'New York Style Berry Cheesecake',
    category: 'desserts',
    restaurant: 'Sweet Indulgence Bakery',
    price: 8.50,
    rating: 4.7,
    reviews: 240,
    deliveryTime: '15-20 min',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    dietary: ['Vegetarian'],
    calories: '420 kcal',
    description: 'Velvety smooth cream cheese filling baked on a golden buttery graham cracker crust, crowned with glazed summer berries and fresh mint.',
    customizable: [
      { name: 'Whipped Chantilly Cream', price: 0.95 },
      { name: 'Crushed Candied Pecans', price: 1.25 }
    ]
  },
  {
    id: 'f13',
    name: 'Iced Spanish Latte & Cold Foam',
    category: 'drinks',
    restaurant: 'Roast & Brew Coffee Co.',
    price: 5.75,
    rating: 4.8,
    reviews: 320,
    deliveryTime: '10-20 min',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    dietary: ['Vegetarian', 'Trending'],
    calories: '210 kcal',
    description: 'Double shot of artisan espresso poured over sweetened condensed milk and cold whole milk, topped with silky vanilla bean sweet cream foam.',
    customizable: [
      { name: 'Oat Milk Sub', price: 0.80 },
      { name: 'Extra Espresso Shot', price: 1.00 },
      { name: 'Caramel Syrup Swirl', price: 0.60 }
    ]
  },
  {
    id: 'f14',
    name: 'Fresh Mango Passionfruit Smoothie',
    category: 'drinks',
    restaurant: 'Juice Lab & Botanicals',
    price: 6.50,
    rating: 4.9,
    reviews: 198,
    deliveryTime: '10-20 min',
    image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    dietary: ['Vegan', 'Gluten-Free'],
    calories: '180 kcal',
    description: 'Ripe Alphonso mango blended with crushed passionfruit pulp, organic coconut water, and a touch of agave nectar. 100% natural and refreshing.',
    customizable: [
      { name: 'Add Chia Seeds', price: 0.75 },
      { name: 'Plant Protein Boost', price: 1.50 },
      { name: 'Fresh Mint Leaves', price: 0.50 }
    ]
  },
  {
    id: 'f15',
    name: 'Smoked BBQ Pulled Pork Burger',
    category: 'burgers',
    restaurant: 'Burger Theory & Co.',
    price: 15.50,
    rating: 4.7,
    reviews: 260,
    deliveryTime: '20-30 min',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    dietary: ['Smoked BBQ'],
    calories: '710 kcal',
    description: '12-hour hickory smoked pulled pork shoulder tossed in tangy Texas barbecue sauce, topped with crunchy apple slaw and crispy fried shallots on brioche.',
    customizable: [
      { name: 'Extra Melted Cheddar', price: 1.50 },
      { name: 'Pickled Jalapeños', price: 1.00 },
      { name: 'Crispy Onion Rings side', price: 3.50 }
    ]
  },
  {
    id: 'f16',
    name: 'Quattro Formaggi White Truffle Pizza',
    category: 'pizza',
    restaurant: 'Bella Napoli Woodfire',
    price: 19.50,
    rating: 4.8,
    reviews: 290,
    deliveryTime: '25-35 min',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    dietary: ['Vegetarian', 'Gourmet'],
    calories: '790 kcal',
    description: 'Creamy garlic ricotta base with aged provolone, creamy gorgonzola dolce, fresh fior di latte mozzarella, and white truffle oil drizzle.',
    customizable: [
      { name: 'Caramelized Pears & Walnuts', price: 2.00 },
      { name: 'Hot Honey Drizzle', price: 1.25 }
    ]
  }
];

/**
 * Initializes Firestore collections: 'orders' and 'customer_items'.
 * Checks if collections already contain documents. If they exist, creation is skipped.
 */
export async function initDatabase() {
  if (!db) {
    console.warn('⚠️  Firestore db instance not available. Skipping automatic collection initialization.');
    return { success: false, reason: 'No db instance' };
  }

  const results = {
    orders: { created: false, message: '' },
    customer_items: { created: false, message: '' }
  };

  try {
    console.log('🔄 Checking Firestore collections status...');

    // 1. Check 'orders' collection
    const ordersSnapshot = await db.collection('orders').limit(1).get();
    if (!ordersSnapshot.empty) {
      const msg = "Collection 'orders' already exists. Skipping creation.";
      console.log(`ℹ️  ${msg}`);
      results.orders = { created: false, message: msg };
    } else {
      console.log(`📦 Creating and seeding collection 'orders' (${SEED_ORDERS.length} documents)...`);
      const batch = db.batch();
      for (const order of SEED_ORDERS) {
        const docRef = db.collection('orders').doc(order.id);
        batch.set(docRef, order);
      }
      await batch.commit();
      const msg = `Created 'orders' collection with ${SEED_ORDERS.length} documents.`;
      console.log(`✨ ${msg}`);
      results.orders = { created: true, count: SEED_ORDERS.length, message: msg };
    }

    // 2. Check 'customer_items' collection
    const itemsSnapshot = await db.collection('customer_items').limit(1).get();
    if (!itemsSnapshot.empty) {
      const msg = "Collection 'customer_items' already exists. Skipping creation.";
      console.log(`ℹ️  ${msg}`);
      results.customer_items = { created: false, message: msg };
    } else {
      console.log(`📦 Creating and seeding collection 'customer_items' (${SEED_CUSTOMER_ITEMS.length} documents)...`);
      const batch = db.batch();
      for (const item of SEED_CUSTOMER_ITEMS) {
        const docRef = db.collection('customer_items').doc(item.id);
        batch.set(docRef, item);
      }
      await batch.commit();
      const msg = `Created 'customer_items' collection with ${SEED_CUSTOMER_ITEMS.length} documents.`;
      console.log(`✨ ${msg}`);
      results.customer_items = { created: true, count: SEED_CUSTOMER_ITEMS.length, message: msg };
    }

    return { success: true, results };
  } catch (error) {
    console.error('❌ Error during Firestore collection initialization:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Helper to inspect the current state of both collections
 */
export async function getCollectionsStatus() {
  if (!db) {
    return { connected: false, message: 'Firestore not connected' };
  }

  try {
    const ordersSnapshot = await db.collection('orders').get();
    const itemsSnapshot = await db.collection('customer_items').get();

    return {
      connected: true,
      collections: {
        orders: {
          exists: !ordersSnapshot.empty,
          count: ordersSnapshot.size
        },
        customer_items: {
          exists: !itemsSnapshot.empty,
          count: itemsSnapshot.size
        }
      }
    };
  } catch (error) {
    return { connected: false, error: error.message };
  }
}
