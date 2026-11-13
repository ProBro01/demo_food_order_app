import React from 'react';
import { useCart } from '../context/CartContext';
import { Star, Clock, Heart, Plus, Minus, Flame } from 'lucide-react';

export default function FoodCard({ item }) {
  const { 
    cart, 
    addToCart, 
    updateQuantity, 
    favorites, 
    toggleFavorite, 
    setSelectedItemForModal 
  } = useCart();

  // Check if item is already in cart (base item without extra custom add-ons)
  const cartItem = cart.find(ci => ci.id === item.id && (!ci.selectedAddons || ci.selectedAddons.length === 0));
  const isFavorite = favorites.includes(item.id);

  const handleCardClick = (e) => {
    // If clicking an action button, don't trigger modal
    if (e.target.closest('button')) return;
    setSelectedItemForModal(item);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Image Container */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Top Overlay Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
            {/* Veg / Non-Veg Indicator */}
            <div 
              className={`w-5 h-5 rounded-md flex items-center justify-center border-2 bg-white/95 backdrop-blur-sm shadow-sm ${
                item.isVeg ? 'border-emerald-600' : 'border-rose-600'
              }`}
              title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
            >
              <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
            </div>

            {/* Dietary / Special Tag */}
            {item.dietary && item.dietary.slice(0, 1).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-slate-900/80 text-white backdrop-blur-sm shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(item.id);
            }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm shadow-md flex items-center justify-center transition-transform active:scale-90"
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label="Toggle favorite"
          >
            <Heart 
              className={`w-4 h-4 transition-colors ${
                isFavorite 
                  ? 'fill-rose-500 text-rose-500' 
                  : 'text-slate-400 hover:text-rose-500'
              }`} 
            />
          </button>

          {/* Delivery Time & Calories badge on bottom of image */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-semibold text-white pointer-events-none">
            <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full">
              <Clock className="w-3 h-3 text-orange-400" />
              {item.deliveryTime}
            </span>
            <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full">
              {item.calories}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5">
          {/* Restaurant & Rating */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-orange-600 truncate max-w-[160px]">
              {item.restaurant}
            </span>
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full text-amber-700 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{item.rating}</span>
              <span className="text-[10px] text-amber-600/70">({item.reviews})</span>
            </div>
          </div>

          {/* Dish Name */}
          <h3 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1 mb-1.5">
            {item.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>

      {/* Card Footer: Price & Add to Cart button */}
      <div className="p-4 sm:p-5 pt-0 mt-auto border-t border-slate-50">
        <div className="flex items-center justify-between pt-3">
          <div className="flex flex-col">
            <span className="text-[11px] uppercase font-bold text-slate-400">Price</span>
            <span className="text-lg font-extrabold text-slate-900">
              ${item.price.toFixed(2)}
            </span>
          </div>

          {/* Cart Stepper or Add button */}
          {cartItem ? (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 bg-orange-50 border border-orange-200 px-2 py-1 rounded-2xl"
            >
              <button
                onClick={() => updateQuantity(cartItem.cartItemId, -1)}
                className="w-7 h-7 rounded-xl bg-white hover:bg-orange-500 hover:text-white text-orange-600 shadow-sm flex items-center justify-center transition-all"
                title="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>

              <span className="w-5 text-center text-xs font-black text-slate-800">
                {cartItem.quantity}
              </span>

              <button
                onClick={() => updateQuantity(cartItem.cartItemId, 1)}
                className="w-7 h-7 rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-sm flex items-center justify-center transition-all"
                title="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(item);
              }}
              className="flex items-center gap-1.5 bg-orange-50 hover:bg-orange-500 text-orange-600 hover:text-white border border-orange-200 hover:border-orange-500 px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-orange-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
