'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Shield, Lock, Mail, AlertCircle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { BrandWordmark } from '@/components/ui/BrandWordmark';
import { createClient } from '@/lib/supabase/client';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const messageParam = searchParams.get('message');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError || !authData.user) {
        throw new Error('Invalid email or password.');
      }

      // 2. Verify active admin profile
      const { data: profile, error: profileError } = await supabase
        .from('admin_profiles')
        .select('is_active, role, full_name')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profile || !profile.is_active) {
        // Sign out unprivileged user
        await supabase.auth.signOut();
        throw new Error('Access Denied: You do not have active admin permissions.');
      }

      // Successful Admin Login
      router.push('/admin');
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-brand-border/40 space-y-6">
      {/* Header Lockup */}
      <div className="text-center space-y-3">
        <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-md mx-auto border border-brand-navy/10 flex items-center justify-center bg-white p-1">
          <Image
            src="/friendli/logo.svg"
            alt="Friendli Logo"
            width={56}
            height={56}
            className="w-full h-full object-contain rounded-xl"
          />
        </div>
        <div className="flex flex-col items-center justify-center pt-1">
          <BrandWordmark
            theme="light"
            size="lg"
            badge="ADMIN"
            badgePosition="inline"
          />
          <p className="text-xs font-semibold text-brand-muted mt-2">
            Internal Operations Portal
          </p>
        </div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        {messageParam === 'account_ready' && !error && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span>Your account is ready. Sign in with your new password.</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1.5 font-mono">
            Admin Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              placeholder="admin@friendlitripz.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-brand-border focus:border-brand-orange focus:ring-1 focus:ring-brand-orange text-sm font-medium text-brand-navy outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1.5 font-mono">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-brand-border focus:border-brand-orange focus:ring-1 focus:ring-brand-orange text-sm font-medium text-brand-navy outline-none"
            />
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={loading}
            className="w-full justify-center"
            icon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
          >
            {loading ? 'Authenticating...' : 'Sign In to Admin'}
          </Button>
        </div>
      </form>

      {/* Security Reassurance Note */}
      <div className="pt-2 border-t border-brand-border/50 text-center text-xs text-brand-muted flex items-center justify-center gap-1.5">
        <Shield className="w-3.5 h-3.5 text-brand-orange shrink-0" />
        <span>Protected Admin Access · Invitation Only</span>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-brand-navy flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Accent glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10 max-w-md">
        <Suspense>
          <AdminLoginForm />
        </Suspense>
      </Container>
    </main>
  );
}
