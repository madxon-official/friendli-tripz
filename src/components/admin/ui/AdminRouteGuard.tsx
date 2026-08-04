'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { AdminRole, ROLES } from '@/lib/rbac/roles';
import { hasModuleAccess } from '@/lib/rbac/permissions';
import { ROUTES } from '@/lib/routes';

interface AdminRouteGuardProps {
  children: React.ReactNode;
  modulePath?: string;
}

export const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({ children, modulePath }) => {
  const pathname = usePathname();
  const targetPath = modulePath || pathname;

  const [activeRole, setActiveRole] = useState<AdminRole>('owner');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('ft_admin_role');
    if (saved && (saved === 'owner' || saved === 'admin' || saved === 'operations' || saved === 'support')) {
      setActiveRole(saved as AdminRole);
    }
  }, [pathname]);

  if (!mounted) return null;

  const isAllowed = hasModuleAccess(activeRole, targetPath);

  if (!isAllowed) {
    return (
      <div className="bg-slate-950 text-slate-100 min-h-[70vh] flex items-center justify-center p-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-elevated">
          <div className="w-14 h-14 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-400 flex items-center justify-center mx-auto shadow-glow">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-widest block mb-1">
              Access Restricted
            </span>
            <h2 className="text-2xl font-extrabold text-white">Insufficient Permissions</h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Your active role <strong className="text-white">"{ROLES[activeRole].label}"</strong> does not have permission to access module <code className="text-brand-orange font-mono">{targetPath}</code>.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-center gap-3">
            <Link
              href="/admin"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" /> Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
