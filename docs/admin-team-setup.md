# FRIENDLI TRIPZ — PHASE 5.2 ADMIN TEAM & SECURITY SETUP GUIDE

This document outlines the database migration steps, Supabase Dashboard settings, Vercel environment variables, and role permission architecture for **Phase 5.2: Multi-User Friendli Admin, Role-Based Access Control (RBAC), and Team Invitation Flow**.

---

## 1. ROLE & PERMISSION ARCHITECTURE

Friendli Admin supports four roles:

| Role | Display Name | Authority Level & Key Permissions | Assignable via Invite |
| :--- | :--- | :--- | :--- |
| `owner` | **Owner** | Founder / highest authority. Full system control, Team management (`team.view`, `team.invite`, `team.change_role`, `team.change_status`), enquiry archiving, security settings. | ❌ (Manual DB promotion only) |
| `admin` | **Admin** | Core team member. Enquiries view, update, internal notes, and archiving (`enquiries.archive`). | ✅ |
| `operations` | **Operations** | Trip operations. Enquiries view, status updates, internal notes. Cannot archive enquiries or access Team. | ✅ |
| `sales` | **Sales** | Lead conversion team. Enquiries view, status updates, internal notes. Cannot archive enquiries or access Team. | ✅ |

---

## 2. SUPABASE DATABASE MIGRATION

Run the SQL migration script located in `supabase/migrations/20260727000000_phase5_2_team_and_permissions.sql` in your Supabase SQL Editor:

```sql
-- 1. Migrate legacy role values and update role check constraint
UPDATE public.admin_profiles
SET role = 'operations'
WHERE role NOT IN ('owner', 'admin', 'operations', 'sales');

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'admin_profiles_role_check') THEN
    ALTER TABLE public.admin_profiles DROP CONSTRAINT admin_profiles_role_check;
  END IF;
END $$;

ALTER TABLE public.admin_profiles
  ADD CONSTRAINT admin_profiles_role_check
  CHECK (role IN ('owner', 'admin', 'operations', 'sales'));

-- 2. Create Admin Audit Log table
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes & RLS
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created_at ON public.admin_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin_id ON public.admin_audit_log(admin_id);

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Active admins can view audit log" ON public.admin_audit_log;
CREATE POLICY "Active admins can view audit log"
  ON public.admin_audit_log FOR SELECT
  TO authenticated
  USING (public.is_active_admin(auth.uid()));
```

---

## 3. SUPABASE DASHBOARD AUTH CONFIGURATION

To ensure invitation email links redirect invited members to the password setup page instead of failing or defaulting to localhost in production:

1. Open your **Supabase Dashboard** -> **Authentication** -> **URL Configuration**.
2. Set **Site URL**:
   - `https://friendli-tripz.vercel.app` (or custom domain `https://admin.friendlitripz.com`)
3. Under **Redirect URLs**, add the following entries:
   - `http://localhost:3000/**`
   - `https://friendli-tripz.vercel.app/**`
   - `https://admin.friendlitripz.com/**`
4. Click **Save**.

---

## 4. ENVIRONMENT VARIABLES (VERCEL & LOCAL)

Ensure these variables are configured in Vercel Project Settings and local `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ovsrfytzylxcofahhbcy.supabase.co/
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Application Base URL (Crucial for invitation redirects)
# Local: http://localhost:3000
# Production: https://friendli-tripz.vercel.app
NEXT_PUBLIC_APP_URL=https://friendli-tripz.vercel.app

# Operations WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=917603967190
```

---

## 5. SECURITY RULES & SAFEGUARDS

1. **Service Role Key Security**: `SUPABASE_SERVICE_ROLE_KEY` is restricted exclusively to server execution (`src/lib/supabase/service.ts` and API routes). It is never sent to the browser.
2. **Server-Side Authorization**: Every sensitive route and API endpoint validates caller authentication, active admin status (`is_active = true`), and role permissions via `authorizeAdmin()`.
3. **Single Owner Protection**:
   - An Owner cannot deactivate their own account if they are the only active Owner.
   - The application blocks deactivating or demoting the last active Owner account.
4. **Non-Owner Escalation Prevention**:
   - Admins, Operations, and Sales cannot access `/admin/team`. Direct URL access redirects to `/admin/access-denied?reason=forbidden`.
   - Admin roles cannot promote themselves to Owner.
