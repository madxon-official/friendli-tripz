-- ============================================================================
-- FRIENDLI TRIPZ - SPRINT 5.2: DRIVER PWA & TOUR LEADER PLATFORM
-- Migration: 20260811000000_sprint5_driver_and_leader.sql
-- ============================================================================

-- 1. VEHICLE INSPECTIONS & FUEL LOGS
CREATE TABLE IF NOT EXISTS vehicle_inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_assignment_id UUID REFERENCES driver_assignments(id) ON DELETE CASCADE,
  vehicle_number TEXT NOT NULL,
  odometer_reading INTEGER NOT NULL,
  tyre_condition TEXT NOT NULL DEFAULT 'good',
  brake_condition TEXT NOT NULL DEFAULT 'good',
  first_aid_kit_present BOOLEAN DEFAULT true,
  inspection_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fuel_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_assignment_id UUID REFERENCES driver_assignments(id) ON DELETE CASCADE,
  litres_filled NUMERIC(6,2) NOT NULL,
  total_cost NUMERIC(10,2) NOT NULL,
  receipt_photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. TOUR LEADER INCIDENTS & EXPENSES
CREATE TABLE IF NOT EXISTS incident_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deployment_id UUID REFERENCES operational_deployments(id) ON DELETE CASCADE,
  reporter_name TEXT NOT NULL,
  incident_type TEXT NOT NULL, -- 'medical', 'delay', 'weather', 'lost_property', 'vehicle'
  description TEXT NOT NULL,
  action_taken TEXT,
  severity TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS leader_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deployment_id UUID REFERENCES operational_deployments(id) ON DELETE CASCADE,
  expense_category TEXT NOT NULL, -- 'fuel', 'toll', 'parking', 'guide_fee', 'emergency'
  amount NUMERIC(10,2) NOT NULL,
  notes TEXT,
  receipt_photo_url TEXT,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. RLS POLICIES
ALTER TABLE vehicle_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE fuel_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE leader_expenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public inspections full" ON vehicle_inspections;
CREATE POLICY "Public inspections full" ON vehicle_inspections FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public fuel logs full" ON fuel_logs;
CREATE POLICY "Public fuel logs full" ON fuel_logs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public incidents full" ON incident_reports;
CREATE POLICY "Public incidents full" ON incident_reports FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public expenses full" ON leader_expenses;
CREATE POLICY "Public expenses full" ON leader_expenses FOR ALL USING (true) WITH CHECK (true);
