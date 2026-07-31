'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Clock,
  CheckCircle2,
  Car,
  Building2,
  RefreshCw,
  Sparkles,
  Phone,
  MessageSquare,
  Filter,
} from 'lucide-react';
import { Booking } from '@/lib/types/booking';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface ArrivalQueueClientProps {
  initialBookings: Booking[];
}

export const ArrivalQueueClient: React.FC<ArrivalQueueClientProps> = ({ initialBookings }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'today' | 'tomorrow' | 'upcoming' | 'completed' | 'all'>('today');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredBookings = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    switch (activeTab) {
      case 'today':
        return initialBookings.filter((b) => b.start_date === today || b.status === 'confirmed');
      case 'tomorrow':
        return initialBookings.filter((b) => b.start_date === tomorrow);
      case 'upcoming':
        return initialBookings.filter((b) => b.start_date > tomorrow);
      case 'completed':
        return initialBookings.filter((b) => b.status === 'completed');
      default:
        return initialBookings;
    }
  }, [initialBookings, activeTab]);

  const columns: Column<Booking>[] = [
    {
      key: 'booking_code',
      header: 'Booking Code & Traveller',
      sortable: true,
      accessor: (b) => (
        <div className="space-y-0.5">
          <span className="font-mono font-bold text-brand-orange text-xs block">
            {b.booking_code}
          </span>
          <span className="font-heading font-black text-slate-900 block leading-tight">
            {b.lead_booker_name}
          </span>
          <span className="text-xs font-mono text-slate-400 block">{b.lead_booker_phone}</span>
        </div>
      ),
    },
    {
      key: 'start_date',
      header: 'Arrival Date & Pax',
      sortable: true,
      accessor: (b) => (
        <div className="font-mono text-xs">
          <span className="font-bold text-slate-900 block">{b.start_date}</span>
          <span className="text-slate-400">{b.passenger_count} Pax</span>
        </div>
      ),
    },
    {
      key: 'hotel',
      header: 'Hotel & Pickup Point',
      sortable: false,
      accessor: (b) => (
        <div className="text-xs space-y-0.5">
          <span className="font-bold text-slate-800 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-indigo-500" />
            Villa Retreat Kodaikanal
          </span>
          <span className="text-slate-400 block">Pickup: Kodai Bus Stand (09:00 AM)</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      accessor: (b) => <StatusBadge status={b.status} size="md" />,
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      align: 'right',
      accessor: (b) => (
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() =>
              window.open(`https://wa.me/${b.lead_booker_phone.replace(/\D/g, '')}`, '_blank')
            }
            className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
            title="WhatsApp Traveller"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <button
            onClick={() => showToast(`Marked ${b.booking_code} as Greeted & Checked In!`)}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
          >
            Check In
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20 animate-slide-up">
          <Sparkles className="w-4 h-4 text-brand-orange" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-brand-orange">
            <Clock className="w-4 h-4" />
            <span>Live Operational Queue</span>
          </div>
          <h1 className="text-2xl font-heading font-black text-slate-900 tracking-tight mt-1">
            Arrivals Command Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor incoming traveller arrivals, driver pickups, and hotel check-in status.
          </p>
        </div>

        <button
          onClick={() => router.refresh()}
          className="p-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors self-start md:self-auto flex items-center gap-2 text-xs font-bold"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Sync Realtime</span>
        </button>
      </div>

      {/* Tab Queue Selectors */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'today', label: "Today's Arrivals" },
          { id: 'tomorrow', label: 'Tomorrow' },
          { id: 'upcoming', label: 'Upcoming' },
          { id: 'completed', label: 'Completed' },
          { id: 'all', label: 'All Arrivals' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-2xl font-bold text-xs transition-all shrink-0 ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Arrival Queue Data Table */}
      <DataTable
        data={filteredBookings}
        columns={columns}
        keyExtractor={(b) => b.id}
        searchPlaceholder="Filter arrivals by code, name, or phone..."
        searchKeys={['booking_code', 'lead_booker_name', 'lead_booker_phone']}
        exportFilename="arrivals_queue.csv"
        emptyTitle="No arrivals in this queue"
        emptyDescription="No arrival records match your selected queue tab."
        bulkActions={(ids) => (
          <button
            onClick={() => showToast(`Bulk checked-in ${ids.length} arrivals!`)}
            className="text-xs font-bold hover:underline"
          >
            Check In Selected
          </button>
        )}
      />
    </div>
  );
};
