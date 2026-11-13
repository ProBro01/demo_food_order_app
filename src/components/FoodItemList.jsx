import React, { useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { FOOD_ITEMS } from '../data/foodItems';
import FoodCard from './FoodCard';
import { 
  SlidersHorizontal, 
  SearchX, 
  RotateCcw, 
  Sparkles,
  ArrowUpDown,
  Loader2,
  RefreshCw
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
    setSortBy,
    customerItems,
    isLoadingCustomerItems,
    fetchCustomerItems,
    itemsSource
  } = useCart();

  // Filter and Sort logic using data fetched from /api/get_customer_items
  const filteredAndSortedItems = useMemo(() => {
    const baseItems = customerItems && customerItems.length > 0 ? customerItems : FOOD_ITEMS;
    let result = [...baseItems];

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
  }, [customerItems, activeCategory, dietFilter, searchQuery, sortBy]);

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
            <button
              onClick={fetchCustomerItems}
              disabled={isLoadingCustomerItems}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-orange-600 hover:text-white bg-orange-50 hover:bg-orange-500 border border-orange-200/80 rounded-full shadow-sm transition-all active:scale-95 disabled:opacity-50 ml-1"
              title="Refresh menu items from database (/api/get_customer_items)"
            >
              <RefreshCw className={`w-3 h-3 ${isLoadingCustomerItems ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
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

      {/* Loading State or Food Items Grid */}
      {isLoadingCustomerItems ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 bg-white/70 backdrop-blur-sm rounded-3xl border border-slate-200/90 shadow-sm mt-6 animate-fade-in text-center">
          {/* Animated Loading Icon */}
          <div className="relative flex items-center justify-center mb-5">
            <div className="w-16 h-16 rounded-full border-4 border-orange-100 border-t-orange-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-7 h-7 text-orange-500 animate-spin" />
            </div>
          </div>

          <h3 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <span>Fetching Customer Items</span>
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce [animation-delay:0.4s]" />
            </span>
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-md">
            Loading fresh dishes from database via{' '}
            <code className="text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded font-mono text-[11px] font-semibold border border-orange-200/60">
              /api/get_customer_items
            </code>
          </p>

          {/* Skeleton placeholder grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-6xl mt-8 opacity-60">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-slate-50 rounded-3xl p-4 border border-slate-200 animate-pulse space-y-3">
                <div className="bg-slate-200 h-44 rounded-2xl w-full" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-5 bg-slate-200 rounded w-1/4" />
                  <div className="h-8 bg-slate-200 rounded-xl w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : filteredAndSortedItems.length > 0 ? (
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
