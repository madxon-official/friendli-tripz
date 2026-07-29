-- ============================================================================
-- FRIENDLI TRIPZ - SPRINT 3.4: INVENTORY ORCHESTRATION ENGINE
-- Migration: 20260804000000_sprint3_4_inventory_engine.sql
-- ============================================================================

-- 1. ENUMS
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'hold_status') THEN
    CREATE TYPE hold_status AS ENUM ('temporary_hold', 'committed', 'expired', 'released');
  END IF;
END $$;

-- 2. RESERVATION SESSIONS (SAGA ORCHESTRATION CONTAINER)
CREATE TABLE IF NOT EXISTS reservation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. INVENTORY RESERVATIONS (ATOMIC RESOURCE HOLDS)
CREATE TABLE IF NOT EXISTS inventory_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES reservation_sessions(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL,
  resource_id UUID NOT NULL,
  target_date DATE NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity >= 1),
  hold_status hold_status NOT NULL DEFAULT 'temporary_hold',
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. INDEXES
CREATE INDEX IF NOT EXISTS idx_reservation_sessions_token ON reservation_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_inventory_res_session ON inventory_reservations(session_id);
CREATE INDEX IF NOT EXISTS idx_inventory_res_resource ON inventory_reservations(resource_type, resource_id, target_date);

-- 5. ROW LEVEL SECURITY (RLS) POLICIES (IDEMPOTENT)
ALTER TABLE reservation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_reservations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public reservation_sessions select" ON reservation_sessions;
CREATE POLICY "Public reservation_sessions select" ON reservation_sessions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public reservation_sessions insert" ON reservation_sessions;
CREATE POLICY "Public reservation_sessions insert" ON reservation_sessions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public inventory_reservations select" ON inventory_reservations;
CREATE POLICY "Public inventory_reservations select" ON inventory_reservations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public inventory_reservations insert" ON inventory_reservations;
CREATE POLICY "Public inventory_reservations insert" ON inventory_reservations FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin reservation_sessions full" ON reservation_sessions;
CREATE POLICY "Admin reservation_sessions full" ON reservation_sessions FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin inventory_reservations full" ON inventory_reservations;
CREATE POLICY "Admin inventory_reservations full" ON inventory_reservations FOR ALL TO authenticated USING (true) WITH CHECK (true);
