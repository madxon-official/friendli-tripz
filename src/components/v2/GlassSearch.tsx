'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, Users, Compass, Sparkles } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

export const GlassSearch: React.FC = () => {
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [dates, setDates] = useState('');
  const [travellers, setTravellers] = useState('2 Travellers');
  const [tripStyle, setTripStyle] = useState('Any Style');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`${ROUTES.PACKAGES}?dest=${encodeURIComponent(destination)}`);
  };

  return (
    <motion.form
      onSubmit={handleSearch}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="w-full max-w-4xl bg-white/15 dark:bg-black/30 backdrop-blur-2xl border border-white/30 dark:border-white/10 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-2xl"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Where */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl p-2.5 sm:p-3 border border-white/50 dark:border-slate-800 transition-all hover:border-brand-orange/50">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-brand-orange" />
            Where?
          </label>
          <input
            type="text"
            placeholder="Any destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full bg-transparent text-xs sm:text-sm font-semibold text-brand-navy dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        {/* When */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl p-2.5 sm:p-3 border border-white/50 dark:border-slate-800 transition-all hover:border-brand-orange/50">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-brand-orange" />
            When?
          </label>
          <select
            value={dates}
            onChange={(e) => setDates(e.target.value)}
            className="w-full bg-transparent text-xs sm:text-sm font-semibold text-brand-navy dark:text-white focus:outline-none cursor-pointer"
          >
            <option value="">Anytime</option>
            <option value="may">May 2026</option>
            <option value="jun">June 2026</option>
            <option value="jul">July 2026</option>
            <option value="aug">August 2026</option>
          </select>
        </div>

        {/* Who's Coming */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl p-2.5 sm:p-3 border border-white/50 dark:border-slate-800 transition-all hover:border-brand-orange/50">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1 flex items-center gap-1">
            <Users className="w-3 h-3 text-brand-orange" />
            Who's Coming?
          </label>
          <select
            value={travellers}
            onChange={(e) => setTravellers(e.target.value)}
            className="w-full bg-transparent text-xs sm:text-sm font-semibold text-brand-navy dark:text-white focus:outline-none cursor-pointer"
          >
            <option value="1">Solo Traveller</option>
            <option value="2">2 Travellers</option>
            <option value="3-5">Small Group (3-5)</option>
            <option value="6+">Big Gang (6+)</option>
          </select>
        </div>

        {/* Trip Style */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl p-2.5 sm:p-3 border border-white/50 dark:border-slate-800 transition-all hover:border-brand-orange/50">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1 flex items-center gap-1">
            <Compass className="w-3 h-3 text-brand-orange" />
            Trip Style
          </label>
          <select
            value={tripStyle}
            onChange={(e) => setTripStyle(e.target.value)}
            className="w-full bg-transparent text-xs sm:text-sm font-semibold text-brand-navy dark:text-white focus:outline-none cursor-pointer"
          >
            <option value="Any Style">Any type</option>
            <option value="Mountain">Mountain Escape</option>
            <option value="Beach">Beach Break</option>
            <option value="Campfire">Campfire Nights</option>
            <option value="Weekend">Weekend Reset</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full h-full min-h-[48px] bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs sm:text-sm rounded-xl px-4 py-2.5 shadow-lg shadow-brand-orange/25 transition-all flex items-center justify-center gap-2 group shrink-0"
        >
          <span>Find My Vibe</span>
          <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
        </button>
      </div>
    </motion.form>
  );
};
