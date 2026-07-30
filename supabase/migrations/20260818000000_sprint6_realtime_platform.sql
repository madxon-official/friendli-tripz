-- ============================================================================
-- FRIENDLI TRIPZ - SPRINT 6.1: REALTIME PLATFORM & LIVE PRESENCE
-- Migration: 20260818000000_sprint6_realtime_platform.sql
-- ============================================================================

-- 1. PRESENCE SESSIONS & LIVE DRIVER GEOLOCATION STREAM
CREATE TABLE IF NOT EXISTS presence_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  user_role TEXT NOT NULL DEFAULT 'traveller', -- 'traveller', 'driver', 'tour_leader', 'admin', 'vendor'
  current_route TEXT,
  last_active_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS live_driver_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deployment_id UUID REFERENCES operational_deployments(id) ON DELETE CASCADE,
  driver_assignment_id UUID REFERENCES driver_assignments(id) ON DELETE CASCADE,
  latitude NUMERIC(10, 7) NOT NULL,
  longitude NUMERIC(10, 7) NOT NULL,
  speed_kmh NUMERIC(5, 2) DEFAULT 0.00,
  heading_degrees NUMERIC(5, 2) DEFAULT 0.00,
  recorded_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS realtime_event_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  subscriber_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. RLS POLICIES
ALTER TABLE presence_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_driver_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE realtime_event_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public presence full" ON presence_sessions;
CREATE POLICY "Public presence full" ON presence_sessions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public live driver location full" ON live_driver_locations;
CREATE POLICY "Public live driver location full" ON live_driver_locations FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public event subs full" ON realtime_event_subscriptions;
CREATE POLICY "Public event subs full" ON realtime_event_subscriptions FOR ALL USING (true) WITH CHECK (true);

-- 3. SEED INITIAL REALTIME SAMPLE DATA
INSERT INTO live_driver_locations (
  deployment_id, driver_assignment_id, latitude, longitude, speed_kmh, heading_degrees
) VALUES (
  '66666666-6666-6666-6666-666666666601',
  (SELECT id FROM driver_assignments LIMIT 1),
  10.2381, 77.4892, 42.50, 180.00
) ON CONFLICT DO NOTHING;
