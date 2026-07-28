-- ==============================================================================
-- FRIENDLI TRIPZ — PHASE 5.3 MIGRATION: ENTERPRISE ACCESS MANAGEMENT UPGRADE
-- Features: Extensible Schema, Department Statistics View & Atomic Invitation Acceptance Transaction
-- ==============================================================================

-- 1. ADD EXTENSIBILITY COLUMNS TO ADMIN_PROFILES
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_profiles' AND column_name = 'phone') THEN
    ALTER TABLE public.admin_profiles ADD COLUMN phone TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_profiles' AND column_name = 'last_login') THEN
    ALTER TABLE public.admin_profiles ADD COLUMN last_login TIMESTAMPTZ;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_profiles' AND column_name = 'joined_at') THEN
    ALTER TABLE public.admin_profiles ADD COLUMN joined_at TIMESTAMPTZ DEFAULT NOW();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_profiles' AND column_name = 'archived_at') THEN
    ALTER TABLE public.admin_profiles ADD COLUMN archived_at TIMESTAMPTZ;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_profiles' AND column_name = 'employee_id') THEN
    ALTER TABLE public.admin_profiles ADD COLUMN employee_id TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_profiles' AND column_name = 'emergency_contact') THEN
    ALTER TABLE public.admin_profiles ADD COLUMN emergency_contact TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_profiles' AND column_name = 'address') THEN
    ALTER TABLE public.admin_profiles ADD COLUMN address TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_profiles' AND column_name = 'dob') THEN
    ALTER TABLE public.admin_profiles ADD COLUMN dob DATE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_profiles' AND column_name = 'branch_id') THEN
    ALTER TABLE public.admin_profiles ADD COLUMN branch_id UUID;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_profiles' AND column_name = 'reporting_manager_id') THEN
    ALTER TABLE public.admin_profiles ADD COLUMN reporting_manager_id UUID REFERENCES public.admin_profiles(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 2. ADD COLUMNS TO ADMIN_INVITATIONS
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_invitations' AND column_name = 'phone') THEN
    ALTER TABLE public.admin_invitations ADD COLUMN phone TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_invitations' AND column_name = 'accepted_at') THEN
    ALTER TABLE public.admin_invitations ADD COLUMN accepted_at TIMESTAMPTZ;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_invitations' AND column_name = 'cancelled_at') THEN
    ALTER TABLE public.admin_invitations ADD COLUMN cancelled_at TIMESTAMPTZ;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_invitations' AND column_name = 'expires_at') THEN
    ALTER TABLE public.admin_invitations ADD COLUMN expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days');
  END IF;
END $$;

-- 3. ADD COLUMNS TO DEPARTMENTS
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'departments' AND column_name = 'manager_id') THEN
    ALTER TABLE public.departments ADD COLUMN manager_id UUID REFERENCES public.admin_profiles(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'departments' AND column_name = 'archived_at') THEN
    ALTER TABLE public.departments ADD COLUMN archived_at TIMESTAMPTZ;
  END IF;
END $$;

-- 4. UPDATE STATUS CONSTRAINTS FOR MEMBERS & INVITATIONS
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'admin_profiles_status_check') THEN
    ALTER TABLE public.admin_profiles DROP CONSTRAINT admin_profiles_status_check;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'admin_invitations_status_check') THEN
    ALTER TABLE public.admin_invitations DROP CONSTRAINT admin_invitations_status_check;
  END IF;
END $$;

ALTER TABLE public.admin_profiles
  ADD CONSTRAINT admin_profiles_status_check
  CHECK (status IN ('pending', 'active', 'suspended', 'archived'));

ALTER TABLE public.admin_invitations
  ADD CONSTRAINT admin_invitations_status_check
  CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled'));

-- 5. SQL VIEW: DEPARTMENT STATISTICS
CREATE OR REPLACE VIEW public.department_statistics_view AS
SELECT 
  d.id AS department_id,
  d.name AS department_name,
  d.color AS department_color,
  d.active AS is_active,
  d.manager_id,
  m.full_name AS manager_name,
  d.archived_at,
  COUNT(p.id) AS total_members,
  COUNT(CASE WHEN p.is_active = true AND p.status = 'active' THEN 1 END) AS active_members,
  COUNT(CASE WHEN p.status = 'pending' THEN 1 END) AS pending_members,
  COUNT(CASE WHEN p.status = 'suspended' THEN 1 END) AS suspended_members,
  COUNT(CASE WHEN p.status = 'archived' THEN 1 END) AS archived_members,
  (
    SELECT COUNT(*) 
    FROM public.admin_invitations i 
    WHERE i.department_id = d.id AND i.status = 'pending'
  ) AS pending_invitations_count
FROM public.departments d
LEFT JOIN public.admin_profiles p ON p.department_id = d.id
LEFT JOIN public.admin_profiles m ON d.manager_id = m.id
WHERE d.archived_at IS NULL
GROUP BY d.id, d.name, d.color, d.active, d.manager_id, m.full_name, d.archived_at;

-- 6. ATOMIC TRANSACTION STORED FUNCTION: ACCEPT INVITATION
CREATE OR REPLACE FUNCTION public.accept_invitation_transaction(
  p_user_id UUID,
  p_email TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_inv RECORD;
BEGIN
  -- 1. Find pending invitation by email
  SELECT * INTO v_inv
  FROM public.admin_invitations
  WHERE LOWER(email) = LOWER(p_email) AND status = 'pending'
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_inv.id IS NOT NULL THEN
    -- Update invitation status to accepted
    UPDATE public.admin_invitations
    SET status = 'accepted',
        accepted_at = NOW()
    WHERE id = v_inv.id;
  END IF;

  -- 2. Update or activate admin_profiles record
  UPDATE public.admin_profiles
  SET is_active = true,
      status = 'active',
      joined_at = COALESCE(joined_at, NOW()),
      phone = COALESCE(phone, v_inv.phone),
      role = COALESCE(role, v_inv.role, 'sales'),
      department_id = COALESCE(department_id, v_inv.department_id)
  WHERE id = p_user_id;

  -- 3. Log audit event
  INSERT INTO public.admin_activity_logs (admin_id, action, target_type, target_user_id, metadata)
  VALUES (
    p_user_id,
    'accept',
    'invitation',
    p_user_id,
    jsonb_build_object('email', p_email, 'invitation_id', v_inv.id)
  );

  -- 4. Create notification for admin team
  INSERT INTO public.admin_notifications (recipient_id, title, body, type, link)
  SELECT p.id, 'Invitation Accepted', 'Staff member ' || p_email || ' has completed setup and activated their account.', 'invitation_accepted', '/admin/team'
  FROM public.admin_profiles p
  WHERE p.role IN ('owner', 'admin') AND p.is_active = true AND p.id != p_user_id;

  RETURN jsonb_build_object('success', true, 'message', 'Invitation accepted atomically.');
EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'accept_invitation_transaction failed: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
