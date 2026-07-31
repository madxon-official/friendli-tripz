'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Search, Compass, Calendar, User, ArrowRight, Loader2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function CustomerTripLookupPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setLoading(true);
    setSearched(true);
    const supabase = createClient();

    try {
      const sanitized = query.replace(/[%_'"\\;]/g, '');
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .or(`booking_code.ilike.%${sanitized}%,lead_booker_phone.ilike.%${sanitized}%,lead_booker_email.ilike.%${sanitized}%`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Search error:', error);
      }
      setBookings(data || []);
    } catch (err) {
      console.error('Lookup failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-12 sm:py-16 bg-slate-50">
      <Container className="max-w-4xl space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-soft-orange text-brand-orange">
            <Compass className="w-4 h-4 text-brand-orange" />
            Traveller Companion Portal
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-black text-brand-navy tracking-tight">
            Find &amp; Track Your Booking
          </h1>
          <p className="text-sm text-brand-muted max-w-xl mx-auto">
            Enter your booking code (e.g. <code className="font-mono text-brand-navy font-bold">FT-2026-9001</code>) or registered phone number to access your live trip itinerary, driver contact, and entry vouchers.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border/60 shadow-card space-y-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full">
              <Search className="w-5 h-5 text-brand-muted absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Booking Code (FT-2026-XXXX) or Phone Number"
                className="w-full text-sm sm:text-base pl-12 pr-4 py-3.5 rounded-2xl border border-brand-border text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchQuery.trim()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-sm shadow-button transition-colors shrink-0 flex items-center justify-center gap-2 min-h-[48px] disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Track Trip</span>
            </button>
          </form>

          <div className="flex items-center justify-between text-xs text-brand-muted pt-2 border-t border-brand-border/40">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Instant &amp; Secure Verification
            </span>
            <span>Example: FT-2026-9001</span>
          </div>
        </div>

        {/* Search Results */}
        {searched && (
          <div className="space-y-4">
            <h2 className="font-heading font-bold text-lg text-brand-navy">
              Found Bookings ({bookings.length})
            </h2>

            {bookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-brand-border/60 text-center space-y-3">
                <Compass className="w-10 h-10 text-brand-muted mx-auto opacity-50" />
                <h3 className="font-heading font-bold text-lg text-brand-navy">No bookings found</h3>
                <p className="text-xs text-brand-muted max-w-md mx-auto">
                  We couldn't find any booking matching <strong className="font-mono text-brand-navy">{searchQuery}</strong>. Please check your confirmation message or contact support.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-soft-navy text-brand-navy font-bold text-xs hover:bg-brand-soft-navy/80 transition-colors"
                >
                  Contact Friendli Desk →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white rounded-3xl p-6 border border-brand-border/60 shadow-card space-y-4 hover:border-brand-orange/40 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-border/40 pb-3">
                      <div className="space-y-0.5">
                        <span className="font-mono text-xs font-black text-brand-orange uppercase">
                          {b.booking_code}
                        </span>
                        <h3 className="font-heading font-bold text-lg text-brand-navy">
                          {b.lead_booker_name}'s Escape
                        </h3>
                      </div>

                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 w-fit">
                        {b.status || 'Confirmed'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                      <div>
                        <span className="text-[11px] text-brand-muted block font-mono uppercase">Dates</span>
                        <span className="font-bold text-brand-navy flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                          {b.start_date ? new Date(b.start_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'Upcoming'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[11px] text-brand-muted block font-mono uppercase">Travellers</span>
                        <span className="font-bold text-brand-navy flex items-center gap-1 mt-0.5">
                          <User className="w-3.5 h-3.5 text-brand-navy" />
                          {b.passenger_count || 1} Passengers
                        </span>
                      </div>
                      <div>
                        <span className="text-[11px] text-brand-muted block font-mono uppercase">Total Amount</span>
                        <span className="font-bold text-brand-navy font-mono text-sm mt-0.5 block">
                          ₹{b.total_gross_amount ? b.total_gross_amount.toLocaleString('en-IN') : '14,500'}
                        </span>
                      </div>
                      <div className="flex items-center justify-end">
                        <Link
                          href={`/trip/${b.id}/live`}
                          className="px-4 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-navy-dark text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                          <span>Live Itinerary</span>
                          <ArrowRight className="w-3.5 h-3.5 text-brand-orange" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Container>
    </main>
  );
}
