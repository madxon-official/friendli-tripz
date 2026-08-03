import React from 'react';
import Link from 'next/link';
import dynamicImport from 'next/dynamic';
import { redirect } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { EnquiryDetail, NoteItem, HistoryItem } from '@/components/admin/EnquiryDetailClient';

const DynamicEnquiryDetailClient = dynamicImport(
  () => import('@/components/admin/EnquiryDetailClient').then((mod) => mod.EnquiryDetailClient),
  {
    loading: () => (
      <div className="p-8 space-y-4 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-lg w-1/3" />
        <div className="h-96 bg-slate-100 rounded-2xl w-full" />
      </div>
    ),
  }
);

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Enquiry Detail | Friendli Admin',
  description: 'View and manage traveller enquiry details.',
};

export default async function EnquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const targetId = resolvedParams.id;

  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Fetch CORE ENQUIRY
  const { data: enquiry, error: enqError } = await supabase
    .from('enquiries')
    .select('id, reference, name, email, phone, destination, traveller_count, preferred_date, starting_location, status, assigned_to, created_at, archived_at')
    .eq('id', targetId)
    .single();

  if (enqError || !enquiry) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center space-y-4 border border-brand-border/60 max-w-md mx-auto my-12">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-brand-navy font-heading">
          Enquiry Not Found
        </h2>
        <p className="text-xs text-brand-muted leading-relaxed">
          The requested enquiry could not be found or has been removed.
        </p>
        <div className="pt-2 flex items-center justify-center gap-3">
          <Link href="/admin/enquiries">
            <Button variant="primary" size="sm">
              Back to Enquiries
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Fetch NOTES, HISTORY, NEW COUNT, and TEAM MEMBERS in parallel
  const [notesRes, historyRes, newCountRes, teamRes, profileRes] = await Promise.all([
    supabase
      .from('enquiry_notes')
      .select('*')
      .eq('enquiry_id', targetId)
      .order('created_at', { ascending: false }),
    supabase
      .from('enquiry_history')
      .select('*')
      .eq('enquiry_id', targetId)
      .order('created_at', { ascending: false }),
    supabase
      .from('enquiries')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'new')
      .is('archived_at', null),
    supabase
      .from('admin_profiles')
      .select('id, full_name, role')
      .eq('is_active', true)
      .order('full_name'),
    supabase
      .from('admin_profiles')
      .select('full_name, role')
      .eq('id', user.id)
      .single(),
  ]);

  const rawNotes = notesRes.data || [];
  const initialNotes: NoteItem[] = rawNotes.map((n: any) => ({
    id: n.id,
    note: n.content || n.note || '',
    created_at: n.created_at,
    admin_id: n.author_id || n.admin_id || user.id,
    admin_name: n.author_name || n.admin_name || 'Admin',
  }));

  const rawHistory = historyRes.data || [];
  const initialHistory: HistoryItem[] = rawHistory.map((h: any) => ({
    id: h.id,
    previous_status: h.old_value || h.previous_status || null,
    new_status: h.new_value || h.new_status || 'updated',
    created_at: h.created_at,
    changed_by: h.actor_name || h.changed_by || null,
    admin_name: h.actor_name || h.admin_name || 'Admin',
  }));

  const initialEnquiryDetail: EnquiryDetail = {
    id: enquiry.id,
    reference: enquiry.reference,
    name: enquiry.name,
    email: enquiry.email,
    phone: enquiry.phone,
    destination: enquiry.destination,
    traveller_count: enquiry.traveller_count,
    preferred_date: enquiry.preferred_date,
    starting_location: enquiry.starting_location,
    status: enquiry.status,
    assigned_to: enquiry.assigned_to,
    created_at: enquiry.created_at,
    archived_at: enquiry.archived_at,
  };

  const teamMembers = (teamRes.data || []).map((t: any) => ({
    id: t.id,
    full_name: t.full_name,
    role: t.role,
  }));

  const adminUser = {
    id: user.id,
    name: profileRes.data?.full_name || 'Admin User',
    email: user.email || '',
    role: profileRes.data?.role || 'admin',
  };

  return (
    <DynamicEnquiryDetailClient
      initialEnquiry={initialEnquiryDetail}
      initialNotes={initialNotes}
      notesAvailable={!notesRes.error}
      initialHistory={initialHistory}
      historyAvailable={!historyRes.error}
      initialNewCount={newCountRes.count || 0}
      teamMembers={teamMembers}
      adminUser={adminUser}
    />
  );
}
