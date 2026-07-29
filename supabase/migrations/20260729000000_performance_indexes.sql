-- Additive Performance Indexes for Friendli Tripz Team Management & Queries
-- Safe Mode: Additive IF NOT EXISTS indexes only

-- admin_profiles query indexes
CREATE INDEX IF NOT EXISTS idx_admin_profiles_role ON admin_profiles(role);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_status ON admin_profiles(status);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_dept ON admin_profiles(department_id);

-- admin_invitations query indexes
CREATE INDEX IF NOT EXISTS idx_admin_invitations_status ON admin_invitations(status);
CREATE INDEX IF NOT EXISTS idx_admin_invitations_expires ON admin_invitations(expires_at);

-- departments query indexes
CREATE INDEX IF NOT EXISTS idx_departments_manager ON departments(manager_id);
CREATE INDEX IF NOT EXISTS idx_departments_archived ON departments(archived_at);

-- admin_activity_logs query indexes
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON admin_activity_logs(created_at DESC);

-- enquiries query indexes
CREATE INDEX IF NOT EXISTS idx_enquiries_assigned_to ON enquiries(assigned_to);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
