'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Car,
  Compass,
  Building2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Booking } from '@/lib/types/booking';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Drawer } from '@/components/ui/Drawer';

interface OperationsCalendarClientProps {
  initialBookings: Booking[];
}

export const OperationsCalendarClient: React.FC<OperationsCalendarClientProps> = ({
  initialBookings,
}) => {
  const router = useRouter();
  const [view, setView] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= lastDate; i++) days.push(i);
    return days;
  }, [currentDate]);

  const monthYearLabel = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const getBookingsForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(day).padStart(2, '0')}`;
    return initialBookings.filter(
      (b) => b.start_date <= dateStr && b.end_date >= dateStr
    );
  };

  const nextPeriod = () => {
    if (view === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else if (view === 'week') {
      setCurrentDate(new Date(currentDate.getTime() + 7 * 86400000));
    } else {
      setCurrentDate(new Date(currentDate.getTime() + 86400000));
    }
  };

  const prevPeriod = () => {
    if (view === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else if (view === 'week') {
      setCurrentDate(new Date(currentDate.getTime() - 7 * 86400000));
    } else {
      setCurrentDate(new Date(currentDate.getTime() - 86400000));
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Calendar Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-brand-orange">
            <CalendarIcon className="w-4 h-4" />
            <span>Operational Roster</span>
          </div>
          <h1 className="text-2xl font-heading font-black text-slate-900 tracking-tight mt-1">
            Operations Calendar ({monthYearLabel})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Visual breakdown of tour departures, active dates, and vehicle allocations.
          </p>
        </div>

        {/* View Switcher & Navigation Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Prev / Next Buttons */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={prevPeriod}
              className="p-1.5 rounded-xl hover:bg-white text-slate-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 font-mono text-xs font-bold text-slate-900">
              {monthYearLabel}
            </span>
            <button
              onClick={nextPeriod}
              className="p-1.5 rounded-xl hover:bg-white text-slate-600 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mode Toggles */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
            {(['month', 'week', 'day', 'agenda'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setView(mode)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  view === mode
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Month View Grid */}
      {view === 'month' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Day Headers */}
          <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 text-center py-3">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 text-xs">
            {daysInMonth.map((day, idx) => {
              if (day === null) {
                return <div key={idx} className="bg-slate-50/40 min-h-[110px]" />;
              }

              const dayBookings = getBookingsForDay(day);
              const isToday =
                day === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();

              return (
                <div
                  key={idx}
                  className={`min-h-[110px] p-2 space-y-1 hover:bg-slate-50/60 transition-colors ${
                    isToday ? 'bg-brand-orange/5' : ''
                  }`}
                >
                  <div className="flex items-center justify-between font-mono">
                    <span
                      className={`font-bold ${
                        isToday
                          ? 'w-6 h-6 rounded-full bg-brand-orange text-white flex items-center justify-center text-xs'
                          : 'text-slate-700'
                      }`}
                    >
                      {day}
                    </span>
                    {dayBookings.length > 0 && (
                      <span className="text-[10px] text-slate-400 font-bold">
                        {dayBookings.length} Tour(s)
                      </span>
                    )}
                  </div>

                  {/* Day Booking Cards */}
                  <div className="space-y-1 mt-1">
                    {dayBookings.slice(0, 3).map((b) => (
                      <div
                        key={b.id}
                        onClick={() => setSelectedBooking(b)}
                        className="p-1.5 rounded-xl bg-slate-900 text-white font-mono text-[11px] cursor-pointer hover:bg-slate-800 transition-colors truncate space-y-0.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-brand-orange truncate">{b.booking_code}</span>
                          <span className="text-[9px] text-slate-400">{b.passenger_count}p</span>
                        </div>
                        <p className="text-slate-200 truncate font-sans text-[10px]">
                          {b.lead_booker_name}
                        </p>
                      </div>
                    ))}
                    {dayBookings.length > 3 && (
                      <div className="text-[10px] text-brand-orange font-bold font-mono text-center pt-0.5">
                        +{dayBookings.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Agenda View */}
      {view === 'agenda' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-heading font-black text-slate-900 border-b border-slate-100 pb-3">
            Agenda Roster List ({initialBookings.length} Total Bookings)
          </h2>

          <div className="space-y-3">
            {initialBookings.map((b) => (
              <div
                key={b.id}
                onClick={() => setSelectedBooking(b)}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-brand-orange text-xs">
                      {b.booking_code}
                    </span>
                    <StatusBadge status={b.status} size="sm" />
                  </div>
                  <p className="font-heading font-bold text-slate-900 text-base">
                    {b.lead_booker_name}
                  </p>
                  <p className="text-xs text-slate-500 font-mono">
                    Dates: {b.start_date} ➔ {b.end_date} ({b.passenger_count} Pax)
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className="font-mono text-xs font-bold text-emerald-600">
                    ₹{Number(b.total_gross_amount).toLocaleString('en-IN')}
                  </span>
                  <button className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Details Drawer */}
      <Drawer
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title={`Calendar Event: ${selectedBooking?.booking_code}`}
        subtitle={`Lead Booker: ${selectedBooking?.lead_booker_name}`}
        width="lg"
      >
        {selectedBooking && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 font-mono">STATUS</span>
                <StatusBadge status={selectedBooking.status} size="md" />
              </div>
              <p className="text-base font-bold text-slate-900">{selectedBooking.lead_booker_name}</p>
              <p className="text-xs text-slate-500 font-mono">
                {selectedBooking.start_date} ➔ {selectedBooking.end_date}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 text-white font-mono text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Pax</span>
                <span className="font-bold text-white">{selectedBooking.passenger_count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Gross</span>
                <span className="font-bold text-emerald-400">
                  ₹{Number(selectedBooking.total_gross_amount).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedBooking(null);
                router.push(`/admin/bookings`);
              }}
              className="w-full py-3 bg-brand-orange text-white font-bold text-xs rounded-xl shadow-button flex items-center justify-center gap-2"
            >
              <span>Open Booking Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </Drawer>
    </div>
  );
};
