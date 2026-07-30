import React from 'react';
import Link from 'next/link';
import { getCustomerBookings } from '@/lib/actions/dashboard';
import { Compass, Calendar, Download, Eye, FileText, CheckCircle2, QrCode } from 'lucide-react';

export const metadata = {
  title: 'Customer Dashboard - My Bookings | Friendli Tripz',
  description: 'Manage your upcoming trip bookings, view invoices, download vouchers, and track trip execution.',
};

export default async function CustomerBookingsPage() {
  const bookings = await getCustomerBookings();

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">Customer Portal</span>
            <h1 className="font-heading text-3xl font-extrabold text-slate-900">
              My Trips & Bookings ({bookings.length})
            </h1>
          </div>

          <Link
            href="/planner"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-amber-600 text-white text-xs font-bold transition-colors w-fit"
          >
            + Plan New AI Trip
          </Link>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">{b.title}</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize">
                      {b.status}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 block">Booking Ref: <strong>{b.bookingCode}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/trip/${b.id}/live`}
                    className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <QrCode className="w-3.5 h-3.5 text-amber-600" />
                    Live Itinerary & QR Vouchers
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Trip Dates</span>
                  <span className="font-bold text-slate-900">{b.startDate} to {b.endDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Passengers</span>
                  <span className="font-bold text-slate-900">{b.passengerCount} Adults</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Total Amount</span>
                  <span className="font-bold text-slate-900">₹{b.totalGrossAmount.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Deposit Paid</span>
                  <span className="font-bold text-emerald-600">₹{b.depositPaid.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
