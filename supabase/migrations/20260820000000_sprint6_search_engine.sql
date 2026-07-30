-- ============================================================================
-- FRIENDLI TRIPZ - SPRINT 6.3: GLOBAL SEARCH ENGINE & TRIGRAM INDEXES
-- Migration: 20260820000000_sprint6_search_engine.sql
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. TRIGRAM INDEXES FOR FAST FUZZY MATCHING
CREATE INDEX IF NOT EXISTS idx_trgm_bookings_code ON bookings USING gin (booking_code gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_trgm_destinations_name ON destinations USING gin (name gin_trgm_ops);

-- 3. SEARCH ANALYTICS AUDIT LOG
CREATE TABLE IF NOT EXISTS universal_search_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_text TEXT NOT NULL,
  results_count INTEGER NOT NULL DEFAULT 0,
  execution_time_ms NUMERIC(6,2) NOT NULL DEFAULT 0.00,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. RLS POLICIES
ALTER TABLE universal_search_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public search logs full" ON universal_search_logs;
CREATE POLICY "Public search logs full" ON universal_search_logs FOR ALL USING (true) WITH CHECK (true);
