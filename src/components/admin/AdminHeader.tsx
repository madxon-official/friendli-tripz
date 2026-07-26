'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LayoutDashboard, Inbox, LogOut, Bell, ExternalLink, ChevronDown, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface AdminHeaderProps {
  newEnquiriesCount: number;
  adminName?: string;
  adminEmail?: string;
  notificationsEnabled?: boolean;
  onEnableNotifications?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  newEnquiriesCount,
  adminName = 'Admin',
  adminEmail = '',
  notificationsEnabled = false,
  onEnableNotifications,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        <div className="flex items-center gap-3">
          <span className="font-heading font-black text-base text-brand-navy">
            Friendli Operations
          </span>
          <span className="text-xs font-mono font-bold text-brand-orange bg-brand-soft-orange px-2.5 py-0.5 rounded-full">
            LIVE
          </span>
        </div>

        {/* Desktop Profile Dropdown & Controls */}
        <div className="flex items-center gap-4">
          {/* Enable Notifications button */}
          {onEnableNotifications && !notificationsEnabled && (
            <button
              onClick={onEnableNotifications}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-soft-navy text-brand-navy hover:bg-brand-soft-orange text-xs font-semibold transition-colors"
            >
              <Bell className="w-3.5 h-3.5 text-brand-orange" />
              <span>Notifications Off</span>
              <Sparkles className="w-3 h-3 text-brand-orange" />
            </button>
          )}

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-brand-warm transition-colors border border-brand-border/40 text-brand-navy text-xs font-bold font-heading"
            >
              <div className="w-7 h-7 rounded-full bg-brand-navy text-white flex items-center justify-center font-black text-xs">
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
                </div>

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
          {/* Brand Lockup */}
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

          {/* Mobile Actions & Toggle */}
          <div className="flex items-center gap-2">
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

              {onEnableNotifications && !notificationsEnabled && (
                <button
                  onClick={() => {
                    onEnableNotifications();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm text-slate-300 hover:bg-white/10 min-h-[44px]"
                >
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4 text-brand-orange" />
                    <span>Enable Notifications</span>
                  </div>
                  <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                </button>
              )}

              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm text-slate-300 hover:bg-white/10 min-h-[44px]"
              >
                <div className="flex items-center gap-3">
                  <ExternalLink className="w-4 h-4 text-brand-orange" />
                  <span>Open Customer Website</span>
                </div>
                <span>↗</span>
              </Link>
            </nav>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-300 font-semibold">{adminName}</span>
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
