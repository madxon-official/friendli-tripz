'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, KeyRound } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';

export default function SetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    // Check if user has an active session from the invitation link
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          setHasSession(true);
        } else {
          // Listen for token recovery/invite auth event
          const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, currentSession) => {
              if (currentSession) {
                setHasSession(true);
              }
            }
          );

          // Grace period for Supabase SSR auth exchange
          setTimeout(async () => {
            const {
              data: { session: recheckSession },
            } = await supabase.auth.getSession();
            if (recheckSession) {
              setHasSession(true);
            }
            setCheckingSession(false);
          }, 1000);

          return () => {
            authListener.subscription.unsubscribe();
          };
        }
      } catch (err) {
        console.warn('Session check error:', err);
      } finally {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, [supabase]);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Client validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please check and try again.');
      return;
    }

    setSubmitting(true);

    try {
      // Update password via Supabase Auth
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        throw updateError;
      }

      setSuccessMessage('Password created successfully.');

      // Sign out and redirect to /admin/login with message (Option B from spec)
      setTimeout(async () => {
        try {
          await supabase.auth.signOut();
        } catch {
          // ignore signout errors
        }
        router.push('/admin/login?message=account_ready');
        router.refresh();
      }, 1500);
    } catch (err: any) {
      console.error('Password update failed:', err);
      setError(err.message || 'Failed to update password. Your invitation link may have expired.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-brand-navy flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10 max-w-md">
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-brand-border/40 space-y-6">
          {/* Header Lockup */}
          <div className="text-center space-y-3">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-md mx-auto border border-brand-navy/10 flex items-center justify-center bg-white p-0.5">
              <Image
                src="/logo.jpeg"
                alt="Friendli Logo"
                width={48}
                height={48}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div>
              <h1 className="text-2xl font-black text-brand-navy font-heading">
                Welcome to Friendli Tripz
              </h1>
              <p className="text-xs font-semibold text-brand-muted mt-1">
                Set your password to finish setting up your admin account.
              </p>
            </div>
          </div>

          {checkingSession ? (
            <div className="py-8 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-brand-orange animate-spin mx-auto" />
              <p className="text-xs text-brand-muted font-medium">Validating invitation link...</p>
            </div>
          ) : (
            <form onSubmit={handleSetPassword} className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                  <div>
                    <p className="font-bold">{successMessage}</p>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      Redirecting you to sign in with your new password...
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1.5 font-mono">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-brand-border focus:border-brand-orange focus:ring-1 focus:ring-brand-orange text-sm font-medium text-brand-navy outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-brand-muted hover:text-brand-navy"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1.5 font-mono">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    placeholder="Re-enter your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-brand-border focus:border-brand-orange focus:ring-1 focus:ring-brand-orange text-sm font-medium text-brand-navy outline-none"
                  />
                </div>
              </div>

              <div className="text-[11px] text-brand-muted space-y-1 bg-brand-warm p-3 rounded-xl border border-brand-border/40">
                <span className="font-mono font-bold uppercase block text-brand-navy">Requirements:</span>
                <p className="flex items-center gap-1.5">
                  <span className={password.length >= 8 ? 'text-emerald-600 font-bold' : 'text-brand-muted'}>
                    ✓ Minimum 8 characters
                  </span>
                </p>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={submitting || !!successMessage}
                  className="w-full justify-center"
                  icon={submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                >
                  {submitting ? 'Setting Password...' : 'Set Password'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </Container>
    </main>
  );
}
