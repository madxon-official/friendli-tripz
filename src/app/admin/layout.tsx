'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { V3AdminLayout } from '@/components/v3/admin/AdminLayout';

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

  return <V3AdminLayout>{children}</V3AdminLayout>;
}
