'use client';

import React, { useMemo, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Car,
  Users,
  Inbox,
  Package,
  MapPin,
  Mountain,
  Building2,
  BarChart3,
  ShieldCheck,
  Key,
  LogOut,
  Bell,
  Sparkles,
  Compass,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { AdminRole, getRoleLabel } from '@/lib/rbac/roles';
import { hasPermission, Permission } from '@/lib/rbac/permissions';

interface AdminSidebarProps {
  newEnquiriesCount: number;
  adminName?: string;
  adminEmail?: string;
  adminRole?: AdminRole | string;
  notificationsEnabled?: boolean;
  onEnableNotifications?: () => void;
  onOpenSearch?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  newEnquiriesCount,
  adminName = 'Friendli Admin',
  adminEmail = '',
  adminRole = 'operations',
  notificationsEnabled = false,
  onEnableNotifications,
  onOpenSearch,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  // Clear optimistic click highlight when pathname actually changes
  useEffect(() => {
    setPendingHref(null);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }
    router.push('/admin/login');
    router.refresh();
  };

  // Keyboard shortcut listener for section jump shortcuts
  useEffect(() => {
    let keyBuffer: string[] = [];
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      keyBuffer.push(e.key.toLowerCase());
      if (keyBuffer.length > 2) keyBuffer.shift();

      const combo = keyBuffer.join('');
      if (combo === 'gd') router.push('/admin');
      if (combo === 'gb') router.push('/admin/bookings');
      if (combo === 'ga') router.push('/admin/arrivals');
      if (combo === 'gc') router.push('/admin/calendar');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  // Section 1: Operations
  const operationsItems: {
    label: string;
    href: string;
    icon: React.ElementType;
    badge?: number | null;
    exact?: boolean;
    permission?: Permission;
  }[] = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Bookings', href: '/admin/bookings', icon: Calendar },
    { label: 'Calendar', href: '/admin/calendar', icon: Compass },
    { label: 'Arrivals', href: '/admin/arrivals', icon: Clock },
    { label: 'Departures', href: '/admin/departures', icon: Compass },
    { label: 'Fleet & Drivers', href: '/admin/operations', icon: Car },
    {
      label: 'Travellers & Enquiries',
      href: '/admin/enquiries',
      icon: Inbox,
      badge: newEnquiriesCount > 0 ? newEnquiriesCount : null,
    },
  ];

  // Section 2: Business
  const businessItems: {
    label: string;
    href: string;
    icon: React.ElementType;
    badge?: number | null;
    exact?: boolean;
    permission?: Permission;
  }[] = [
    { label: 'Packages', href: '/admin/packages', icon: Package, permission: 'destination.view' },
    { label: 'Destinations', href: '/admin/destinations', icon: MapPin, permission: 'destination.view' },
    { label: 'Attractions', href: '/admin/attractions', icon: Mountain, permission: 'destination.view' },
    { label: 'Hotels & Partners', href: '/admin/crm', icon: Building2, permission: 'destination.view' },
  ];

  // Section 3: Administration
  const adminItems: {
    label: string;
    href: string;
    icon: React.ElementType;
    badge?: number | null;
    exact?: boolean;
    permission?: Permission;
  }[] = [
    { label: 'Team & Roles', href: '/admin/team', icon: Users, permission: 'team.view' },
    { label: 'BI & Analytics', href: '/admin/analytics', icon: BarChart3, permission: 'dashboard.view' },
    { label: 'Security', href: '/admin/security', icon: ShieldCheck, permission: 'team.view' },
    { label: 'API Keys', href: '/admin/api-keys', icon: Key, permission: 'team.view' },
  ];

  const roleLabel = getRoleLabel(adminRole);

  const renderNavLink = (item: {
    label: string;
    href: string;
    icon: React.ElementType;
    badge?: number | null;
    exact?: boolean;
    permission?: Permission;
  }) => {
    if (item.permission && !hasPermission(adminRole, item.permission)) return null;

    const currentCheck = pendingHref || pathname;
    const isActive = item.exact ? currentCheck === item.href : currentCheck.startsWith(item.href);
    const Icon = item.icon;

    return (
      <Link
        key={item.label}
        href={item.href}
        prefetch={true}
        onClick={() => setPendingHref(item.href)}
        className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-semibold text-xs sm:text-sm transition-all ${
          isActive
            ? 'bg-brand-orange text-white shadow-button font-bold scale-[1.01]'
            : 'text-slate-300 hover:bg-white/10 hover:text-white'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
          <span>{item.label}</span>
        </div>
        {item.badge !== null && item.badge !== undefined && (
          <span
            className={`px-2 py-0.5 text-[11px] font-black rounded-full font-mono ${
              isActive ? 'bg-white text-brand-orange' : 'bg-brand-orange text-white'
            }`}
          >
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="w-full bg-brand-navy text-white flex flex-col justify-between h-screen sticky top-0 border-r border-white/10 z-30 overflow-y-auto">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-white p-0.5 shrink-0 shadow-md">
              <Image
                src="/logo.jpeg"
                alt="Friendli Logo"
                width={36}
                height={36}
                className="object-cover rounded-lg"
              />
            </div>
            <div>
              <span className="font-heading font-black text-base tracking-tight text-white block leading-none">
                Friendli Tripz
              </span>
              <span className="text-[10px] font-bold text-brand-orange uppercase tracking-wider font-mono">
                {roleLabel}
              </span>
            </div>
          </div>

          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
              title="Search (Ctrl+K)"
            >
              <kbd className="text-[10px] font-mono font-bold text-brand-orange">⌘K</kbd>
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <nav className="p-4 space-y-6">
          {/* Operations Section */}
          <div className="space-y-1">
            <div className="px-3.5 pb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-mono flex items-center justify-between">
              <span>Operations</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-brand-orange/20 text-brand-orange border border-brand-orange/30 font-bold">
                Live Queues
              </span>
            </div>
            {operationsItems.map((item) => renderNavLink(item))}
          </div>

          {/* Business Section */}
          <div className="space-y-1">
            <div className="px-3.5 pb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-mono">
              Business & Catalog
            </div>
            {businessItems.map((item) => renderNavLink(item))}
          </div>

          {/* Administration Section */}
          <div className="space-y-1">
            <div className="px-3.5 pb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-mono">
              Administration
            </div>
            {adminItems.map((item) => renderNavLink(item))}
          </div>
        </nav>
      </div>

      {/* Footer Profile & Notifications */}
      <div className="p-4 border-t border-white/10 space-y-3 bg-brand-navy/90 backdrop-blur-sm">
        {onEnableNotifications && !notificationsEnabled && (
          <button
            onClick={onEnableNotifications}
            className="w-full p-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-slate-200 flex items-center justify-between transition-colors min-h-[44px]"
          >
            <div className="flex items-center gap-2">
              <Bell className="w-3.5 h-3.5 text-brand-orange" />
              <span>Enable Notifications</span>
            </div>
            <Sparkles className="w-3 h-3 text-brand-orange animate-pulse" />
          </button>
        )}

        <div className="flex items-center justify-between pt-1">
          <div className="min-w-0 pr-2">
            <span className="block text-xs font-bold text-white truncate font-heading">
              {adminName}
            </span>
            {adminEmail && (
              <span className="block text-[11px] text-slate-400 truncate">
                {adminEmail}
              </span>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
