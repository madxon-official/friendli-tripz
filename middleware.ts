import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { sanitizeSupabaseUrl } from '@/lib/supabase/client';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Admin Subdomain Preparation for production (admin.friendlitripz.com)
  const isAdminSubdomain = hostname.startsWith('admin.');
  const isAdminPath = url.pathname.startsWith('/admin') || isAdminSubdomain;

  // Skip middleware for static assets, public API, etc.
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api/enquiries') ||
    url.pathname.includes('.')
  ) {
    return response;
  }

  // If requesting /admin/login, allow unauthenticated access
  if (url.pathname === '/admin/login') {
    return response;
  }

  // If requesting admin routes (/admin, /admin/enquiries, etc.)
  if (isAdminPath) {
    const supabaseUrl = sanitizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Verify active admin profile in database
    const { data: profile } = await supabase
      .from('admin_profiles')
      .select('is_active')
      .eq('id', session.user.id)
      .single();

    if (!profile || !profile.is_active) {
      // User authenticated in Supabase but not an active Friendli admin profile
      const loginUrl = new URL('/admin/login?error=access_denied', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
