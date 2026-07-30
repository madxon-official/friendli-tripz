-- ============================================================================
-- FRIENDLI TRIPZ - SPRINT 6.4: PUBLIC API PLATFORM & WEBHOOKS
-- Migration: 20260821000000_sprint6_public_apis.sql
-- ============================================================================

-- 1. API KEYS & WEBHOOK SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_prefix VARCHAR(10) NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  partner_name TEXT NOT NULL,
  rate_limit_per_min INTEGER DEFAULT 60,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS webhook_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_name TEXT NOT NULL,
  target_url TEXT NOT NULL,
  secret_token TEXT NOT NULL,
  subscribed_events TEXT[] DEFAULT '{"booking.confirmed", "trip.status_changed"}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS api_usage_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID REFERENCES api_keys(id) ON DELETE CASCADE,
  endpoint_path TEXT NOT NULL,
  http_method TEXT NOT NULL,
  response_status INTEGER NOT NULL,
  latency_ms INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. RLS POLICIES
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin api keys full" ON api_keys;
CREATE POLICY "Admin api keys full" ON api_keys FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin webhooks full" ON webhook_subscriptions;
CREATE POLICY "Admin webhooks full" ON webhook_subscriptions FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin api analytics full" ON api_usage_analytics;
CREATE POLICY "Admin api analytics full" ON api_usage_analytics FOR ALL TO authenticated USING (true) WITH CHECK (true);
