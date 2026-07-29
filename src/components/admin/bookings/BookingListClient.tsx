'use me';
'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  RefreshCw,
  UserCheck,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { Booking, BookingStatus } from '@/lib/types/booking';
import { transitionBookingStatus } from '@/lib/actions/booking';

interface BookingListClientProps {
  initialData: {
    bookings: Booking[];
    totalCount: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}

export const BookingListClient: React.FC<BookingListClientProps> = ({ initialData }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredBookings = initialData.bookings.filter((b) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchCode = b.booking_code.toLowerCase().includes(q);
      const matchName = b.lead_booker_name.toLowerCase().includes(q);
      const matchEmail = b.lead_booker_email.toLowerCase().includes(q);
      if (!matchCode && !matchName && !matchEmail) return false;
    }
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    return true;
  });

  const handleStatusTransition = (id: string, toStatus: BookingStatus) => {
    startTransition(async () => {
      try {
        await transitionBookingStatus(id, toStatus);
        showToast(`Booking ${id} status updated to ${toStatus}`);
        router.refresh();
      } catch (err: unknown) {
        showToast(`Error: ${err instanceof Error ? err.message : 'Failed'}`);
      }
    });
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Confirmed
          </span>
        );
      case 'pending_payment':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Pending Payment
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            On Tour (In Progress)
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
            Completed
          </span>
        );
      case 'amendment_pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200">
            <AlertCircle className="w-3.5 h-3.5 text-orange-600" />
            Amendment Pending
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {status}
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
            <Calendar className="w-4 h-4" />
            <span>Booking & Governance Engine</span>
          </div>
          <h1 className="text-2xl font-heading font-black text-slate-900 tracking-tight mt-1">
            Confirmed Bookings & Passenger Roster
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage lifecycle state machine transitions, immutable financial snapshots, and 3-point amendment impacts.
          </p>
        </div>

        <button
          onClick={() => router.refresh()}
          className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors self-start md:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[280px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search bookings by code, lead booker name, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
            >
              <option value="all">All Booking Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending_payment">Pending Payment</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="amendment_pending">Amendment Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No booking records found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              No customer bookings match your current search and filter criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Booking Code & Lead Booker</th>
                  <th className="py-3.5 px-4">Trip Dates & Pax</th>
                  <th className="py-3.5 px-4">Gross Amount & Margin</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">State Machine Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="font-mono font-bold text-brand-orange text-xs block">
                          {b.booking_code}
                        </span>
                        <span className="font-heading font-extrabold text-slate-900 block leading-tight">
                          {b.lead_booker_name}
                        </span>
                        <span className="text-xs font-mono text-slate-400 block">
                          {b.lead_booker_email}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs">
                      <div className="font-bold text-slate-800">
                        {b.start_date} ➔ {b.end_date}
                      </div>
                      <div className="text-slate-400 mt-0.5">{b.passenger_count} Passenger(s)</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs">
                      <div className="font-bold text-emerald-600">
                        ₹{Number(b.total_gross_amount).toLocaleString('en-IN')}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Margin: ₹{Number(b.margin_amount).toLocaleString('en-IN')} ({b.margin_percentage}%)
                      </div>
                    </td>

                    <td className="py-3.5 px-4">{getStatusBadge(b.status)}</td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {b.status === 'pending_payment' && (
                          <button
                            onClick={() => handleStatusTransition(b.id, 'confirmed')}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                          >
                            Confirm Deposit
                          </button>
                        )}

                        {b.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusTransition(b.id, 'in_progress')}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
                          >
                            Start Tour
                          </button>
                        )}

                        {b.status === 'in_progress' && (
                          <button
                            onClick={() => handleStatusTransition(b.id, 'completed')}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors"
                          >
                            Complete Trip
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
