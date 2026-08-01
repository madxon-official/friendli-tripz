'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import {
  LayoutDashboard, MessageSquare, Package, MapPin, FileText, Settings,
  ChevronLeft, ChevronRight, Users, BarChart3, Calendar, CreditCard,
  Globe, BookOpen, HelpCircle, LogOut, Bell, Search, Menu,
  X, Truck, ClipboardList,
} from 'lucide-react';

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

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { label: 'Enquiries', href: '/admin/enquiries', icon: MessageSquare, badge: '12' },
    ],
  },
  {
    title: 'Trip Management',
    items: [
      { label: 'Packages', href: '/admin/packages', icon: Package },
      { label: 'Departures', href: '/admin/departures', icon: Calendar },
      { label: 'Bookings', href: '/admin/bookings', icon: ClipboardList },
      { label: 'Destinations', href: '/admin/destinations', icon: MapPin },
    ],
  },
  {
    title: 'Operations',
    items: [
      { label: 'Vehicle Dispatch', href: '/admin/operations/vehicle-dispatch', icon: Truck },
      { label: 'Accommodation', href: '/admin/operations/accommodation', icon: Globe },
      { label: 'Payments', href: '/admin/payments', icon: CreditCard },
    ],
  },
  {
    title: 'Content',
    items: [
      { label: 'Blog Posts', href: '/admin/blogs', icon: BookOpen },
      { label: 'Pages', href: '/admin/pages', icon: FileText },
      { label: 'Gallery', href: '/admin/gallery', icon: Globe },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Team', href: '/admin/team', icon: Users },
      { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
];

/* ---- Admin Sidebar ---- */
function AdminSidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: {
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

  const sidebarContent = (
    <div className="flex flex-col h-full bg-surface-950 text-white">
      {/* Logo */}
      <div className={clsx(
        'flex items-center gap-3 border-b border-white/5 shrink-0',
        collapsed ? 'px-3 py-4 justify-center' : 'px-5 py-4'
      )}>
        <div className="w-9 h-9 rounded-lg overflow-hidden bg-white shadow-md shrink-0">
          <Image src="/logo.jpeg" alt="" width={36} height={36} className="w-full h-full object-cover" />
        </div>
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="font-heading font-extrabold text-sm text-white leading-none truncate">
              Friendli Tripz
            </span>
            <span className="text-[8px] font-extrabold text-brand-orange uppercase tracking-wider">
              Admin Panel
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2 space-y-5" aria-label="Admin navigation">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            {!collapsed && (
              <h4 className="text-[9px] font-extrabold text-white/30 uppercase tracking-[0.12em] px-3 mb-2">
                {group.title}
              </h4>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onMobileClose}
                      title={collapsed ? item.label : undefined}
                      className={clsx(
                        'flex items-center gap-3 rounded-button transition-all duration-200',
                        collapsed ? 'p-2.5 justify-center' : 'px-3 py-2',
                        active
                          ? 'bg-brand-orange/10 text-brand-orange'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      )}
                    >
                      <item.icon className="w-[18px] h-[18px] shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="text-[13px] font-bold flex-1 truncate">{item.label}</span>
                          {item.badge && (
                            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-badge bg-brand-orange/20 text-brand-orange min-w-[20px] text-center">
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

      {/* Collapse toggle (desktop) */}
      <div className="hidden lg:block border-t border-white/5 p-2 shrink-0">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-button text-white/40 hover:text-white hover:bg-white/5 transition-all text-caption"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span className="text-[11px] font-bold">Collapse</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          <div className="absolute inset-y-0 left-0 w-64 shadow-elevated z-50">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={clsx(
          'hidden lg:flex flex-col shrink-0 border-r border-white/5 transition-all duration-300',
          collapsed ? 'w-[60px]' : 'w-60'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

/* ---- Admin Header ---- */
function AdminHeader({
  onMobileMenuToggle,
}: {
  onMobileMenuToggle: () => void;
}) {
  const pathname = usePathname();

  // Derive page title from pathname
  const segments = pathname.replace('/admin', '').split('/').filter(Boolean);
  const pageTitle = segments.length > 0
    ? segments.map((s) => s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ')).join(' / ')
    : 'Dashboard';

  return (
    <header className="h-14 border-b border-surface-200/60 bg-white flex items-center justify-between px-4 sm:px-6 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="p-2 rounded-button text-brand-muted hover:bg-surface-100 lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-body-sm font-heading font-bold text-brand-navy truncate">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <button className="p-2 rounded-button text-brand-muted hover:bg-surface-100 hidden sm:flex">
          <Search className="w-4 h-4" />
        </button>
        {/* Notifications */}
        <button className="p-2 rounded-button text-brand-muted hover:bg-surface-100 relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-orange" />
        </button>
        {/* Profile */}
        <div className="w-8 h-8 rounded-full bg-brand-navy flex items-center justify-center text-white text-caption font-extrabold ml-1">
          A
        </div>
      </div>
    </header>
  );
}

/* ---- Admin Layout Wrapper ---- */
export function V3AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-surface-50 overflow-hidden">
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1 overflow-y-auto scrollbar-thin p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
