import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import CategoryFilter from './components/CategoryFilter';
import FoodItemList from './components/FoodItemList';
import CartDrawer from './components/CartDrawer';
import FoodDetailModal from './components/FoodDetailModal';
import OrderTrackerModal from './components/OrderTrackerModal';
import Toast from './components/Toast';
import Footer from './components/Footer';
import AdminPage from './pages/AdminPage';

function AppContent() {
  const [currentPath, setCurrentPath] = useState(() => {
    return window.location.pathname || '/';
  });

  // Listen to browser forward/backward navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isAdminRoute = currentPath === '/admin';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-orange-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar currentPath={currentPath} onNavigate={navigate} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {isAdminRoute ? (
          /* Admin Page (/admin) */
          <AdminPage />
        ) : (
          /* Customer Menu Page (/) */
          <>
            {/* Promotional Hero Banner */}
            <HeroBanner />

            {/* Categories Bar */}
            <CategoryFilter />

            {/* Food Items Catalog & Filter Page */}
            <FoodItemList />
          </>
        )}
      </main>

      {/* Footer (Rendered only on Customer view) */}
      {!isAdminRoute && <Footer />}

      {/* Interactive Drawers & Modals (Available for customer orders) */}
      <CartDrawer />
      <FoodDetailModal />
      <OrderTrackerModal />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
