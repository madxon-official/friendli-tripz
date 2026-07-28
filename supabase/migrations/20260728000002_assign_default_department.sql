-- ==============================================================================
-- FRIENDLI TRIPZ — PHASE 5.3 MIGRATION: DEFAULT DEPARTMENT ASSIGNMENT
-- Feature: Assign NULL department_id members to default 'Admin' department
-- ==============================================================================

-- 1. Ensure 'Admin' department exists in public.departments
INSERT INTO public.departments (name, color, active)
VALUES ('Admin', '#8B5CF6', true)
ON CONFLICT (name) DO NOTHING;

-- 2. Migrate existing admin_profiles with NULL department_id to 'Admin' department
UPDATE public.admin_profiles
SET department_id = (SELECT id FROM public.departments WHERE name = 'Admin' LIMIT 1)
WHERE department_id IS NULL;

-- 3. Migrate any invitations with NULL department_id to 'Admin' department
UPDATE public.admin_invitations
SET department_id = (SELECT id FROM public.departments WHERE name = 'Admin' LIMIT 1)
WHERE department_id IS NULL;
