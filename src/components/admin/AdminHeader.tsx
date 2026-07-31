'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  LayoutDashboard,
  Inbox,
  Users,
  LogOut,
  Bell,
  ExternalLink,
  ChevronDown,
  Sparkles,
  CheckCheck,
  Search,
  Calendar,
  Clock,
  Car,
  Package,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { AdminRole, getRoleLabel } from '@/lib/rbac/roles';
import { hasPermission } from '@/lib/rbac/permissions';

export interface AdminNotification {
  id: string;
  title: string;
  body: string;
  type: string;
  link?: string | null;
  is_read: boolean;
  created_at: string;
}

interface AdminHeaderProps {
  newEnquiriesCount: number;
  adminName?: string;
  adminEmail?: string;
  adminRole?: AdminRole | string;
  notificationsEnabled?: boolean;
  onEnableNotifications?: () => void;
  onOpenSearch?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  newEnquiriesCount,
  adminName = 'Admin',
  adminEmail = '',
  adminRole = 'operations',
  notificationsEnabled = false,
  onEnableNotifications,
  onOpenSearch,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Notification drawer state
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const pathname = usePathname();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const showTeamLink = hasPermission(adminRole, 'team.view');
  const roleLabel = getRoleLabel(adminRole);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/admin/notifications');
      const data = await res.json();
      if (res.ok && data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Supabase Realtime Listener for new notifications
    const channelName = `admin-notifications-header-${Math.random().toString(36).substring(2, 9)}`;
    const channel = supabase.channel(channelName);

    channel
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'admin_notifications' },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifDrawerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = async () => {
    try {
      await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true }),
      });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch {
      // ignore
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore auth errors on logout
    }
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <>
      {/* Desktop Top Header Bar (lg:flex) */}
      <header className="hidden lg:flex items-center justify-between px-8 py-3.5 bg-white border-b border-brand-border/60 sticky top-0 z-20 shadow-sm w-full">
        {/* Left Section: Brand & Quick Search Bar */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="font-heading font-black text-base text-brand-navy">
              Friendli Operations
            </span>
            <span className="text-xs font-mono font-bold text-brand-orange bg-brand-soft-orange px-2.5 py-0.5 rounded-full uppercase">
              {roleLabel}
            </span>
          </div>

          {/* Quick Universal Search Trigger */}
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-100/80 hover:bg-slate-200/80 text-slate-500 text-xs font-semibold transition-all border border-slate-200/60 w-64 md:w-80 justify-between group"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-brand-orange group-hover:scale-110 transition-transform" />
                <span>Search bookings, drivers, packages...</span>
              </div>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-400 bg-white rounded border border-slate-200">
                ⌘K
              </kbd>
            </button>
          )}
        </div>

        {/* Right Section: Notification Bell & Profile Dropdown */}
        <div className="flex items-center gap-4">
          {/* Notification Bell with Badge & Drawer */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifDrawerOpen(!notifDrawerOpen)}
              className="relative p-2 rounded-xl hover:bg-brand-warm transition-colors border border-brand-border/40 text-brand-navy min-h-[40px] min-w-[40px] flex items-center justify-center"
              title="Admin Notifications"
            >
              <Bell className="w-4 h-4 text-brand-navy" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-orange text-white text-[10px] font-black rounded-full flex items-center justify-center font-mono">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {notifDrawerOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-brand-border/60 py-3 z-50 animate-fadeIn text-xs space-y-2">
                <div className="px-4 pb-2 border-b border-brand-border/40 flex items-center justify-between">
                  <span className="font-bold text-brand-navy font-heading text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[11px] text-brand-orange font-bold hover:underline flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark all read</span>
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-brand-border/30 px-2 space-y-1">
                  {notifications.length === 0 ? (
                    <p className="text-center py-6 text-brand-muted text-xs">No notifications yet.</p>
                  ) : (
                    notifications.map((n) => (
                      <Link
                        key={n.id}
                        href={n.link || '/admin'}
                        onClick={() => setNotifDrawerOpen(false)}
                        className={`block p-3 rounded-xl transition-colors ${
                          n.is_read ? 'hover:bg-brand-warm/60' : 'bg-brand-soft-orange/30 font-bold'
                        }`}
                      >
                        <div className="text-brand-navy font-heading font-bold">{n.title}</div>
                        <div className="text-brand-muted text-[11px] mt-0.5">{n.body}</div>
                        <div className="text-[10px] text-brand-muted font-mono mt-1">
                          {new Date(n.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-brand-warm transition-colors border border-brand-border/40 text-brand-navy text-xs font-bold font-heading"
            >
              <div className="w-7 h-7 rounded-full bg-brand-navy text-white flex items-center justify-center font-black text-xs uppercase">
                {adminName.charAt(0)}
              </div>
              <span>{adminName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-brand-muted" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-brand-border/60 py-2 z-50 animate-fadeIn text-xs space-y-1">
                <div className="px-4 py-2 border-b border-brand-border/40">
                  <span className="font-bold text-brand-navy block truncate font-heading">{adminName}</span>
                  {adminEmail && <span className="text-brand-muted block truncate">{adminEmail}</span>}
                  <span className="inline-block mt-1 text-[10px] font-mono font-bold text-brand-orange bg-brand-soft-orange px-2 py-0.5 rounded uppercase">
                    {roleLabel}
                  </span>
                </div>

                {showTeamLink && (
                  <Link
                    href="/admin/team"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-brand-navy hover:bg-brand-soft-navy font-semibold transition-colors"
                  >
                    <Users className="w-3.5 h-3.5 text-brand-orange" />
                    <span>Manage Team</span>
                  </Link>
                )}

                <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center justify-between px-4 py-2.5 text-brand-navy hover:bg-brand-soft-navy font-semibold transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-3.5 h-3.5 text-brand-orange" />
                    <span>Open Customer Website</span>
                  </div>
                  <span className="text-[10px] text-brand-muted font-mono">↗</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 font-bold transition-colors border-t border-brand-border/40"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Top Header (lg:hidden) */}
      <header className="bg-brand-navy text-white lg:hidden sticky top-0 z-30 border-b border-brand-navy-light/20 w-full">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="relative w-7 h-7 rounded bg-white p-0.5 shrink-0">
              <Image
                src="/logo.jpeg"
                alt="Friendli Logo"
                width={28}
                height={28}
                className="object-cover rounded"
              />
            </div>
            <span className="font-heading font-extrabold text-base tracking-tight text-white">
              Friendli Admin
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                className="p-2 rounded-lg text-slate-300 hover:bg-white/10"
                aria-label="Search"
              >
                <Search className="w-4 h-4 text-brand-orange" />
              </button>
            )}
            {newEnquiriesCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-brand-orange text-white font-mono">
                {newEnquiriesCount} NEW
              </span>
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg text-white hover:bg-white/10 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle admin menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {menuOpen && (
          <div className="p-4 bg-brand-navy-dark border-t border-white/10 space-y-3">
            <nav className="space-y-1">
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm min-h-[44px] ${
                  pathname === '/admin' ? 'bg-brand-orange text-white' : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </div>
              </Link>

              <Link
                href="/admin/bookings"
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm min-h-[44px] ${
                  pathname.startsWith('/admin/bookings') ? 'bg-brand-orange text-white' : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4" />
                  <span>Bookings</span>
                </div>
              </Link>

              <Link
                href="/admin/arrivals"
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm min-h-[44px] ${
                  pathname.startsWith('/admin/arrivals') ? 'bg-brand-orange text-white' : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4" />
                  <span>Arrivals</span>
                </div>
              </Link>

              <Link
                href="/admin/operations"
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm min-h-[44px] ${
                  pathname.startsWith('/admin/operations') ? 'bg-brand-orange text-white' : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Car className="w-4 h-4" />
                  <span>Fleet & Drivers</span>
                </div>
              </Link>

              <Link
                href="/admin/enquiries"
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm min-h-[44px] ${
                  pathname.startsWith('/admin/enquiries') ? 'bg-brand-orange text-white' : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Inbox className="w-4 h-4" />
                  <span>Enquiries</span>
                </div>
                {newEnquiriesCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-black bg-white text-brand-orange rounded-full font-mono">
                    {newEnquiriesCount}
                  </span>
                )}
              </Link>
            </nav>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-300 font-semibold block">{adminName}</span>
                <span className="text-[10px] text-brand-orange font-mono uppercase font-bold">{roleLabel}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-xs font-bold text-red-300 hover:text-white rounded-lg hover:bg-red-500/20 flex items-center gap-1.5 min-h-[44px]"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
