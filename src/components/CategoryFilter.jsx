import React from 'react';
import { useCart } from '../context/CartContext';
import { CATEGORIES, FOOD_ITEMS } from '../data/foodItems';
import { 
  UtensilsCrossed, 
  Sandwich, 
  Pizza, 
  Soup, 
  Flame, 
  Salad, 
  Cake, 
  Coffee 
} from 'lucide-react';

const ICON_MAP = {
  UtensilsCrossed,
  Sandwich,
  Pizza,
  Soup,
  Flame,
  Salad,
  Cake,
  Coffee
};

export default function CategoryFilter() {
  const { activeCategory, setActiveCategory, customerItems } = useCart();
  const items = customerItems || FOOD_ITEMS;

  // Calculate count for each category
  const getCategoryCount = (catId) => {
    if (catId === 'all') return items.length;
    return items.filter(item => item.category === catId).length;
  };

  return (
    <div className="my-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Explore by Category
        </h2>
        <span className="text-xs font-semibold text-slate-500">
          {items.length} dishes available
        </span>
      </div>

      {/* Horizontal Scrollable Category Pills */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
        {CATEGORIES.map((cat) => {
          const IconComponent = ICON_MAP[cat.icon] || UtensilsCrossed;
          const isActive = activeCategory === cat.id;
          const count = getCategoryCount(cat.id);

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all duration-200 border ${
                isActive
                  ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/25 scale-[1.02]'
                  : 'bg-white text-slate-700 hover:text-orange-600 hover:bg-orange-50/50 border-slate-200/80 shadow-sm'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                <IconComponent className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span>{cat.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                isActive ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
