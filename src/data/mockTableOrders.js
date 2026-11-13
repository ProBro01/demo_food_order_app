export const INITIAL_TABLE_ORDERS = [
  {
    id: 'ORD-101',
    tableNumber: 'Table 3',
    guestCount: 2,
    placedAt: '12:24 PM',
    status: 'Preparing', // 'Pending', 'Preparing', 'Ready to Serve', 'Completed', 'Cancelled'
    specialInstructions: 'Extra napkins and water with lemon please.',
    items: [
      {
        id: 'item-1',
        name: 'Truffle Bacon Smash Burger',
        quantity: 2,
        price: 14.99,
        isVeg: false,
        addons: ['Extra Cheddar Cheese', 'Crispy Bacon Strip'],
        itemStatus: 'Preparing'
      },
      {
        id: 'item-2',
        name: 'Iced Spanish Latte & Cold Foam',
        quantity: 2,
        price: 5.75,
        isVeg: true,
        addons: ['Oat Milk Sub'],
        itemStatus: 'Ready to Serve'
      }
    ],
    totalAmount: 46.48
  },
  {
    id: 'ORD-102',
    tableNumber: 'Table 7',
    guestCount: 4,
    placedAt: '12:35 PM',
    status: 'Pending',
    specialInstructions: 'Make the pizza well-done / crispy crust.',
    items: [
      {
        id: 'item-3',
        name: 'Fiery Pepperoni & Hot Honey Pizza',
        quantity: 1,
        price: 18.20,
        isVeg: false,
        addons: ['Ranch Dipping Sauce', 'Hot Honey Cup'],
        itemStatus: 'Pending'
      },
      {
        id: 'item-4',
        name: 'Artisan Margherita Pizza',
        quantity: 1,
        price: 16.50,
        isVeg: true,
        addons: ['Garlic Butter Crust'],
        itemStatus: 'Pending'
      },
      {
        id: 'item-5',
        name: 'Fresh Mango Passionfruit Smoothie',
        quantity: 2,
        price: 6.50,
        isVeg: true,
        addons: [],
        itemStatus: 'Pending'
      }
    ],
    totalAmount: 51.70
  },
  {
    id: 'ORD-103',
    tableNumber: 'Table 1',
    guestCount: 1,
    placedAt: '12:10 PM',
    status: 'Ready to Serve',
    specialInstructions: 'No onions in the bowl.',
    items: [
      {
        id: 'item-6',
        name: 'Mediterranean Salmon Quinoa Bowl',
        quantity: 1,
        price: 17.95,
        isVeg: false,
        addons: ['Hass Avocado Half'],
        itemStatus: 'Ready to Serve'
      },
      {
        id: 'item-7',
        name: 'Fresh Mango Passionfruit Smoothie',
        quantity: 1,
        price: 6.50,
        isVeg: true,
        addons: ['Add Chia Seeds'],
        itemStatus: 'Ready to Serve'
      }
    ],
    totalAmount: 27.20
  },
  {
    id: 'ORD-104',
    tableNumber: 'Table 5',
    guestCount: 3,
    placedAt: '12:18 PM',
    status: 'Preparing',
    specialInstructions: 'Allergies: peanut allergy on Pad Thai (skip crushed peanuts).',
    items: [
      {
        id: 'item-8',
        name: 'Spicy Shoyu Tonkotsu Ramen',
        quantity: 2,
        price: 15.25,
        isVeg: false,
        addons: ['Extra Ajitsuke Egg', 'Bamboo Shoots'],
        itemStatus: 'Preparing'
      },
      {
        id: 'item-9',
        name: 'Golden Vegetable Pad Thai',
        quantity: 1,
        price: 14.00,
        isVeg: true,
        addons: ['Add Jumbo Prawns (4 pcs)'],
        itemStatus: 'Preparing'
      }
    ],
    totalAmount: 52.45
  },
  {
    id: 'ORD-105',
    tableNumber: 'Table 12',
    guestCount: 2,
    placedAt: '11:55 AM',
    status: 'Completed',
    specialInstructions: 'Bill requested split 50/50.',
    items: [
      {
        id: 'item-10',
        name: 'Crispy Baja Fish Tacos',
        quantity: 2,
        price: 13.50,
        isVeg: false,
        addons: ['Handmade Guacamole'],
        itemStatus: 'Completed'
      },
      {
        id: 'item-11',
        name: 'Molten Belgian Chocolate Lava Cake',
        quantity: 1,
        price: 8.95,
        isVeg: true,
        addons: ['Extra Vanilla Gelato Scoop'],
        itemStatus: 'Completed'
      }
    ],
    totalAmount: 41.20
  }
];

export const ORDER_STATUSES = [
  { id: 'Pending', label: 'Pending', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'Preparing', label: 'Preparing', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { id: 'Ready to Serve', label: 'Ready to Serve', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  { id: 'Completed', label: 'Completed', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { id: 'Cancelled', label: 'Cancelled', color: 'bg-rose-100 text-rose-800 border-rose-300' }
];
