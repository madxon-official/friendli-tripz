'use server';

import { createClient } from '@/lib/supabase/server';

export async function toggleWishlist(packageFamilyId: string): Promise<{ success: boolean; isWishlisted: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, isWishlisted: false };
  }

  // Check if exists
  const { data: existing } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', user.id)
    .eq('package_family_id', packageFamilyId)
    .maybeSingle();

  if (existing) {
    await supabase.from('wishlists').delete().eq('id', existing.id);
    return { success: true, isWishlisted: false };
  } else {
    await supabase.from('wishlists').insert({
      user_id: user.id,
      package_family_id: packageFamilyId
    });
    return { success: true, isWishlisted: true };
  }
}

export async function getUserWishlist(): Promise<string[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from('wishlists')
    .select('package_family_id')
    .eq('user_id', user.id);

  return data ? data.map(d => d.package_family_id) : [];
}
