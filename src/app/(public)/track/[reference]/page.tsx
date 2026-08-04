'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, User, Phone, MapPin, Calendar, Compass, RefreshCw, ArrowLeft, History, MessageSquare, Mail, AlertCircle } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { fetchTripByReference } from '@/lib/actions/enquiryActions';
import { TripEnquiryRecord, TripStatusStep } from '@/lib/types/platform';
import { useRealtimeSubscription } from '@/lib/hooks/useRealtime';
import { ROUTES } from '@/lib/routes';

const FIVE_STAGES: TripStatusStep[] = [
  'Enquiry Received',
  'Under Review',
  'Trip Confirmed',
  'Trip Started',
  'Trip Completed'
];

export default function TrackDetailPage() {
  const params = useParams();
  const reference = (params?.reference as string) || '';

  const [trip, setTrip] = useState<TripEnquiryRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const loadTrip = async () => {
    setLoading(true);
    const res = await fetchTripByReference(reference);
    setTrip(res);
    setLoading(false);
  };

  useEffect(() => {
    if (reference) {
      loadTrip();
    }
  }, [reference]);

  // Realtime updates
  useRealtimeSubscription('enquiries', () => {
    loadTrip();
  });

  if (loading) {
    return (
      <div className="bg-slate-950 text-slate-100 min-h-screen pt-36 pb-24 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-brand-orange animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400">Loading Realtime Status for {reference}...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="bg-slate-950 text-slate-100 min-h-screen pt-36 pb-24 flex items-center justify-center">
        <Container className="max-w-md text-center">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-4">
            <Compass className="w-10 h-10 text-slate-600 mx-auto" />
            <h2 className="text-xl font-bold text-white">Trip Reference Not Found</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              We could not find an active trip matching reference "<span className="font-mono text-brand-orange">{reference}</span>". Please check for typos.
            </p>
            <Link
              href={ROUTES.TRACK_TRIP}
              className="text-xs font-bold bg-brand-orange text-white px-4 py-2.5 rounded-xl inline-block shadow-button"
            >
              Try Another Reference ID
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  const isCancelled = trip.status === 'Cancelled';
  const currentStepIndex = FIVE_STAGES.indexOf(trip.status);

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pt-32 pb-24">
      <Container className="max-w-5xl">
        <Link href={ROUTES.TRACK_TRIP} className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 mb-6">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Tracker Lookup
        </Link>

        {/* Status Header Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 mb-8 shadow-elevated">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
            <div>
              <span className="text-[10px] font-mono text-brand-orange uppercase tracking-wider block">Reference ID</span>
              <h1 className="text-3xl font-extrabold text-white font-mono mt-0.5">{trip.reference}</h1>
              <p className="text-xs text-slate-400 mt-1">Logged for {trip.name} • {trip.destination}</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-2xl flex items-center gap-2.5">
              <span className={`w-2.5 h-2.5 rounded-full ${isCancelled ? 'bg-red-500' : 'bg-emerald-400 animate-pulse'}`} />
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-semibold">Current Pipeline Stage</span>
                <span className="text-sm font-bold text-white">{trip.status}</span>
              </div>
            </div>
          </div>

          {/* 5-Stage Visual Timeline Stepper */}
          <div className="py-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">5-Stage Realtime Live Timeline</h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {FIVE_STAGES.map((stageName, idx) => {
                const isCompleted = idx <= currentStepIndex && !isCancelled;
                const isCurrent = idx === currentStepIndex && !isCancelled;

                return (
                  <div
                    key={stageName}
                    className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-between ${
                      isCurrent
                        ? 'bg-brand-orange/15 border-brand-orange text-white ring-2 ring-brand-orange/30 shadow-md'
                        : isCompleted
                        ? 'bg-slate-950/80 border-slate-700 text-slate-200'
                        : 'bg-slate-950/40 border-slate-800/80 text-slate-600'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-2 ${
                        isCompleted ? 'bg-brand-orange text-white' : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span className="text-xs font-bold leading-tight">{stageName}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Planner Notes & Details (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status History Log */}
            {trip.status_history && trip.status_history.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-card">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <History className="w-4 h-4 text-brand-orange" /> Realtime Status Activity Log
                </h3>

                <div className="space-y-3">
                  {trip.status_history.map((hist, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-brand-orange flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{hist.status}</span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {new Date(hist.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {hist.note && <p className="text-xs text-slate-400 mt-1">{hist.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trip Details Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-card">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Compass className="w-4 h-4 text-brand-orange" /> Trip Request Summary
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">Journey Route</span>
                  <span className="font-bold text-white mt-0.5 block flex items-center gap-1">
                    <span className="text-slate-400 font-normal">{trip.starting_location || 'Coimbatore'}</span>
                    <span className="text-brand-orange">➔</span>
                    <span className="text-white font-extrabold">{trip.destination}</span>
                  </span>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">Travel Date</span>
                  <span className="font-bold text-white mt-0.5 block">{trip.travel_date}</span>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">Travellers</span>
                  <span className="font-bold text-white mt-0.5 block">{trip.adults} Adults {trip.children > 0 ? `, ${trip.children} Kids` : ''}</span>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">Budget</span>
                  <span className="font-bold text-brand-orange mt-0.5 block">{trip.budget}</span>
                </div>
              </div>

              {trip.message && (
                <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Traveller Request Notes</span>
                  {trip.message}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Dedicated Travel Planner Details */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-card space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4 text-brand-orange" /> Dedicated Travel Planner
                </span>
                {trip.assigned_staff_role && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 border border-brand-orange/20 px-2 py-0.5 rounded-full">
                    {trip.assigned_staff_role}
                  </span>
                )}
              </h3>

              {trip.assigned_staff_name ? (
                <div className="space-y-4">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-brand-orange/15 border border-brand-orange/30 text-brand-orange flex items-center justify-center font-bold text-sm shrink-0">
                      {trip.assigned_staff_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">Assigned Planner</span>
                      <span className="text-sm font-extrabold text-white">{trip.assigned_staff_name}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {trip.assigned_staff_phone && (
                      <a
                        href={`https://wa.me/${trip.assigned_staff_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${trip.assigned_staff_name}, I am reaching out regarding my trip enquiry ${trip.reference}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-600/30 text-xs font-bold py-2.5 px-3 rounded-xl transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                      </a>
                    )}
                    {trip.assigned_staff_email && (
                      <a
                        href={`mailto:${trip.assigned_staff_email}?subject=${encodeURIComponent(`Enquiry ${trip.reference} - ${trip.destination}`)}`}
                        className="flex items-center justify-center gap-2 bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 text-xs font-bold py-2.5 px-3 rounded-xl transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" /> Email
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center text-xs text-slate-400">
                  A dedicated travel planner is being assigned to your enquiry.
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
