import React from 'react';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Inbox, ArrowRight, Clock, UserCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'Admin Dashboard | Friendli Tripz',
  description: 'Friendli Tripz internal enquiry management dashboard.',
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

  // Fetch summary counts concurrently using narrow headcount selects
  const [{ count: newCount }, { count: followUpCount }, { count: confirmedCount }, { count: completedCount }] =
    await Promise.all([
      supabase.from('enquiries').select('id', { count: 'exact', head: true }).eq('status', 'new').is('archived_at', null),
      supabase.from('enquiries').select('id', { count: 'exact', head: true }).eq('status', 'follow_up').is('archived_at', null),
      supabase.from('enquiries').select('id', { count: 'exact', head: true }).eq('status', 'confirmed').is('archived_at', null),
      supabase.from('enquiries').select('id', { count: 'exact', head: true }).eq('status', 'completed').is('archived_at', null),
    ]);

  // Fetch recent enquiries (latest 5 active with ONLY required fields for dashboard display)
  const { data: recentEnquiries } = await supabase
    .from('enquiries')
    .select('id, reference, name, phone, traveller_count, starting_location, destination, status, created_at')
    .is('archived_at', null)
    .order('created_at', { ascending: false })
    .limit(5);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-brand-orange text-white font-mono">NEW</span>;
      case 'contacted':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800 font-mono">CONTACTED</span>;
      case 'follow_up':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 font-mono">FOLLOW-UP</span>;
      case 'confirmed':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 font-mono">CONFIRMED</span>;
      case 'completed':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-800 font-mono">COMPLETED</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800 font-mono">CANCELLED</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-800 font-mono">{status}</span>;
    }
  };

  return (
    <AdminLayout
      initialNewCount={newCount || 0}
      adminName={profile.full_name}
      adminEmail={session.user.email}
      adminRole={profile.role}
    >
      <div className="space-y-8">
        {/* Top Greeting Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border/60 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-brand-navy font-heading">
              {greeting}, {adminFirstName}
            </h1>
            <p className="text-sm text-brand-muted mt-1">
              Here&apos;s what&apos;s happening with Friendli Tripz.
            </p>
          </div>

          <Link href="/admin/enquiries">
            <Button variant="primary" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
              View All Enquiries
            </Button>
          </Link>
        </div>

        {/* Clickable Summary Metric Workflow Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          <Link
            href="/admin/enquiries?status=new"
            className="bg-white p-5 rounded-2xl border border-brand-border/60 shadow-card space-y-2 hover:border-brand-orange/60 transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-muted font-mono">
                New Enquiries
              </span>
              <div className="w-8 h-8 rounded-xl bg-brand-soft-orange text-brand-orange flex items-center justify-center">
                <Inbox className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-brand-navy font-heading block">
                {newCount || 0}
              </span>
              <span className="text-xs text-brand-orange font-bold hover:underline">View →</span>
            </div>
          </Link>

          <Link
            href="/admin/enquiries?status=follow_up"
            className="bg-white p-5 rounded-2xl border border-brand-border/60 shadow-card space-y-2 hover:border-amber-400 transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-muted font-mono">
                Follow-ups
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-brand-navy font-heading block">
                {followUpCount || 0}
              </span>
              <span className="text-xs text-amber-600 font-bold hover:underline">View →</span>
            </div>
          </Link>

          <Link
            href="/admin/enquiries?status=confirmed"
            className="bg-white p-5 rounded-2xl border border-brand-border/60 shadow-card space-y-2 hover:border-emerald-400 transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-muted font-mono">
                Confirmed
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-brand-navy font-heading block">
                {confirmedCount || 0}
              </span>
              <span className="text-xs text-emerald-600 font-bold hover:underline">View →</span>
            </div>
          </Link>

          <Link
            href="/admin/enquiries?status=completed"
            className="bg-white p-5 rounded-2xl border border-brand-border/60 shadow-card space-y-2 hover:border-slate-400 transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-muted font-mono">
                Completed
              </span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-brand-navy font-heading block">
                {completedCount || 0}
              </span>
              <span className="text-xs text-slate-600 font-bold hover:underline">View →</span>
            </div>
          </Link>
        </div>

        {/* Recent Enquiries Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border/60 shadow-card space-y-6">
          <div className="flex items-center justify-between border-b border-brand-border/60 pb-4">
            <div>
              <h2 className="text-lg font-bold text-brand-navy font-heading">
                Recent Enquiries
              </h2>
              <p className="text-xs text-brand-muted">
                Latest submissions from the website
              </p>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {!recentEnquiries || recentEnquiries.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Inbox className="w-10 h-10 text-brand-muted mx-auto" />
              <p className="text-sm font-semibold text-brand-navy">No enquiries yet.</p>
              <p className="text-xs text-brand-muted">New trip enquiries will appear here in real time.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentEnquiries.map((enq) => (
                <Link
                  key={enq.id}
                  href={`/admin/enquiries/${enq.id}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-brand-warm hover:bg-brand-soft-navy border border-brand-border/40 transition-colors gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-brand-navy">
                        {enq.reference}
                      </span>
                      {getStatusBadge(enq.status)}
                    </div>
                    <p className="font-heading font-bold text-brand-navy text-base">
                      {enq.name}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-brand-muted">
                      <span>📱 {enq.phone}</span>
                      <span>👥 {enq.traveller_count} travellers</span>
                      <span>📍 {enq.starting_location || 'TBD'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
                    <span className="text-brand-muted">
                      {new Date(enq.created_at).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <ArrowRight className="w-4 h-4 text-brand-orange shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
