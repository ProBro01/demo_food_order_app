import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { 
  ShoppingBag, 
  Search, 
  MapPin, 
  Heart, 
  X, 
  Utensils, 
  ShieldCheck, 
  Store,
  Hash
} from 'lucide-react';

export default function Navbar({ currentPath, onNavigate }) {
  const { 
    cartCount, 
    setIsCartOpen, 
    subtotal, 
    searchQuery, 
    setSearchQuery, 
    deliveryAddress, 
    setDeliveryAddress,
    favorites,
    selectedTableNumber,
    setSelectedTableNumber,
    TABLE_OPTIONS
  } = useCart();

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressInput, setAddressInput] = useState(deliveryAddress);

  const isAdmin = currentPath === '/admin';

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (addressInput.trim()) {
      setDeliveryAddress(addressInput.trim());
      setIsAddressModalOpen(false);
    }
  };

  const handleNavigate = (path) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.history.pushState(null, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Logo & Brand */}
            <div className="flex items-center gap-6">
              <button 
                onClick={() => handleNavigate('/')} 
                className="flex items-center gap-2.5 group text-left"
              >
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                  <Utensils className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text text-transparent">
                      CraveBite
                    </span>
                    {isAdmin && (
                      <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Admin
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Fast • Fresh • Flavor
                  </span>
                </div>
              </button>

              {/* Delivery Address Pill (Customer view only) */}
              {/* Delivery Address Pill (Customer view only) */}
              {!isAdmin && (
                <button 
                  onClick={() => setIsAddressModalOpen(true)}
                  className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/80 hover:bg-orange-50 hover:border-orange-200 border border-transparent text-slate-700 text-xs font-medium transition-colors"
                  title="Change delivery location"
                >
                  <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                  <span className="truncate max-w-[170px] text-left">{deliveryAddress}</span>
                  <span className="text-orange-600 font-semibold text-[11px]">Edit</span>
                </button>
              )}

              {/* Dine-In Table Selection Pill (Customer view only) */}
              {!isAdmin && (
                <div 
                  className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200/90 text-slate-800 text-xs font-bold shadow-sm"
                  title="Select your dining table number"
                >
                  <Hash className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <span className="text-orange-700 font-semibold text-[11px] uppercase tracking-wider">Table:</span>
                  <select
                    value={selectedTableNumber}
                    onChange={(e) => setSelectedTableNumber(e.target.value)}
                    className="bg-transparent text-xs font-black text-orange-950 outline-none cursor-pointer border-none p-0 pr-1 hover:text-orange-600"
                  >
                    {TABLE_OPTIONS.map((table) => (
                      <option key={table} value={table} className="text-slate-800 bg-white font-medium">
                        {table}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Search Bar (Customer view only) */}
            {!isAdmin ? (
              <div className="flex-1 max-w-md mx-2">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search for burgers, pizza, ramen, tacos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-9 py-2.5 text-sm bg-slate-100/90 focus:bg-white rounded-full border border-transparent focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all placeholder:text-slate-400 text-slate-800"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 px-4 py-2 rounded-full">
                <ShieldCheck className="w-4 h-4 text-orange-500" />
                <span>Admin Management Mode &bull; Two-Column View</span>
              </div>
            )}

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Route Switcher Button: /admin <-> / */}
              {isAdmin ? (
                <button
                  onClick={() => handleNavigate('/')}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-700 text-xs font-bold transition-all border border-slate-200/80 shadow-sm"
                  title="Switch to Customer Menu"
                >
                  <Store className="w-4 h-4 text-orange-500" />
                  <span>Customer Menu</span>
                </button>
              ) : (
                <button
                  onClick={() => handleNavigate('/admin')}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 text-xs font-bold transition-all border border-slate-200/80 shadow-sm"
                  title="Open Admin Portal"
                >
                  <ShieldCheck className="w-4 h-4 text-orange-500" />
                  <span className="hidden sm:inline">Admin Portal</span>
                </button>
              )}

              {/* Favorites Count indicator (Customer view) */}
              {!isAdmin && favorites.length > 0 && (
                <div 
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-pink-50 text-pink-600 text-xs font-semibold"
                  title={`${favorites.length} saved favorites`}
                >
                  <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
                  <span>{favorites.length}</span>
                </div>
              )}

              {/* Cart Trigger Button (Customer view) */}
              {!isAdmin && (
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative flex items-center gap-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-4 py-2.5 rounded-2xl font-semibold shadow-md shadow-orange-500/25 transition-all"
                  aria-label="View shopping cart"
                >
                  <div className="relative">
                    <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-[10px] uppercase font-bold text-orange-100 leading-none">Cart</span>
                    <span className="text-xs font-extrabold leading-tight">
                      {subtotal > 0 ? `$${subtotal.toFixed(2)}` : 'Empty'}
                    </span>
                  </div>
                </button>
              )}

            </div>

          </div>
        </div>
      </header>

      {/* Address Edit Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-500" />
                <h3 className="text-lg font-bold text-slate-800">Set Delivery Address</h3>
              </div>
              <button 
                onClick={() => setIsAddressModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddressSubmit}>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  Street Address & Apartment
                </label>
                <input
                  type="text"
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  placeholder="e.g. 124 Main Street, Apt 3B"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none text-slate-800 text-sm"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-md shadow-orange-500/20"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
