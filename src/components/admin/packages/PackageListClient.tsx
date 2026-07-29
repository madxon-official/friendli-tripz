'use me';
'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Package,
  Plus,
  Search,
  CheckCircle,
  Clock,
  Sparkles,
  Archive,
  RefreshCw,
  MapPin,
  Calendar,
  Layers,
  Tag,
} from 'lucide-react';
import { PackageRelease, PackageFamily, PackageReleaseStatus } from '@/lib/types/package';
import { updatePackageReleaseStatus } from '@/lib/actions/package';

interface PackageListClientProps {
  initialData: {
    releases: PackageRelease[];
    totalCount: number;
    totalPages: number;
    page: number;
    limit: number;
  };
  families: PackageFamily[];
  destinations: { id: string; name: string }[];
}

export const PackageListClient: React.FC<PackageListClientProps> = ({
  initialData,
  families,
  destinations,
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [destFilter, setDestFilter] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredReleases = initialData.releases.filter((rel) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = rel.title.toLowerCase().includes(q);
      const matchVersion = rel.version_tag.toLowerCase().includes(q);
      const matchFamily = rel.family?.name.toLowerCase().includes(q);
      if (!matchTitle && !matchVersion && !matchFamily) return false;
    }
    if (statusFilter !== 'all' && rel.status !== statusFilter) return false;
    if (destFilter !== 'all' && rel.family?.destination?.id !== destFilter) return false;
    return true;
  });

  const handleStatusChange = (id: string, newStatus: PackageReleaseStatus) => {
    startTransition(async () => {
      try {
        await updatePackageReleaseStatus(id, newStatus);
        showToast(`Package version status updated to ${newStatus}`);
        router.refresh();
      } catch (err: unknown) {
        showToast(`Error: ${err instanceof Error ? err.message : 'Failed'}`);
      }
    });
  };

  const getStatusBadge = (status: PackageReleaseStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            Active Release
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Sparkles className="w-3 h-3 text-amber-600" />
            Draft Version
          </span>
        );
      case 'superseded':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-600" />
            Superseded
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
            <Package className="w-4 h-4" />
            <span>Commercial Domain Module</span>
          </div>
          <h1 className="text-2xl font-heading font-black text-slate-900 tracking-tight mt-1">
            Package Releases & Product Catalog
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage versioned package releases, pricing trees, temporal day segment itineraries, and family contracts.
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
            href="/admin/packages/new"
            className="inline-flex items-center gap-2 bg-brand-orange text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-button hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Build Package Release</span>
          </Link>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[280px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search package releases by title, version, or family..."
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
              <option value="all">All Release Statuses</option>
              <option value="active">Active Release</option>
              <option value="draft">Draft Version</option>
              <option value="superseded">Superseded</option>
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
          </div>
        </div>
      </div>

      {/* Package Releases Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredReleases.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <Package className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No package releases found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              No versioned package releases match your current search criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Package Release & Version</th>
                  <th className="py-3.5 px-4">Family & Destination</th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th className="py-3.5 px-4">Base Pricing</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReleases.map((rel) => {
                  const adultPrice = rel.base_pricing_tree_json?.base_adult_price || 0;

                  return (
                    <tr key={rel.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="font-heading font-extrabold text-slate-900 block leading-tight">
                            {rel.title}
                          </span>
                          <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-brand-orange">
                            <Tag className="w-3 h-3" />
                            {rel.version_tag}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-xs font-bold text-slate-800">
                          {rel.family?.name || 'Unassigned Family'}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                          {rel.family?.destination?.name}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-xs font-bold text-slate-700">
                        {rel.duration_days} Days / {rel.duration_nights} Nights
                      </td>

                      <td className="py-3.5 px-4 font-mono text-xs font-bold text-emerald-600">
                        ₹{adultPrice.toLocaleString('en-IN')} / adult
                      </td>

                      <td className="py-3.5 px-4">{getStatusBadge(rel.status)}</td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {rel.status !== 'active' ? (
                            <button
                              onClick={() => handleStatusChange(rel.id, 'active')}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                            >
                              Publish Active
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(rel.id, 'superseded')}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                            >
                              Supersede
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
