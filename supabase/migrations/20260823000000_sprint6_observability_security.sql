-- ============================================================================
-- FRIENDLI TRIPZ - SPRINT 6.6: OBSERVABILITY & SECURITY PLATFORM
-- Migration: 20260823000000_sprint6_observability_security.sql
-- ============================================================================

-- 1. SECURITY EVENTS & BOT DETECTION LOGS
CREATE TABLE IF NOT EXISTS security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL, -- 'auth_failure', 'csrf_mismatch', 'rate_limit_exceeded', 'suspicious_payload'
  severity TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  ip_address TEXT,
  user_agent TEXT,
  payload_json JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bot_detection_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  bot_score NUMERIC(3,2) NOT NULL DEFAULT 0.00, -- 0.00 (Human) to 1.00 (Bot)
  action_blocked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS performance_spans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  span_name TEXT NOT NULL,
  duration_ms INTEGER NOT NULL,
  route_path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. RLS POLICIES
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_detection_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_spans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin security events full" ON security_events;
CREATE POLICY "Admin security events full" ON security_events FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin bot logs full" ON bot_detection_logs;
CREATE POLICY "Admin bot logs full" ON bot_detection_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin perf spans full" ON performance_spans;
CREATE POLICY "Admin perf spans full" ON performance_spans FOR ALL TO authenticated USING (true) WITH CHECK (true);
