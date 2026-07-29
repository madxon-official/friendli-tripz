'use me';
'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Mountain,
  Plus,
  Search,
  CheckCircle,
  Clock,
  Sparkles,
  Archive,
  RefreshCw,
  Star,
  ExternalLink,
  Edit,
  MapPin,
} from 'lucide-react';
import { Attraction, AttractionCategory, DestinationZone, AttractionStatus } from '@/lib/types/attraction';
import { updateAttractionStatus } from '@/lib/actions/attraction';

interface AttractionListClientProps {
  initialData: {
    attractions: Attraction[];
    totalCount: number;
    totalPages: number;
    page: number;
    limit: number;
  };
  destinations: { id: string; name: string }[];
  categories: AttractionCategory[];
  zones: DestinationZone[];
}

export const AttractionListClient: React.FC<AttractionListClientProps> = ({
  initialData,
  destinations,
  categories,
  zones,
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [destFilter, setDestFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredAttractions = initialData.attractions.filter((attr) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = attr.name.toLowerCase().includes(q);
      const matchSlug = attr.slug.toLowerCase().includes(q);
      const matchDest = attr.destination?.name.toLowerCase().includes(q);
      if (!matchName && !matchSlug && !matchDest) return false;
    }
    if (statusFilter !== 'all' && attr.status !== statusFilter) return false;
    if (destFilter !== 'all' && attr.destination_id !== destFilter) return false;
    if (categoryFilter !== 'all' && attr.category_id !== categoryFilter) return false;
    return true;
  });

  const handleStatusChange = (id: string, newStatus: AttractionStatus) => {
    startTransition(async () => {
      try {
        await updateAttractionStatus(id, newStatus);
        showToast(`Attraction status updated to ${newStatus}`);
        router.refresh();
      } catch (err: unknown) {
        showToast(`Error: ${err instanceof Error ? err.message : 'Failed'}`);
      }
    });
  };

  const getStatusBadge = (status: AttractionStatus) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            Published
          </span>
        );
      case 'coming_soon':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-600" />
            Coming Soon
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Sparkles className="w-3 h-3 text-amber-600" />
            Draft
          </span>
        );
      case 'archived':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-300">
            <Archive className="w-3 h-3 text-slate-500" />
            Archived
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-brand-navy text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20">
          <Sparkles className="w-4 h-4 text-brand-orange" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-orange font-mono">
            <Mountain className="w-4 h-4" />
            <span>Travel Catalog Module</span>
          </div>
          <h1 className="text-2xl font-heading font-black text-slate-900 tracking-tight mt-1">
            Attractions & Points of Interest
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage physical points of interest, coordinates, operating hours, ticket fees, and bound activities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.refresh()}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`} />
          </button>

          <Link
            href="/admin/attractions/new"
            className="inline-flex items-center gap-2 bg-brand-orange text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-button hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Attraction</span>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[280px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search attractions by name, slug, or destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="coming_soon">Coming Soon</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            <select
              value={destFilter}
              onChange={(e) => setDestFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
            >
              <option value="all">All Destinations</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Attraction Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredAttractions.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <Mountain className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No attractions found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              No attraction records match your current filter parameters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Attraction</th>
                  <th className="py-3.5 px-4">Destination & Zone</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Entry Fee</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAttractions.map((attr) => {
                  const imageSrc =
                    attr.featured_image_url || attr.hero_banner_url || '/images/kodaikanal/kodaikanal-lake.webp';

                  return (
                    <tr key={attr.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3.5">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                            <Image src={imageSrc} alt={attr.name} fill className="object-cover" />
                          </div>
                          <div>
                            <span className="font-heading font-extrabold text-slate-900 block leading-tight hover:text-brand-orange transition-colors">
                              <Link href={`/admin/attractions/${attr.id}/edit`}>{attr.name}</Link>
                            </span>
                            <span className="text-xs font-mono text-slate-400 block mt-0.5">
                              /{attr.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-xs font-bold text-slate-800">
                          {attr.destination?.name || 'Unassigned'}
                        </div>
                        {attr.zone && (
                          <div className="text-[11px] font-mono text-brand-orange mt-0.5">
                            {attr.zone.name}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {attr.category?.name || 'General'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-xs font-bold text-slate-700">
                        {attr.entry_fee_type === 'free'
                          ? 'Free Entry'
                          : `₹${attr.adult_entry_fee}`}
                      </td>

                      <td className="py-3.5 px-4">{getStatusBadge(attr.status)}</td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {attr.destination?.slug && (
                            <Link
                              href={`/destinations/${attr.destination.slug}/attractions/${attr.slug}`}
                              target="_blank"
                              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                              title="View Canonical Page"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          )}

                          <Link
                            href={`/admin/attractions/${attr.id}/edit`}
                            className="p-2 rounded-lg text-slate-400 hover:text-brand-orange hover:bg-orange-50 transition-colors"
                            title="Edit Attraction"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          {attr.status !== 'archived' ? (
                            <button
                              onClick={() => handleStatusChange(attr.id, 'archived')}
                              className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Archive"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(attr.id, 'draft')}
                              className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                              title="Restore"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
