'use me';
'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { destinationFormSchema, DestinationFormValues } from '@/lib/validations/destination';
import { DestinationFilterParams, DestinationStatus } from '@/lib/types/destination';

// Helper to check user permission
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

// 1. Get List of Master Lookup Tables
export async function getMasterCountries() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('countries').select('*').order('name');
  if (error) throw new Error(error.message);
  return data || [];
}

export async function getMasterStates(countryId?: string) {
  const supabase = await createServerSupabaseClient();
  let query = supabase.from('states').select('*').order('name');
  if (countryId) {
    query = query.eq('country_id', countryId);
  }
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data || [];
}

export async function getMasterCategories() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('destination_categories').select('*').order('display_order');
  if (error) throw new Error(error.message);
  return data || [];
}

export async function getMasterTags() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('master_tags').select('*').order('name');
  if (error) throw new Error(error.message);
  return data || [];
}

// 2. Fetch Destinations with Filters & Pagination (Admin & Public)
export async function getDestinations(params: DestinationFilterParams = {}) {
  const supabase = await createServerSupabaseClient();
  const {
    search = '',
    status = 'all',
    category_id,
    state_id,
    country_id,
    is_featured,
    page = 1,
    limit = 20,
    sort_by = 'created_at',
    sort_order = 'desc',
  } = params;

  let query = supabase
    .from('destinations')
    .select(
      `
      *,
      country:countries(*),
      state:states(*),
      category:destination_categories(*)
    `,
      { count: 'exact' }
    );

  // Search filter
  if (search.trim()) {
    query = query.or(`name.ilike.%${search}%,short_description.ilike.%${search}%,slug.ilike.%${search}%`);
  }

  // Status filter
  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  // Category, state, country filter
  if (category_id) query = query.eq('category_id', category_id);
  if (state_id) query = query.eq('state_id', state_id);
  if (country_id) query = query.eq('country_id', country_id);
  if (typeof is_featured === 'boolean') query = query.eq('is_featured', is_featured);

  // Sort
  query = query.order(sort_by, { ascending: sort_order === 'asc' });

  // Pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  return {
    destinations: data || [],
    totalCount: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
    page,
    limit,
  };
}

// 3. Fetch Single Destination by Slug (Public View + Slug History Check)
export async function getDestinationBySlug(slug: string) {
  const supabase = await createServerSupabaseClient();

  // First check if current slug exists
  const { data: currentDest, error } = await supabase
    .from('destinations')
    .select(
      `
      *,
      country:countries(*),
      state:states(*),
      category:destination_categories(*),
      gallery:destination_gallery(*),
      highlights:destination_highlights(*),
      emergency_contacts:destination_emergency_contacts(*),
      faqs:destination_faqs(*)
    `
    )
    .eq('slug', slug)
    .maybeSingle();

  if (currentDest) {
    // Order gallery, highlights, contacts, faqs manually by display_order
    if (currentDest.gallery) {
      currentDest.gallery.sort((a: { display_order?: number }, b: { display_order?: number }) => (a.display_order || 0) - (b.display_order || 0));
    }
    if (currentDest.highlights) {
      currentDest.highlights.sort((a: { display_order?: number }, b: { display_order?: number }) => (a.display_order || 0) - (b.display_order || 0));
    }
    if (currentDest.emergency_contacts) {
      currentDest.emergency_contacts.sort((a: { display_order?: number }, b: { display_order?: number }) => (a.display_order || 0) - (b.display_order || 0));
    }
    if (currentDest.faqs) {
      currentDest.faqs.sort((a: { display_order?: number }, b: { display_order?: number }) => (a.display_order || 0) - (b.display_order || 0));
    }
    return { destination: currentDest, redirectedSlug: null };
  }

  // Check Slug History for 301 Permanent Redirect
  const { data: history } = await supabase
    .from('destination_slug_history')
    .select('destination_id, destinations(slug)')
    .eq('old_slug', slug)
    .maybeSingle();

  if (history && history.destinations) {
    const canonicalSlug = (history.destinations as unknown as { slug: string }).slug;
    return { destination: null, redirectedSlug: canonicalSlug };
  }

  return { destination: null, redirectedSlug: null };
}

