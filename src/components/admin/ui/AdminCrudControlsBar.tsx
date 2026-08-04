'use client';

import React from 'react';
import { Search, Filter } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
}

interface AdminCrudControlsBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  searchPlaceholder?: string;
  filterValue?: string;
  onFilterChange?: (v: string) => void;
  filterOptions?: FilterOption[];
  filterLabel?: string;
}

export const AdminCrudControlsBar: React.FC<AdminCrudControlsBarProps> = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search records...',
  filterValue,
  onFilterChange,
  filterOptions = [],
  filterLabel = 'Filter Status',
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6 shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Search Input */}
      <div className="relative w-full md:w-96">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-orange transition-colors"
        />
      </div>

      {/* Filter Dropdown */}
      {filterOptions.length > 0 && onFilterChange && (
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={filterValue}
            onChange={(e) => onFilterChange(e.target.value)}
            className="w-full md:w-auto bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-orange"
          >
            {filterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};
