'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AdminLayout } from '@/components/admin/AdminLayout';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Standalone pages outside the main sidebar/header shell
  const isStandalonePage =
    pathname === '/admin/login' ||
    pathname === '/admin/set-password' ||
    pathname.startsWith('/admin/access-denied');

  if (isStandalonePage) {
    return <>{children}</>;
  }

  return <AdminLayout>{children}</AdminLayout>;
}
