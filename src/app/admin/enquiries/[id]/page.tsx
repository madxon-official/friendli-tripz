import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import {
  EnquiryDetailClient,
  EnquiryDetail,
  NoteItem,
  HistoryItem,
} from '@/components/admin/EnquiryDetailClient';

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
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/admin/login');
  }

  // 1. Fetch CORE ENQUIRY (Primary blocking query on server)
  const { data: enquiry, error: enqError } = await supabase
    .from('enquiries')
    .select('*')
    .eq('id', targetId)
    .single();

  if (enqError || !enquiry) {
    return (
      <AdminLayout>
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
      </AdminLayout>
    );
  }

  // 2. Fetch SECONDARY DATA in parallel (Non-blocking settled promises)
  const [profileRes, notesRes, historyRes, newCountRes] = await Promise.allSettled([
    supabase.from('admin_profiles').select('full_name, role').eq('id', session.user.id).single(),
    supabase.from('enquiry_notes').select('*').eq('enquiry_id', targetId).order('created_at', { ascending: false }),
    supabase.from('enquiry_status_history').select('*').eq('enquiry_id', targetId).order('created_at', { ascending: false }),
    supabase.from('enquiries').select('id', { count: 'exact', head: true }).eq('status', 'new').is('archived_at', null),
  ]);

  const adminName = profileRes.status === 'fulfilled' && profileRes.value.data ? profileRes.value.data.full_name : 'Admin';
  const adminRole = profileRes.status === 'fulfilled' && profileRes.value.data ? profileRes.value.data.role : 'operations';
  
  const notes: NoteItem[] = notesRes.status === 'fulfilled' && notesRes.value.data ? notesRes.value.data : [];
  const notesAvailable = notesRes.status === 'fulfilled' && !notesRes.value.error;

  const history: HistoryItem[] = historyRes.status === 'fulfilled' && historyRes.value.data ? historyRes.value.data : [];
  const historyAvailable = historyRes.status === 'fulfilled' && !historyRes.value.error;

  const newCount = newCountRes.status === 'fulfilled' && newCountRes.value.count ? newCountRes.value.count : 0;

  return (
    <EnquiryDetailClient
      initialEnquiry={enquiry as EnquiryDetail}
      initialNotes={notes}
      notesAvailable={notesAvailable}
      initialHistory={history}
      historyAvailable={historyAvailable}
      initialNewCount={newCount}
      adminUser={{
        id: session.user.id,
        name: adminName,
        email: session.user.email,
        role: adminRole,
      }}
    />
  );
}
