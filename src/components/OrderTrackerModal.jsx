import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { 
  X, 
  CheckCircle2, 
  ChefHat, 
  Bike, 
  Home, 
  Clock, 
  Phone, 
  MessageSquare, 
  MapPin,
  Sparkles
} from 'lucide-react';

const STEPS = [
  { id: 'confirmed', label: 'Order Confirmed', desc: 'Sent to restaurant', icon: CheckCircle2 },
  { id: 'kitchen', label: 'In the Kitchen', desc: 'Chef preparing fresh', icon: ChefHat },
  { id: 'driver', label: 'Out for Delivery', desc: 'Driver on their way', icon: Bike },
  { id: 'delivered', label: 'Arrived at Door', desc: 'Enjoy your food!', icon: Home },
];

export default function OrderTrackerModal() {
  const { 
    isOrderTrackerOpen, 
    setIsOrderTrackerOpen, 
    activeOrder 
  } = useCart();

  const [currentStepIndex, setCurrentStepIndex] = useState(1); // Start at "kitchen"

  // Simulate progress through delivery stages
  useEffect(() => {
    if (!isOrderTrackerOpen || !activeOrder) return;

    const timer1 = setTimeout(() => setCurrentStepIndex(2), 6000); // move to "driver"
    const timer2 = setTimeout(() => setCurrentStepIndex(3), 15000); // move to "delivered"

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isOrderTrackerOpen, activeOrder]);

  if (!isOrderTrackerOpen || !activeOrder) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-3xl w-full max-w-lg max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-6 relative">
          <button
            onClick={() => setIsOrderTrackerOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="bg-white/20 backdrop-blur-md px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
              {activeOrder.orderId}
            </span>
            {activeOrder.tableNumber && (
              <span className="bg-white text-orange-600 px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
                🍽️ {activeOrder.tableNumber}
              </span>
            )}
            <span className="text-xs text-orange-100">
              Placed at {activeOrder.placedAt}
            </span>
          </div>

          <h3 className="text-2xl font-black">
            Order in Progress!
          </h3>
          <p className="text-xs text-orange-100 mt-1 flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5" />
            Estimated Delivery: <span className="font-bold underline">{activeOrder.estimatedArrival}</span>
          </p>
        </div>

        {/* Tracker Steps */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="relative pl-6 space-y-6 before:absolute before:left-[19px] before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {STEPS.map((step, idx) => {
              const IconComp = step.icon;
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step.id} className="relative flex items-start gap-4">
                  {/* Step Icon Badge */}
                  <div className={`relative z-10 w-7 h-7 -ml-[23px] rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isPast 
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 ring-4 ring-emerald-100'
                      : isCurrent
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25 ring-4 ring-orange-100 animate-pulse'
                      : 'bg-slate-200 text-slate-400'
                  }`}>
                    <IconComp className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>

                  {/* Step Description */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-extrabold ${
                        isCurrent ? 'text-orange-600' : isPast ? 'text-slate-800' : 'text-slate-400'
                      }`}>
                        {step.label}
                      </h4>
                      {isCurrent && (
                        <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded-full">
                          Live
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Delivery Driver Info Card */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                alt="Delivery Driver"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-orange-500/20"
              />
              <div>
                <h5 className="text-sm font-bold text-slate-800">Marcus Sterling</h5>
                <p className="text-xs text-slate-500">Your Delivery Partner &bull; ⭐ 4.9</p>
                <p className="text-[11px] text-orange-600 font-semibold">Honda Civic &bull; Blue</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => alert('Calling Marcus at +1 (555) 234-5678')}
                className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-orange-50 hover:text-orange-600 text-slate-700 flex items-center justify-center shadow-sm transition-colors"
                title="Call driver"
              >
                <Phone className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Destination Details */}
          <div className="text-xs space-y-1.5 p-3.5 bg-slate-50 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                <span>Service Location</span>
              </div>
              {activeOrder.tableNumber && (
                <span className="text-[11px] font-bold text-orange-700 bg-orange-100/80 px-2 py-0.5 rounded-full">
                  Dine-In: {activeOrder.tableNumber}
                </span>
              )}
            </div>
            <p className="text-slate-600 pl-5 font-medium">
              {activeOrder.tableNumber ? `Table Service: ${activeOrder.tableNumber}` : activeOrder.address}
            </p>
            {(activeOrder.specialInstructions || activeOrder.notes) && (
              <p className="text-slate-500 pl-5 italic">
                Notes: "{activeOrder.specialInstructions || activeOrder.notes}"
              </p>
            )}
          </div>

          {/* Ordered Items Summary */}
          <div>
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Items Ordered ({activeOrder.items?.length || 0})
            </h5>
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {(activeOrder.items || []).map((item, idx) => {
                const itemPrice = typeof item.price === 'number'
                  ? item.price
                  : (typeof item.unitPrice === 'number' ? item.unitPrice : parseFloat(item.price || item.unitPrice || 0));
                const itemQty = item.quantity || 1;
                const lineTotal = (itemPrice * itemQty) || 0;

                return (
                  <div key={item.cartItemId || item.id || idx} className="flex justify-between text-xs py-1 border-b border-slate-100 last:border-0">
                    <span className="text-slate-700 font-medium">
                      <span className="font-bold text-slate-900">{itemQty}x</span> {item.name}
                    </span>
                    <span className="font-bold text-slate-900">
                      ${lineTotal.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-700">
            Total Paid: <span className="text-orange-600 font-black text-sm">
              ${(Number(activeOrder.totalAmount ?? activeOrder.total ?? 0)).toFixed(2)}
            </span>
          </div>
          <button
            onClick={() => setIsOrderTrackerOpen(false)}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
          >
            Close & Continue Browsing
          </button>
        </div>

      </div>
    </div>
  );
}
