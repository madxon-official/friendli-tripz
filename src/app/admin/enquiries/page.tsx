import React, { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { EnquiryListClient, EnquiryRow } from '@/components/admin/EnquiryListClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Customer Enquiries | Friendli Admin',
  description: 'Friendli Tripz internal enquiry list and tracking workspace.',
};

export default async function EnquiryListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const resolvedParams = await searchParams;
  const statusFilter = resolvedParams.status || 'all';

  const supabase = await createServerSupabaseClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/admin/login');
  }

  // Run server queries concurrently
  let query = supabase
    .from('enquiries')
    .select(
      'id, reference, created_at, name, phone, email, destination, traveller_count, preferred_date, starting_location, status, archived_at'
    )
    .is('archived_at', null)
    .order('created_at', { ascending: false })
    .limit(30);

  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('status', statusFilter);
  }

  const [enquiriesRes, newCountRes, profileRes] = await Promise.all([
    query,
    supabase
      .from('enquiries')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'new')
      .is('archived_at', null),
    supabase
      .from('admin_profiles')
      .select('full_name')
      .eq('id', session.user.id)
      .single(),
  ]);

  const initialEnquiries: EnquiryRow[] = enquiriesRes.data || [];
  const initialNewCount = newCountRes.count || 0;
  const adminName = profileRes.data?.full_name || 'Admin';

  return (
    <Suspense>
      <EnquiryListClient
        initialEnquiries={initialEnquiries}
        initialNewCount={initialNewCount}
        initialStatus={statusFilter}
        adminName={adminName}
        adminEmail={session.user.email}
      />
    </Suspense>
  );
}
