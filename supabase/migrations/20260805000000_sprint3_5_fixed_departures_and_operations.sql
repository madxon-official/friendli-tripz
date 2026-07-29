-- ============================================================================
-- FRIENDLI TRIPZ - SPRINT 3.5: FIXED DEPARTURES & OPERATIONS DOMAIN
-- Migration: 20260805000000_sprint3_5_fixed_departures_and_operations.sql
-- ============================================================================

-- 1. FIXED DEPARTURE EXECUTIONS
CREATE TABLE IF NOT EXISTS package_departures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  release_id UUID NOT NULL REFERENCES package_releases(id) ON DELETE RESTRICT,
  departure_code VARCHAR(30) NOT NULL UNIQUE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  
  min_travellers INTEGER NOT NULL DEFAULT 8,
  max_travellers INTEGER NOT NULL DEFAULT 14,
  current_booked_count INTEGER DEFAULT 0,
  
  is_guaranteed BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'open',
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

DROP TRIGGER IF EXISTS update_package_departures_updated_at ON package_departures;
CREATE TRIGGER update_package_departures_updated_at
BEFORE UPDATE ON package_departures
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 2. DEPARTURE CAPACITY POOLS
CREATE TABLE IF NOT EXISTS departure_capacity_pools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  departure_id UUID NOT NULL REFERENCES package_departures(id) ON DELETE CASCADE,
  pool_type TEXT NOT NULL,
  total_capacity INTEGER NOT NULL,
  allocated_capacity INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(departure_id, pool_type)
);

-- 3. PRIORITY WAITLISTS WITH CLAIM WINDOWS
CREATE TABLE IF NOT EXISTS departure_waitlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  departure_id UUID NOT NULL REFERENCES package_departures(id) ON DELETE CASCADE,
  position_number INTEGER NOT NULL,
  lead_name TEXT NOT NULL,
  lead_email CITEXT NOT NULL,
  lead_phone TEXT NOT NULL,
  passenger_count INTEGER DEFAULT 1,
  priority_token TEXT UNIQUE,
  claim_expires_at TIMESTAMPTZ,
  status TEXT DEFAULT 'waiting',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(departure_id, position_number)
);

-- 4. SOLO TRAVELLER ROOM MATCH POOL
CREATE TABLE IF NOT EXISTS room_match_pool (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  departure_id UUID NOT NULL REFERENCES package_departures(id) ON DELETE CASCADE,
  passenger_id UUID REFERENCES passenger_roster(id) ON DELETE CASCADE,
  gender TEXT NOT NULL,
  same_gender_requested BOOLEAN DEFAULT true,
  matched_with_passenger_id UUID REFERENCES passenger_roster(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'searching',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. INDEXES
CREATE INDEX IF NOT EXISTS idx_departures_release ON package_departures(release_id);
CREATE INDEX IF NOT EXISTS idx_departures_dates ON package_departures(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_waitlists_departure ON departure_waitlists(departure_id, position_number);
CREATE INDEX IF NOT EXISTS idx_room_match_departure ON room_match_pool(departure_id);

-- 6. ROW LEVEL SECURITY (RLS) POLICIES (IDEMPOTENT)
ALTER TABLE package_departures ENABLE ROW LEVEL SECURITY;
ALTER TABLE departure_capacity_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE departure_waitlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_match_pool ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public package_departures select" ON package_departures;
CREATE POLICY "Public package_departures select" ON package_departures FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public waitlists select" ON departure_waitlists;
CREATE POLICY "Public waitlists select" ON departure_waitlists FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin package_departures full" ON package_departures;
CREATE POLICY "Admin package_departures full" ON package_departures FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin departure_capacity_pools full" ON departure_capacity_pools;
CREATE POLICY "Admin departure_capacity_pools full" ON departure_capacity_pools FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin departure_waitlists full" ON departure_waitlists;
CREATE POLICY "Admin departure_waitlists full" ON departure_waitlists FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin room_match_pool full" ON room_match_pool;
CREATE POLICY "Admin room_match_pool full" ON room_match_pool FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7. SEED SAMPLE FIXED DEPARTURE
INSERT INTO package_departures (
  id, release_id, departure_code, start_date, end_date, min_travellers, max_travellers, current_booked_count, is_guaranteed, status
) VALUES (
  '77777777-7777-7777-7777-777777777702',
  '22222222-2222-2222-2222-222222222201',
  'DEP-KODAI-20261024',
  '2026-10-24', '2026-10-27',
  8, 14, 10, true, 'guaranteed'
) ON CONFLICT (departure_code) DO NOTHING;

INSERT INTO departure_capacity_pools (departure_id, pool_type, total_capacity, allocated_capacity) VALUES
('77777777-7777-7777-7777-777777777702', 'passenger', 14, 10),
('77777777-7777-7777-7777-777777777702', 'transport', 14, 10),
('77777777-7777-7777-7777-777777777702', 'accommodation', 7, 5)
ON CONFLICT (departure_id, pool_type) DO NOTHING;
