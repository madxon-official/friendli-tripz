'use client';

import React, { Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShieldAlert, LogOut, ArrowLeft } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';

function AccessDeniedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reason = searchParams.get('reason') || '';

  const supabase = useMemo(() => createClient(), []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore auth error on signout
    }
    router.push('/admin/login');
    router.refresh();
  };

  let title = "Access Denied";
  let description = "You don't have access to Friendli Admin.";

  if (reason.includes('inactive')) {
    title = "Account Inactive";
    description = "Your Friendli Admin access is currently inactive. Please contact an Owner to reactivate your account.";
  } else if (reason.includes('forbidden') || reason.includes('permission')) {
    title = "Permission Restricted";
    description = "You do not have permission to access this area of Friendli Admin.";
  } else if (reason.includes('profile')) {
    title = "No Admin Profile";
    description = "You don't have an active Friendli Admin profile registered.";
  }

  return (
    <main className="min-h-screen bg-brand-navy flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10 max-w-md">
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-brand-border/40 space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-100 shadow-sm">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-brand-navy font-heading">
              {title}
            </h1>
            <p className="text-xs text-brand-muted leading-relaxed">
              {description}
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            {reason.includes('forbidden') && (
              <Button
                variant="outline"
                size="md"
                onClick={() => router.push('/admin')}
                icon={<ArrowLeft className="w-4 h-4" />}
                className="w-full justify-center"
              >
                Back to Dashboard
              </Button>
            )}

            <Button
              variant="primary"
              size="md"
              onClick={handleSignOut}
              icon={<LogOut className="w-4 h-4" />}
              className="w-full justify-center"
            >
              Sign Out
            </Button>
          </div>

          <div className="pt-3 border-t border-brand-border/40 flex items-center justify-center gap-2">
            <div className="relative w-5 h-5 rounded bg-white p-0.5 shrink-0 border border-brand-border/40">
              <Image
                src="/logo.jpeg"
                alt="Friendli Logo"
                width={20}
                height={20}
                className="object-cover rounded"
              />
            </div>
            <span className="text-[11px] font-bold text-brand-navy font-heading">
              Friendli Admin Security
            </span>
          </div>
        </div>
      </Container>
    </main>
  );
}

export default function AccessDeniedPage() {
  return (
    <Suspense>
      <AccessDeniedContent />
    </Suspense>
  );
}
