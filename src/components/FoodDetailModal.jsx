import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { 
  X, 
  Star, 
  Clock, 
  Heart, 
  Plus, 
  Minus, 
  Check, 
  ShoppingBag,
  Flame,
  Utensils
} from 'lucide-react';

export default function FoodDetailModal() {
  const { 
    selectedItemForModal, 
    setSelectedItemForModal, 
    addToCart, 
    favorites, 
    toggleFavorite 
  } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState([]);

  if (!selectedItemForModal) return null;

  const item = selectedItemForModal;
  const isFavorite = favorites.includes(item.id);

  const toggleAddon = (addon) => {
    setSelectedAddons(prev => {
      const exists = prev.some(a => a.name === addon.name);
      if (exists) {
        return prev.filter(a => a.name !== addon.name);
      } else {
        return [...prev, addon];
      }
    });
  };

  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const itemUnitPrice = item.price + addonsTotal;
  const grandTotal = itemUnitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(item, quantity, selectedAddons);
    setSelectedItemForModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="relative h-64 sm:h-72 w-full shrink-0 overflow-hidden bg-slate-100">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />

          {/* Close Button */}
          <button
            onClick={() => setSelectedItemForModal(null)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center shadow-lg transition-transform active:scale-90"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Heart Favorite Button */}
          <button
            onClick={() => toggleFavorite(item.id)}
            className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow-lg transition-transform active:scale-90"
            aria-label="Toggle favorite"
          >
            <Heart 
              className={`w-4 h-4 transition-colors ${
                isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
              }`} 
            />
          </button>

          {/* Bottom Overlay Badges */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-bold text-white">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5 text-orange-400" />
                {item.deliveryTime}
              </span>
              <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full">
                {item.calories}
              </span>
            </div>

            <div 
              className={`w-6 h-6 rounded-md flex items-center justify-center border-2 bg-white/95 backdrop-blur-sm shadow-sm ${
                item.isVeg ? 'border-emerald-600' : 'border-rose-600'
              }`}
            >
              <div className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Title & Restaurant */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                {item.restaurant}
              </span>
              <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full text-amber-800 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{item.rating}</span>
                <span className="text-[10px] text-amber-600/70">({item.reviews} reviews)</span>
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900">
              {item.name}
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Dietary Badges */}
          {item.dietary && (
            <div className="flex flex-wrap gap-2">
              {item.dietary.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Customizable Add-ons */}
          {item.customizable && item.customizable.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Custom Extras & Add-ons
                </h4>
                <span className="text-[11px] font-semibold text-slate-400">Optional</span>
              </div>

              <div className="space-y-2">
                {item.customizable.map((addon) => {
                  const isChecked = selectedAddons.some(a => a.name === addon.name);
                  return (
                    <label
                      key={addon.name}
                      onClick={() => toggleAddon(addon)}
                      className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                        isChecked 
                          ? 'bg-orange-50/70 border-orange-300 shadow-sm' 
                          : 'bg-white border-slate-200/80 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                          isChecked ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-slate-800">
                          {addon.name}
                        </span>
                      </div>
                      <span className="text-xs font-extrabold text-slate-900">
                        +${addon.price.toFixed(2)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer: Quantity Stepper & Add to Cart Button */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 shrink-0 flex items-center justify-between gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center gap-3 bg-white border border-slate-200 px-3 py-2 rounded-2xl shadow-sm">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 flex items-center justify-center transition-colors"
            >
              <Minus className="w-4 h-4 stroke-[2.5]" />
            </button>
            <span className="w-6 text-center text-sm font-black text-slate-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              className="w-8 h-8 rounded-xl bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-2.5 bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white px-6 py-3.5 rounded-2xl font-extrabold text-sm sm:text-base shadow-lg shadow-orange-500/25 transition-all"
          >
            <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
            <span>Add to Cart &bull; ${grandTotal.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
