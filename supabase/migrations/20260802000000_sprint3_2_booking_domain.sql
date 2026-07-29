-- ============================================================================
-- FRIENDLI TRIPZ - SPRINT 3.2: BOOKING DOMAIN
-- Migration: 20260802000000_sprint3_2_booking_domain.sql
-- ============================================================================

-- 1. ENUMS
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
    CREATE TYPE booking_status AS ENUM ('draft', 'pending_payment', 'confirmed', 'in_progress', 'completed', 'amendment_pending', 'cancelled');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'amendment_status') THEN
    CREATE TYPE amendment_status AS ENUM ('requested', 'impact_analyzed', 'approved', 'rejected', 'executed');
  END IF;
END $$;

-- 2. BOOKINGS (COMMERCIAL CONTRACT CONTAINER)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code VARCHAR(20) NOT NULL UNIQUE,
  instance_id UUID NOT NULL REFERENCES package_instances(id) ON DELETE RESTRICT,
  
  lead_booker_name TEXT NOT NULL,
  lead_booker_email CITEXT NOT NULL,
  lead_booker_phone TEXT NOT NULL,
  
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  passenger_count INTEGER NOT NULL CHECK (passenger_count >= 1),
  
  total_gross_amount NUMERIC(10, 2) NOT NULL,
  total_tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  total_net_cost NUMERIC(10, 2) NOT NULL,
  margin_amount NUMERIC(10, 2) NOT NULL,
  margin_percentage NUMERIC(5, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  
  status booking_status NOT NULL DEFAULT 'draft',
  current_revision_number INTEGER DEFAULT 1,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. PASSENGER ROSTER
CREATE TABLE IF NOT EXISTS passenger_roster (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  age INTEGER CHECK (age >= 0),
  gender TEXT,
  dietary_preference TEXT DEFAULT 'standard',
  special_assistance_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. IMMUTABLE BOOKING SNAPSHOTS
CREATE TABLE IF NOT EXISTS booking_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  revision_number INTEGER NOT NULL,
  serialized_contract_json JSONB NOT NULL,
  snapshot_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(booking_id, revision_number)
);

-- 5. BOOKING STATE TRANSITIONS AUDIT LOG
CREATE TABLE IF NOT EXISTS booking_state_transitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  from_status booking_status NOT NULL,
  to_status booking_status NOT NULL,
  reason TEXT,
  initiated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. AMENDMENT-DRIVEN CHANGE GOVERNANCE
CREATE TABLE IF NOT EXISTS booking_amendments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  amendment_type TEXT NOT NULL,
  requested_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  amendment_payload_json JSONB NOT NULL,
  
  operational_impact_json JSONB DEFAULT '{}'::jsonb,
  commercial_price_diff NUMERIC(10, 2) DEFAULT 0.00,
  financial_refund_or_due NUMERIC(10, 2) DEFAULT 0.00,
  
  status amendment_status NOT NULL DEFAULT 'requested',
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  executed_at TIMESTAMPTZ
);

-- 7. INDEXES
CREATE INDEX IF NOT EXISTS idx_bookings_code ON bookings(booking_code);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(lead_booker_email);
CREATE INDEX IF NOT EXISTS idx_passenger_roster_booking ON passenger_roster(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_snapshots_booking ON booking_snapshots(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_amendments_booking ON booking_amendments(booking_id);

-- 8. ROW LEVEL SECURITY (RLS) POLICIES (IDEMPOTENT)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE passenger_roster ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_state_transitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_amendments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public bookings select own" ON bookings;
CREATE POLICY "Public bookings select own" ON bookings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public passenger_roster select" ON passenger_roster;
CREATE POLICY "Public passenger_roster select" ON passenger_roster FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public snapshots select" ON booking_snapshots;
CREATE POLICY "Public snapshots select" ON booking_snapshots FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public amendments select" ON booking_amendments;
CREATE POLICY "Public amendments select" ON booking_amendments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin bookings full" ON bookings;
CREATE POLICY "Admin bookings full" ON bookings FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin passenger_roster full" ON passenger_roster;
CREATE POLICY "Admin passenger_roster full" ON passenger_roster FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin snapshots full" ON booking_snapshots;
CREATE POLICY "Admin snapshots full" ON booking_snapshots FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin state transitions full" ON booking_state_transitions;
CREATE POLICY "Admin state transitions full" ON booking_state_transitions FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin amendments full" ON booking_amendments;
CREATE POLICY "Admin amendments full" ON booking_amendments FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 9. SEED SAMPLE CONFIRMED BOOKING & SNAPSHOT
INSERT INTO package_instances (
  id, release_id, instance_type, title, custom_pricing_tree_json, custom_notes
) VALUES (
  '44444444-4444-4444-4444-444444444401',
  '22222222-2222-2222-2222-222222222201',
  'private_quote',
  'Private Kodaikanal Tour Instance - Sharma Family',
  '{"base_adult_price": 14500, "base_child_price": 8500, "margin_percentage": 18}'::jsonb,
  'Special request: Lake view room on 2nd floor.'
) ON CONFLICT DO NOTHING;

INSERT INTO bookings (
  id, booking_code, instance_id, lead_booker_name, lead_booker_email, lead_booker_phone,
  start_date, end_date, passenger_count, total_gross_amount, total_tax_amount, total_net_cost,
  margin_amount, margin_percentage, currency, status, current_revision_number
) VALUES (
  '55555555-5555-5555-5555-555555555502',
  'FT-2026-9001',
  '44444444-4444-4444-4444-444444444401',
  'Rahul Sharma',
  'rahul.sharma@example.com',
  '+919876543210',
  '2026-10-15', '2026-10-18', 2,
  29000.00, 1450.00, 23000.00,
  6000.00, 20.69, 'INR', 'confirmed', 1
) ON CONFLICT (booking_code) DO NOTHING;

INSERT INTO passenger_roster (booking_id, first_name, last_name, age, gender, dietary_preference) VALUES
('55555555-5555-5555-5555-555555555502', 'Rahul', 'Sharma', 34, 'male', 'vegetarian'),
('55555555-5555-5555-5555-555555555502', 'Priya', 'Sharma', 32, 'female', 'vegetarian')
ON CONFLICT DO NOTHING;

INSERT INTO booking_snapshots (
  booking_id, revision_number, serialized_contract_json, snapshot_hash
) VALUES (
  '55555555-5555-5555-5555-555555555502', 1,
  '{"booking_code": "FT-2026-9001", "package": "Misty Kodaikanal Escape", "total_gross": 29000}'::jsonb,
  'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
) ON CONFLICT (booking_id, revision_number) DO NOTHING;
