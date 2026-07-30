'use client';

import React from 'react';
import { Filter, RotateCcw, Compass, Calendar, DollarSign, Award, Users, Heart } from 'lucide-react';
import { PackageFilterState } from '@/lib/types/discovery';

interface FilterSidebarProps {
  filters: PackageFilterState;
  onFilterChange: (newFilters: PackageFilterState) => void;
  onReset: () => void;
}

export const PackageFilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  return (
    <aside className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-amber-600" />
          <h3 className="font-heading font-bold text-slate-900 text-sm">Filter Packages</h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-slate-500 hover:text-amber-600 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset All
        </button>
      </div>

      {/* Duration Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-amber-500" />
          Duration (Days)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min Days"
            value={filters.minDuration || ''}
            onChange={(e) => onFilterChange({ ...filters, minDuration: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
          <input
            type="number"
            placeholder="Max Days"
            value={filters.maxDuration || ''}
            onChange={(e) => onFilterChange({ ...filters, maxDuration: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>
      </div>

      {/* Budget Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-amber-500" />
          Max Budget (₹)
        </label>
        <input
          type="number"
          placeholder="e.g. 25000"
          value={filters.maxBudget || ''}
          onChange={(e) => onFilterChange({ ...filters, maxBudget: e.target.value ? Number(e.target.value) : undefined })}
          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
        />
      </div>

      {/* Difficulty Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-amber-500" />
          Difficulty Level
        </label>
        <select
          value={filters.difficulty || ''}
          onChange={(e) => onFilterChange({ ...filters, difficulty: e.target.value || undefined })}
          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
        >
          <option value="">All Difficulties</option>
          <option value="easy">Easy (Relaxed)</option>
          <option value="moderate">Moderate</option>
          <option value="challenging">Challenging</option>
          <option value="strenuous">Strenuous Trekking</option>
        </select>
      </div>

      {/* Travel Style Checkboxes */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
          Travel Style & Vibe
        </label>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={!!filters.familyFriendly}
              onChange={(e) => onFilterChange({ ...filters, familyFriendly: e.target.checked })}
              className="rounded text-amber-600 focus:ring-amber-500"
            />
            <span>Family Friendly</span>
          </label>
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={!!filters.honeymoon}
              onChange={(e) => onFilterChange({ ...filters, honeymoon: e.target.checked })}
              className="rounded text-amber-600 focus:ring-amber-500"
            />
            <span>Honeymoon & Romantic</span>
          </label>
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={!!filters.adventure}
              onChange={(e) => onFilterChange({ ...filters, adventure: e.target.checked })}
              className="rounded text-amber-600 focus:ring-amber-500"
            />
            <span>Adventure & Outdoors</span>
          </label>
        </div>
      </div>
    </aside>
  );
};
