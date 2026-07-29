'use me';
'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Star,
  Globe,
  MoreVertical,
  CheckCircle,
  Clock,
  Archive,
  RefreshCw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  ExternalLink,
} from 'lucide-react';
import { Destination, DestinationCategory, State, Country, DestinationStatus } from '@/lib/types/destination';
import {
  updateDestinationStatus,
  toggleDestinationFeatured,
  bulkUpdateDestinationStatus,
} from '@/lib/actions/destination';

interface DestinationListClientProps {
  initialData: {
    destinations: Destination[];
    totalCount: number;
    totalPages: number;
    page: number;
    limit: number;
  };
  categories: DestinationCategory[];
  states: State[];
  countries: Country[];
}

export const DestinationListClient: React.FC<DestinationListClientProps> = ({
  initialData,
  categories,
  states,
  countries,
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Search & Filter States
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [featuredOnly, setFeaturedOnly] = useState<boolean>(false);

  // Selection state for Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filter local dataset if client-side filtering or trigger router query params
  const filteredDestinations = initialData.destinations.filter((dest) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = dest.name.toLowerCase().includes(q);
      const matchSlug = dest.slug.toLowerCase().includes(q);
      const matchState = dest.state?.name.toLowerCase().includes(q);
      if (!matchName && !matchSlug && !matchState) return false;
    }
    if (statusFilter !== 'all' && dest.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && dest.category_id !== categoryFilter) return false;
    if (stateFilter !== 'all' && dest.state_id !== stateFilter) return false;
    if (featuredOnly && !dest.is_featured) return false;
    return true;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredDestinations.map((d) => d.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleStatusChange = (id: string, newStatus: DestinationStatus) => {
    startTransition(async () => {
      try {
        await updateDestinationStatus(id, newStatus);
        showToast(`Destination status updated to ${newStatus}`);
        router.refresh();
      } catch (err: unknown) {
        showToast(`Error: ${err instanceof Error ? err.message : 'Action failed'}`);
      }
    });
  };

  const handleToggleFeatured = (id: string, currentFeatured: boolean) => {
    startTransition(async () => {
      try {
        await toggleDestinationFeatured(id, !currentFeatured);
        showToast(!currentFeatured ? 'Marked as Featured' : 'Removed from Featured');
        router.refresh();
      } catch (err: unknown) {
        showToast(`Error: ${err instanceof Error ? err.message : 'Action failed'}`);
      }
    });
  };

  const handleBulkAction = (newStatus: DestinationStatus) => {
    if (selectedIds.length === 0) return;
    startTransition(async () => {
      try {
        await bulkUpdateDestinationStatus(selectedIds, newStatus);
        showToast(`Updated ${selectedIds.length} destinations to ${newStatus}`);
        setSelectedIds([]);
        router.refresh();
      } catch (err: unknown) {
        showToast(`Bulk update failed: ${err instanceof Error ? err.message : 'Action failed'}`);
      }
    });
  };

  const getStatusBadge = (status: DestinationStatus) => {
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
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-brand-navy text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20 animate-fade-in">
          <Sparkles className="w-4 h-4 text-brand-orange" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-orange font-mono">
            <MapPin className="w-4 h-4" />
            <span>Travel Catalog Module</span>
          </div>
          <h1 className="text-2xl font-heading font-black text-slate-900 tracking-tight mt-1">
            Destinations Management
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage public travel catalog destinations, media galleries, travel guides, and SEO metadata.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.refresh()}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`} />
          </button>

          <Link
            href="/admin/destinations/new"
            className="inline-flex items-center gap-2 bg-brand-orange text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-button hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Destination</span>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[280px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search destinations by name, slug, or state..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="coming_soon">Coming Soon</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            {/* Category Dropdown */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* State Dropdown */}
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
            >
              <option value="all">All States</option>
              {states.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            {/* Featured Toggle Filter */}
            <button
              onClick={() => setFeaturedOnly(!featuredOnly)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                featuredOnly
                  ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${featuredOnly ? 'fill-white' : 'text-amber-500'}`} />
              <span>Featured Only</span>
            </button>
          </div>
        </div>

        {/* Bulk Action Controls */}
        {selectedIds.length > 0 && (
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between bg-orange-50/50 -mx-4 -mb-4 p-4 rounded-b-2xl">
            <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
              <span className="px-2 py-0.5 bg-brand-orange text-white rounded-full font-mono text-[11px]">
                {selectedIds.length}
              </span>
              <span>Destinations Selected</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction('published')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
              >
                Bulk Publish
              </button>
              <button
                onClick={() => handleBulkAction('coming_soon')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Bulk Coming Soon
              </button>
              <button
                onClick={() => handleBulkAction('draft')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 transition-colors"
              >
                Bulk Draft
              </button>
              <button
                onClick={() => handleBulkAction('archived')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-700 text-white hover:bg-slate-800 transition-colors"
              >
                Bulk Archive
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Destinations Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredDestinations.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <MapPin className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">No destinations found</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
                No destination records match your filter parameters. Try resetting your search or filter options.
              </p>
            </div>
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('all');
                setCategoryFilter('all');
                setStateFilter('all');
                setFeaturedOnly(false);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.length > 0 &&
                        selectedIds.length === filteredDestinations.length
                      }
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-brand-orange focus:ring-brand-orange"
                    />
                  </th>
                  <th className="py-3.5 px-4">Destination</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">State & Country</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Featured</th>
                  <th className="py-3.5 px-4 text-right">Views</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDestinations.map((dest) => {
                  const isSelected = selectedIds.includes(dest.id);
                  return (
                    <tr
                      key={dest.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? 'bg-orange-50/30' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(dest.id)}
                          className="rounded border-slate-300 text-brand-orange focus:ring-brand-orange"
                        />
                      </td>

                      {/* Destination Identity */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3.5">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                            {dest.featured_image_url || dest.hero_banner_url ? (
                              <Image
                                src={dest.featured_image_url || dest.hero_banner_url || ''}
                                alt={dest.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <MapPin className="w-5 h-5" />
                              </div>
                            )}
                          </div>

                          <div>
                            <span className="font-heading font-extrabold text-slate-900 block leading-tight hover:text-brand-orange transition-colors">
                              <Link href={`/admin/destinations/${dest.id}/edit`}>{dest.name}</Link>
                            </span>
                            <span className="text-xs font-mono text-slate-400 block mt-0.5">
                              /{dest.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {dest.category?.name || 'Uncategorized'}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs text-slate-700 font-medium">
                          {dest.state?.name || 'N/A'}, {dest.country?.name || 'India'}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">{getStatusBadge(dest.status)}</td>

                      {/* Featured */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleFeatured(dest.id, dest.is_featured)}
                          className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
                          title={dest.is_featured ? 'Remove from Featured' : 'Mark as Featured'}
                        >
                          <Star
                            className={`w-5 h-5 ${
                              dest.is_featured
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300 hover:text-amber-400'
                            }`}
                          />
                        </button>
                      </td>

                      {/* Views */}
                      <td className="py-3.5 px-4 text-right font-mono text-xs font-semibold text-slate-600">
                        {dest.view_count || 0}
                      </td>

                      {/* Row Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Public View */}
                          <Link
                            href={`/destinations/${dest.slug}`}
                            target="_blank"
                            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title="View Public Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          {/* Edit */}
                          <Link
                            href={`/admin/destinations/${dest.id}/edit`}
                            className="p-2 rounded-lg text-slate-400 hover:text-brand-orange hover:bg-orange-50 transition-colors"
                            title="Edit Destination"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          {/* Quick Archive / Restore */}
                          {dest.status !== 'archived' ? (
                            <button
                              onClick={() => handleStatusChange(dest.id, 'archived')}
                              className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Archive Destination"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(dest.id, 'draft')}
                              className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                              title="Restore to Draft"
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

        {/* Footer info & pagination */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
          <div>
            Showing <span className="font-bold text-slate-800">{filteredDestinations.length}</span> of{' '}
            <span className="font-bold text-slate-800">{initialData.totalCount}</span> total destinations
          </div>

          <div className="flex items-center gap-2 font-mono">
            <button
              disabled={initialData.page <= 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>
              Page {initialData.page} of {initialData.totalPages || 1}
            </span>
            <button
              disabled={initialData.page >= initialData.totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
