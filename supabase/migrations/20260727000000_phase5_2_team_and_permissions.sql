-- ==============================================================================
-- FRIENDLI TRIPZ — PHASE 5.2 SUPABASE MIGRATION
-- Database: PostgreSQL (Supabase)
-- Feature: Team Roles, Access Control & Admin Audit Logging
-- ==============================================================================

-- 1. UPDATE ADMIN_PROFILES ROLE CHECK CONSTRAINT
-- First migrate legacy 'team' role records if any exist
UPDATE public.admin_profiles
SET role = 'operations'
WHERE role NOT IN ('owner', 'admin', 'operations', 'sales');

-- Drop old role check constraint if exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'admin_profiles_role_check'
  ) THEN
    ALTER TABLE public.admin_profiles DROP CONSTRAINT admin_profiles_role_check;
  END IF;
END $$;

-- Add updated check constraint allowing owner, admin, operations, sales
ALTER TABLE public.admin_profiles
  ADD CONSTRAINT admin_profiles_role_check
  CHECK (role IN ('owner', 'admin', 'operations', 'sales'));

-- 2. CREATE ADMIN AUDIT LOG TABLE
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for audit performance
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created_at ON public.admin_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin_id ON public.admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_target_user_id ON public.admin_audit_log(target_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_action ON public.admin_audit_log(action);

-- 3. ROW LEVEL SECURITY FOR AUDIT LOG
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Active admins can view audit log" ON public.admin_audit_log;
CREATE POLICY "Active admins can view audit log"
  ON public.admin_audit_log FOR SELECT
  TO authenticated
  USING (public.is_active_admin(auth.uid()));

DROP POLICY IF EXISTS "Active admins can insert audit log" ON public.admin_audit_log;
CREATE POLICY "Active admins can insert audit log"
  ON public.admin_audit_log FOR INSERT
  TO authenticated
  WITH CHECK (public.is_active_admin(auth.uid()));

-- 4. UPDATE HELPER FUNCTION TO COUNT ACTIVE OWNERS
CREATE OR REPLACE FUNCTION public.active_owner_count()
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER FROM public.admin_profiles
    WHERE role = 'owner' AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
