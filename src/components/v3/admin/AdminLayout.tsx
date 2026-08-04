'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { BrandWordmark } from '@/components/ui/BrandWordmark';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  MessageSquare,
  MapPin,
  Sparkles,
  Package,
  BookOpen,
  HelpCircle,
  Home,
  Star,
  Compass,
  Settings,
  Users,
  History,
  ChevronLeft,
  ChevronRight,
  Bell,
  Menu,
  Eye,
  ShieldCheck,
  User,
  LogOut,
  ExternalLink
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { AdminRole, ROLES } from '@/lib/rbac/roles';
import { hasModuleAccess } from '@/lib/rbac/permissions';
import { useCurrentAdminProfile } from '@/lib/hooks/useCurrentAdminProfile';
import { useAdminNotifications } from '@/lib/hooks/useAdminNotifications';
import { NotificationDrawer } from '@/components/admin/ui/NotificationDrawer';
import { DbTeamMember } from '@/lib/actions/teamActions';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const ALL_NAV_GROUPS: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { label: 'Enquiries', href: '/admin/enquiries', icon: MessageSquare, badge: 'Live' },
    ],
  },
  {
    title: 'Catalog',
    items: [
      { label: 'Destinations', href: '/admin/destinations', icon: MapPin },
      { label: 'Experiences', href: '/admin/experiences', icon: Sparkles },
      { label: 'Packages', href: '/admin/packages', icon: Package },
    ],
  },
  {
    title: 'Content CMS',
    items: [
      { label: 'Blogs & Guides', href: '/admin/blogs', icon: BookOpen },
      { label: 'FAQs', href: '/admin/faqs', icon: HelpCircle },
      { label: 'Homepage CMS', href: '/admin/homepage-cms', icon: Home },
      { label: 'Testimonials', href: '/admin/testimonials', icon: Star },
    ],
  },
  {
    title: 'Operations',
    items: [
      { label: 'Trip Tracker', href: '/admin/trip-tracker', icon: Compass },
    ],
  },
  {
    title: 'Governance',
    items: [
      { label: 'Team', href: '/admin/team', icon: Users },
      { label: 'Audit Logs', href: '/admin/audit-logs', icon: History },
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
];

/* ---- Admin Sidebar ---- */
function AdminSidebar({
  activeRole,
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: {
  activeRole: AdminRole;
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const filteredNavGroups = ALL_NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => hasModuleAccess(activeRole, item.href)),
  })).filter((group) => group.items.length > 0);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 border-r border-slate-800/80">
      {/* Logo */}
      <div
        className={clsx(
          'flex items-center gap-3 border-b border-slate-800/80 shrink-0',
          collapsed ? 'px-3 py-4 justify-center' : 'px-5 py-4'
        )}
      >
        <div className="w-8 h-8 rounded-xl overflow-hidden bg-white shadow-md shrink-0 p-0.5 border border-white/20">
          <Image src="/friendli/logo.svg" alt="Friendli Logo" width={32} height={32} className="w-full h-full object-contain" />
        </div>
        {!collapsed && (
          <BrandWordmark
            theme="dark"
            size="sm"
            badge={ROLES[activeRole]?.label.toUpperCase() || 'ADMIN'}
            badgePosition="below"
          />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-none py-4 px-3 space-y-6" aria-label="Admin navigation">
        {filteredNavGroups.map((group) => (
          <div key={group.title}>
            {!collapsed && (
              <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest px-3 mb-2">
                {group.title}
              </h4>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onMobileClose}
                      title={collapsed ? item.label : undefined}
                      className={clsx(
                        'flex items-center gap-3 rounded-xl transition-all duration-150 text-xs font-semibold',
                        collapsed ? 'p-2.5 justify-center' : 'px-3 py-2.5',
                        active
                          ? 'bg-brand-orange/15 text-brand-orange border border-brand-orange/30 font-bold shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                      )}
                    >
                      <item.icon className={clsx('w-4 h-4 shrink-0', active ? 'text-brand-orange' : 'text-slate-400')} />
                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.badge && (
                            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-brand-orange/20 text-brand-orange border border-brand-orange/30">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer Controls */}
      <div className="border-t border-slate-800/80 p-3 shrink-0 flex flex-col gap-2">
        <Link
          href={ROUTES.HOME}
          target="_blank"
          className={clsx(
            'flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors',
            collapsed && 'justify-center'
          )}
        >
          <Eye className="w-4 h-4 text-brand-orange" />
          {!collapsed && <span>View Public Site</span>}
        </Link>

        <button
          onClick={onToggle}
          className="hidden lg:flex w-full items-center justify-center gap-2 px-3 py-2 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-slate-900/60 transition-all text-xs font-bold"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span>Collapse Sidebar</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onMobileClose} />
          <div className="absolute inset-y-0 left-0 w-64 shadow-elevated z-50">
            {sidebarContent}
          </div>
        </div>
      )}

      <aside
        className={clsx(
          'hidden lg:flex flex-col shrink-0 transition-all duration-300',
          collapsed ? 'w-[64px]' : 'w-60'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

/* ---- Admin Header with Avatar Dropdown & Notifications ---- */
function AdminHeader({
  activeRole,
  profile,
  unreadCount,
  onOpenNotifications,
  onMobileMenuToggle,
}: {
  activeRole: AdminRole;
  profile: DbTeamMember | null;
  unreadCount: number;
  onOpenNotifications: () => void;
  onMobileMenuToggle: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const segments = pathname.replace('/admin', '').split('/').filter(Boolean);
  const pageTitle =
    segments.length > 0
      ? segments.map((s) => s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ')).join(' / ')
      : 'Dashboard Overview';

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore fallback
    }
    router.push('/');
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-6 shrink-0 text-slate-100 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="p-2 rounded-xl text-slate-400 hover:bg-slate-900 lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-mono">/admin</span>
          <span className="text-slate-700">/</span>
          <h1 className="text-sm font-bold text-white truncate">{pageTitle}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Static Role Badge */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-brand-orange shrink-0" />
          <span className="text-xs font-bold text-white tracking-wide">
            {ROLES[activeRole]?.label || 'Admin'}
          </span>
        </div>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 relative border border-slate-800 transition-colors"
          title="Open Notifications Drawer"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-brand-orange text-white text-[9px] font-extrabold shadow-sm">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Profile Avatar Dropdown Trigger */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white text-xs font-extrabold text-brand-orange uppercase hover:border-brand-orange transition-colors"
            title="Profile Menu"
          >
            {profile?.name ? profile.name.charAt(0).toUpperCase() : activeRole.charAt(0).toUpperCase()}
          </button>

          {/* Avatar Dropdown Popover */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-elevated p-3 z-50 text-slate-100 animate-fade-in">
              {/* Profile Brief */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center text-brand-orange text-xs font-extrabold">
                    {profile?.name ? profile.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-extrabold text-white truncate">{profile?.name || 'Admin User'}</h4>
                    <p className="text-[10px] text-slate-400 font-mono truncate">{profile?.email || 'admin@friendlitripz.com'}</p>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">Role:</span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-brand-orange/20 text-brand-orange border border-brand-orange/30 uppercase">
                    {ROLES[activeRole]?.label}
                  </span>
                </div>
              </div>

              {/* Menu Links */}
              <div className="space-y-1">
                <Link
                  href={`/admin/team/${profile?.id || 'usr-owner-001'}`}
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <User className="w-4 h-4 text-brand-orange" />
                  <span>My Profile</span>
                </Link>

                <Link
                  href="/"
                  target="_blank"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <ExternalLink className="w-4 h-4 text-blue-400" />
                    <span>Traveller Website</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-slate-500 font-mono">live</span>
                </Link>

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors border-t border-slate-800/80 mt-1 pt-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* ---- Admin Layout Wrapper ---- */
export function V3AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);

  const { profile, role } = useCurrentAdminProfile();
  const { notifications, unreadCount, refresh: refreshNotifs } = useAdminNotifications();

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden selection:bg-brand-orange selection:text-white">
      <AdminSidebar
        activeRole={role}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader
          activeRole={role}
          profile={profile}
          unreadCount={unreadCount}
          onOpenNotifications={() => setNotifDrawerOpen(true)}
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
        <main className="flex-1 overflow-y-auto scrollbar-thin p-6 md:p-8">
          {children}
        </main>
      </div>

      <NotificationDrawer
        isOpen={notifDrawerOpen}
        onClose={() => setNotifDrawerOpen(false)}
        notifications={notifications}
        onRefresh={refreshNotifs}
      />
    </div>
  );
}
