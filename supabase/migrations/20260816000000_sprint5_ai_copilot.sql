-- ============================================================================
-- FRIENDLI TRIPZ - SPRINT 5.7: AI OPERATIONS COPILOT
-- Migration: 20260816000000_sprint5_ai_copilot.sql
-- ============================================================================

-- 1. AI COPILOT LOGS & RISK ALERTS
CREATE TABLE IF NOT EXISTS ai_copilot_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  query_text TEXT NOT NULL,
  copilot_response_json JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. RLS POLICIES
ALTER TABLE ai_copilot_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin copilot full" ON ai_copilot_logs;
CREATE POLICY "Admin copilot full" ON ai_copilot_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);
