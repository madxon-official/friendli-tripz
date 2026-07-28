'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, KeyRound, ShieldAlert } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import { User, EmailOtpType } from '@supabase/supabase-js';

type InvitationState =
  | 'checking_invitation'
  | 'valid_invitation'
  | 'expired_invitation'
  | 'invalid_invitation';

function parseHashParams(hashString: string): Record<string, string> {
  if (!hashString) return {};
  const hash = hashString.startsWith('#') ? hashString.substring(1) : hashString;
  const params = new URLSearchParams(hash);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

function SetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [invitationState, setInvitationState] = useState<InvitationState>('checking_invitation');
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let isMounted = true;

    const processInvitationLink = async () => {
      try {
        setError(null);

        // 1. Parse Hash Parameters (Implicit/Hash token flow: #access_token=...&refresh_token=...&type=invite)
        const rawHash = typeof window !== 'undefined' ? window.location.hash : '';
        const hashParams = parseHashParams(rawHash);

        // Check for error in hash or query parameters
        const hashError = hashParams.error || hashParams.error_description;
        const queryError = searchParams.get('error') || searchParams.get('error_description');

        if (hashError || queryError) {
          if (isMounted) {
            setError(queryError || hashError || 'This invitation link is invalid or has expired.');
            setInvitationState('expired_invitation');
          }
          return;
        }

        // 2. Process implicit hash tokens (#access_token=... & refresh_token=...)
        if (hashParams.access_token && hashParams.refresh_token) {
          const { data: sessionData, error: setSessionErr } = await supabase.auth.setSession({
            access_token: hashParams.access_token,
            refresh_token: hashParams.refresh_token,
          });

          if (setSessionErr || !sessionData.session) {
            if (isMounted) {
              setError('Invitation session could not be established. The link may be expired.');
              setInvitationState('expired_invitation');
            }
            return;
          }

          // SECURITY REQUIREMENT: Strip sensitive tokens from browser address bar immediately
          if (typeof window !== 'undefined') {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          }

          // Verify authenticated user
          const { data: userData, error: userErr } = await supabase.auth.getUser();

          if (userErr || !userData.user) {
            if (isMounted) {
              setError('Could not verify invited user profile. Please request a new invitation.');
              setInvitationState('invalid_invitation');
            }
            return;
          }

          if (isMounted) {
            setAuthenticatedUser(userData.user);
            setInvitationState('valid_invitation');
          }
          return;
        }

        // 3. Process PKCE authorization code in query string (?code=...)
        const code = searchParams.get('code');
        if (code) {
          const { error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeErr) {
            console.warn('PKCE code exchange error:', exchangeErr.message);
          } else {
            const { data: userData } = await supabase.auth.getUser();
            if (userData?.user && isMounted) {
              setAuthenticatedUser(userData.user);
              setInvitationState('valid_invitation');
              return;
            }
          }
        }

        // 4. Process OTP / token_hash in query string (?token_hash=...)
        const tokenHash = searchParams.get('token_hash');
        const typeParam = (searchParams.get('type') as EmailOtpType) || 'invite';

        if (tokenHash) {
          const { error: verifyErr } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: typeParam,
          });

          if (verifyErr) {
            console.warn('Verify OTP error:', verifyErr.message);
          } else {
            const { data: userData } = await supabase.auth.getUser();
            if (userData?.user && isMounted) {
              setAuthenticatedUser(userData.user);
              setInvitationState('valid_invitation');
              return;
            }
          }
        }

        // 5. Fallback: Check if user already has an active session from browser storage/cookies
        const { data: existingSessionData } = await supabase.auth.getSession();
        if (existingSessionData?.session) {
          const { data: userData } = await supabase.auth.getUser();
          if (userData?.user && isMounted) {
            setAuthenticatedUser(userData.user);
            setInvitationState('valid_invitation');
            return;
          }
        }

        // If no credentials or session found
        if (isMounted) {
          setError('Invitation session not found. Please click the invitation link from your email again.');
          setInvitationState('expired_invitation');
        }
      } catch (err: any) {
        console.error('Invitation processing error:', err);
        if (isMounted) {
          setError('An error occurred validating your invitation link.');
          setInvitationState('invalid_invitation');
        }
      }
    };

    processInvitationLink();

    return () => {
      isMounted = false;
    };
  }, [searchParams, supabase]);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Client-side password validation
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
      // Security Check: Verify active user session before password mutation
      const { data: userData, error: userErr } = await supabase.auth.getUser();

      if (userErr || !userData?.user) {
        throw new Error('Auth session missing or expired. Please click the invitation link in your email again.');
      }

      // Update password via Supabase Auth
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        throw updateError;
      }

      // Trigger Atomic Invitation Acceptance API
      try {
        await fetch('/api/admin/team/accept-invite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userData.user.id,
            email: userData.user.email,
          }),
        });
      } catch (acceptErr) {
        console.error('Failed to notify invitation acceptance API:', acceptErr);
      }

      setSuccessMessage('Password created successfully.');

      // Sign out invitation session and redirect to /admin/login (Option B)
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
      console.error('Password creation failed:', err);
      const msg =
        err?.name === 'AuthSessionMissingError' || err?.message?.includes('session missing')
          ? 'Auth session missing or expired. Please click the invitation link from your email again.'
          : err?.message || 'Failed to create password. Your invitation link may have expired.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const userEmail = authenticatedUser?.email;
  const userFullName = authenticatedUser?.user_metadata?.full_name;

  return (
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

      {/* State 1: Checking Invitation Link */}
      {invitationState === 'checking_invitation' && (
        <div className="py-8 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-brand-orange animate-spin mx-auto" />
          <p className="text-xs text-brand-muted font-medium">Validating invitation link...</p>
        </div>
      )}

      {/* State 2 & 3: Invalid or Expired Invitation Link */}
      {(invitationState === 'expired_invitation' || invitationState === 'invalid_invitation') && (
        <div className="py-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h2 className="font-heading font-bold text-base text-brand-navy">
              Invitation Link Invalid or Expired
            </h2>
            <p className="text-xs text-brand-muted max-w-xs mx-auto leading-relaxed">
              {error || 'This invitation session could not be verified. Please ask your Friendli Admin Owner to send a new invitation.'}
            </p>
          </div>
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/admin/login')}
              className="w-full justify-center"
            >
              Go to Admin Login
            </Button>
          </div>
        </div>
      )}

      {/* State 4: Valid Invitation — Authenticated Password Setup Form */}
      {invitationState === 'valid_invitation' && (
        <form onSubmit={handleSetPassword} className="space-y-4">
          {userEmail && (
            <div className="p-3 rounded-xl bg-brand-soft-navy/60 border border-brand-border/40 text-xs text-brand-navy flex items-center justify-between">
              <span className="text-brand-muted font-mono uppercase text-[10px] font-bold">Account</span>
              <span className="font-bold font-mono text-brand-navy">{userFullName ? `${userFullName} (${userEmail})` : userEmail}</span>
            </div>
          )}

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
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-brand-border focus:border-brand-orange focus:ring-1 focus:ring-brand-orange text-sm font-medium text-brand-navy outline-none font-mono"
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
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-brand-border focus:border-brand-orange focus:ring-1 focus:ring-brand-orange text-sm font-medium text-brand-navy outline-none font-mono"
              />
            </div>
          </div>

          <div className="text-[11px] text-brand-muted space-y-1 bg-brand-warm p-3 rounded-xl border border-brand-border/40">
            <span className="font-mono font-bold uppercase block text-brand-navy">Password Requirements:</span>
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
              disabled={submitting || !!successMessage || !authenticatedUser}
              className="w-full justify-center"
              icon={submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
            >
              {submitting ? 'Setting Password...' : 'Set Password'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <main className="min-h-screen bg-brand-navy flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10 max-w-md">
        <Suspense>
          <SetPasswordForm />
        </Suspense>
      </Container>
    </main>
  );
}
