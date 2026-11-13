import React, { createContext, useContext, useState, useEffect } from 'react';
import { PROMO_COUPONS, FOOD_ITEMS } from '../data/foodItems';
import { API_ENDPOINTS, BACKEND_URL } from '../config/api';

export const TABLE_OPTIONS = [
  'Table 1',
  'Table 2',
  'Table 3',
  'Table 4',
  'Table 5',
  'Table 6',
  'Table 7',
  'Table 8',
  'Table 9',
  'Table 10',
  'Table 11',
  'Table 12'
];

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Table selection state for customer dine-in orders
  const [selectedTableNumber, setSelectedTableNumber] = useState(() => {
    try {
      return localStorage.getItem('cravebite_table_number') || 'Table 1';
    } catch (e) {
      return 'Table 1';
    }
  });

  // Cart state persisted in localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('cravebite_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Favorites state persisted in localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('cravebite_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // UI state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItemForModal, setSelectedItemForModal] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [activeOrder, setActiveOrder] = useState(null);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [dietFilter, setDietFilter] = useState('all'); // 'all', 'veg', 'non-veg'
  const [sortBy, setSortBy] = useState('popular'); // 'popular', 'rating', 'price-low', 'price-high', 'time'
  const [deliveryAddress, setDeliveryAddress] = useState('742 Evergreen Terrace, Apt 4B');

  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  // Customer items catalog state from /api/get_customer_items
  const [customerItems, setCustomerItems] = useState(FOOD_ITEMS);
  const [isLoadingCustomerItems, setIsLoadingCustomerItems] = useState(true);
  const [itemsSource, setItemsSource] = useState('connecting');

  // Fetch customer items from backend API
  const fetchCustomerItems = async () => {
    setIsLoadingCustomerItems(true);
    try {
      const endpoint = API_ENDPOINTS.GET_CUSTOMER_ITEMS || `${BACKEND_URL}/api/get_customer_items`;
      console.log(`Connecting to customer items API: ${endpoint}`);

      let response = null;
      try {
        response = await fetch(endpoint);
      } catch (directErr) {
        // Fallback to relative proxy route or singular alias
        try {
          response = await fetch('/api/get_customer_items');
        } catch (proxyErr) {
          response = await fetch('/api/get_customer_item');
        }
      }

      if (response && response.ok) {
        const data = await response.json();
        const list = Array.isArray(data) ? data : (data.customer_items || data.items || []);
        if (list && list.length > 0) {
          setCustomerItems(list);
          const sourceLabel = data.source === 'firestore' ? 'Live Firestore Database' : 'Backend Service';
          setItemsSource(sourceLabel);
        } else {
          setCustomerItems(FOOD_ITEMS);
          setItemsSource('Default Menu');
        }
      } else {
        throw new Error(`HTTP ${response?.status || 'Unavailable'}`);
      }
    } catch (error) {
      console.warn(`Customer items API unavailable at ${BACKEND_URL}, using fallback catalog:`, error.message);
      setCustomerItems(FOOD_ITEMS);
      setItemsSource(`Offline Catalog`);
    } finally {
      setIsLoadingCustomerItems(false);
    }
  };

  useEffect(() => {
    fetchCustomerItems();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('cravebite_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('cravebite_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('cravebite_table_number', selectedTableNumber);
    } catch (e) {
      console.error(e);
    }
  }, [selectedTableNumber]);

  const showNotification = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'info' });
    }, 3200);
  };

  // Add item with optional custom addons
  const addToCart = (foodItem, quantity = 1, selectedAddons = []) => {
    // Generate unique key based on item id and addons
    const addonsKey = selectedAddons.map(a => a.name).sort().join('|');
    const cartItemId = `${foodItem.id}-${addonsKey}`;

    const addonsCost = selectedAddons.reduce((sum, a) => sum + (a.price || 0), 0);
    const unitPrice = foodItem.price + addonsCost;

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      } else {
        return [
          ...prevCart,
          {
            ...foodItem,
            cartItemId,
            unitPrice,
            selectedAddons,
            quantity
          }
        ];
      }
    });

    showNotification(`Added "${foodItem.name}" to your cart! 🛍️`);
  };

  const updateQuantity = (cartItemId, delta) => {
    setCart(prevCart => {
      return prevCart
        .map(item => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
    showNotification('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    try {
      localStorage.setItem('cravebite_cart', JSON.stringify([]));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleFavorite = (itemId) => {
    setFavorites(prev => {
      const exists = prev.includes(itemId);
      if (exists) {
        showNotification('Removed from saved items', 'info');
        return prev.filter(id => id !== itemId);
      } else {
        showNotification('Saved to favorites! ❤️', 'success');
        return [...prev, itemId];
      }
    });
  };

  // Bill calculations
  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  // Delivery fee logic: Free over $35 or if FREEDEL coupon applied
  const baseDeliveryFee = subtotal > 35 || subtotal === 0 ? 0 : 2.99;
  const isFreeDeliveryCoupon = appliedCoupon?.freeDelivery && subtotal >= (appliedCoupon.minOrder || 0);
  const deliveryFee = isFreeDeliveryCoupon ? 0 : baseDeliveryFee;

  // Coupon discount logic
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent && subtotal >= appliedCoupon.minOrder) {
      discount = (subtotal * appliedCoupon.discountPercent) / 100;
    } else if (appliedCoupon.discountAmount && subtotal >= appliedCoupon.minOrder) {
      discount = appliedCoupon.discountAmount;
    }
  }

  // Tax 8%
  const tax = subtotal > 0 ? (subtotal - discount) * 0.08 : 0;
  const total = Math.max(0, subtotal - discount + deliveryFee + tax);

  const applyCoupon = (code) => {
    setCouponError('');
    const coupon = PROMO_COUPONS.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!coupon) {
      setCouponError('Invalid promo code');
      return false;
    }
    if (subtotal < coupon.minOrder) {
      setCouponError(`Min order of $${coupon.minOrder.toFixed(2)} required for this code`);
      return false;
    }
    setAppliedCoupon(coupon);
    showNotification(`Promo code ${coupon.code} applied! 🎉`, 'success');
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
    showNotification('Promo code removed', 'info');
  };

  const placeOrder = async (orderNotes = '', tableNumber = selectedTableNumber) => {
    if (cart.length === 0) return;

    const targetTable = (tableNumber || selectedTableNumber || 'Table 1').trim();
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const generatedId = `ORD-${Math.floor(100 + Math.random() * 900)}`;

    const currentCart = [...cart];
    const currentTotal = Number(total.toFixed(2));

    const orderPayload = {
      id: generatedId,
      tableNumber: targetTable,
      guestCount: 2,
      placeAt: currentTime,
      placedAt: currentTime,
      status: 'Pending',
      specialInstructions: orderNotes || '',
      notes: orderNotes || '',
      totalAmount: currentTotal,
      total: currentTotal,
      subtotal,
      discount,
      deliveryFee,
      tax,
      address: `Dining In: ${targetTable}`,
      items: currentCart.map((item, idx) => ({
        id: item.id || `item-${idx + 1}`,
        cartItemId: item.cartItemId || `${item.id}-${idx}`,
        name: item.name,
        quantity: item.quantity,
        price: item.unitPrice ?? item.price ?? 0,
        unitPrice: item.unitPrice ?? item.price ?? 0,
        isVeg: Boolean(item.isVeg),
        addons: item.selectedAddons ? item.selectedAddons.map(a => a.name) : [],
        selectedAddons: item.selectedAddons || [],
        itemsStatus: 'Pending',
        itemStatus: 'Pending'
      }))
    };

    // 1. Immediately make the cart empty and close cart drawer to show customer items
    clearCart();
    setIsCartOpen(false);
    setIsOrderTrackerOpen(false);

    // 2. Trigger the backend API to register the order in database
    try {
      const endpoint = API_ENDPOINTS.REGISTER_ORDER || `${BACKEND_URL}/api/register_order`;
      console.log(`Submitting order to: ${endpoint} for ${targetTable}`);

      let response = null;
      try {
        response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload)
        });
      } catch (directErr) {
        response = await fetch('/api/register_order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload)
        });
      }

      if (response && (response.status === 201 || response.ok)) {
        const result = await response.json();
        const savedOrder = result.order || orderPayload;
        setActiveOrder({
          ...savedOrder,
          orderId: savedOrder.id,
          total: savedOrder.totalAmount || savedOrder.total || currentTotal,
          totalAmount: savedOrder.totalAmount || currentTotal,
          estimatedArrival: '15-20 mins'
        });
        showNotification(`🎉 Order #${savedOrder.id} placed for ${targetTable}! Sent to kitchen.`, 'success');
      } else {
        throw new Error(`HTTP ${response?.status || 'Failed'}`);
      }
    } catch (err) {
      console.warn('Backend unavailable, order saved in offline mode:', err.message);
      setActiveOrder({
        ...orderPayload,
        orderId: orderPayload.id,
        total: currentTotal,
        totalAmount: currentTotal,
        estimatedArrival: '15-20 mins',
        isOffline: true
      });
      showNotification(`Order #${orderPayload.id} placed for ${targetTable}! (Backend offline - saved locally)`, 'info');
    }
  };

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        favorites,
        toggleFavorite,
        isCartOpen,
        setIsCartOpen,
        selectedItemForModal,
        setSelectedItemForModal,
        subtotal,
        deliveryFee,
        discount,
        tax,
        total,
        appliedCoupon,
        couponError,
        applyCoupon,
        removeCoupon,
        placeOrder,
        activeOrder,
        setActiveOrder,
        isOrderTrackerOpen,
        setIsOrderTrackerOpen,
        searchQuery,
        setSearchQuery,
        activeCategory,
        setActiveCategory,
        dietFilter,
        setDietFilter,
        sortBy,
        setSortBy,
        deliveryAddress,
        setDeliveryAddress,
        toast,
        showNotification,
        customerItems,
        setCustomerItems,
        isLoadingCustomerItems,
        fetchCustomerItems,
        itemsSource,
        TABLE_OPTIONS,
        selectedTableNumber,
        setSelectedTableNumber
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
