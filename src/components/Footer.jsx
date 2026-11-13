import React from 'react';
import { Utensils, Heart, ShieldCheck, Truck, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value proposition badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-slate-800 text-center sm:text-left">
          <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">Fast 30-Min Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Reliable local couriers keeping food hot.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">100% Quality Guaranteed</h4>
              <p className="text-xs text-slate-400 mt-0.5">Fresh ingredients from top-rated restaurants.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">24/7 Food Support</h4>
              <p className="text-xs text-slate-400 mt-0.5">Live order tracking and friendly assistance.</p>
            </div>
          </div>
        </div>

        {/* Footer main links & branding */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-slate-800">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white">
                <Utensils className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xl font-extrabold text-white">CraveBite</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your favorite meals delivered swiftly from the best kitchens in town.
            </p>
          </div>

          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Discover</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#" className="hover:text-orange-400 transition-colors">Burgers & Wings</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Artisan Pizzas</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Asian Ramen & Noodles</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Healthy Bowls</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Company</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#" className="hover:text-orange-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Partner with Us</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Ride with CraveBite</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Careers</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Support & Legal</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#" className="hover:text-orange-400 transition-colors">Help & FAQ</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Contact Support</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} CraveBite Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for delicious food experiences.
          </p>
        </div>

      </div>
    </footer>
  );
}
