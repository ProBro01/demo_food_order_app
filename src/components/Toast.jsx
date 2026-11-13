import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function Toast() {
  const { toast } = useCart();

  if (!toast.show) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-xs sm:text-sm font-bold border ${
        isSuccess 
          ? 'bg-slate-900 text-white border-slate-800' 
          : 'bg-orange-600 text-white border-orange-500'
      }`}>
        {isSuccess ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        ) : (
          <Info className="w-4 h-4 text-amber-300 shrink-0" />
        )}
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
