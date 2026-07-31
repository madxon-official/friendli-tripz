'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Inbox, ArrowRight, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { StatusBadge } from '@/components/ui/StatusBadge';

export interface EnquiryRow {
  id: string;
  reference: string;
  created_at: string;
  name: string;
  phone: string;
  email?: string | null;
  destination: string;
  traveller_count: number;
  preferred_date?: string | null;
  starting_location?: string | null;
  status: string;
  archived_at?: string | null;
}

interface EnquiryListClientProps {
  initialEnquiries: EnquiryRow[];
  initialNewCount: number;
  initialStatus: string;
  adminName?: string;
  adminEmail?: string;
  adminRole?: string;
}

function formatRelativeTime(isoString: string): string {
  if (!isoString) return 'Recent';
  const date = new Date(isoString);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hr ago`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

export const EnquiryListClient: React.FC<EnquiryListClientProps> = ({
  initialEnquiries,
  initialNewCount,
  initialStatus,
  adminName,
  adminEmail,
  adminRole,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [enquiries, setEnquiries] = useState<EnquiryRow[]>(initialEnquiries);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [archiveFilter, setArchiveFilter] = useState<'active' | 'archived'>('active');
  const [newCount, setNewCount] = useState(initialNewCount);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    setEnquiries(initialEnquiries);
  }, [initialEnquiries]);

  useEffect(() => {
    const s = searchParams.get('status') || 'all';
    setStatusFilter(s);
  }, [searchParams]);

  const fetchEnquiriesData = useCallback(
    async (targetArchive: 'active' | 'archived', targetStatus: string) => {
      setLoading(true);
      setFetchError(null);

      try {
        let query = supabase
          .from('enquiries')
          .select(
            'id, reference, created_at, name, phone, email, destination, traveller_count, preferred_date, starting_location, status, archived_at'
          )
          .order('created_at', { ascending: false })
          .limit(50);

        if (targetArchive === 'active') {
          query = query.is('archived_at', null);
        } else {
          query = query.not('archived_at', 'is', null);
        }

        if (targetStatus && targetStatus !== 'all') {
          query = query.eq('status', targetStatus);
        }

        const { data, error } = await query;

        if (error) {
          setFetchError(error.message || 'Could not fetch enquiries from Supabase.');
        } else {
          setEnquiries(data || []);
        }

        try {
          const { count } = await supabase
            .from('enquiries')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'new')
            .is('archived_at', null);

          if (count !== null) setNewCount(count);
        } catch {
          // ignore
        }
      } catch (err: any) {
        setFetchError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    },
    [supabase]
  );

  const handleArchiveTabChange = (newArchive: 'active' | 'archived') => {
    setArchiveFilter(newArchive);
    fetchEnquiriesData(newArchive, statusFilter);
  };

  const handleStatusFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    router.push(`/admin/enquiries${newStatus !== 'all' ? `?status=${newStatus}` : ''}`);
    fetchEnquiriesData(archiveFilter, newStatus);
  };

  const handleRefresh = () => {
    fetchEnquiriesData(archiveFilter, statusFilter);
  };

  const filteredEnquiries = enquiries.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (item.reference && item.reference.toLowerCase().includes(q)) ||
      (item.name && item.name.toLowerCase().includes(q)) ||
      (item.phone && item.phone.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border/60 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-navy font-heading">
            {archiveFilter === 'archived' ? 'Archived Enquiries' : 'Customer Enquiries'}
          </h1>
          <p className="text-sm text-brand-muted mt-1">
            Filter, search, and track Friendli Tripz customer requests from NEW to COMPLETED.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 text-xs font-bold text-brand-navy hover:text-brand-orange bg-white px-4 py-2.5 rounded-xl border border-brand-border/60 shadow-sm transition-colors shrink-0 min-h-[44px]"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-orange' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters & Search Controls Bar */}
      <div className="bg-white rounded-2xl p-4 border border-brand-border/60 shadow-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="flex-1 relative min-w-[260px]">
            <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reference, name, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border text-sm font-medium text-brand-navy outline-none focus:border-brand-orange min-h-[44px]"
            />
          </div>

          <div className="w-full md:w-52 shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm font-medium text-brand-navy outline-none focus:border-brand-orange bg-white cursor-pointer min-h-[44px]"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="follow_up">Follow-up</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex bg-brand-warm p-1 rounded-xl border border-brand-border/60 w-full md:w-60 shrink-0">
            <button
              type="button"
              onClick={() => handleArchiveTabChange('active')}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-colors min-h-[40px] ${
                archiveFilter === 'active'
                  ? 'bg-white text-brand-navy shadow-sm'
                  : 'text-brand-muted hover:text-brand-navy'
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => handleArchiveTabChange('archived')}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-colors min-h-[40px] ${
                archiveFilter === 'archived'
                  ? 'bg-white text-brand-navy shadow-sm'
                  : 'text-brand-muted hover:text-brand-navy'
              }`}
            >
              Archived
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center text-brand-muted text-sm border border-brand-border/60 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-brand-orange" />
          <span>Updating enquiries...</span>
        </div>
      ) : fetchError ? (
        <div className="bg-white rounded-3xl p-10 text-center space-y-4 border border-brand-border/60 max-w-lg mx-auto">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <h2 className="text-lg font-bold text-brand-navy font-heading">
            Could not load enquiries
          </h2>
          <p className="text-xs text-brand-muted leading-relaxed">{fetchError}</p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-orange text-white font-bold text-xs shadow-button hover:bg-brand-orange-dark transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      ) : filteredEnquiries.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-brand-border/60">
          <Inbox className="w-10 h-10 text-brand-muted mx-auto" />
          <p className="text-base font-bold text-brand-navy">No matching enquiries found.</p>
        </div>
      ) : (
        <div>
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white rounded-3xl border border-brand-border/60 shadow-card overflow-hidden">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-brand-soft-navy/50 border-b border-brand-border/60 text-xs font-bold text-brand-navy uppercase tracking-wider font-mono">
                  <th className="py-4 px-6">Reference</th>
                  <th className="py-4 px-6">Traveller</th>
                  <th className="py-4 px-6">Phone</th>
                  <th className="py-4 px-6">Travellers</th>
                  <th className="py-4 px-6">Preferred Date</th>
                  <th className="py-4 px-6">Submitted</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/40 font-medium text-brand-navy">
                {filteredEnquiries.map((enq) => (
                  <tr
                    key={enq.id}
                    onClick={() => router.push(`/admin/enquiries/${enq.id}`)}
                    className="hover:bg-brand-warm/80 transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-6 font-mono font-bold text-xs text-brand-navy">
                      {enq.reference}
                    </td>
                    <td className="py-4 px-6 font-bold font-heading text-base">{enq.name}</td>
                    <td className="py-4 px-6 font-mono text-xs text-brand-muted">{enq.phone}</td>
                    <td className="py-4 px-6">{enq.traveller_count}</td>
                    <td className="py-4 px-6 text-xs text-brand-muted">
                      {enq.preferred_date || 'Flexible'}
                    </td>
                    <td className="py-4 px-6 text-xs text-brand-muted font-medium">
                      {formatRelativeTime(enq.created_at)}
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={enq.status} size="sm" />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-orange hover:underline">
                        <span>Open</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="lg:hidden space-y-3">
            {filteredEnquiries.map((enq) => (
              <div
                key={enq.id}
                onClick={() => router.push(`/admin/enquiries/${enq.id}`)}
                className="bg-white rounded-2xl p-5 border border-brand-border/60 shadow-card space-y-3 hover:border-brand-orange/40 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-brand-navy">
                    {enq.reference}
                  </span>
                  <StatusBadge status={enq.status} size="sm" />
                </div>

                <div>
                  <h3 className="font-heading font-bold text-lg text-brand-navy">{enq.name}</h3>
                  <p className="text-xs text-brand-muted">📱 {enq.phone}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-brand-border/40 text-brand-navy/80">
                  <div>
                    <span className="text-brand-muted block">Travellers</span>
                    <span className="font-semibold">{enq.traveller_count} travellers</span>
                  </div>
                  <div>
                    <span className="text-brand-muted block">Preferred Date</span>
                    <span className="font-semibold">{enq.preferred_date || 'Flexible'}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-brand-border/40 flex items-center justify-between text-xs">
                  <span className="text-brand-muted">
                    Submitted {formatRelativeTime(enq.created_at)}
                  </span>
                  <span className="font-bold text-brand-orange flex items-center gap-1">
                    <span>Open</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
