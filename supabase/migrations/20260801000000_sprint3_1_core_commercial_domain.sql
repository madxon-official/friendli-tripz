-- ============================================================================
-- FRIENDLI TRIPZ - SPRINT 3.1: CORE COMMERCIAL DOMAIN
-- Migration: 20260801000000_sprint3_1_core_commercial_domain.sql
-- ============================================================================

-- 1. FOUNDATIONAL EXTENSIONS & TRIGGER FUNCTIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. ENUMS
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'package_release_status') THEN
    CREATE TYPE package_release_status AS ENUM ('draft', 'active', 'superseded', 'archived');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'instance_type') THEN
    CREATE TYPE instance_type AS ENUM ('fixed_departure', 'private_quote', 'corporate_group', 'ai_proposal');
  END IF;
END $$;

-- 3. PACKAGE FAMILIES (IDENTITY LAYER)
CREATE TABLE IF NOT EXISTS package_families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  family_slug CITEXT NOT NULL UNIQUE,
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE RESTRICT,
  category_id UUID REFERENCES attraction_categories(id) ON DELETE SET NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

DROP TRIGGER IF EXISTS update_package_families_updated_at ON package_families;
CREATE TRIGGER update_package_families_updated_at
BEFORE UPDATE ON package_families
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. PACKAGE RELEASES (COMMERCIAL PRODUCTS - IMMUTABLE VERSIONS)
CREATE TABLE IF NOT EXISTS package_releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES package_families(id) ON DELETE CASCADE,
  version_tag VARCHAR(20) NOT NULL,
  title TEXT NOT NULL,
  duration_days INTEGER NOT NULL CHECK (duration_days >= 1),
  duration_nights INTEGER NOT NULL CHECK (duration_nights >= 0),
  base_pricing_tree_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  commercial_terms_text TEXT,
  status package_release_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  UNIQUE(family_id, version_tag)
);

DROP TRIGGER IF EXISTS update_package_releases_updated_at ON package_releases;
CREATE TRIGGER update_package_releases_updated_at
BEFORE UPDATE ON package_releases
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. PACKAGE INSTANCES (OPERATIONAL EXECUTIONS)
CREATE TABLE IF NOT EXISTS package_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  release_id UUID NOT NULL REFERENCES package_releases(id) ON DELETE RESTRICT,
  instance_type instance_type NOT NULL DEFAULT 'private_quote',
  title TEXT NOT NULL,
  custom_pricing_tree_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  custom_notes TEXT,
  assigned_customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_agent_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  price_drift_detected BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

DROP TRIGGER IF EXISTS update_package_instances_updated_at ON package_instances;
CREATE TRIGGER update_package_instances_updated_at
BEFORE UPDATE ON package_instances
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. ITINERARY DAYS
CREATE TABLE IF NOT EXISTS itinerary_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  release_id UUID REFERENCES package_releases(id) ON DELETE CASCADE,
  instance_id UUID REFERENCES package_instances(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  theme_title TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  CHECK ((release_id IS NOT NULL AND instance_id IS NULL) OR (release_id IS NULL AND instance_id IS NOT NULL))
);

-- 7. TEMPORAL ITINERARY DAY SEGMENTS
CREATE TABLE IF NOT EXISTS itinerary_day_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_id UUID NOT NULL REFERENCES itinerary_days(id) ON DELETE CASCADE,
  sequence_order INTEGER NOT NULL,
  segment_type TEXT NOT NULL,
  planned_start_time TIME,
  planned_end_time TIME,
  duration_mins INTEGER NOT NULL DEFAULT 30,
  
  attraction_id UUID REFERENCES attractions(id) ON DELETE SET NULL,
  activity_offering_id UUID REFERENCES activity_offerings(id) ON DELETE SET NULL,
  
  origin_lat NUMERIC(10, 7),
  origin_lng NUMERIC(10, 7),
  destination_lat NUMERIC(10, 7),
  destination_lng NUMERIC(10, 7),
  transit_mode TEXT,
  cached_distance_km NUMERIC(6, 2),
  cached_eta_mins INTEGER,
  
  segment_title TEXT NOT NULL,
  custom_instructions TEXT,
  cost_override NUMERIC(10, 2),
  is_included_in_package BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_package_families_slug ON package_families(family_slug);
