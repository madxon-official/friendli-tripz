'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Inbox, Users, LogOut, Bell, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { AdminRole, getRoleLabel } from '@/lib/auth/roles';
import { hasPermission } from '@/lib/auth/permissions';

interface AdminSidebarProps {
  newEnquiriesCount: number;
  adminName?: string;
  adminEmail?: string;
  adminRole?: AdminRole | string;
  notificationsEnabled?: boolean;
  onEnableNotifications?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  newEnquiriesCount,
  adminName = 'Friendli Admin',
  adminEmail = '',
  adminRole = 'operations',
  notificationsEnabled = false,
  onEnableNotifications,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore auth errors on logout
    }
    router.push('/admin/login');
    router.refresh();
  };

  const showTeamLink = hasPermission(adminRole, 'team.view');

  const navItems = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      active: pathname === '/admin',
    },
    {
      label: 'Enquiries',
      href: '/admin/enquiries',
      icon: Inbox,
      active: pathname.startsWith('/admin/enquiries'),
      badge: newEnquiriesCount > 0 ? newEnquiriesCount : null,
    },
  ];

  if (showTeamLink) {
    navItems.push({
      label: 'Team',
      href: '/admin/team',
      icon: Users,
      active: pathname.startsWith('/admin/team'),
      badge: null,
    });
  }

  const roleLabel = getRoleLabel(adminRole);

  return (
    <div className="w-full bg-brand-navy text-white flex flex-col justify-between h-screen sticky top-0 border-r border-white/10 z-30">
      <div>
        {/* Logo Lockup */}
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-white p-0.5 shrink-0">
            <Image
              src="/logo.jpeg"
              alt="Friendli Logo"
              width={32}
              height={32}
              className="object-cover rounded-md"
            />
          </div>
          <div>
            <span className="font-heading font-black text-lg tracking-tight text-white block leading-none">
              Friendli Admin
            </span>
            <span className="text-[10px] font-bold text-brand-orange uppercase tracking-wider font-mono">
              {roleLabel}
            </span>
          </div>
        </div>

        {/* Navigation Item List */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl font-semibold text-sm transition-colors ${
                  item.active
                    ? 'bg-brand-orange text-white shadow-button'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 text-xs font-black rounded-full font-mono ${
                      item.active
                        ? 'bg-white text-brand-orange'
                        : 'bg-brand-orange text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer & Admin Profile */}
      <div className="p-4 border-t border-white/10 space-y-3">
        {/* Enable Notifications Trigger */}
        {onEnableNotifications && !notificationsEnabled && (
          <button
            onClick={onEnableNotifications}
            className="w-full p-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-slate-200 flex items-center justify-between transition-colors min-h-[44px]"
          >
            <div className="flex items-center gap-2">
              <Bell className="w-3.5 h-3.5 text-brand-orange" />
              <span>Enable Notifications</span>
            </div>
            <Sparkles className="w-3 h-3 text-brand-orange" />
          </button>
        )}

        {/* Admin Info & Logout */}
        <div className="flex items-center justify-between pt-2">
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
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
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
