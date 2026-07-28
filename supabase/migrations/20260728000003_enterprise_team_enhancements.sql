-- ==============================================================================
-- FRIENDLI TRIPZ — PHASE 5.3 MIGRATION: ENTERPRISE TEAM ENHANCEMENTS (SAFE UPGRADE)
-- Feature: Additive columns for Departments (manager_id, archived_at) and Invitations (phone, accepted_at)
-- ==============================================================================

-- 1. EXTEND DEPARTMENTS TABLE
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'departments' AND column_name = 'manager_id') THEN
    ALTER TABLE public.departments ADD COLUMN manager_id UUID REFERENCES public.admin_profiles(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'departments' AND column_name = 'archived_at') THEN
    ALTER TABLE public.departments ADD COLUMN archived_at TIMESTAMPTZ;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_departments_manager_id ON public.departments(manager_id);
CREATE INDEX IF NOT EXISTS idx_departments_archived_at ON public.departments(archived_at);

-- 2. EXTEND ADMIN_INVITATIONS TABLE
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_invitations' AND column_name = 'phone') THEN
    ALTER TABLE public.admin_invitations ADD COLUMN phone TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_invitations' AND column_name = 'accepted_at') THEN
    ALTER TABLE public.admin_invitations ADD COLUMN accepted_at TIMESTAMPTZ;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_admin_invitations_accepted_at ON public.admin_invitations(accepted_at);
