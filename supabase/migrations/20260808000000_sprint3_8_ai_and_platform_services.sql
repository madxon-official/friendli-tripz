-- ============================================================================
-- FRIENDLI TRIPZ - SPRINT 3.8: AI PLANNER & PLATFORM EVENT BUS ARCHITECTURE
-- Migration: 20260808000000_sprint3_8_ai_and_platform_services.sql
-- ============================================================================

-- 1. PLATFORM DOMAIN EVENT BUS (ASYNC EVENT STREAM)
CREATE TABLE IF NOT EXISTS platform_domain_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  aggregate_type TEXT NOT NULL,
  aggregate_id UUID NOT NULL,
  event_payload_json JSONB NOT NULL,
  published_at TIMESTAMPTZ DEFAULT now()
);

-- 2. BUSINESS CAPABILITY REGISTRY
CREATE TABLE IF NOT EXISTS business_capability_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  capability_name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL DEFAULT 'core',
  is_active BOOLEAN DEFAULT true,
  config_json JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. AI EXPLANATION ENGINE LOGS
CREATE TABLE IF NOT EXISTS ai_plan_explanations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES itinerary_plans(id) ON DELETE CASCADE,
  reasoning_type TEXT NOT NULL,
  explanation_text TEXT NOT NULL,
  confidence_score NUMERIC(3, 2) DEFAULT 0.95,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. INDEXES
CREATE INDEX IF NOT EXISTS idx_domain_events_name ON platform_domain_events(event_name);
CREATE INDEX IF NOT EXISTS idx_domain_events_aggregate ON platform_domain_events(aggregate_type, aggregate_id);
CREATE INDEX IF NOT EXISTS idx_ai_explanations_plan ON ai_plan_explanations(plan_id);

-- 5. ROW LEVEL SECURITY (RLS) POLICIES (IDEMPOTENT)
ALTER TABLE platform_domain_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_capability_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_plan_explanations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public capability_registry select" ON business_capability_registry;
CREATE POLICY "Public capability_registry select" ON business_capability_registry FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public ai_explanations select" ON ai_plan_explanations;
CREATE POLICY "Public ai_explanations select" ON ai_plan_explanations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin domain_events full" ON platform_domain_events;
CREATE POLICY "Admin domain_events full" ON platform_domain_events FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin capability_registry full" ON business_capability_registry;
CREATE POLICY "Admin capability_registry full" ON business_capability_registry FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin ai_explanations full" ON ai_plan_explanations;
CREATE POLICY "Admin ai_explanations full" ON ai_plan_explanations FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 6. SEED INITIAL BUSINESS CAPABILITIES
INSERT INTO business_capability_registry (capability_name, category) VALUES
('Booking', 'core'),
('Inventory', 'core'),
('Pricing', 'core'),
('Payments', 'finance'),
('Documents', 'compliance'),
('Insurance', 'addon'),
('Visa', 'addon'),
('CRM', 'operations'),
('Rewards', 'marketing'),
('Fleet', 'operations')
ON CONFLICT (capability_name) DO NOTHING;
