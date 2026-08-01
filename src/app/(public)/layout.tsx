import React from 'react';
import { V3Navbar } from '@/components/v3/layout/Navbar';
import { V3Footer } from '@/components/v3/layout/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <V3Navbar />
      <div className="flex-1">{children}</div>
      <V3Footer />
    </>
  );
}
