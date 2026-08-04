-- ==============================================================================
-- FRIENDLI TRIPZ — PRODUCTION SCHEMA ALIGNMENT MIGRATION
-- Migration: 20260826000000_production_team_and_notifications.sql
-- Source of Truth: Canonical Production Database Schema
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. DEPARTMENTS TABLE (REUSE & SAFELY EXTEND EXISTING PRODUCTION TABLE)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL DEFAULT '#FF6500',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  manager_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  archived_at TIMESTAMPTZ
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'departments' AND column_name = 'color') THEN
    ALTER TABLE public.departments ADD COLUMN color TEXT NOT NULL DEFAULT '#FF6500';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'departments' AND column_name = 'active') THEN
    ALTER TABLE public.departments ADD COLUMN active BOOLEAN NOT NULL DEFAULT true;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'departments' AND column_name = 'manager_id') THEN
    ALTER TABLE public.departments ADD COLUMN manager_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'departments' AND column_name = 'archived_at') THEN
    ALTER TABLE public.departments ADD COLUMN archived_at TIMESTAMPTZ;
  END IF;
END $$;

INSERT INTO public.departments (name, color, active)
VALUES
  ('Management', '#F59E0B', true),
  ('Operations', '#3B82F6', true),
  ('Customer Support', '#8B5CF6', true),
  ('Marketing', '#EC4899', true),
  ('Content', '#10B981', true)
ON CONFLICT (name) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 2. ADMIN PROFILES TABLE (REUSE & EXTEND PRODUCTION ADMIN PROFILES)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'operations',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_profiles' AND column_name = 'avatar_url') THEN
    ALTER TABLE public.admin_profiles ADD COLUMN avatar_url TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_profiles' AND column_name = 'phone') THEN
    ALTER TABLE public.admin_profiles ADD COLUMN phone TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_profiles' AND column_name = 'department_id') THEN
    ALTER TABLE public.admin_profiles ADD COLUMN department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_profiles' AND column_name = 'status') THEN
    ALTER TABLE public.admin_profiles ADD COLUMN status TEXT NOT NULL DEFAULT 'active';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_profiles' AND column_name = 'created_by') THEN
    ALTER TABLE public.admin_profiles ADD COLUMN created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'admin_profiles_role_check') THEN
    ALTER TABLE public.admin_profiles DROP CONSTRAINT admin_profiles_role_check;
  END IF;
END $$;

ALTER TABLE public.admin_profiles
  ADD CONSTRAINT admin_profiles_role_check
  CHECK (role IN ('owner', 'admin', 'operations', 'support'));

-- ------------------------------------------------------------------------------
-- 3. ADMIN INVITATIONS TABLE (REUSE PRODUCTION ADMIN INVITATIONS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'operations' CHECK (role IN ('owner', 'admin', 'operations', 'support')),
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  invited_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  token TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  phone TEXT,
  accepted_at TIMESTAMPTZ
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_invitations' AND column_name = 'token') THEN
    ALTER TABLE public.admin_invitations ADD COLUMN token TEXT UNIQUE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_invitations' AND column_name = 'phone') THEN
    ALTER TABLE public.admin_invitations ADD COLUMN phone TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_invitations' AND column_name = 'accepted_at') THEN
    ALTER TABLE public.admin_invitations ADD COLUMN accepted_at TIMESTAMPTZ;
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 4. ADMIN NOTIFICATIONS TABLE (REUSE EXACT PRODUCTION COLUMNS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'general',
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_notifications' AND column_name = 'read') THEN
    ALTER TABLE public.admin_notifications RENAME COLUMN read TO is_read;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_notifications' AND column_name = 'message') THEN
    ALTER TABLE public.admin_notifications RENAME COLUMN message TO body;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_notifications' AND column_name = 'body') THEN
    ALTER TABLE public.admin_notifications ADD COLUMN body TEXT NOT NULL DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_notifications' AND column_name = 'type') THEN
    ALTER TABLE public.admin_notifications ADD COLUMN type TEXT NOT NULL DEFAULT 'general';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_notifications' AND column_name = 'link') THEN
    ALTER TABLE public.admin_notifications ADD COLUMN link TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_notifications' AND column_name = 'is_read') THEN
    ALTER TABLE public.admin_notifications ADD COLUMN is_read BOOLEAN NOT NULL DEFAULT false;
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 5. ADMIN AUDIT LOG TABLE (REUSE PRODUCTION TABLE)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. REUSE PRODUCTION HELPER FUNCTION IS_ACTIVE_ADMIN
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_active_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = user_id AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ------------------------------------------------------------------------------
-- 7. INDEX CREATION (IDEMPOTENT)
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_admin_profiles_role ON public.admin_profiles(role);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_status ON public.admin_profiles(status);
CREATE INDEX IF NOT EXISTS idx_admin_invitations_email ON public.admin_invitations(email);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_recipient_read ON public.admin_notifications(recipient_id, is_read);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created ON public.admin_audit_log(created_at DESC);

-- ------------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (RLS) POLICIES USING IS_ACTIVE_ADMIN
-- ------------------------------------------------------------------------------
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Active admins view departments" ON public.departments;
CREATE POLICY "Active admins view departments" ON public.departments FOR SELECT TO authenticated USING (public.is_active_admin(auth.uid()));

DROP POLICY IF EXISTS "Active admins view profiles" ON public.admin_profiles;
CREATE POLICY "Active admins view profiles" ON public.admin_profiles FOR SELECT TO authenticated USING (public.is_active_admin(auth.uid()));

DROP POLICY IF EXISTS "Owners and Admins manage profiles" ON public.admin_profiles;
CREATE POLICY "Owners and Admins manage profiles" ON public.admin_profiles FOR ALL TO authenticated, service_role USING (public.is_active_admin(auth.uid())) WITH CHECK (public.is_active_admin(auth.uid()));

DROP POLICY IF EXISTS "Active admins view notifications" ON public.admin_notifications;
CREATE POLICY "Active admins view notifications" ON public.admin_notifications FOR SELECT TO authenticated USING (recipient_id = auth.uid() OR recipient_id IS NULL);

-- ------------------------------------------------------------------------------
-- 9. AUTOMATED PRODUCTION SCHEMA VALIDATION BLOCK
-- ------------------------------------------------------------------------------
DO $$
DECLARE
  v_missing TEXT := '';
BEGIN
  -- Verify admin_profiles columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_profiles' AND column_name = 'department_id') THEN
    v_missing := v_missing || ' Column: admin_profiles.department_id;';
  END IF;

  -- Verify admin_notifications columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_notifications' AND column_name = 'body') THEN
    v_missing := v_missing || ' Column: admin_notifications.body;';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_notifications' AND column_name = 'is_read') THEN
    v_missing := v_missing || ' Column: admin_notifications.is_read;';
  END IF;

  -- Verify helper function is_active_admin
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_active_admin') THEN
    v_missing := v_missing || ' Function: is_active_admin;';
  END IF;

  IF v_missing <> '' THEN
    RAISE EXCEPTION 'Production Migration Validation Failed! Missing elements: %', v_missing;
  ELSE
    RAISE NOTICE 'Migration completed successfully. Production schema verified.';
  END IF;
END $$;
