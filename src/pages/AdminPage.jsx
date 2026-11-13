import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { INITIAL_TABLE_ORDERS, ORDER_STATUSES } from '../data/mockTableOrders';
import { CATEGORIES } from '../data/foodItems';
import { API_ENDPOINTS, BACKEND_URL } from '../config/api';
import { 
  PlusCircle, 
  RotateCcw, 
  Clock, 
  ChefHat, 
  CheckCircle2, 
  AlertCircle, 
  Utensils, 
  Search, 
  Filter, 
  Check, 
  Loader2, 
  Layers, 
  DollarSign, 
  Sparkles,
  ArrowRight,
  Flame,
  UserCheck,
  RefreshCw,
  Eye,
  Hash
} from 'lucide-react';

export default function AdminPage() {
  const { showNotification } = useCart();

  // Loading state for fetching data from orders tables
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [tableSearch, setTableSearch] = useState('');

  // Form State for Column 1 (Add new item form)
  const initialFormState = {
    name: '',
    category: 'burgers',
    price: '',
    isVeg: true,
    prepTime: '15-20 min',
    calories: '',
    imageUrl: '',
    description: '',
    addons: ''
  };
  const [formData, setFormData] = useState(initialFormState);
  const [formSubmittedItem, setFormSubmittedItem] = useState(null);
  const [apiSource, setApiSource] = useState('Connecting to /api/getorderlist...');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch real data for admin using URL from .env (VITE_BACKEND_URL)
  const fetchOrdersData = async () => {
    setIsLoading(true);
    try {
      const endpoint = API_ENDPOINTS.GET_ORDER_LIST;
      console.log(`Connecting to backend API: ${endpoint}`);
      
      let response = null;
      try {
        response = await fetch(endpoint);
      } catch (directErr) {
        // Fallback to relative proxy route
        response = await fetch('/api/getorderlist');
      }

      if (response && response.ok) {
        const data = await response.json();
        const ordersList = Array.isArray(data) ? data : data.orders || [];
        setOrders(ordersList);
        const sourceLabel = data.source === 'firestore' ? 'Live Firestore Database' : 'Backend Service';
        setApiSource(sourceLabel);
        showNotification(`Loaded ${ordersList.length} orders from ${sourceLabel} (${BACKEND_URL})! 🚀`, 'success');
      } else {
        throw new Error(`HTTP ${response?.status || 'Unavailable'}`);
      }
    } catch (error) {
      console.warn(`Backend API at ${BACKEND_URL} unavailable, using local dataset fallback:`, error.message);
      setOrders(INITIAL_TABLE_ORDERS);
      setApiSource(`Offline (Start backend at ${BACKEND_URL})`);
      showNotification(`Using offline data. Start backend at ${BACKEND_URL} to sync live orders.`, 'info');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersData();
  }, []);

  // Handle Form Input changes and clear field errors dynamically
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (formErrors[name]) {
      setFormErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  // Validate mandatory information on frontend
  const validateForm = () => {
    const errors = {};

    if (!formData.name || !formData.name.trim()) {
      errors.name = 'Dish Name is mandatory.';
    }

    if (!formData.category || !formData.category.trim()) {
      errors.category = 'Category is mandatory.';
    }

    const priceNum = parseFloat(formData.price);
    if (formData.price === '' || formData.price === null || formData.price === undefined) {
      errors.price = 'Price is mandatory.';
    } else if (isNaN(priceNum) || priceNum <= 0) {
      errors.price = 'Price must be a valid number greater than $0.00.';
    }

    return errors;
  };

  // Handle Form Submission: validates mandatory fields and hits /api/register_customer_item
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // 1. Mandatory information check
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      const firstErrorMessage = Object.values(errors)[0];
      showNotification(`Mandatory field missing: ${firstErrorMessage}`, 'info');
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    // 2. Prepare payload matching customer_item schema
    const payload = {
      id: `item-${Date.now()}`,
      name: formData.name.trim(),
      category: formData.category.trim().toLowerCase(),
      price: parseFloat(formData.price),
      isVeg: Boolean(formData.isVeg),
      restaurant: 'CraveBite Kitchen',
      deliveryTime: formData.prepTime.trim() || '20-30 min',
      calories: formData.calories.trim() ? `${formData.calories.trim()} kcal` : '450 kcal',
      image: formData.imageUrl.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      description: formData.description.trim() || 'Specialty dish made with fresh ingredients and house seasoning.',
      dietary: [formData.isVeg ? 'Vegetarian' : 'Non-Veg', 'Chef Special'],
      customizable: formData.addons
        ? formData.addons.split(',').map(s => s.trim()).filter(Boolean).map(name => ({ name, price: 1.50 }))
        : []
    };

    try {
      const endpoint = API_ENDPOINTS.REGISTER_CUSTOMER_ITEM || `${BACKEND_URL}/api/register_customer_item`;
      console.log(`Submitting new item to: ${endpoint}`);

      let response = null;
      try {
        response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (directErr) {
        // Fallback to relative proxy route
        response = await fetch('/api/register_customer_item', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (response && (response.status === 201 || response.ok)) {
        const result = await response.json();
        const savedItem = result.item || payload;
        setFormSubmittedItem(savedItem);
        showNotification(`🎉 Dish "${savedItem.name}" saved to Firestore database successfully!`, 'success');
        setFormData(initialFormState);
      } else {
        const errData = await response.json().catch(() => ({}));
        const errMsg = errData.errors ? errData.errors.join(', ') : errData.message || 'Server rejected item entry.';
        showNotification(`Validation error: ${errMsg}`, 'info');
      }
    } catch (err) {
      console.warn('Backend unavailable, saved locally in mock mode:', err.message);
      setFormSubmittedItem({ ...payload, isOffline: true });
      showNotification(`Saved "${payload.name}" locally. (Backend at ${BACKEND_URL} offline)`, 'info');
      setFormData(initialFormState);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update order status (In-memory, without calling backend)
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id === orderId) {
          // Also sync child item statuses if order status changes
          const updatedItems = order.items.map(item => ({
            ...item,
            itemStatus: newStatus
          }));
          return {
            ...order,
            status: newStatus,
            items: updatedItems
          };
        }
        return order;
      })
    );
    showNotification(`Updated ${orderId} status to "${newStatus}"`, 'success');
  };

  // Update individual item status within an order
  const handleUpdateItemStatus = (orderId, itemId, newStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id === orderId) {
          const updatedItems = order.items.map(item => 
            item.id === itemId ? { ...item, itemStatus: newStatus } : item
          );
          return {
            ...order,
            items: updatedItems
          };
        }
        return order;
      })
    );
    showNotification(`Item status updated to "${newStatus}"`, 'info');
  };

  // Metrics for header
  const totalActiveTables = new Set(orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled').map(o => o.tableNumber)).size;
  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const preparingCount = orders.filter(o => o.status === 'Preparing').length;
  const readyCount = orders.filter(o => o.status === 'Ready to Serve').length;

  // Filter orders by table search and status tab
  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatusFilter === 'All' || order.status === selectedStatusFilter;
    const matchesTable = !tableSearch.trim() || 
      order.tableNumber.toLowerCase().includes(tableSearch.toLowerCase().trim()) ||
      order.id.toLowerCase().includes(tableSearch.toLowerCase().trim());
    return matchesStatus && matchesTable;
  });

  return (
    <div className="py-8 space-y-8 animate-fade-in">
      
      {/* Admin Portal Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <ChefHat className="w-3.5 h-3.5" />
                Kitchen & Catalog Admin
              </span>
              <span className="text-slate-400 text-xs">Path: /admin</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Restaurant Admin Console
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
              Add new menu catalog entries and supervise incoming customer orders categorized by dining table number.
            </p>
          </div>

          {/* Quick Metrics & Re-fetch Button */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl px-4 py-2.5 text-center">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Active Tables</div>
              <div className="text-xl font-black text-white">{totalActiveTables}</div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl px-4 py-2.5 text-center">
              <div className="text-[11px] font-bold text-amber-400 uppercase">Pending</div>
              <div className="text-xl font-black text-amber-300">{pendingCount}</div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl px-4 py-2.5 text-center">
              <div className="text-[11px] font-bold text-blue-400 uppercase">In Kitchen</div>
              <div className="text-xl font-black text-blue-300">{preparingCount}</div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl px-4 py-2.5 text-center">
              <div className="text-[11px] font-bold text-purple-400 uppercase">Ready</div>
              <div className="text-xl font-black text-purple-300">{readyCount}</div>
            </div>

            <button
              onClick={fetchOrdersData}
              disabled={isLoading}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-4 py-3 rounded-2xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all disabled:opacity-50"
              title="Refresh orders from database"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ======================================================== */}
        {/* COLUMN 1: Add New Item Form (Takes Admin Entry)          */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-6 lg:max-h-[calc(100vh-175px)] lg:overflow-y-auto custom-scrollbar lg:sticky lg:top-28">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Add New Dish Entry
                </h2>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                Col 1 &bull; Entry Form
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              Enter details for new menu items. Validates mandatory fields and stores to Firestore via <code className="text-orange-600 bg-orange-50 px-1 py-0.5 rounded font-mono text-[11px]">/api/register_customer_item</code>.
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4" noValidate>
            {/* Dish Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Dish / Item Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Garlic Butter Lobster Roll"
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border outline-none transition-all text-slate-800 placeholder:text-slate-400 ${
                  formErrors.name 
                    ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500 focus:ring-2 focus:ring-rose-200' 
                    : 'border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                }`}
              />
              {formErrors.name && (
                <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{formErrors.name}</span>
                </p>
              )}
            </div>

            {/* Category & Price Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-3.5 py-2.5 text-sm rounded-xl border outline-none bg-white text-slate-800 font-medium ${
                    formErrors.category 
                      ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500' 
                      : 'border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                  }`}
                >
                  <option value="burgers">Burgers</option>
                  <option value="pizza">Pizza</option>
                  <option value="asian">Asian & Noodles</option>
                  <option value="mexican">Mexican & Tacos</option>
                  <option value="healthy">Bowls & Salads</option>
                  <option value="desserts">Desserts</option>
                  <option value="drinks">Drinks & Shakes</option>
                </select>
                {formErrors.category && (
                  <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{formErrors.category}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Price ($ USD) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="14.99"
                    className={`w-full pl-8 pr-3.5 py-2.5 text-sm rounded-xl border outline-none transition-all text-slate-800 ${
                      formErrors.price 
                        ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500 focus:ring-2 focus:ring-rose-200' 
                        : 'border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                    }`}
                  />
                </div>
                {formErrors.price && (
                  <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{formErrors.price}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Veg / Non-Veg toggle & Prep Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Dietary Classification
                </label>
                <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => setFormData(f => ({ ...f, isVeg: true }))}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      formData.isVeg ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-300" />
                    Vegetarian
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(f => ({ ...f, isVeg: false }))}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      !formData.isVeg ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-300" />
                    Non-Veg
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Est. Prep Time
                </label>
                <input
                  type="text"
                  name="prepTime"
                  value={formData.prepTime}
                  onChange={handleInputChange}
                  placeholder="e.g. 15-20 min"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-orange-500 outline-none text-slate-800"
                />
              </div>
            </div>

            {/* Calories & Image URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Calories
                </label>
                <input
                  type="text"
                  name="calories"
                  value={formData.calories}
                  onChange={handleInputChange}
                  placeholder="e.g. 520"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-orange-500 outline-none text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Image URL
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-orange-500 outline-none text-slate-800"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Description & Ingredients
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe flavors, key ingredients, allergens, or house recipe secrets..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none text-slate-800 resize-none"
              />
            </div>

            {/* Add-ons comma separated */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Add-ons / Extras <span className="text-slate-400 font-normal lowercase">(comma separated)</span>
              </label>
              <input
                type="text"
                name="addons"
                value={formData.addons}
                onChange={handleInputChange}
                placeholder="Extra Truffle Aioli, Double Cheese, Jalapeños"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-orange-500 outline-none text-slate-800"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setFormData(initialFormState);
                  setFormErrors({});
                }}
                disabled={isSubmitting}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
              >
                Clear Form
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-75 active:scale-[0.99] text-white py-3 rounded-xl font-bold text-sm shadow-md shadow-orange-500/20 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving to Database...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    <span>Save Entry</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Last Submitted Preview Card */}
          {formSubmittedItem && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mt-4 animate-fade-in">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <div className="flex items-center gap-2 text-emerald-800">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Last Entered Item Preview</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  formSubmittedItem.isOffline ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {formSubmittedItem.isOffline ? 'Saved Offline' : 'Saved in Firestore'}
                </span>
              </div>
              <div className="flex gap-3 items-center">
                <img
                  src={formSubmittedItem.image}
                  alt={formSubmittedItem.name}
                  className="w-12 h-12 rounded-xl object-cover bg-slate-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{formSubmittedItem.name}</h4>
                  <div className="text-xs text-slate-600 flex items-center gap-2">
                    <span className="font-extrabold text-orange-600">${Number(formSubmittedItem.price).toFixed(2)}</span>
                    <span>&bull;</span>
                    <span className="capitalize">{formSubmittedItem.category}</span>
                    <span>&bull;</span>
                    <span>{formSubmittedItem.isVeg ? 'Veg' : 'Non-Veg'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ======================================================== */}
        {/* COLUMN 2: Ordered Items by Table Number                  */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col lg:h-[calc(100vh-175px)] lg:min-h-[640px]">
          
          {/* Header of Column 2 */}
          <div className="shrink-0 border-b border-slate-100 pb-4 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    Live Table Orders
                  </h2>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs text-slate-500">
                      Track and update food statuses per table
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {apiSource}
                    </span>
                  </div>
                </div>
              </div>

              {/* Search by Table Number */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter table (e.g. Table 3)"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:border-blue-500 outline-none w-44"
                />
              </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-4 text-xs font-bold">
              {['All', 'Pending', 'Preparing', 'Ready to Serve', 'Completed'].map((statusKey) => {
                const count = statusKey === 'All' 
                  ? orders.length 
                  : orders.filter(o => o.status === statusKey).length;
                const isActive = selectedStatusFilter === statusKey;

                return (
                  <button
                    key={statusKey}
                    onClick={() => setSelectedStatusFilter(statusKey)}
                    className={`shrink-0 px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200/70'
                    }`}
                  >
                    <span>{statusKey}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Loading Indicator when fetching data */}
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 py-16">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center animate-spin">
                <Loader2 className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h4 className="text-base font-bold text-slate-800">
                Fetching Active Table Orders...
              </h4>
              <p className="text-xs text-slate-400 max-w-xs">
                Synchronizing live table tickets and kitchen queue.
              </p>
            </div>
          ) : filteredOrders.length > 0 ? (
            /* Orders List Grouped by Table Number - Scrollable Container */
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {filteredOrders.map((order) => {
                const statusMeta = ORDER_STATUSES.find(s => s.id === order.status) || ORDER_STATUSES[0];

                return (
                  <div
                    key={order.id}
                    className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-all bg-white shadow-sm space-y-4"
                  >
                    {/* Order & Table Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        {/* Table Number Badge */}
                        <div className="px-3 py-1.5 rounded-xl bg-orange-500 text-white font-extrabold text-xs shadow-sm flex items-center gap-1.5">
                          <Hash className="w-3.5 h-3.5" />
                          <span>{order.tableNumber}</span>
                        </div>

                        <div className="text-xs">
                          <span className="font-mono font-bold text-slate-900">{order.id}</span>
                          <span className="text-slate-400 mx-1.5">&bull;</span>
                          <span className="text-slate-500">{order.placeAt || order.placedAt || '12:00 PM'}</span>
                          <span className="text-slate-400 mx-1.5">&bull;</span>
                          <span className="text-slate-500">{order.guestCount ? `${order.guestCount} Guests` : 'Guests'}</span>
                        </div>
                      </div>

                      {/* Order Status Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-400 uppercase">Status:</span>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl border appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${statusMeta.color}`}
                        >
                          {ORDER_STATUSES.map(s => (
                            <option key={s.id} value={s.id}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Ordered Items Table */}
                    <div className="space-y-2.5">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Items Ordered ({order.items.length})
                      </div>

                      <div className="divide-y divide-slate-100">
                        {order.items.map((item) => (
                          <div 
                            key={item.id} 
                            className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                          >
                            <div className="flex items-start gap-2.5">
                              {/* Veg / Non-Veg Dot */}
                              <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                item.isVeg ? 'border-emerald-600' : 'border-rose-600'
                              }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                              </div>

                              <div>
                                <div className="text-xs font-bold text-slate-800">
                                  <span className="text-orange-600 font-extrabold mr-1">
                                    {item.quantity}x
                                  </span> 
                                  {item.name}
                                </div>
                                {item.addons && item.addons.length > 0 && (
                                  <div className="text-[11px] text-slate-500 italic mt-0.5">
                                    Extras: {item.addons.join(', ')}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Item Price and Status Badge */}
                            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                              <span className="text-xs font-extrabold text-slate-800">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>

                              {/* Item status setter */}
                              <select
                                value={item.itemsStatus || item.itemStatus || order.status}
                                onChange={(e) => handleUpdateItemStatus(order.id, item.id, e.target.value)}
                                className="text-[11px] font-semibold px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none cursor-pointer"
                              >
                                {ORDER_STATUSES.map(s => (
                                  <option key={s.id} value={s.id}>
                                    {s.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Special Instructions Note */}
                    {order.specialInstructions && (
                      <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl px-3 py-2 text-xs text-amber-800 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Table Request: </span>
                          <span>{order.specialInstructions}</span>
                        </div>
                      </div>
                    )}

                    {/* Footer of Card: Total Amount */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <span className="text-slate-500 font-medium">Order Subtotal</span>
                      <span className="text-sm font-black text-slate-900">
                        ${order.totalAmount.toFixed(2)}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            /* No Orders Match State */
            <div className="flex-1 flex flex-col items-center justify-center py-16 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Utensils className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-700">No Orders Found</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                No orders match your filter criteria or search keyword.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
