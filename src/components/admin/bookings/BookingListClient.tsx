'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Sparkles,
  RefreshCw,
  UserCheck,
  ShieldCheck,
  Car,
  FileText,
  MessageSquare,
  Clock,
  AlertCircle,
  CheckCircle2,
  Phone,
  Mail,
  User,
  Building2,
  DollarSign,
  ArrowRight,
} from 'lucide-react';
import { Booking, BookingStatus } from '@/lib/types/booking';
import { transitionBookingStatus } from '@/lib/actions/booking';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Drawer } from '@/components/ui/Drawer';

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

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [assigningDriver, setAssigningDriver] = useState(false);
  const [driverNameInput, setDriverNameInput] = useState('');
  const [vehicleInput, setVehicleInput] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleStatusTransition = (id: string, toStatus: BookingStatus) => {
    startTransition(async () => {
      try {
        await transitionBookingStatus(id, toStatus);
        showToast(`Booking status updated to ${toStatus}`);
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking({ ...selectedBooking, status: toStatus });
        }
        router.refresh();
      } catch (err: unknown) {
        showToast(`Error: ${err instanceof Error ? err.message : 'Failed transition'}`);
      }
    });
  };

  const columns: Column<Booking>[] = [
    {
      key: 'booking_code',
      header: 'Booking Code & Lead Booker',
      sortable: true,
      accessor: (b) => (
        <div className="space-y-0.5">
          <span className="font-mono font-bold text-brand-orange text-xs block">
            {b.booking_code}
          </span>
          <span className="font-heading font-extrabold text-slate-900 block leading-tight">
            {b.lead_booker_name}
          </span>
          <span className="text-xs font-mono text-slate-400 block">{b.lead_booker_email}</span>
        </div>
      ),
    },
    {
      key: 'start_date',
      header: 'Travel Dates & Pax',
      sortable: true,
      accessor: (b) => (
        <div className="font-mono text-xs">
          <div className="font-bold text-slate-800">
            {b.start_date} ➔ {b.end_date}
          </div>
          <div className="text-slate-400 mt-0.5">{b.passenger_count} Passenger(s)</div>
        </div>
      ),
    },
    {
      key: 'total_gross_amount',
      header: 'Gross Amount & Margin',
      sortable: true,
      accessor: (b) => (
        <div className="font-mono text-xs">
          <div className="font-bold text-emerald-600">
            ₹{Number(b.total_gross_amount).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400">
            Margin: ₹{Number(b.margin_amount).toLocaleString('en-IN')} ({b.margin_percentage}%)
          </div>
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
      header: 'Quick Action',
      sortable: false,
      align: 'right',
      accessor: (b) => (
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setSelectedBooking(b)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center gap-1"
          >
            <span>Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
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

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-brand-orange">
            <Calendar className="w-4 h-4" />
            <span>Operational Workspace</span>
          </div>
          <h1 className="text-2xl font-heading font-black text-slate-900 tracking-tight mt-1">
            Confirmed Bookings & Passenger Roster
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Operational workspace for driver assignments, status transitions, and passenger documents.
          </p>
        </div>

        <button
          onClick={() => router.refresh()}
          className="p-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors self-start md:self-auto flex items-center gap-2 text-xs font-bold"
        >
          <RefreshCw className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`} />
          <span>Refresh Roster</span>
        </button>
      </div>

      {/* Main Data Table */}
      <DataTable
        data={initialData.bookings}
        columns={columns}
        keyExtractor={(b) => b.id}
        searchPlaceholder="Search bookings by code, lead booker name, or email..."
        searchKeys={['booking_code', 'lead_booker_name', 'lead_booker_email']}
        onRowClick={(b) => setSelectedBooking(b)}
        exportFilename="friendli_bookings.csv"
        emptyTitle="No bookings found"
        emptyDescription="No customer bookings match your current workspace search."
      />

      {/* Slide-over Workspace Drawer for Selected Booking */}
      <Drawer
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title={`Booking ${selectedBooking?.booking_code}`}
        subtitle={`Lead Booker: ${selectedBooking?.lead_booker_name}`}
        width="xl"
      >
        {selectedBooking && (
          <div className="space-y-6">
            {/* Status & Quick Action Buttons */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 font-mono uppercase">
                  Current Lifecycle State
                </span>
                <StatusBadge status={selectedBooking.status} size="lg" />
              </div>

              <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center gap-2">
                {selectedBooking.status === 'pending_payment' && (
                  <button
                    onClick={() => handleStatusTransition(selectedBooking.id, 'confirmed')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Confirm Booking
                  </button>
                )}

                {selectedBooking.status === 'confirmed' && (
                  <button
                    onClick={() => handleStatusTransition(selectedBooking.id, 'in_progress')}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    <UserCheck className="w-4 h-4" /> Start Tour
                  </button>
                )}

                {selectedBooking.status === 'in_progress' && (
                  <button
                    onClick={() => handleStatusTransition(selectedBooking.id, 'completed')}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" /> Complete Trip
                  </button>
                )}

                <button
                  onClick={() =>
                    window.open(
                      `https://wa.me/${selectedBooking.lead_booker_phone.replace(/\D/g, '')}`,
                      '_blank'
                    )
                  }
                  className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs flex items-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4" /> WhatsApp Traveller
                </button>

                <button
                  onClick={() => alert(`Invoice generated for ${selectedBooking.booking_code}`)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold text-xs flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" /> Export Invoice
                </button>
              </div>
            </div>

            {/* Traveller & Trip Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-heading font-black text-slate-900 border-b border-slate-200 pb-2">
                Traveller & Trip Details
              </h3>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-400 font-mono block">Lead Booker</span>
                  <span className="font-bold text-slate-900 block">{selectedBooking.lead_booker_name}</span>
                  <span className="text-slate-500 block">{selectedBooking.lead_booker_email}</span>
                  <span className="text-slate-500 block">{selectedBooking.lead_booker_phone}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-400 font-mono block">Trip Schedule</span>
                  <span className="font-bold text-slate-900 block">
                    {selectedBooking.start_date} ➔ {selectedBooking.end_date}
                  </span>
                  <span className="text-slate-500 block">{selectedBooking.passenger_count} Pax</span>
                </div>
              </div>
            </div>

            {/* Fleet & Resource Allocations */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="text-sm font-heading font-black text-slate-900">
                  Fleet & Driver Assignment
                </h3>
                <button
                  onClick={() => setAssigningDriver(!assigningDriver)}
                  className="text-xs font-bold text-brand-orange hover:underline"
                >
                  {assigningDriver ? 'Cancel' : 'Edit Fleet'}
                </button>
              </div>

              {assigningDriver ? (
                <div className="p-4 bg-slate-50 rounded-2xl space-y-3 border border-slate-200">
                  <div>
                    <label className="text-[10px] font-mono font-bold uppercase text-slate-500 block mb-1">
                      Driver Name & Contact
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Murugan V (+91 98401 23456)"
                      value={driverNameInput}
                      onChange={(e) => setDriverNameInput(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono font-bold uppercase text-slate-500 block mb-1">
                      Vehicle Model & Plate Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Toyota Innova Crysta (TN-57-AB-1234)"
                      value={vehicleInput}
                      onChange={(e) => setVehicleInput(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <button
                    onClick={() => {
                      showToast('Fleet assignment saved successfully!');
                      setAssigningDriver(false);
                    }}
                    className="w-full py-2 bg-brand-orange text-white font-bold text-xs rounded-xl shadow-button"
                  >
                    Save Fleet Assignment
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <Car className="w-5 h-5 text-brand-orange shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900 block">
                        {vehicleInput || 'Innova Crysta (TN-57-AB-1234)'}
                      </span>
                      <span className="text-slate-500">
                        Driver: {driverNameInput || 'Murugan V (+91 98401 23456)'}
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 font-mono">
                    ASSIGNED
                  </span>
                </div>
              )}
            </div>

            {/* Financial Ledger Snapshot */}
            <div className="space-y-4">
              <h3 className="text-sm font-heading font-black text-slate-900 border-b border-slate-200 pb-2">
                Financial Ledger Snapshot
              </h3>
              <div className="p-4 rounded-2xl bg-slate-900 text-white font-mono text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Gross Total</span>
                  <span className="font-bold text-emerald-400">
                    ₹{Number(selectedBooking.total_gross_amount).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Net Cost</span>
                  <span className="font-bold text-slate-300">
                    ₹{Number(selectedBooking.total_net_cost).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-2">
                  <span className="text-slate-400">Margin</span>
                  <span className="font-bold text-brand-orange">
                    ₹{Number(selectedBooking.margin_amount).toLocaleString('en-IN')} (
                    {selectedBooking.margin_percentage}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
