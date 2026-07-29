'use me';
'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import {
  packageFamilyFormSchema,
  packageReleaseFormSchema,
  PackageFamilyFormValues,
  PackageReleaseFormValues,
} from '@/lib/validations/package';
import { PackageFilterParams, PackageReleaseStatus } from '@/lib/types/package';

async function checkPermission(requiredPermission: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized: Authentication required');
  }
  return { supabase, user };
}

// 1. Get Package Families (Admin & Public)
export async function getPackageFamilies() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('package_families')
    .select(`
      *,
      destination:destinations(id, name, slug),
      releases:package_releases(*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

// 2. Get Package Releases (Admin & Public Listing)
export async function getPackageReleases(params: PackageFilterParams = {}) {
  const supabase = await createServerSupabaseClient();
  const { search = '', destination_id, status = 'all', page = 1, limit = 20 } = params;

  let query = supabase.from('package_releases').select(
    `
      *,
      family:package_families!inner(
        id, name, family_slug,
        destination:destinations(id, name, slug)
      )
    `,
    { count: 'exact' }
  );

  if (search.trim()) {
    query = query.or(`title.ilike.%${search}%,version_tag.ilike.%${search}%`);
  }

  if (destination_id) {
    query = query.eq('family.destination_id', destination_id);
  }

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  query = query.order('created_at', { ascending: false });

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  return {
    releases: data || [],
    totalCount: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
    page,
    limit,
  };
}

// 3. Fetch Package Release by ID with Full Itinerary Component Tree
export async function getPackageReleaseById(id: string) {
  const supabase = await createServerSupabaseClient();

  const { data: release, error } = await supabase
    .from('package_releases')
    .select(
      `
      *,
      family:package_families(
        id, name, family_slug,
        destination:destinations(id, name, slug)
      ),
      days:itinerary_days(
        *,
        segments:itinerary_day_segments(
          *,
          attraction:attractions(id, name, slug),
          offering:activity_offerings(id, title)
        )
      )
    `
    )
    .eq('id', id)
    .single();

  if (error || !release) return null;

  // Sort days and segments in order
  if (release.days) {
    release.days.sort((a: any, b: any) => a.day_number - b.day_number);
    release.days.forEach((day: any) => {
      if (day.segments) {
        day.segments.sort((a: any, b: any) => a.sequence_order - b.sequence_order);
      }
    });
  }

  return release;
}

// 4. Create Package Family
export async function createPackageFamily(rawValues: PackageFamilyFormValues) {
  const { supabase, user } = await checkPermission('destination.create');

  const validated = packageFamilyFormSchema.parse(rawValues);

  const { data, error } = await supabase
    .from('package_families')
    .insert({
      ...validated,
      created_by: user.id,
    })
    .select()
    .single();

  if (error || !data) throw new Error(`Failed to create package family: ${error?.message}`);

  revalidatePath('/admin/packages');
  return data;
}

// 5. Create Package Release Version
export async function createPackageRelease(rawValues: PackageReleaseFormValues) {
  const { supabase, user } = await checkPermission('destination.create');

  const validated = packageReleaseFormSchema.parse(rawValues);
  const { days, ...releasePayload } = validated;

  const { data: newRelease, error } = await supabase
    .from('package_releases')
    .insert({
      ...releasePayload,
      created_by: user.id,
      published_at: releasePayload.status === 'active' ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error || !newRelease) throw new Error(`Failed to create package release: ${error?.message}`);

  const releaseId = newRelease.id;

  // Insert Itinerary Days & Segments
  if (days && days.length > 0) {
    for (const day of days) {
      const { data: newDay } = await supabase
        .from('itinerary_days')
        .insert({
          release_id: releaseId,
          day_number: day.day_number,
          theme_title: day.theme_title,
          description: day.description,
        })
        .select()
        .single();

      if (newDay && day.segments && day.segments.length > 0) {
        await supabase.from('itinerary_day_segments').insert(
          day.segments.map((seg, idx) => ({
            day_id: newDay.id,
            sequence_order: idx + 1,
            segment_type: seg.segment_type,
            planned_start_time: seg.planned_start_time || null,
            planned_end_time: seg.planned_end_time || null,
            duration_mins: seg.duration_mins,
            attraction_id: seg.attraction_id || null,
            activity_offering_id: seg.activity_offering_id || null,
            segment_title: seg.segment_title,
            custom_instructions: seg.custom_instructions || null,
            cost_override: seg.cost_override || null,
            is_included_in_package: seg.is_included_in_package,
          }))
        );
      }
    }
  }

  revalidatePath('/admin/packages');
  return newRelease;
}

// 6. Update Package Release Status
export async function updatePackageReleaseStatus(id: string, status: PackageReleaseStatus) {
  const { supabase } = await checkPermission('destination.update');

  const { error } = await supabase
    .from('package_releases')
    .update({
      status,
      published_at: status === 'active' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw new Error(`Failed to update release status: ${error.message}`);

  revalidatePath('/admin/packages');
}
