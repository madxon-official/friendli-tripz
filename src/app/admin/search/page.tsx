'use client';

import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight, Filter, Tag } from 'lucide-react';
import { executeUniversalSearch } from '@/lib/actions/search';
import { UniversalSearchResultItem } from '@/lib/types/search';
import Link from 'next/link';

export default function GlobalSearchPage() {
  const [queryInput, setQueryInput] = useState('');
  const [results, setResults] = useState<UniversalSearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!queryInput.trim()) return;

    setLoading(true);
    const res = await executeUniversalSearch(queryInput);
    setResults(res);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-700 space-y-3 shadow-xl">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Search className="w-4 h-4" />
            Universal Search Engine
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
            Search Across Bookings, Customers, Vendors & Invoices
          </h1>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSearch} className="bg-slate-800 rounded-3xl p-4 border border-slate-700 flex items-center gap-3">
          <input
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder='Type booking code, customer name, vendor ID, or package slug...'
            className="w-full text-sm p-4 rounded-2xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shrink-0 shadow-md"
          >
            Search
          </button>
        </form>

        {/* Search Results Stream */}
        {results.length > 0 && (
          <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 space-y-4 animate-in fade-in">
            <h3 className="font-heading font-bold text-slate-300 text-sm uppercase tracking-wider">
              Search Results ({results.length})
            </h3>

            <div className="divide-y divide-slate-700/60 text-xs">
              {results.map((res) => (
                <div key={res.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base">{res.title}</span>
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-semibold text-[10px] uppercase">
                        {res.category}
                      </span>
                    </div>
                    <span className="text-slate-400 block">{res.subtitle}</span>
                  </div>

                  <Link
                    href={res.linkUrl}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    Open Record
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