CREATE INDEX IF NOT EXISTS idx_package_families_dest ON package_families(destination_id);
CREATE INDEX IF NOT EXISTS idx_package_releases_family ON package_releases(family_id);
CREATE INDEX IF NOT EXISTS idx_package_releases_status ON package_releases(status);
CREATE INDEX IF NOT EXISTS idx_package_instances_release ON package_instances(release_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_days_release ON itinerary_days(release_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_days_instance ON itinerary_days(instance_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_segments_day ON itinerary_day_segments(day_id, sequence_order);

-- 9. ROW LEVEL SECURITY (RLS) POLICIES (IDEMPOTENT)
ALTER TABLE package_families ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_day_segments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public package_families select" ON package_families;
CREATE POLICY "Public package_families select" ON package_families FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public package_releases select" ON package_releases;
CREATE POLICY "Public package_releases select" ON package_releases FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS "Public package_instances select" ON package_instances;
CREATE POLICY "Public package_instances select" ON package_instances FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public itinerary_days select" ON itinerary_days;
CREATE POLICY "Public itinerary_days select" ON itinerary_days FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public itinerary_day_segments select" ON itinerary_day_segments;
CREATE POLICY "Public itinerary_day_segments select" ON itinerary_day_segments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin package_families full" ON package_families;
CREATE POLICY "Admin package_families full" ON package_families FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin package_releases full" ON package_releases;
CREATE POLICY "Admin package_releases full" ON package_releases FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin package_instances full" ON package_instances;
CREATE POLICY "Admin package_instances full" ON package_instances FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin itinerary_days full" ON itinerary_days;
CREATE POLICY "Admin itinerary_days full" ON itinerary_days FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin itinerary_day_segments full" ON itinerary_day_segments;
CREATE POLICY "Admin itinerary_day_segments full" ON itinerary_day_segments FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 10. SEED INITIAL PACKAGE FAMILY & RELEASE DATA
INSERT INTO package_families (id, name, family_slug, destination_id, description) VALUES (
  '11111111-1111-1111-1111-111111111101',
  'Misty Kodaikanal Escape',
  'misty-kodaikanal-escape',
  '55555555-5555-5555-5555-555555555501',
  'Signature 4-Day hill station itinerary covering Kodai Lake, Pillar Rocks, Pine Forest, and boating.'
) ON CONFLICT (family_slug) DO NOTHING;

INSERT INTO package_releases (
  id, family_id, version_tag, title, duration_days, duration_nights,
  base_pricing_tree_json, commercial_terms_text, status, published_at
) VALUES (
  '22222222-2222-2222-2222-222222222201',
  '11111111-1111-1111-1111-111111111101',
  'v1.0',
  '4-Day Misty Kodaikanal Escape (Classic Release)',
  4, 3,
  '{"base_adult_price": 14500, "base_child_price": 8500, "single_supplement": 4500, "currency": "INR"}'::jsonb,
  'Includes 3-Star MAP hotel, dedicated SUV transport, lake boating tickets, and all entry passes.',
  'active',
  now()
) ON CONFLICT (family_id, version_tag) DO NOTHING;

INSERT INTO itinerary_days (id, release_id, day_number, theme_title, description) VALUES
('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', 1, 'Arrival & Lake Promenade', 'Check-in to hilltop resort, evening promenade walk, and lake boating.'),
('33333333-3333-3333-3333-333333333302', '22222222-2222-2222-2222-222222222201', 2, 'Pillar Rocks & Pine Forest Trail', 'Explore dramatic cliff viewpoints, pine forests, and Guna caves.')
ON CONFLICT DO NOTHING;

INSERT INTO itinerary_day_segments (
  day_id, sequence_order, segment_type, planned_start_time, planned_end_time, duration_mins,
  attraction_id, activity_offering_id, segment_title, custom_instructions, cost_override, is_included_in_package
) VALUES
('33333333-3333-3333-3333-333333333301', 1, 'lodging_transition', '12:00', '13:00', 60, NULL, NULL, 'Resort Check-In & Refreshment', 'Welcome drink served on arrival.', 0.00, true),
('33333333-3333-3333-3333-333333333301', 2, 'attraction_visit', '14:30', '16:00', 90, '99999999-9999-9999-9999-999999999901', NULL, 'Kodai Lake Exploration', 'Stroll around 5km lake promenade.', 0.00, true),
('33333333-3333-3333-3333-333333333301', 3, 'activity_experience', '16:15', '17:00', 45, '99999999-9999-9999-9999-999999999901', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Kodai Lake 4-Seater Boat Ride', 'Show pre-issued boat club voucher.', 350.00, true)
ON CONFLICT DO NOTHING;