// 4. Fetch Single Destination by ID (Admin Edit)
export async function getDestinationById(id: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('destinations')
    .select(
      `
      *,
      country:countries(*),
      state:states(*),
      category:destination_categories(*),
      gallery:destination_gallery(*),
      highlights:destination_highlights(*),
      emergency_contacts:destination_emergency_contacts(*),
      faqs:destination_faqs(*),
      destination_tag_relations(tag_id)
    `
    )
    .eq('id', id)
    .single();

  if (error || !data) return null;

  const tag_ids = data.destination_tag_relations ? data.destination_tag_relations.map((r: { tag_id: string }) => r.tag_id) : [];

  return {
    ...data,
    tag_ids,
  };
}

// 5. Create Destination (Admin)
export async function createDestination(rawValues: DestinationFormValues) {
  const { supabase, user } = await checkPermission('destination.create');

  const validated = destinationFormSchema.parse(rawValues);

  const {
    tag_ids,
    gallery,
    highlights,
    emergency_contacts,
    faqs,
    ...destinationPayload
  } = validated;

  // Insert Destination
  const { data: newDest, error: destError } = await supabase
    .from('destinations')
    .insert({
      ...destinationPayload,
      created_by: user.id,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (destError || !newDest) {
    throw new Error(`Failed to create destination: ${destError?.message}`);
  }

  const destId = newDest.id;

  // Insert Gallery Items
  if (gallery && gallery.length > 0) {
    await supabase.from('destination_gallery').insert(
      gallery.map((g, idx) => ({
        destination_id: destId,
        image_url: g.image_url,
        thumbnail_url: g.thumbnail_url,
        medium_url: g.medium_url,
        alt_text: g.alt_text,
        caption: g.caption,
        photographer: g.photographer,
        is_featured: g.is_featured,
        display_order: g.display_order ?? idx,
      }))
    );
  }

  // Insert Highlights
  if (highlights && highlights.length > 0) {
    await supabase.from('destination_highlights').insert(
      highlights.map((h, idx) => ({
        destination_id: destId,
        title: h.title,
        description: h.description,
        icon_name: h.icon_name || 'Sparkles',
        display_order: h.display_order ?? idx,
      }))
    );
  }

  // Insert Emergency Contacts
  if (emergency_contacts && emergency_contacts.length > 0) {
    await supabase.from('destination_emergency_contacts').insert(
      emergency_contacts.map((c, idx) => ({
        destination_id: destId,
        service_type: c.service_type,
        title: c.title,
        phone_number: c.phone_number,
        alt_phone: c.alt_phone,
        address: c.address,
        display_order: c.display_order ?? idx,
      }))
    );
  }

  // Insert FAQs
  if (faqs && faqs.length > 0) {
    await supabase.from('destination_faqs').insert(
      faqs.map((f, idx) => ({
        destination_id: destId,
        question: f.question,
        answer: f.answer,
        display_order: f.display_order ?? idx,
      }))
    );
  }

  // Insert Master Tag Junctions
  if (tag_ids && tag_ids.length > 0) {
    await supabase.from('destination_tag_relations').insert(
      tag_ids.map((tagId) => ({
        destination_id: destId,
        tag_id: tagId,
      }))
    );
  }

  revalidatePath('/admin/destinations');
  revalidatePath('/destinations');
  revalidatePath('/trips');

  return newDest;
}

// 6. Update Destination (Admin & Slug History Check)
export async function updateDestination(id: string, rawValues: DestinationFormValues) {
  const { supabase, user } = await checkPermission('destination.update');

  const validated = destinationFormSchema.parse(rawValues);

  // Check if slug is changing to record slug history
  const { data: existingDest } = await supabase.from('destinations').select('slug').eq('id', id).single();

  if (existingDest && existingDest.slug !== validated.slug) {
    // Record old slug in history
    await supabase.from('destination_slug_history').upsert(
      {
        destination_id: id,
        old_slug: existingDest.slug,
      },
      { onConflict: 'old_slug' }
    );
  }

  const {
    tag_ids,
    gallery,
    highlights,
    emergency_contacts,
    faqs,
    ...destinationPayload
  } = validated;

  // Update Main Destination Record
  const { data: updatedDest, error: updateError } = await supabase
    .from('destinations')
    .update({
      ...destinationPayload,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (updateError) {
    throw new Error(`Failed to update destination: ${updateError.message}`);
  }

  // Replace Gallery Items
  await supabase.from('destination_gallery').delete().eq('destination_id', id);
  if (gallery && gallery.length > 0) {
    await supabase.from('destination_gallery').insert(
      gallery.map((g, idx) => ({
        destination_id: id,
        image_url: g.image_url,
        thumbnail_url: g.thumbnail_url,
        medium_url: g.medium_url,
        alt_text: g.alt_text,
        caption: g.caption,
        photographer: g.photographer,
        is_featured: g.is_featured,
        display_order: g.display_order ?? idx,
      }))
    );
  }

  // Replace Highlights
  await supabase.from('destination_highlights').delete().eq('destination_id', id);
  if (highlights && highlights.length > 0) {
    await supabase.from('destination_highlights').insert(
      highlights.map((h, idx) => ({
        destination_id: id,
        title: h.title,
        description: h.description,
        icon_name: h.icon_name || 'Sparkles',
        display_order: h.display_order ?? idx,
      }))
    );
  }

  // Replace Emergency Contacts
  await supabase.from('destination_emergency_contacts').delete().eq('destination_id', id);
  if (emergency_contacts && emergency_contacts.length > 0) {
    await supabase.from('destination_emergency_contacts').insert(
      emergency_contacts.map((c, idx) => ({
        destination_id: id,
        service_type: c.service_type,
        title: c.title,
        phone_number: c.phone_number,
        alt_phone: c.alt_phone,
        address: c.address,
        display_order: c.display_order ?? idx,
      }))
    );
  }

  // Replace FAQs
  await supabase.from('destination_faqs').delete().eq('destination_id', id);
  if (faqs && faqs.length > 0) {
    await supabase.from('destination_faqs').insert(
      faqs.map((f, idx) => ({
        destination_id: id,
        question: f.question,
        answer: f.answer,
        display_order: f.display_order ?? idx,
      }))
    );
  }

  // Replace Tag Relations
  await supabase.from('destination_tag_relations').delete().eq('destination_id', id);
  if (tag_ids && tag_ids.length > 0) {
    await supabase.from('destination_tag_relations').insert(
      tag_ids.map((tagId) => ({
        destination_id: id,
        tag_id: tagId,
      }))
    );
  }

  revalidatePath('/admin/destinations');
  revalidatePath(`/admin/destinations/${id}/edit`);
  revalidatePath('/destinations');
  revalidatePath(`/destinations/${validated.slug}`);

  return updatedDest;
}

// 7. Quick Status Update
export async function updateDestinationStatus(id: string, status: DestinationStatus) {
  const { supabase, user } = await checkPermission('destination.update');

  const { error } = await supabase
    .from('destinations')
    .update({
      status,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw new Error(`Failed to update status: ${error.message}`);

  revalidatePath('/admin/destinations');
  revalidatePath('/destinations');
}

// 8. Quick Featured Toggle
export async function toggleDestinationFeatured(id: string, is_featured: boolean) {
  const { supabase, user } = await checkPermission('destination.update');

  const { error } = await supabase
    .from('destinations')
    .update({
      is_featured,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw new Error(`Failed to update featured flag: ${error.message}`);

  revalidatePath('/admin/destinations');
  revalidatePath('/destinations');
}

// 9. Bulk Status Update (Bulk Publish, Unpublish, Archive)
export async function bulkUpdateDestinationStatus(ids: string[], status: DestinationStatus) {
  const { supabase, user } = await checkPermission('destination.update');

  const { error } = await supabase
    .from('destinations')
    .update({
      status,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .in('id', ids);

  if (error) throw new Error(`Bulk update failed: ${error.message}`);

  revalidatePath('/admin/destinations');
  revalidatePath('/destinations');
}

// 10. Increment View Count (Public Async Action)
export async function incrementDestinationViewCount(slug: string) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.from('destinations').select('id, view_count').eq('slug', slug).single();
    if (data) {
      await supabase
        .from('destinations')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', data.id);
    }
  } catch {
    // Non-blocking view count failure ignore
  }
}
