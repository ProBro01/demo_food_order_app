import React, { createContext, useContext, useState, useEffect } from 'react';
import { PROMO_COUPONS } from '../data/foodItems';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
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

  const placeOrder = (orderNotes = '') => {
    if (cart.length === 0) return;
    const newOrder = {
      orderId: 'CRV-' + Math.floor(100000 + Math.random() * 900000),
      items: [...cart],
      subtotal,
      discount,
      deliveryFee,
      tax,
      total,
      address: deliveryAddress,
      notes: orderNotes,
      status: 'confirmed', // 'confirmed', 'kitchen', 'driver', 'delivered'
      placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedArrival: '25-35 mins'
    };

    setActiveOrder(newOrder);
    clearCart();
    setIsCartOpen(false);
    setIsOrderTrackerOpen(true);
    showNotification('Order placed successfully! Tracking your delivery 🚀', 'success');
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
        showNotification
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
