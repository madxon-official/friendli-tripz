-- ==============================================================================
-- FRIENDLI TRIPZ — PHASE 5.3 SUPABASE MIGRATION
-- Feature: Enterprise RBAC, Departments, Assignment Engine, Activity Logs & Notifications
-- ==============================================================================

-- 1. DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL DEFAULT '#F97316',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed default enterprise departments if not exists
INSERT INTO public.departments (name, color, active)
VALUES
  ('Admin', '#8B5CF6', true),
  ('Operations', '#3B82F6', true),
  ('Sales', '#10B981', true),
  ('Support', '#F59E0B', true),
  ('Marketing', '#EC4899', true),
  ('Finance', '#06B6D4', true)
ON CONFLICT (name) DO NOTHING;

-- 2. EXTEND ADMIN_PROFILES TABLE
-- Add avatar_url, phone, department_id, status, created_by
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_profiles' AND column_name = 'avatar_url') THEN
    ALTER TABLE public.admin_profiles ADD COLUMN avatar_url TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_profiles' AND column_name = 'phone') THEN
    ALTER TABLE public.admin_profiles ADD COLUMN phone TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_profiles' AND column_name = 'department_id') THEN
    ALTER TABLE public.admin_profiles ADD COLUMN department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_profiles' AND column_name = 'status') THEN
    ALTER TABLE public.admin_profiles ADD COLUMN status TEXT NOT NULL DEFAULT 'active';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_profiles' AND column_name = 'created_by') THEN
    ALTER TABLE public.admin_profiles ADD COLUMN created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Update role check constraint for 6 roles
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'admin_profiles_role_check') THEN
    ALTER TABLE public.admin_profiles DROP CONSTRAINT admin_profiles_role_check;
  END IF;
END $$;

ALTER TABLE public.admin_profiles
  ADD CONSTRAINT admin_profiles_role_check
  CHECK (role IN ('owner', 'admin', 'operations', 'sales', 'support', 'viewer'));

-- 3. ADMIN INVITATIONS TABLE
CREATE TABLE IF NOT EXISTS public.admin_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'operations', 'sales', 'support', 'viewer')),
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
  token TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days')
);

CREATE INDEX IF NOT EXISTS idx_invitations_email ON public.admin_invitations(email);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON public.admin_invitations(status);

-- 4. EXTEND ENQUIRIES TABLE FOR ASSIGNMENT ENGINE
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'enquiries' AND column_name = 'assigned_to') THEN
    ALTER TABLE public.enquiries ADD COLUMN assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'enquiries' AND column_name = 'assigned_by') THEN
    ALTER TABLE public.enquiries ADD COLUMN assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'enquiries' AND column_name = 'assigned_at') THEN
    ALTER TABLE public.enquiries ADD COLUMN assigned_at TIMESTAMPTZ;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_enquiries_assigned_to ON public.enquiries(assigned_to);

-- 5. ADMIN ACTIVITY AUDIT LOG TABLE
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL, -- 'enquiry', 'team_member', 'department', 'role', 'session'
  target_id UUID,
  action TEXT NOT NULL, -- 'invite', 'accept', 'role_changed', 'department_changed', 'assigned', 'archived', 'restored', 'status_changed', 'login', 'logout'
  old_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  new_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.admin_activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_actor_id ON public.admin_activity_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_target ON public.admin_activity_logs(target_type, target_id);

-- 6. ADMIN NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- NULL means broadcast to admins with permission
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL, -- 'enquiry_new', 'assignment', 'invitation_accepted', 'role_changed', 'team_joined', 'archived', 'trip_completed'
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.admin_notifications(recipient_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.admin_notifications(created_at DESC);

-- Realtime publication enablement for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_notifications;

-- 7. ROW LEVEL SECURITY (RLS) POLICIES

ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- RLS for DEPARTMENTS
DROP POLICY IF EXISTS "Admins can view departments" ON public.departments;
CREATE POLICY "Admins can view departments"
  ON public.departments FOR SELECT
  TO authenticated
  USING (public.is_active_admin(auth.uid()));

DROP POLICY IF EXISTS "Owners and Admins can manage departments" ON public.departments;
CREATE POLICY "Owners and Admins can manage departments"
  ON public.departments FOR ALL
  TO authenticated
  USING (public.is_active_admin(auth.uid()));

-- RLS for ADMIN_INVITATIONS
DROP POLICY IF EXISTS "Admins can view invitations" ON public.admin_invitations;
CREATE POLICY "Admins can view invitations"
  ON public.admin_invitations FOR SELECT
  TO authenticated
  USING (public.is_active_admin(auth.uid()));

-- RLS for ADMIN_ACTIVITY_LOGS
DROP POLICY IF EXISTS "Admins can view activity logs" ON public.admin_activity_logs;
CREATE POLICY "Admins can view activity logs"
  ON public.admin_activity_logs FOR SELECT
  TO authenticated
  USING (public.is_active_admin(auth.uid()));

-- RLS for ADMIN_NOTIFICATIONS
DROP POLICY IF EXISTS "Admins can view notifications" ON public.admin_notifications;
CREATE POLICY "Admins can view notifications"
  ON public.admin_notifications FOR SELECT
  TO authenticated
  USING (
    public.is_active_admin(auth.uid()) AND
    (recipient_id = auth.uid() OR recipient_id IS NULL)
  );

DROP POLICY IF EXISTS "Admins can update own notifications" ON public.admin_notifications;
CREATE POLICY "Admins can update own notifications"
  ON public.admin_notifications FOR UPDATE
  TO authenticated
  USING (
    public.is_active_admin(auth.uid()) AND
    (recipient_id = auth.uid() OR recipient_id IS NULL)
  );
