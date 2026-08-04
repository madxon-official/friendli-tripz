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

  // Partner portal paths that require authentication
  const isPartnerPortal =
    url.pathname.startsWith('/driver') ||
    url.pathname.startsWith('/hotel-portal') ||
    url.pathname.startsWith('/vendor-portal') ||
    url.pathname.startsWith('/tour-leader');

  // Skip middleware for static assets, public API, etc.
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api/enquiries') ||
    url.pathname.includes('.')
  ) {
    return response;
  }

  // Public admin pages that do not require an active admin profile
  const publicAdminPaths = ['/admin/login', '/admin/set-password', '/admin/access-denied'];
  if (publicAdminPaths.includes(url.pathname)) {
    return response;
  }

  // Helper: create Supabase client for session verification
  const createSupabaseMiddlewareClient = () => {
    const supabaseUrl = sanitizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    return createServerClient(supabaseUrl, supabaseAnonKey, {
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
  };

  // Partner portal route protection (driver, hotel, vendor, tour-leader)
  if (isPartnerPortal) {
    const supabase = createSupabaseMiddlewareClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('returnTo', url.pathname);
      return NextResponse.redirect(loginUrl);
    }

    return response;
  }

  // Admin route protection
  if (isAdminPath) {
    const supabase = createSupabaseMiddlewareClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Verify active admin profile in database
    let profileRole = 'admin';
    let profileActive = false;

    const { data: profile } = await supabase
      .from('admin_profiles')
      .select('role, is_active')
      .eq('id', user.id)
      .maybeSingle();

    if (profile) {
      profileRole = profile.role;
      profileActive = profile.is_active;
    } else {
      // Self-healing: Query via Service Role Client to provision missing admin_profiles for invited auth users
      try {
        const { createServiceRoleClient } = await import('@/lib/supabase/service');
        const serviceSupabase = createServiceRoleClient();

        const { data: inv } = await serviceSupabase
          .from('admin_invitations')
          .select('role, department_id, full_name')
          .eq('email', user.email?.toLowerCase().trim() || '')
          .maybeSingle();

        const newRole = inv?.role || 'admin';

        const { data: healedProfile } = await serviceSupabase
          .from('admin_profiles')
          .upsert({
            id: user.id,
            full_name: user.user_metadata?.full_name || inv?.full_name || user.email?.split('@')[0] || 'Admin User',
            role: newRole,
            department_id: inv?.department_id || null,
            status: 'active',
            is_active: true,
            updated_at: new Date().toISOString(),
          })
          .select('role, is_active')
          .single();

        if (healedProfile) {
          profileRole = healedProfile.role;
          profileActive = healedProfile.is_active;
        }
      } catch (err) {
        console.error('[Middleware Self-Healing Exception]', err);
      }
    }

    if (!profileActive) {
      const accessDeniedUrl = new URL('/admin/access-denied?reason=inactive', request.url);
      return NextResponse.redirect(accessDeniedUrl);
    }

    // Guard /admin/team route: OWNER & ADMIN ONLY
    if (url.pathname.startsWith('/admin/team')) {
      if (!['owner', 'admin'].includes(profileRole)) {
        const forbiddenUrl = new URL('/admin/access-denied?reason=forbidden', request.url);
        return NextResponse.redirect(forbiddenUrl);
      }
    }
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/driver/:path*', '/hotel-portal/:path*', '/vendor-portal/:path*', '/tour-leader/:path*'],
};
