'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { createClient } from '@/lib/supabase/client';
import { X, ArrowRight } from 'lucide-react';
import { AdminRole } from '@/lib/auth/roles';
import { CommandPalette } from '@/components/ui/CommandPalette';

interface AdminLayoutProps {
  children: React.ReactNode;
  initialNewCount?: number;
  adminName?: string;
  adminEmail?: string;
  adminRole?: AdminRole | string;
}

interface ToastNotification {
  id: string;
  reference: string;
  name: string;
  travellerCount: number;
  destination: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  initialNewCount = 0,
  adminName = 'Admin',
  adminEmail = '',
  adminRole = 'operations',
}) => {
  const pathname = usePathname();
  const [newCount, setNewCount] = useState<number>(initialNewCount);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastNotification | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Memoize Supabase browser client to avoid recreating instance on every re-render
  const supabase = useMemo(() => createClient(), []);

  const [profileState, setProfileState] = useState<{
    name: string;
    email: string;
    role: AdminRole | string;
  }>({
    name: adminName,
    email: adminEmail,
    role: adminRole,
  });

  // Top progress bar effect on route change
  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 250);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Sync profileState if props change
  useEffect(() => {
    if (adminName !== 'Admin' || adminEmail || adminRole !== 'operations') {
      setProfileState({
        name: adminName,
        email: adminEmail,
        role: adminRole,
      });
    }
  }, [adminName, adminEmail, adminRole]);

  // Dynamically load authenticated user's actual profile & role from Supabase
  useEffect(() => {
    async function syncAdminProfile() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: prof } = await supabase
            .from('admin_profiles')
            .select('full_name, role')
            .eq('id', session.user.id)
            .single();

          if (prof) {
            setProfileState({
              name: prof.full_name || 'Admin',
              email: session.user.email || '',
              role: prof.role || 'operations',
            });
          }
        }
      } catch {
        // ignore error
      }
    }

    syncAdminProfile();
  }, [supabase]);

  // Fetch current new active enquiry count from Supabase
  const fetchNewCount = useCallback(async () => {
    try {
      const { count, error } = await supabase
        .from('enquiries')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new')
        .is('archived_at', null);

      if (!error && count !== null) {
        setNewCount(count);
      }
    } catch {
      // Supabase fetch failed or count query ignored
    }
  }, [supabase]);

  // Request browser notification permission on user action
  const handleEnableNotifications = async () => {
    try {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setNotificationsEnabled(true);
        }
      }
    } catch (err) {
      console.warn('Browser notification permission error:', err);
    }
  };

  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (
        event.reason &&
        (event.reason instanceof Event ||
          Object.prototype.toString.call(event.reason) === '[object Event]')
      ) {
        event.preventDefault();
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    fetchNewCount();

    if (
      typeof window !== 'undefined' &&
      'Notification' in window &&
      Notification.permission === 'granted'
    ) {
      setNotificationsEnabled(true);
    }

    const channelName = `admin_realtime_enquiries_${Math.random().toString(36).substring(2, 9)}`;
    const channel = supabase.channel(channelName);

    channel
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'enquiries',
        },
        (payload) => {
          const newEnquiry = payload.new;

          setNewCount((prev) => prev + 1);

          setToast({
            id: newEnquiry.id,
            reference: newEnquiry.reference || 'FT-KOD-NEW',
            name: newEnquiry.name || 'New Traveller',
            travellerCount: newEnquiry.traveller_count || 1,
            destination: newEnquiry.destination || 'Kodaikanal',
          });

          try {
            if ('Notification' in window && Notification.permission === 'granted') {
              const notif = new Notification('Friendli Tripz — New Enquiry!', {
                body: `${newEnquiry.name || 'Traveller'} · ${newEnquiry.traveller_count || 1} travellers · ${newEnquiry.destination || 'Kodaikanal'}`,
                icon: '/logo.jpeg',
                tag: newEnquiry.id,
              });

              notif.onclick = () => {
                window.focus();
                window.location.href = `/admin/enquiries/${newEnquiry.id}`;
              };
            }
          } catch (err) {
            console.warn('Notification error:', err);
          }
        }
      )
      .subscribe((status, err) => {
        if (err || status === 'CHANNEL_ERROR') {
          console.warn('Realtime channel status:', status, err);
        }
      });

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      supabase.removeChannel(channel);
    };
  }, [fetchNewCount, supabase]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans relative">
      {/* Top Instant Navigation Progress Loading Bar */}
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-brand-orange z-50 animate-pulse transition-all" />
      )}

      {/* Universal Cmd+K Search Modal */}
      <CommandPalette />

      {/* Persistent Desktop Sidebar Column */}
      <aside className="hidden lg:block w-64 lg:w-72 shrink-0">
        <AdminSidebar
          newEnquiriesCount={newCount}
          adminName={profileState.name}
          adminEmail={profileState.email}
          adminRole={profileState.role}
          notificationsEnabled={notificationsEnabled}
          onEnableNotifications={handleEnableNotifications}
          onOpenSearch={() => setSearchOpen(true)}
        />
      </aside>

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <AdminHeader
          newEnquiriesCount={newCount}
          adminName={profileState.name}
          adminEmail={profileState.email}
          adminRole={profileState.role}
          notificationsEnabled={notificationsEnabled}
          onEnableNotifications={handleEnableNotifications}
          onOpenSearch={() => setSearchOpen(true)}
        />

        {/* Inner Page Content Area */}
        <main className="flex-1 p-4 sm:p-8 max-w-[1400px] w-full mx-auto space-y-6">
          {children}
        </main>
      </div>

      {/* In-App Realtime Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-brand-navy text-white p-4 rounded-2xl shadow-2xl border border-brand-orange/30 animate-slide-up">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-orange animate-ping" />
              <span className="text-xs font-mono font-bold uppercase text-brand-orange tracking-wider">
                NEW ENQUIRY
              </span>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-2 space-y-1">
            <p className="font-heading font-bold text-base text-white">
              {toast.name}
            </p>
            <p className="text-xs text-slate-300">
              {toast.destination} · {toast.travellerCount} travellers · {toast.reference}
            </p>
          </div>

          <div className="mt-3 pt-2 border-t border-white/10 text-right">
            <Link
              href={`/admin/enquiries/${toast.id}`}
              onClick={() => setToast(null)}
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-orange hover:underline"
            >
              <span>View Enquiry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
