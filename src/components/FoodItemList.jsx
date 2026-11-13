import React, { useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { FOOD_ITEMS } from '../data/foodItems';
import FoodCard from './FoodCard';
import { 
  SlidersHorizontal, 
  SearchX, 
  RotateCcw, 
  Sparkles,
  ArrowUpDown
} from 'lucide-react';

export default function FoodItemList() {
  const { 
    searchQuery, 
    setSearchQuery, 
    activeCategory, 
    setActiveCategory,
    dietFilter, 
    setDietFilter,
    sortBy, 
    setSortBy 
  } = useCart();

  // Filter and Sort logic
  const filteredAndSortedItems = useMemo(() => {
    let result = [...FOOD_ITEMS];

    // 1. Category Filter
    if (activeCategory !== 'all') {
      result = result.filter(item => item.category === activeCategory);
    }

    // 2. Dietary Filter
    if (dietFilter === 'veg') {
      result = result.filter(item => item.isVeg === true);
    } else if (dietFilter === 'non-veg') {
      result = result.filter(item => item.isVeg === false);
    }

    // 3. Search query (matches name, description, category, restaurant)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(item => 
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.restaurant.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }

    // 4. Sorting
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'time':
        // parse min time number
        result.sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
        break;
      case 'popular':
      default:
        result.sort((a, b) => b.reviews - a.reviews);
        break;
    }

    return result;
  }, [activeCategory, dietFilter, searchQuery, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setDietFilter('all');
    setSortBy('popular');
  };

  const isFiltering = searchQuery || activeCategory !== 'all' || dietFilter !== 'all' || sortBy !== 'popular';

  return (
    <section id="menu-section" className="py-8">
      {/* List Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Delicious Menu
            </h2>
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-full">
              {filteredAndSortedItems.length} items
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Prepared fresh to order, packed with care, delivered piping hot.
          </p>
        </div>

        {/* Dietary toggles and Sort Dropdown */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          
          {/* Pure Veg / Non-Veg segmented buttons */}
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200/80 text-xs font-bold">
            <button
              onClick={() => setDietFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                dietFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setDietFilter('veg')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                dietFilter === 'veg'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-emerald-600'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${dietFilter === 'veg' ? 'bg-white' : 'bg-emerald-500'}`} />
              Veg
            </button>
            <button
              onClick={() => setDietFilter('non-veg')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                dietFilter === 'non-veg'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-rose-600'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${dietFilter === 'non-veg' ? 'bg-white' : 'bg-rose-500'}`} />
              Non-Veg
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative flex items-center">
            <ArrowUpDown className="absolute left-3 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-8 pr-8 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="time">Fastest Delivery</option>
            </select>
          </div>

          {/* Reset Filters button */}
          {isFiltering && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 hover:text-orange-600 bg-white hover:bg-orange-50 border border-slate-200 rounded-2xl shadow-sm transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

        </div>
      </div>

      {/* Active Search / Category Notification */}
      {searchQuery && (
        <div className="flex items-center justify-between bg-orange-50 border border-orange-200/80 rounded-2xl px-4 py-3 my-4">
          <p className="text-xs sm:text-sm text-orange-800 font-medium">
            Search results for: <span className="font-bold underline">"{searchQuery}"</span>
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs font-bold text-orange-600 hover:text-orange-800 underline"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Food Items Grid */}
      {filteredAndSortedItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {filteredAndSortedItems.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 mt-6 shadow-sm">
          <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <SearchX className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">
            No matching food items found
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
            We couldn't find any dishes matching your current search or dietary filters. Try clearing your search or switching categories.
          </p>
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-2xl shadow-md shadow-orange-500/20 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </section>
  );
}
