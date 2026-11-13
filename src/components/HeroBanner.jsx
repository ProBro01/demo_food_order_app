import React from 'react';
import { useCart } from '../context/CartContext';
import { Sparkles, Flame, Tag, Check, ArrowRight } from 'lucide-react';
import { PROMO_COUPONS } from '../data/foodItems';

export default function HeroBanner() {
  const { applyCoupon, appliedCoupon, showNotification } = useCart();

  const handleApplyCoupon = (code) => {
    applyCoupon(code);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-amber-500 to-rose-500 text-white rounded-3xl p-6 sm:p-10 my-6 shadow-xl shadow-orange-500/10">
      {/* Decorative ambient elements */}
      <div className="absolute -right-12 -bottom-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-10 -top-10 w-48 h-48 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Headline */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
            Special Today &bull; 20-30 Min Rapid Delivery
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.15]">
            Hungry? Get Gourmet Food <br className="hidden sm:inline" />
            <span className="text-amber-200 underline decoration-wavy decoration-orange-300">Delivered Fast</span> to Your Door.
          </h1>

          <p className="text-orange-50 text-sm sm:text-base max-w-xl font-medium leading-relaxed">
            Explore 100+ chef-crafted dishes from the city's finest restaurants. Hot pizzas, smashed burgers, fresh sushi bowls, and more.
          </p>

          {/* Quick Perks */}
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-semibold text-orange-100">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Live Order Tracking
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Free Delivery Over $35
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Contactless Dropoff
            </div>
          </div>
        </div>

        {/* Right Promo Cards */}
        <div className="lg:col-span-5 bg-white/15 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 font-bold text-sm tracking-wide text-white">
              <Tag className="w-4 h-4 text-amber-200" />
              <span>Available Promo Vouchers</span>
            </div>
            <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full font-medium">Click to apply</span>
          </div>

          <div className="space-y-2.5">
            {PROMO_COUPONS.map((coupon) => {
              const isApplied = appliedCoupon?.code === coupon.code;
              return (
                <div
                  key={coupon.code}
                  onClick={() => handleApplyCoupon(coupon.code)}
                  className={`cursor-pointer group flex items-center justify-between p-3 rounded-xl border transition-all ${
                    isApplied
                      ? 'bg-white text-slate-800 border-white shadow-md'
                      : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                  }`}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono font-bold tracking-wider px-2 py-0.5 rounded ${
                        isApplied ? 'bg-orange-100 text-orange-700' : 'bg-black/20 text-amber-200'
                      }`}>
                        {coupon.code}
                      </span>
                      <span className={`text-xs font-bold ${isApplied ? 'text-slate-800' : 'text-white'}`}>
                        {coupon.description}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                      isApplied 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-white/20 group-hover:bg-white group-hover:text-orange-600 text-white'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Applied
                      </>
                    ) : (
                      'Apply'
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
