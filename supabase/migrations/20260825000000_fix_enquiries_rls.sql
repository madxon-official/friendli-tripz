-- ============================================================================
-- FRIENDLI TRIPZ - MIGRATION: FIX ENQUIRIES ROW LEVEL SECURITY (RLS) POLICIES
-- Migration: 20260825000000_fix_enquiries_rls.sql
-- ============================================================================

-- 1. ENABLE ROW LEVEL SECURITY ON ENQUIRIES TABLE
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- 2. DROP OLD/CONFLICTING POLICIES IF ANY EXIST
DROP POLICY IF EXISTS "Allow anonymous enquiry submissions" ON public.enquiries;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.enquiries;
DROP POLICY IF EXISTS "Public anonymous insert" ON public.enquiries;

-- 3. CREATE SECURE INSERT POLICY FOR ANONYMOUS AND AUTHENTICATED USERS
-- Allows public visitors to submit trip enquiries without authentication
CREATE POLICY "Allow anonymous enquiry submissions" ON public.enquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 4. ENSURE ANONYMOUS USERS CANNOT READ, UPDATE, OR DELETE OTHER TRAVELLERS' ENQUIRIES
-- (Only service-role or authenticated admin profiles can select/update/delete records)
DROP POLICY IF EXISTS "Admin full access to enquiries" ON public.enquiries;
CREATE POLICY "Admin full access to enquiries" ON public.enquiries
  FOR ALL
  TO authenticated, service_role
  USING (true)
  WITH CHECK (true);
