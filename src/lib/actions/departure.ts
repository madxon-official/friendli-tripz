'use me';
'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { packageDepartureSchema, PackageDepartureFormValues } from '@/lib/validations/departure';

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

// 1. Fetch Fixed Departures (Admin & Public)
export async function getDepartures() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('package_departures')
    .select(`
      *,
      release:package_releases(
        id, title, version_tag,
        family:package_families(id, name, family_slug)
      ),
      capacity_pools:departure_capacity_pools(*)
    `)
    .order('start_date');

  if (error) throw new Error(error.message);
  return data || [];
}

// 2. Create Fixed Departure Execution
export async function createDeparture(rawValues: PackageDepartureFormValues) {
  const { supabase, user } = await checkPermission('destination.create');

  const validated = packageDepartureSchema.parse(rawValues);

  const { data, error } = await supabase
    .from('package_departures')
    .insert({
      ...validated,
      created_by: user.id,
    })
    .select()
    .single();

  if (error || !data) throw new Error(`Failed to create departure: ${error?.message}`);

  // Initialize Capacity Pools
  await supabase.from('departure_capacity_pools').insert([
    { departure_id: data.id, pool_type: 'passenger', total_capacity: validated.max_travellers },
    { departure_id: data.id, pool_type: 'transport', total_capacity: validated.max_travellers },
    { departure_id: data.id, pool_type: 'accommodation', total_capacity: Math.ceil(validated.max_travellers / 2) },
  ]);

  revalidatePath('/admin/departures');
  return data;
}
