import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import {
  Inbox,
  ArrowRight,
  Clock,
  UserCheck,
  CheckCircle2,
  Car,
  Calendar,
  Plus,
  Compass,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getBookings } from '@/lib/actions/booking';
import { getLiveDeployments } from '@/lib/actions/operations';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Operations Dashboard | Friendli Tripz Admin',
  description: 'Operations-first travel management control panel.',
};

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/admin/login');
  }

  // Get admin profile
  const { data: profile } = await supabase
    .from('admin_profiles')
    .select('full_name, role, is_active')
    .eq('id', session.user.id)
    .single();

  if (!profile || !profile.is_active) {
    redirect('/admin/login?error=access_denied');
  }

  const adminFirstName = profile.full_name.split(' ')[0] || 'Admin';

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // Concurrent data fetching for operations dashboard
  const [
    { count: newCount },
    { count: followUpCount },
    { count: confirmedCount },
    { count: completedCount },
    deployments,
    bookingsResult,
    recentRes,
  ] = await Promise.all([
    supabase.from('enquiries').select('id', { count: 'exact', head: true }).eq('status', 'new').is('archived_at', null),
    supabase.from('enquiries').select('id', { count: 'exact', head: true }).eq('status', 'follow_up').is('archived_at', null),
    supabase.from('enquiries').select('id', { count: 'exact', head: true }).eq('status', 'confirmed').is('archived_at', null),
    supabase.from('enquiries').select('id', { count: 'exact', head: true }).eq('status', 'completed').is('archived_at', null),
    getLiveDeployments(),
    getBookings({ limit: 5 }),
    supabase
      .from('enquiries')
      .select('id, reference, name, phone, traveller_count, starting_location, destination, status, created_at')
      .is('archived_at', null)
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  const recentEnquiries = recentRes.data || [];
  const bookings = bookingsResult.bookings || [];

  // Filter Today's Arrivals and Today's Departures
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysArrivals = bookings.filter((b) => b.start_date === todayStr || b.status === 'confirmed');
  const todaysDepartures = bookings.filter((b) => b.end_date === todayStr || b.status === 'in_progress');

  return (
    <div className="space-y-8">
      {/* Top Greeting & Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-brand-orange">
            <Sparkles className="w-4 h-4" />
            <span>Operations Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading tracking-tight mt-1">
            {greeting}, {adminFirstName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Daily operational arrivals, departures, driver allocations, and pending bookings.
          </p>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/bookings">
            <button className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all">
              <Calendar className="w-4 h-4 text-brand-orange" />
              <span>Bookings Roster</span>
            </button>
          </Link>

          <Link href="/admin/enquiries">
            <button className="px-4 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange-dark text-white font-bold text-xs flex items-center gap-2 shadow-button transition-all">
              <Plus className="w-4 h-4" />
              <span>New Enquiry</span>
            </button>
          </Link>
        </div>
      </div>

      {/* 4 Operations-First KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Arrivals */}
        <Link
          href="/admin/arrivals"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-emerald-400 group space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
              Today's Arrivals
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              {todaysArrivals.length}
            </span>
            <span className="text-xs font-bold text-emerald-600 group-hover:underline">
              View Roster →
            </span>
          </div>
        </Link>

        {/* Today's Departures */}
        <Link
          href="/admin/departures"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-blue-400 group space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
              Active Departures
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              {todaysDepartures.length}
            </span>
            <span className="text-xs font-bold text-blue-600 group-hover:underline">
              View Queue →
            </span>
          </div>
        </Link>

        {/* Vehicle & Fleet Readiness */}
        <Link
          href="/admin/operations"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-amber-400 group space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
              Fleet Deployments
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              {deployments.length}
            </span>
            <span className="text-xs font-bold text-amber-600 group-hover:underline">
              Assign Fleet →
            </span>
          </div>
        </Link>

        {/* Pending Enquiries */}
        <Link
          href="/admin/enquiries?status=new"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-brand-orange group space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
              Pending Enquiries
            </span>
            <div className="w-9 h-9 rounded-xl bg-brand-soft-orange text-brand-orange flex items-center justify-center group-hover:scale-110 transition-transform">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              {newCount || 0}
            </span>
            <span className="text-xs font-bold text-brand-orange group-hover:underline">
              Action Queue →
            </span>
          </div>
        </Link>
      </div>

      {/* Main Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Deployments & Driver Roster (Col 7) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-heading font-black text-slate-900">
                Today's Fleet & Driver Allocations
              </h2>
              <p className="text-xs text-slate-500">
                Real-time active vehicle assignments and readiness scores
              </p>
            </div>

            <Link
              href="/admin/operations"
              className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1"
            >
              <span>Manage Fleet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {deployments.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <Car className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-800">No active vehicle deployments today</p>
              <p className="text-xs text-slate-500">Driver assignments for departures will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {deployments.slice(0, 4).map((dep) => (
                <div
                  key={dep.id}
                  className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-brand-orange">
                        {dep.bookingCode}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {dep.leadBookerName}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Car className="w-3.5 h-3.5 text-slate-400" />
                        {dep.vehicle?.model || 'Vehicle Unassigned'}
                      </span>
                      <span>• Driver: {dep.driver?.name || 'Pending'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span
                      className={`text-xs font-extrabold px-2.5 py-1 rounded-full font-mono ${
                        dep.readinessScore >= 90
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {dep.readinessScore}% Ready
                    </span>
                    <Link
                      href={`/admin/operations`}
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actionable Enquiries Queue (Col 5) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-heading font-black text-slate-900">
                Actionable Enquiries
              </h2>
              <p className="text-xs text-slate-500">Submissions awaiting traveller contact</p>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentEnquiries.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <Inbox className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-800">No pending enquiries</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentEnquiries.map((enq) => (
                <Link
                  key={enq.id}
                  href={`/admin/enquiries/${enq.id}`}
                  className="block p-4 rounded-2xl bg-slate-50/80 hover:bg-brand-orange/5 border border-slate-200/80 hover:border-brand-orange/40 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900">
                      {enq.reference}
                    </span>
                    <StatusBadge status={enq.status} size="sm" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{enq.name}</p>
                      <p className="text-xs text-slate-500">
                        {enq.destination} · {enq.traveller_count} travellers
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-brand-orange shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
