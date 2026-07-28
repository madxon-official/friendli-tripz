-- ==============================================================================
-- FRIENDLI TRIPZ — PHASE 5.3 FIX MIGRATION
-- Feature: Team Visibility RLS Policies & Single Active Owner Constraint
-- ==============================================================================

-- 1. SINGLE ACTIVE OWNER UNIQUE CONSTRAINT
-- Enforce at DB level that there can never be more than one active Owner profile
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'admin_profiles' AND indexname = 'idx_single_active_owner'
  ) THEN
    CREATE UNIQUE INDEX idx_single_active_owner 
    ON public.admin_profiles (role) 
    WHERE (role = 'owner' AND is_active = true);
  END IF;
END $$;

-- 2. HELPER FUNCTION TO GET ACTIVE USER ROLE SAFELY WITHOUT RECURSION
CREATE OR REPLACE FUNCTION public.get_auth_user_role(user_id UUID)
RETURNS TEXT AS $$
DECLARE
  u_role TEXT;
BEGIN
  SELECT role INTO u_role 
  FROM public.admin_profiles 
  WHERE id = user_id AND is_active = true 
  LIMIT 1;
  
  RETURN COALESCE(u_role, 'viewer');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 3. TEAM VISIBILITY RLS POLICIES FOR ADMIN_PROFILES
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view active profiles" ON public.admin_profiles;
DROP POLICY IF EXISTS "Owners can manage profiles" ON public.admin_profiles;
DROP POLICY IF EXISTS "Team members SELECT visibility" ON public.admin_profiles;
DROP POLICY IF EXISTS "Team members UPDATE visibility" ON public.admin_profiles;

-- SELECT Visibility Policy:
-- Owner & Admin: Can view all admin profiles in the team
-- Operations, Sales, Support, Viewer: Can view only their own profile
CREATE POLICY "Team members SELECT visibility"
  ON public.admin_profiles FOR SELECT
  TO authenticated
  USING (
    public.get_auth_user_role(auth.uid()) IN ('owner', 'admin')
    OR id = auth.uid()
  );

-- UPDATE Policy:
-- Owner & Admin can update profiles based on app logic, or user updating self
CREATE POLICY "Team members UPDATE visibility"
  ON public.admin_profiles FOR UPDATE
  TO authenticated
  USING (
    public.get_auth_user_role(auth.uid()) IN ('owner', 'admin')
    OR id = auth.uid()
  );

-- ALL Policy for Owner
DROP POLICY IF EXISTS "Owner ALL profiles policy" ON public.admin_profiles;
CREATE POLICY "Owner ALL profiles policy"
  ON public.admin_profiles FOR ALL
  TO authenticated
  USING (
    public.get_auth_user_role(auth.uid()) = 'owner'
  );
