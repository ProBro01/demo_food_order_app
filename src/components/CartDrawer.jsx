import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Tag, 
  Sparkles, 
  ArrowRight, 
  MapPin, 
  Check, 
  Truck,
  AlertCircle
} from 'lucide-react';
import { PROMO_COUPONS } from '../data/foodItems';

export default function CartDrawer() {
  const {
    cart,
    cartCount,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
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
    deliveryAddress
  } = useCart();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCodeInput.trim()) {
      applyCoupon(couponCodeInput.trim());
      setCouponCodeInput('');
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      placeOrder(orderNotes);
    }, 600);
  };

  // Free delivery progress calculation ($35 threshold)
  const freeDeliveryThreshold = 35;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Your Cart</h3>
                <p className="text-xs text-slate-500">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 transition-colors"
                  title="Clear entire cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          {cart.length > 0 ? (
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              
              {/* Free Delivery Bar */}
              <div className="bg-orange-50/70 border border-orange-200/80 rounded-2xl p-3.5">
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <div className="flex items-center gap-1.5 text-orange-800">
                    <Truck className="w-4 h-4 text-orange-600" />
                    <span>
                      {amountNeededForFreeDelivery === 0 
                        ? '🎉 You unlocked FREE delivery!' 
                        : `Add $${amountNeededForFreeDelivery.toFixed(2)} more for FREE delivery`}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-orange-200/60 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-orange-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${freeDeliveryProgress}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-slate-100">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="py-4 flex gap-3.5 items-start">
                    {/* Thumbnail */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-2xl object-cover shrink-0 bg-slate-100 border border-slate-100"
                    />

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-slate-400 hover:text-rose-500 p-0.5 transition-colors"
                          title="Remove item"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Selected Custom Addons */}
                      {item.selectedAddons && item.selectedAddons.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {item.selectedAddons.map(a => (
                            <span 
                              key={a.name}
                              className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium"
                            >
                              +{a.name} (${a.price.toFixed(2)})
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Quantity Stepper & Price */}
                      <div className="flex items-center justify-between mt-2.5">
                        <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-2 py-1">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, -1)}
                            className="w-5 h-5 rounded-lg bg-white hover:bg-orange-500 hover:text-white text-slate-700 shadow-sm flex items-center justify-center transition-all"
                          >
                            <Minus className="w-3 h-3 stroke-[2.5]" />
                          </button>
                          <span className="text-xs font-black text-slate-900 w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, 1)}
                            className="w-5 h-5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white shadow-sm flex items-center justify-center transition-all"
                          >
                            <Plus className="w-3 h-3 stroke-[2.5]" />
                          </button>
                        </div>

                        <span className="text-sm font-extrabold text-slate-900">
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Box */}
              <div className="pt-2">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Enter promo code (e.g. CRAVE20)"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs uppercase font-mono rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                  >
                    Apply
                  </button>
                </form>

                {couponError && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-semibold">
                    <AlertCircle className="w-3 h-3" />
                    {couponError}
                  </p>
                )}

                {appliedCoupon && (
                  <div className="mt-2 flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800">
                    <span className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Promo {appliedCoupon.code} applied!
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-emerald-700 hover:text-emerald-900 text-[11px] underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Delivery Address Review */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-slate-800">Delivering to:</span>
                  <p className="text-slate-600 font-medium truncate">{deliveryAddress}</p>
                </div>
              </div>

              {/* Order Notes */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Leave at apartment door, ring bell..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-orange-500 outline-none"
                />
              </div>

            </div>
          ) : (
            /* Empty Cart View */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 rounded-3xl bg-orange-50 flex items-center justify-center text-orange-500 mb-4">
                <ShoppingBag className="w-10 h-10 stroke-[1.8]" />
              </div>
              <h4 className="text-lg font-extrabold text-slate-800">Your cart is empty</h4>
              <p className="text-xs text-slate-500 max-w-xs mt-1 mb-6">
                Looks like you haven't added anything to your cart yet. Explore our mouth-watering menu!
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-2xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all"
              >
                Browse Menu
              </button>
            </div>
          )}

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-100 space-y-3 shrink-0">
              {/* Calculations */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-bold">${subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Delivery Fee</span>
                  <span className="font-bold">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600 uppercase font-black">Free</span>
                    ) : (
                      `$${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Taxes (8%)</span>
                  <span className="font-bold">${tax.toFixed(2)}</span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-black text-slate-900">
                  <span>Total Amount</span>
                  <span className="text-orange-600">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-[0.99] disabled:opacity-75 text-white py-3.5 rounded-2xl font-extrabold text-sm shadow-xl shadow-orange-500/25 transition-all"
              >
                {isCheckingOut ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Place Order &bull; ${total.toFixed(2)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
