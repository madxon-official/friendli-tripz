'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Calendar,
  Users,
  MapPin,
  Package,
  Car,
  Building2,
  X,
  ArrowRight,
  Clock,
} from 'lucide-react';

interface SearchResultItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Booking' | 'Traveller' | 'Package' | 'Destination' | 'Driver' | 'Hotel';
  url: string;
}

const mockSearchData: SearchResultItem[] = [
  { id: 'b1', title: 'BK-KOD-8841 (Lead: Rajesh Sharma)', subtitle: 'Kodaikanal 3D2N Tour · Confirmed', category: 'Booking', url: '/admin/bookings' },
  { id: 'b2', title: 'BK-KOD-9022 (Lead: Priya Sundaram)', subtitle: 'Custom Hill Station Experience · In Progress', category: 'Booking', url: '/admin/bookings' },
  { id: 't1', title: 'Anand Kumar', subtitle: 'Phone: +91 98401 23456 · 4 Travellers', category: 'Traveller', url: '/admin/enquiries' },
  { id: 't2', title: 'Meera Deshmukh', subtitle: 'Phone: +91 97890 54321 · Kodaikanal', category: 'Traveller', url: '/admin/enquiries' },
  { id: 'd1', title: 'Kodaikanal Mist & Pines', subtitle: 'Tamil Nadu · 12 Active Packages', category: 'Destination', url: '/admin/destinations' },
  { id: 'p1', title: 'Kodaikanal Honeymoon Escape', subtitle: '3 Days / 2 Nights · Luxury Stay', category: 'Package', url: '/admin/packages' },
  { id: 'dr1', title: 'Murugan V (Driver)', subtitle: 'Innovate Crysta (TN-57-AB-1234) · Available', category: 'Driver', url: '/admin/operations' },
  { id: 'h1', title: 'Villa Retreat Kodaikanal', subtitle: '4 Star Deluxe Hotel · 8 Rooms Booked', category: 'Hotel', url: '/admin/operations' },
];

export const CommandPalette: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const results = React.useMemo(() => {
    if (!query.trim()) return mockSearchData.slice(0, 4);
    const q = query.toLowerCase();
    return mockSearchData.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q)
    );
  }, [query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (item: SearchResultItem) => {
    setIsOpen(false);
    setQuery('');
    router.push(item.url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    }
  };

  if (!isOpen) return null;

  const categoryIcons = {
    Booking: Calendar,
    Traveller: Users,
    Package: Package,
    Destination: MapPin,
    Driver: Car,
    Hotel: Building2,
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 lg:p-20">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Palette Container */}
      <div className="relative mx-auto max-w-2xl transform overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 divide-y divide-slate-100 animate-scale-up">
        {/* Search Input Field */}
        <div className="relative flex items-center px-4 py-3.5 bg-slate-50/50">
          <Search className="w-5 h-5 text-brand-orange shrink-0 mr-3" />
          <input
            type="text"
            autoFocus
            placeholder="Search travellers, bookings, drivers, packages, destinations... (Ctrl+K)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm sm:text-base font-semibold text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-400 bg-white rounded border border-slate-200 shadow-xs">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-mono font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>{query.trim() ? 'Search Results' : 'Recent Quick Searches'}</span>
            {!query.trim() && (
              <span className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3 h-3" /> History
              </span>
            )}
          </div>

          {results.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 space-y-1">
              <p className="font-bold text-slate-700">No matching records found</p>
              <p>Try searching for a booking code, traveller name, or destination.</p>
            </div>
          ) : (
            results.map((item, idx) => {
              const Icon = categoryIcons[item.category] || Calendar;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-colors ${
                    isSelected ? 'bg-brand-orange/10 border border-brand-orange/30' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-brand-orange text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {item.category}
                        </span>
                      </div>
                      {item.subtitle && (
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? 'text-brand-orange translate-x-0.5' : 'text-slate-300'
                    }`}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Command Palette Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200 font-bold text-slate-600">↑↓</kbd>{' '}
              Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200 font-bold text-slate-600">↵</kbd>{' '}
              Select
            </span>
          </div>
          <span>Friendli Tripz Universal Search</span>
        </div>
      </div>
    </div>
  );
};
