'use me';
'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { attractionFormSchema, AttractionFormValues } from '@/lib/validations/attraction';
import { AttractionFilterParams, AttractionStatus } from '@/lib/types/attraction';

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

// 1. Master Lookups: Categories & Destination Micro-Zones
export async function getAttractionCategories() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('attraction_categories').select('*').order('display_order');
  if (error) throw new Error(error.message);
  return data || [];
}

export async function getDestinationZones(destinationId?: string) {
  const supabase = await createServerSupabaseClient();
  let query = supabase.from('destination_zones').select('*').order('display_order');
  if (destinationId) {
    query = query.eq('destination_id', destinationId);
  }
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data || [];
}

// 2. Fetch Attractions (Admin & Public with Filters)
export async function getAttractions(params: AttractionFilterParams = {}) {
  const supabase = await createServerSupabaseClient();
  const {
    search = '',
    destination_id,
    zone_id,
    category_id,
    status = 'all',
    is_featured,
    page = 1,
    limit = 20,
  } = params;

  let query = supabase
    .from('attractions')
    .select(
      `
      *,
      destination:destinations(id, name, slug),
      zone:destination_zones(*),
      category:attraction_categories(*)
    `,
      { count: 'exact' }
    );

  if (search.trim()) {
    query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%,short_tagline.ilike.%${search}%`);
  }

  if (destination_id) query = query.eq('destination_id', destination_id);
  if (zone_id) query = query.eq('zone_id', zone_id);
  if (category_id) query = query.eq('category_id', category_id);
  if (status && status !== 'all') query = query.eq('status', status);
  if (typeof is_featured === 'boolean') query = query.eq('is_featured', is_featured);

  query = query.order('created_at', { ascending: false });

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  return {
    attractions: data || [],
    totalCount: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
    page,
    limit,
  };
}

// 3. Fetch Single Attraction by Canonical Slug & Check 301 History
export async function getAttractionBySlug(destSlug: string, attractionSlug: string) {
  const supabase = await createServerSupabaseClient();

  // Primary Canonical Lookup
  const { data: attraction } = await supabase
    .from('attractions')
    .select(
      `
      *,
      destination:destinations!inner(id, name, slug),
      zone:destination_zones(*),
      category:attraction_categories(*),
      offerings:activity_offerings(*, master_activity:activities(*), pricing_rules:offering_pricing_rules(*)),
      schedules:operating_schedules(*),
      exceptions:operational_exceptions(*)
    `
    )
    .eq('slug', attractionSlug)
    .eq('destinations.slug', destSlug)
    .maybeSingle();

  if (attraction) {
    return { attraction, redirectedSlug: null };
  }

  // 301 Permanent Redirect Check in Slug History
  const { data: history } = await supabase
    .from('attraction_slug_history')
    .select('attraction_id, attractions(slug, destination:destinations(slug))')
    .eq('old_slug', attractionSlug)
    .maybeSingle();

  if (history && history.attractions) {
    const parentDestSlug = (history.attractions as any).destination?.slug;
    const currentSlug = (history.attractions as any).slug;
    return { attraction: null, redirectedSlug: `/destinations/${parentDestSlug}/attractions/${currentSlug}` };
  }

  return { attraction: null, redirectedSlug: null };
}

// 4. Fetch Single Attraction by ID (Admin Edit)
export async function getAttractionById(id: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('attractions')
    .select(
      `
      *,
      destination:destinations(id, name, slug),
      zone:destination_zones(*),
      category:attraction_categories(*),
      schedules:operating_schedules(*),
      exceptions:operational_exceptions(*)
    `
    )
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data;
}

// 5. Create Attraction (Admin)
export async function createAttraction(rawValues: AttractionFormValues) {
  const { supabase, user } = await checkPermission('destination.create');

  const validated = attractionFormSchema.parse(rawValues);

  const { schedules, exceptions, ...attractionPayload } = validated;

  const { data: newAttraction, error } = await supabase
    .from('attractions')
    .insert({
      ...attractionPayload,
      created_by: user.id,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error || !newAttraction) {
    throw new Error(`Failed to create attraction: ${error?.message}`);
  }

  const attrId = newAttraction.id;

  // Insert Operating Schedules
  if (schedules && schedules.length > 0) {
    await supabase.from('operating_schedules').insert(
      schedules.map((s) => ({
        entity_type: 'attraction',
        entity_id: attrId,
        day_of_week: s.day_of_week,
        open_time: s.open_time,
        close_time: s.close_time,
        is_closed: s.is_closed,
      }))
    );
  }

  // Insert Exceptions
  if (exceptions && exceptions.length > 0) {
    await supabase.from('operational_exceptions').insert(
      exceptions.map((e) => ({
        entity_type: 'attraction',
        entity_id: attrId,
        start_date: e.start_date,
        end_date: e.end_date,
        exception_type: e.exception_type,
        reason: e.reason,
        override_open_time: e.override_open_time,
        override_close_time: e.override_close_time,
        validation_impact: e.validation_impact,
      }))
    );
  }

  revalidatePath('/admin/attractions');
  revalidatePath('/destinations');
  return newAttraction;
}

// 6. Update Attraction & 301 Slug History
export async function updateAttraction(id: string, rawValues: AttractionFormValues) {
  const { supabase, user } = await checkPermission('destination.update');

  const validated = attractionFormSchema.parse(rawValues);

  // Check if slug changed to record 301 history
  const { data: existing } = await supabase.from('attractions').select('slug').eq('id', id).single();

  if (existing && existing.slug !== validated.slug) {
    await supabase.from('attraction_slug_history').upsert(
      {
        attraction_id: id,
        old_slug: existing.slug,
      },
      { onConflict: 'old_slug' }
    );
  }

  const { schedules, exceptions, ...attractionPayload } = validated;

  const { data: updated, error } = await supabase
    .from('attractions')
    .update({
      ...attractionPayload,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update attraction: ${error.message}`);

  // Replace Operating Schedules
  await supabase.from('operating_schedules').delete().eq('entity_type', 'attraction').eq('entity_id', id);
  if (schedules && schedules.length > 0) {
    await supabase.from('operating_schedules').insert(
      schedules.map((s) => ({
        entity_type: 'attraction',
        entity_id: id,
        day_of_week: s.day_of_week,
        open_time: s.open_time,
        close_time: s.close_time,
        is_closed: s.is_closed,
      }))
    );
  }

  // Replace Exceptions
  await supabase.from('operational_exceptions').delete().eq('entity_type', 'attraction').eq('entity_id', id);
  if (exceptions && exceptions.length > 0) {
    await supabase.from('operational_exceptions').insert(
      exceptions.map((e) => ({
        entity_type: 'attraction',
        entity_id: id,
        start_date: e.start_date,
        end_date: e.end_date,
        exception_type: e.exception_type,
        reason: e.reason,
        override_open_time: e.override_open_time,
        override_close_time: e.override_close_time,
        validation_impact: e.validation_impact,
      }))
    );
  }

  revalidatePath('/admin/attractions');
  revalidatePath(`/admin/attractions/${id}/edit`);
  revalidatePath('/destinations');

  return updated;
}

// 7. Update Attraction Status
export async function updateAttractionStatus(id: string, status: AttractionStatus) {
  const { supabase, user } = await checkPermission('destination.update');

  const { error } = await supabase
    .from('attractions')
    .update({ status, updated_by: user.id, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw new Error(`Status update failed: ${error.message}`);

  revalidatePath('/admin/attractions');
  revalidatePath('/destinations');
}
