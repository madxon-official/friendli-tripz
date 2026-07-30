-- ============================================================================
-- FRIENDLI TRIPZ - SPRINT 6.2: BACKGROUND WORKERS & QUEUE ENGINE
-- Migration: 20260819000000_sprint6_background_workers.sql
-- ============================================================================

-- 1. DEAD LETTER QUEUE & SCHEDULED CRON JOBS
CREATE TABLE IF NOT EXISTS dead_letter_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_job_id UUID,
  job_type TEXT NOT NULL,
  payload_json JSONB NOT NULL,
  error_stacktrace TEXT NOT NULL,
  retry_count INTEGER DEFAULT 3,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS scheduled_cron_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name TEXT NOT NULL UNIQUE, -- 'inventory_hold_purge', 'payment_reminder', 'voucher_dispatch', 'settlement_processor'
  cron_expression TEXT NOT NULL,
  last_executed_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inventory_hold_leases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID REFERENCES package_instances(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  hold_expires_at TIMESTAMPTZ NOT NULL,
  is_released BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. RLS POLICIES
ALTER TABLE dead_letter_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_cron_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_hold_leases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin dlq full" ON dead_letter_queue;
CREATE POLICY "Admin dlq full" ON dead_letter_queue FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin cron jobs full" ON scheduled_cron_jobs;
CREATE POLICY "Admin cron jobs full" ON scheduled_cron_jobs FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public hold leases full" ON inventory_hold_leases;
CREATE POLICY "Public hold leases full" ON inventory_hold_leases FOR ALL USING (true) WITH CHECK (true);

-- 3. SEED SCHEDULED CRON JOBS
INSERT INTO scheduled_cron_jobs (job_name, cron_expression, next_run_at) VALUES
('inventory_hold_purge', '*/5 * * * *', now() + interval '5 minutes'),
('payment_reminder_dispatcher', '0 9 * * *', now() + interval '1 day'),
('vendor_settlement_processor', '0 0 * * 1', now() + interval '7 days')
ON CONFLICT (job_name) DO NOTHING;
