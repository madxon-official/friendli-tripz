import { createBrowserClient } from '@supabase/ssr';

export function sanitizeSupabaseUrl(url?: string): string {
  if (!url) return 'https://placeholder.supabase.co';
  return url.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
}

export function createClient() {
  const supabaseUrl = sanitizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
