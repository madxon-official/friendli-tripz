import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { sanitizeSupabaseUrl } from './client';

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  const supabaseUrl = sanitizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from Server Component
        }
      },
    },
  });
}

export { createServerSupabaseClient as createClient };
