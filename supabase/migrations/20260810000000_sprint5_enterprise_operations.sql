-- ============================================================================
-- FRIENDLI TRIPZ - SPRINT 5.1: ENTERPRISE OPERATIONS COMMAND CENTER (REFACTORED)
-- Migration: 20260810000000_sprint5_enterprise_operations.sql
-- ============================================================================

-- 1. OPERATIONAL DEPLOYMENTS (LIVE DEPARTURE CONTROL)
CREATE TABLE IF NOT EXISTS operational_deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  instance_id UUID REFERENCES package_instances(id) ON DELETE SET NULL,
  departure_date DATE NOT NULL,
  return_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled', -- 'scheduled', 'ready', 'in_transit', 'completed', 'delayed', 'emergency'
  readiness_score INTEGER NOT NULL DEFAULT 85 CHECK (readiness_score >= 0 AND readiness_score <= 100),
  delay_mins INTEGER DEFAULT 0,
  has_resource_conflict BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. VEHICLE & DRIVER ASSIGNMENTS (CANONICAL REF TO vendors(id))
CREATE TABLE IF NOT EXISTS vehicle_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deployment_id UUID NOT NULL REFERENCES operational_deployments(id) ON DELETE CASCADE,
  vehicle_model TEXT NOT NULL,
  vehicle_number TEXT NOT NULL,
  assigned_vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL, -- CANONICAL REF TO vendors(id)
  status TEXT DEFAULT 'assigned', -- 'assigned', 'inspected', 'active', 'released'
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS driver_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deployment_id UUID NOT NULL REFERENCES operational_deployments(id) ON DELETE CASCADE,
  driver_name TEXT NOT NULL,
  driver_phone TEXT NOT NULL,
  license_number TEXT,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS guide_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deployment_id UUID NOT NULL REFERENCES operational_deployments(id) ON DELETE CASCADE,
  guide_name TEXT NOT NULL,
  guide_phone TEXT NOT NULL,
  badge_number TEXT,
  languages TEXT[] DEFAULT '{"English", "Tamil"}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. HOTEL ALLOCATIONS & ROOMING LISTS
CREATE TABLE IF NOT EXISTS hotel_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deployment_id UUID NOT NULL REFERENCES operational_deployments(id) ON DELETE CASCADE,
  hotel_name TEXT NOT NULL,
  location TEXT NOT NULL,
  room_category TEXT NOT NULL DEFAULT 'Standard MAP',
  allocated_rooms_count INTEGER NOT NULL DEFAULT 1,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  voucher_status TEXT DEFAULT 'issued',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rooming_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  allocation_id UUID NOT NULL REFERENCES hotel_allocations(id) ON DELETE CASCADE,
  room_number VARCHAR(20),
  passenger_names TEXT[] NOT NULL,
  special_requests TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. PICKUP MANIFESTS & OPERATIONAL ALERTS
CREATE TABLE IF NOT EXISTS pickup_manifests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deployment_id UUID NOT NULL REFERENCES operational_deployments(id) ON DELETE CASCADE,
  pickup_time TIME NOT NULL,
  pickup_location TEXT NOT NULL,
  passenger_name TEXT NOT NULL,
  passenger_phone TEXT NOT NULL,
  baggage_count INTEGER DEFAULT 1,
  boarding_status TEXT DEFAULT 'pending', -- 'pending', 'boarded', 'no_show'
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS operational_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deployment_id UUID REFERENCES operational_deployments(id) ON DELETE CASCADE,
  alert_level TEXT NOT NULL DEFAULT 'warning', -- 'info', 'warning', 'critical', 'emergency'
  alert_type TEXT NOT NULL, -- 'delay', 'vehicle_breakdown', 'driver_unreachable', 'weather', 'medical'
  message TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. INDEXES
CREATE INDEX IF NOT EXISTS idx_ops_deployments_date ON operational_deployments(departure_date);
CREATE INDEX IF NOT EXISTS idx_ops_deployments_status ON operational_deployments(status);
CREATE INDEX IF NOT EXISTS idx_ops_alerts_level ON operational_alerts(alert_level, is_resolved);

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE operational_deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooming_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE pickup_manifests ENABLE ROW LEVEL SECURITY;
ALTER TABLE operational_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin operations full" ON operational_deployments;
CREATE POLICY "Admin operations full" ON operational_deployments FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin vehicles full" ON vehicle_assignments;
CREATE POLICY "Admin vehicles full" ON vehicle_assignments FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin drivers full" ON driver_assignments;
CREATE POLICY "Admin drivers full" ON driver_assignments FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin guides full" ON guide_assignments;
CREATE POLICY "Admin guides full" ON guide_assignments FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin hotel allocations full" ON hotel_allocations;
CREATE POLICY "Admin hotel allocations full" ON hotel_allocations FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin rooming lists full" ON rooming_lists;
CREATE POLICY "Admin rooming lists full" ON rooming_lists FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin manifests full" ON pickup_manifests;
CREATE POLICY "Admin manifests full" ON pickup_manifests FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin alerts full" ON operational_alerts;
CREATE POLICY "Admin alerts full" ON operational_alerts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7. SEED INITIAL OPERATIONAL DEPLOYMENT DATA
INSERT INTO operational_deployments (
  id, booking_id, departure_date, return_date, status, readiness_score, delay_mins, has_resource_conflict
) VALUES (
  '66666666-6666-6666-6666-666666666601',
  '55555555-5555-5555-5555-555555555502',
  '2026-10-15', '2026-10-18', 'ready', 95, 0, false
) ON CONFLICT DO NOTHING;

INSERT INTO vehicle_assignments (deployment_id, vehicle_model, vehicle_number, assigned_vendor_id) VALUES
('66666666-6666-6666-6666-666666666601', 'Toyota Innova Crysta 7-Seater', 'TN-57-AB-9876', '88888888-8888-8888-8888-888888888802')
ON CONFLICT DO NOTHING;

INSERT INTO driver_assignments (deployment_id, driver_name, driver_phone, license_number) VALUES
('66666666-6666-6666-6666-666666666601', 'Mani Kumar', '+919443210987', 'DL-TN57-2018-00918')
ON CONFLICT DO NOTHING;

INSERT INTO guide_assignments (deployment_id, guide_name, guide_phone, badge_number) VALUES
('66666666-6666-6666-6666-666666666601', 'Suresh Raman', '+919876543211', 'GUIDE-TN-KODAI-104')
ON CONFLICT DO NOTHING;

INSERT INTO hotel_allocations (id, deployment_id, hotel_name, location, room_category, allocated_rooms_count, check_in_date, check_out_date) VALUES
('77777777-7777-7777-7777-777777777701', '66666666-6666-6666-6666-666666666601', 'Grand Hilltop Resort', 'Kodaikanal Lake Area', 'Valley View Suite', 1, '2026-10-15', '2026-10-18')
ON CONFLICT DO NOTHING;

INSERT INTO rooming_lists (allocation_id, room_number, passenger_names, special_requests) VALUES
('77777777-7777-7777-7777-777777777701', 'Room 204', ARRAY['Rahul Sharma', 'Priya Sharma'], '2nd floor lake view room requested.')
ON CONFLICT DO NOTHING;
