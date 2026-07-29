'use me';
'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import {
  masterActivityFormSchema,
  activityOfferingFormSchema,
  MasterActivityFormValues,
  ActivityOfferingFormValues,
} from '@/lib/validations/attraction';
import { ActivityStatus } from '@/lib/types/attraction';

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

// 1. Fetch Activity Categories
export async function getActivityCategories() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('activity_categories').select('*').order('display_order');
  if (error) throw new Error(error.message);
  return data || [];
}

// 2. Fetch Master Activities
export async function getMasterActivities(status: string = 'all') {
  const supabase = await createServerSupabaseClient();
  let query = supabase.from('activities').select(`
    *,
    category:activity_categories(*),
    offerings:activity_offerings(*, pricing_rules:offering_pricing_rules(*))
  `).order('created_at', { ascending: false });

  if (status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data || [];
}

// 3. Fetch Single Activity by Canonical Slug & Check 301 History
export async function getActivityBySlug(slug: string) {
  const supabase = await createServerSupabaseClient();

  const { data: activity } = await supabase
    .from('activities')
    .select(`
      *,
      category:activity_categories(*),
      offerings:activity_offerings(*, attraction:attractions(name, slug, destination:destinations(slug)), pricing_rules:offering_pricing_rules(*))
    `)
    .eq('slug', slug)
    .maybeSingle();

  if (activity) return { activity, redirectedSlug: null };

  // 301 History Lookup
  const { data: history } = await supabase
    .from('activity_slug_history')
    .select('activity_id, activities(slug)')
    .eq('old_slug', slug)
    .maybeSingle();

  if (history && history.activities) {
    const currentSlug = (history.activities as any).slug;
    return { activity: null, redirectedSlug: `/activities/${currentSlug}` };
  }

  return { activity: null, redirectedSlug: null };
}

// 4. Create Master Activity (Admin)
export async function createMasterActivity(rawValues: MasterActivityFormValues) {
  const { supabase } = await checkPermission('destination.create');

  const validated = masterActivityFormSchema.parse(rawValues);

  const { data, error } = await supabase
    .from('activities')
    .insert({
      ...validated,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error || !data) throw new Error(`Failed to create master activity: ${error?.message}`);

  revalidatePath('/admin/activities');
  revalidatePath('/activities');
  return data;
}

// 5. Update Master Activity & 301 Slug History
export async function updateMasterActivity(id: string, rawValues: MasterActivityFormValues) {
  const { supabase } = await checkPermission('destination.update');

  const validated = masterActivityFormSchema.parse(rawValues);

  const { data: existing } = await supabase.from('activities').select('slug').eq('id', id).single();
  if (existing && existing.slug !== validated.slug) {
    await supabase.from('activity_slug_history').upsert(
      { activity_id: id, old_slug: existing.slug },
      { onConflict: 'old_slug' }
    );
  }

  const { data, error } = await supabase
    .from('activities')
    .update({
      ...validated,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update activity: ${error.message}`);

  revalidatePath('/admin/activities');
  revalidatePath('/activities');
  return data;
}

// 6. Create Activity Offering & Pricing Rules
export async function createActivityOffering(rawValues: ActivityOfferingFormValues) {
  const { supabase } = await checkPermission('destination.create');

  const validated = activityOfferingFormSchema.parse(rawValues);
  const { pricing_rules, ...offeringPayload } = validated;

  const { data: newOffering, error } = await supabase
    .from('activity_offerings')
    .insert({
      ...offeringPayload,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error || !newOffering) throw new Error(`Failed to create offering: ${error?.message}`);

  // Insert Pricing Rules
  if (pricing_rules && pricing_rules.length > 0) {
    await supabase.from('offering_pricing_rules').insert(
      pricing_rules.map((p) => ({
        offering_id: newOffering.id,
        participant_type: p.participant_type,
        base_price: p.base_price,
        currency: p.currency || 'INR',
        is_active: p.is_active,
      }))
    );
  }

  revalidatePath('/admin/activities');
  revalidatePath('/admin/attractions');
  return newOffering;
}
