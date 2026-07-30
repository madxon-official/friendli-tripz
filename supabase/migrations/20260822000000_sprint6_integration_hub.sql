-- ============================================================================
-- FRIENDLI TRIPZ - SPRINT 6.5: INTEGRATION HUB & THIRD-PARTY CONNECTORS
-- Migration: 20260822000000_sprint6_integration_hub.sql
-- ============================================================================

-- 1. INTEGRATION LOGS & OUTBOUND WEBHOOK QUEUE
CREATE TABLE IF NOT EXISTS external_integration_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connector_name TEXT NOT NULL, -- 'razorpay', 'whatsapp_cloud', 'google_maps', 'sendgrid'
  endpoint_url TEXT NOT NULL,
  request_payload JSONB DEFAULT '{}'::jsonb,
  response_status INTEGER NOT NULL,
  execution_latency_ms INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS webhook_outbound_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  target_url TEXT NOT NULL,
  payload_json JSONB NOT NULL,
  attempts_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending', -- 'pending', 'dispatched', 'failed'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. RLS POLICIES
ALTER TABLE external_integration_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_outbound_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin integration logs full" ON external_integration_logs;
CREATE POLICY "Admin integration logs full" ON external_integration_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin outbound queue full" ON webhook_outbound_queue;
CREATE POLICY "Admin outbound queue full" ON webhook_outbound_queue FOR ALL TO authenticated USING (true) WITH CHECK (true);
