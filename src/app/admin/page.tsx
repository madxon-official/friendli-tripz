'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Compass,
  MapPin,
  Package as PackageIcon,
  Sparkles,
  ArrowUpRight,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { getAllEnquiries } from '@/lib/actions/enquiryActions';
import { getDestinations } from '@/lib/actions/destination';
import { TripEnquiryRecord } from '@/lib/types/platform';
import { useRealtimeSubscription } from '@/lib/hooks/useRealtime';

export default function AdminOverviewDashboard() {
  const [enquiries, setEnquiries] = useState<TripEnquiryRecord[]>([]);
  const [destinationCount, setDestinationCount] = useState<number>(0);
  const [packageCount, setPackageCount] = useState<number>(0);

  const loadData = async () => {
    try {
      const list = await getAllEnquiries();
      setEnquiries(list);

      const destRes = await getDestinations({ limit: 1 });
      setDestinationCount(destRes.totalCount);

      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { count } = await supabase.from('package_families').select('*', { count: 'exact', head: true });
      setPackageCount(count || 0);
    } catch (err) {
      console.error('[Admin Dashboard Load Error]', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useRealtimeSubscription('enquiries', () => {
    loadData();
  });

  const activeTripsCount = enquiries.filter(
    (e) => e.status === 'Trip Confirmed' || e.status === 'Trip Started'
  ).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-mono font-bold text-brand-orange uppercase tracking-widest">
            Overview & Telemetry
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">Admin Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">
            Realtime operations telemetry, enquiry activity, and system overview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/enquiries"
            className="bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-button flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Manage Enquiries ({enquiries.length})</span>
          </Link>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-card">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Enquiries</span>
            <div className="w-8 h-8 rounded-xl bg-brand-orange/10 text-brand-orange border border-brand-orange/30 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{enquiries.length}</div>
          <span className="text-[11px] text-emerald-400 mt-2 inline-flex items-center gap-1 font-semibold">
            <ArrowUpRight className="w-3 h-3" /> Live updating via Supabase
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-card">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Trips</span>
            <div className="w-8 h-8 rounded-xl bg-brand-orange/10 text-brand-orange border border-brand-orange/30 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{activeTripsCount}</div>
          <span className="text-[11px] text-slate-400 mt-2 inline-block font-medium">
            Confirmed & dispatched trips
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-card">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Destinations</span>
            <div className="w-8 h-8 rounded-xl bg-brand-orange/10 text-brand-orange border border-brand-orange/30 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{destinationCount}</div>
          <span className="text-[11px] text-slate-400 mt-2 inline-block font-medium">
            Published public guides
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-card">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Commercial Packages</span>
            <div className="w-8 h-8 rounded-xl bg-brand-orange/10 text-brand-orange border border-brand-orange/30 flex items-center justify-center">
              <PackageIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{packageCount}</div>
          <span className="text-[11px] text-slate-400 mt-2 inline-block font-medium">
            Active itinerary templates
          </span>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Quick Management Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/enquiries"
            className="group bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-brand-orange/50 transition-all flex items-center justify-between"
          >
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-brand-orange transition-colors">Review Enquiries</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Assign drivers & update quotes</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-brand-orange group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          <Link
            href="/admin/destinations"
            className="group bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-brand-orange/50 transition-all flex items-center justify-between"
          >
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-brand-orange transition-colors">Manage Destinations</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Add mountain guides & vibes</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-brand-orange group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          <Link
            href="/admin/trip-tracker"
            className="group bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-brand-orange/50 transition-all flex items-center justify-between"
          >
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-brand-orange transition-colors">Trip Tracker Pipeline</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Live status progression</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-brand-orange group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          <Link
            href="/admin/blogs"
            className="group bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-brand-orange/50 transition-all flex items-center justify-between"
          >
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-brand-orange transition-colors">Publish Travel Blog</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Share offbeat mountain guides</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-brand-orange group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Grid: Recent Enquiries Feed + Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Enquiries Preview (Left 2 cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white">Recent Trip Enquiries</h3>
              <p className="text-xs text-slate-400 mt-0.5">Incoming traveller submissions requiring review.</p>
            </div>
            <Link href="/admin/enquiries" className="text-xs font-bold text-brand-orange hover:underline">
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {enquiries.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs bg-slate-955 rounded-2xl border border-slate-800">
                No active enquiries in system.
              </div>
            ) : (
              enquiries.slice(0, 5).map((enq) => (
                <div
                  key={enq.id}
                  className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-brand-orange">{enq.reference}</span>
                      <span className="text-[10px] font-semibold bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                        {enq.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1">{enq.name}</h4>
                    <span className="text-[11px] text-slate-400">{enq.destination} • {enq.adults} Adults • {enq.phone}</span>
                  </div>

                  <Link
                    href={`/track/${enq.reference}`}
                    target="_blank"
                    className="text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5 text-brand-orange" /> Track
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Realtime Stream (Right col) */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-card">
          <h3 className="text-base font-bold text-white mb-4">Realtime Telemetry Stream</h3>
          <div className="space-y-4">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-1">
              <span className="text-[10px] text-emerald-400 font-mono font-bold block uppercase">Supabase Realtime Channel</span>
              <span className="font-bold text-white">Listening on postgres_changes</span>
              <p className="text-slate-400 text-[11px]">Enquiry status transitions stream directly to visitor screens without page reloads.</p>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Operational Highlights</span>
              <div className="text-xs text-slate-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                <span>Connected directly to Supabase production database.</span>
              </div>
              <div className="text-xs text-slate-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                <span>Reference ID generation active on format FT-YYYY-XXXX.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
