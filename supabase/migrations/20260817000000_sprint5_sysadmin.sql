-- ============================================================================
-- FRIENDLI TRIPZ - SPRINT 5.8: SYSTEM ADMINISTRATION & AUDIT LOGS
-- Migration: 20260817000000_sprint5_sysadmin.sql
-- ============================================================================

-- 1. ENTERPRISE AUDIT LOGS & BACKGROUND JOBS
CREATE TABLE IF NOT EXISTS system_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_name TEXT NOT NULL,
  action_type TEXT NOT NULL,
  target_resource TEXT NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS background_jobs_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name TEXT NOT NULL,
  payload_json JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'completed', -- 'queued', 'processing', 'completed', 'failed'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. RLS POLICIES
ALTER TABLE system_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE background_jobs_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin sysadmin audit full" ON system_audit_logs;
CREATE POLICY "Admin sysadmin audit full" ON system_audit_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin sysadmin jobs full" ON background_jobs_queue;
CREATE POLICY "Admin sysadmin jobs full" ON background_jobs_queue FOR ALL TO authenticated USING (true) WITH CHECK (true);
