import React from 'react';
import { getUpcomingHotelArrivals } from '@/lib/actions/hotel';
import { Hotel, Calendar, Users, FileText, CheckCircle2, Upload, AlertCircle } from 'lucide-react';

export const metadata = {
  title: 'Hotel Partner Portal | Friendli Tripz',
  description: 'Manage upcoming guest arrivals, rooming lists, meal plans, and check-in verifications.',
};

export default async function HotelPortalPage() {
  const arrivals = await getUpcomingHotelArrivals();

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block flex items-center gap-1.5">
              <Hotel className="w-4 h-4" />
              Grand Hilltop Resort Partner Desk
            </span>
            <h1 className="font-heading text-3xl font-extrabold text-slate-900">
              Upcoming Guest Arrivals ({arrivals.length})
            </h1>
          </div>

          <button className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs transition-colors flex items-center gap-2 w-fit">
            <Upload className="w-4 h-4 text-amber-400" />
            Upload Hotel Invoice
          </button>
        </div>

        {/* Arrivals Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-heading font-bold text-slate-900 text-base">Today's Rooming & Check-In Sheet</h3>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Live Synchronization Active
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {arrivals.map((a) => (
              <div key={a.id} className="p-6 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-base">{a.leadGuestName}</span>
                      <span className="font-mono text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {a.bookingCode}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 block">
                      Category: <strong>{a.roomCategory}</strong> ({a.roomsCount} Rooms) • Meal Plan: {a.mealPlan}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
                      a.checkInStatus === 'checked_in'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}>
                      {a.checkInStatus.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {a.specialRequests && (
                  <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <strong>Special Guest Request:</strong> {a.specialRequests}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
