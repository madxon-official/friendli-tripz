  -- ==============================================================================
-- FRIENDLI TRIPZ — PHASE 4 SUPABASE SCHEMA MIGRATION
-- Database: PostgreSQL (Supabase)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. REUSABLE UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. ADMIN PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('owner', 'admin', 'team')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for admin_profiles updated_at
DROP TRIGGER IF EXISTS set_admin_profiles_updated_at ON public.admin_profiles;
CREATE TRIGGER set_admin_profiles_updated_at
  BEFORE UPDATE ON public.admin_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 4. ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  destination TEXT NOT NULL DEFAULT 'Kodaikanal',
  traveller_count INTEGER NOT NULL CHECK (traveller_count >= 1),
  preferred_date TEXT,
  starting_location TEXT,
  trip_type TEXT,
  stay_preference TEXT,
  notes_from_traveller TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'follow_up', 'confirmed', 'completed', 'cancelled')),
  archived_at TIMESTAMPTZ,
  created_source TEXT DEFAULT 'website'
);

-- Trigger for enquiries updated_at
DROP TRIGGER IF EXISTS set_enquiries_updated_at ON public.enquiries;
CREATE TRIGGER set_enquiries_updated_at
  BEFORE UPDATE ON public.enquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_enquiries_reference ON public.enquiries(reference);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_archived_at ON public.enquiries(archived_at);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON public.enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enquiries_new_active ON public.enquiries(status, archived_at) WHERE status = 'new' AND archived_at IS NULL;

-- 5. ENQUIRY NOTES TABLE
CREATE TABLE IF NOT EXISTS public.enquiry_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id UUID NOT NULL REFERENCES public.enquiries(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES auth.users(id),
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_enquiry_notes_enquiry_id ON public.enquiry_notes(enquiry_id);

-- 6. ENQUIRY STATUS HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.enquiry_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id UUID NOT NULL REFERENCES public.enquiries(id) ON DELETE CASCADE,
  previous_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_status_history_enquiry_id ON public.enquiry_status_history(enquiry_id);

-- 7. HELPER FUNCTION: CHECK IF USER IS AN ACTIVE ADMIN
CREATE OR REPLACE FUNCTION public.is_active_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = user_id AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS on all tables
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiry_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiry_status_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ADMIN_PROFILES
DROP POLICY IF EXISTS "Admins can view active profiles" ON public.admin_profiles;
CREATE POLICY "Admins can view active profiles"
  ON public.admin_profiles FOR SELECT
  TO authenticated
  USING (public.is_active_admin(auth.uid()));

DROP POLICY IF EXISTS "Owners can manage profiles" ON public.admin_profiles;
CREATE POLICY "Owners can manage profiles"
  ON public.admin_profiles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_profiles
      WHERE id = auth.uid() AND role = 'owner' AND is_active = true
    )
  );

-- RLS Policies for ENQUIRIES
DROP POLICY IF EXISTS "Admins can view enquiries" ON public.enquiries;
CREATE POLICY "Admins can view enquiries"
  ON public.enquiries FOR SELECT
  TO authenticated
  USING (public.is_active_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update enquiries" ON public.enquiries;
CREATE POLICY "Admins can update enquiries"
  ON public.enquiries FOR UPDATE
  TO authenticated
  USING (public.is_active_admin(auth.uid()))
  WITH CHECK (public.is_active_admin(auth.uid()));

-- RLS Policies for ENQUIRY_NOTES
DROP POLICY IF EXISTS "Admins can view notes" ON public.enquiry_notes;
CREATE POLICY "Admins can view notes"
  ON public.enquiry_notes FOR SELECT
  TO authenticated
  USING (public.is_active_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can insert notes" ON public.enquiry_notes;
CREATE POLICY "Admins can insert notes"
  ON public.enquiry_notes FOR INSERT
  TO authenticated
  WITH CHECK (public.is_active_admin(auth.uid()));

-- RLS Policies for ENQUIRY_STATUS_HISTORY
DROP POLICY IF EXISTS "Admins can view status history" ON public.enquiry_status_history;
CREATE POLICY "Admins can view status history"
  ON public.enquiry_status_history FOR SELECT
  TO authenticated
  USING (public.is_active_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can insert status history" ON public.enquiry_status_history;
CREATE POLICY "Admins can insert status history"
  ON public.enquiry_status_history FOR INSERT
  TO authenticated
  WITH CHECK (public.is_active_admin(auth.uid()));

-- 9. ATOMIC STATUS UPDATE RPC FUNCTION
CREATE OR REPLACE FUNCTION public.update_enquiry_status(
  p_enquiry_id UUID,
  p_new_status TEXT,
  p_admin_id UUID
)
RETURNS JSON AS $$
DECLARE
  v_old_status TEXT;
  v_result JSON;
BEGIN
  -- Verify admin caller
  IF NOT public.is_active_admin(p_admin_id) THEN
    RAISE EXCEPTION 'Unauthorized: User is not an active admin.';
  END IF;

  -- Get current status
  SELECT status INTO v_old_status FROM public.enquiries WHERE id = p_enquiry_id;

  IF v_old_status IS NULL THEN
    RAISE EXCEPTION 'Enquiry not found.';
  END IF;

  IF v_old_status = p_new_status THEN
    RETURN json_build_object('success', true, 'status', p_new_status, 'message', 'Status unchanged');
  END IF;

  -- Update enquiry status
  UPDATE public.enquiries
  SET status = p_new_status, updated_at = NOW()
  WHERE id = p_enquiry_id;

  -- Insert history record
  INSERT INTO public.enquiry_status_history (enquiry_id, previous_status, new_status, changed_by)
  VALUES (p_enquiry_id, v_old_status, p_new_status, p_admin_id);

  RETURN json_build_object('success', true, 'status', p_new_status, 'previous_status', v_old_status);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. REALTIME PUBLICATION ENABLEMENT FOR ENQUIRIES
ALTER PUBLICATION supabase_realtime ADD TABLE public.enquiries;
