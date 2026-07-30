-- ============================================================================
-- FRIENDLI TRIPZ - SPRINT 5.6: ANALYTICS & BUSINESS INTELLIGENCE
-- Migration: 20260815000000_sprint5_analytics_bi.sql
-- ============================================================================

-- 1. BI SNAPSHOTS & PREDICTIONS
CREATE TABLE IF NOT EXISTS bi_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date DATE NOT NULL UNIQUE,
  total_revenue NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  total_bookings INTEGER NOT NULL DEFAULT 0,
  conversion_rate NUMERIC(5,2) DEFAULT 0.00,
  occupancy_prediction_percentage NUMERIC(5,2) DEFAULT 88.5,
  demand_forecast_score NUMERIC(5,2) DEFAULT 92.0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. RLS POLICIES
ALTER TABLE bi_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin bi full" ON bi_snapshots;
CREATE POLICY "Admin bi full" ON bi_snapshots FOR ALL TO authenticated USING (true) WITH CHECK (true);
