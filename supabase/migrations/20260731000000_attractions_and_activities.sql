-- ============================================================================
-- FRIENDLI TRIPZ - SPRINT 2: ATTRACTIONS & ACTIVITIES MODULE
-- Migration: 20260731000000_attractions_and_activities.sql
-- ============================================================================

-- 1. ENUMS
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'attraction_status') THEN
    CREATE TYPE attraction_status AS ENUM ('draft', 'published', 'coming_soon', 'archived');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'activity_status') THEN
    CREATE TYPE activity_status AS ENUM ('draft', 'published', 'coming_soon', 'archived');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fitness_level') THEN
    CREATE TYPE fitness_level AS ENUM ('none', 'light', 'moderate', 'strenuous', 'extreme');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'age_suitability') THEN
    CREATE TYPE age_suitability AS ENUM ('all_ages', 'kids', 'adults_only', 'seniors');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'offering_capacity_type') THEN
    CREATE TYPE offering_capacity_type AS ENUM ('per_person', 'per_vehicle', 'per_group', 'slot_based');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'exception_type') THEN
    CREATE TYPE exception_type AS ENUM ('seasonal_closure', 'maintenance', 'weather', 'special_hours', 'government_holiday');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'validation_level') THEN
    CREATE TYPE validation_level AS ENUM ('informational', 'warning', 'blocking');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'participant_type') THEN
    CREATE TYPE participant_type AS ENUM ('adult', 'child', 'senior', 'foreigner', 'group_flat');
  END IF;
END $$;

-- 2. LOCALES & TRANSLATION REGISTRY

CREATE TABLE IF NOT EXISTS locales (
  code VARCHAR(10) PRIMARY KEY,
  language_name TEXT NOT NULL,
  native_name TEXT NOT NULL,
  direction VARCHAR(3) DEFAULT 'ltr',
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  date_format TEXT DEFAULT 'DD/MM/YYYY',
  currency_code VARCHAR(3) DEFAULT 'INR',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS entity_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  locale_code VARCHAR(10) NOT NULL REFERENCES locales(code) ON DELETE RESTRICT,
  field_name TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  translated_slug TEXT,
  workflow_status TEXT DEFAULT 'approved',
  version INTEGER DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  UNIQUE(entity_type, entity_id, locale_code, field_name)
);

CREATE TABLE IF NOT EXISTS entity_locale_slug_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  locale_code VARCHAR(10) NOT NULL REFERENCES locales(code) ON DELETE RESTRICT,
  old_slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. ENTERPRISE DIGITAL ASSET MANAGEMENT (DAM)

CREATE TABLE IF NOT EXISTS media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_bucket TEXT NOT NULL DEFAULT 'tripz-media',
  storage_path TEXT NOT NULL UNIQUE,
  mime_type TEXT NOT NULL,
  original_filename TEXT,
  width INTEGER,
  height INTEGER,
  aspect_ratio NUMERIC(4, 2),
  blurhash TEXT,
  focal_point_x NUMERIC(3, 2) DEFAULT 0.50,
  focal_point_y NUMERIC(3, 2) DEFAULT 0.50,
  alt_text TEXT,
  caption TEXT,
  photographer TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS media_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
  variant_type TEXT NOT NULL,
  url TEXT NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  file_size_bytes INTEGER,
  format VARCHAR(10) DEFAULT 'webp',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(asset_id, variant_type)
);

CREATE TABLE IF NOT EXISTS entity_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'gallery',
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(entity_type, entity_id, asset_id, role)
);

-- 4. SPATIAL SUB-ZONES

CREATE TABLE IF NOT EXISTS destination_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(destination_id, name)
);

-- 5. ATTRACTIONS & ACTIVITIES MASTER ENTITIES

CREATE TABLE IF NOT EXISTS attraction_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon_name TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS attractions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE RESTRICT,
  zone_id UUID REFERENCES destination_zones(id) ON DELETE SET NULL,
  category_id UUID NOT NULL REFERENCES attraction_categories(id) ON DELETE RESTRICT,
  
  latitude NUMERIC(10, 7) NOT NULL,
  longitude NUMERIC(10, 7) NOT NULL,
  address_text TEXT,
  
  short_tagline TEXT,
  description TEXT,
  suggested_duration_mins INTEGER DEFAULT 90,
  
  pet_allowed BOOLEAN DEFAULT false,
  wheelchair_accessible BOOLEAN DEFAULT false,
  parking_available BOOLEAN DEFAULT true,
  restrooms_available BOOLEAN DEFAULT true,
  ideal_for TEXT[] DEFAULT '{}',
  
  entry_fee_type TEXT DEFAULT 'free',
  adult_entry_fee NUMERIC(10, 2) DEFAULT 0.00,
  child_entry_fee NUMERIC(10, 2) DEFAULT 0.00,
  foreign_national_fee NUMERIC(10, 2) DEFAULT 0.00,
  
  hero_banner_url TEXT,
  featured_image_url TEXT,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[] DEFAULT '{}',
  status attraction_status NOT NULL DEFAULT 'draft',
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  website_visibility BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS activity_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon_name TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category_id UUID NOT NULL REFERENCES activity_categories(id) ON DELETE RESTRICT,
  
  short_description TEXT,
  full_description TEXT,
  fitness_level fitness_level DEFAULT 'light',
  age_suitability age_suitability DEFAULT 'all_ages',
  min_age INTEGER DEFAULT 0,
  required_gear TEXT[] DEFAULT '{}',
  provided_gear TEXT[] DEFAULT '{}',
  default_duration_mins INTEGER DEFAULT 60,
  is_indoor BOOLEAN DEFAULT false,
  weather_dependent BOOLEAN DEFAULT true,
  
  hero_image_url TEXT,
  icon_name TEXT DEFAULT 'Activity',
  meta_title TEXT,
  meta_description TEXT,
  status activity_status NOT NULL DEFAULT 'draft',
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. ACTIVITY OFFERINGS & PRICING RULES

CREATE TABLE IF NOT EXISTS activity_offerings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  master_activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE RESTRICT,
  attraction_id UUID REFERENCES attractions(id) ON DELETE CASCADE,
  destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  capacity_type offering_capacity_type DEFAULT 'per_person',
  max_capacity INTEGER DEFAULT 1,
  duration_mins INTEGER NOT NULL DEFAULT 60,
  vendor_name TEXT,
  booking_advance_days INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS offering_pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offering_id UUID NOT NULL REFERENCES activity_offerings(id) ON DELETE CASCADE,
  participant_type participant_type NOT NULL DEFAULT 'adult',
  base_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  currency VARCHAR(3) DEFAULT 'INR',
  effective_start_date DATE,
  effective_end_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. OPERATIONAL CALENDAR ENGINE

CREATE TABLE IF NOT EXISTS operating_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  open_time TIME NOT NULL,
  close_time TIME NOT NULL,
  is_closed BOOLEAN DEFAULT false,
  UNIQUE(entity_type, entity_id, day_of_week)
);

CREATE TABLE IF NOT EXISTS operational_exceptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  exception_type exception_type NOT NULL DEFAULT 'seasonal_closure',
  reason TEXT,
  override_open_time TIME,
  override_close_time TIME,
  validation_impact validation_level DEFAULT 'blocking',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS activity_time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offering_id UUID NOT NULL REFERENCES activity_offerings(id) ON DELETE CASCADE,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_capacity INTEGER NOT NULL DEFAULT 10,
  cutoff_mins_before INTEGER DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. ITINERARY PLANS (AI & PROPOSALS)

CREATE TABLE IF NOT EXISTS itinerary_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL,
  destination_id UUID NOT NULL REFERENCES destinations(id),
  constraints_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  plan_graph_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  total_estimated_cost NUMERIC(10, 2) DEFAULT 0.00,
  status TEXT DEFAULT 'proposal',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. SLUG HISTORIES FOR 301 REDIRECTS

CREATE TABLE IF NOT EXISTS attraction_slug_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attraction_id UUID NOT NULL REFERENCES attractions(id) ON DELETE CASCADE,
  old_slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS activity_slug_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  old_slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. INDEXES FOR QUERY OPTIMIZATION

CREATE INDEX IF NOT EXISTS idx_attractions_slug ON attractions(slug);
CREATE INDEX IF NOT EXISTS idx_attractions_destination ON attractions(destination_id);
CREATE INDEX IF NOT EXISTS idx_attractions_zone ON attractions(zone_id);
CREATE INDEX IF NOT EXISTS idx_attractions_category ON attractions(category_id);
CREATE INDEX IF NOT EXISTS idx_attractions_spatial ON attractions(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_attractions_status ON attractions(status);

CREATE INDEX IF NOT EXISTS idx_activities_slug ON activities(slug);
CREATE INDEX IF NOT EXISTS idx_activities_category ON activities(category_id);

CREATE INDEX IF NOT EXISTS idx_offerings_master ON activity_offerings(master_activity_id);
CREATE INDEX IF NOT EXISTS idx_offerings_attraction ON activity_offerings(attraction_id);
CREATE INDEX IF NOT EXISTS idx_offerings_destination ON activity_offerings(destination_id);

CREATE INDEX IF NOT EXISTS idx_media_assets_path ON media_assets(storage_path);
CREATE INDEX IF NOT EXISTS idx_entity_media_lookup ON entity_media(entity_type, entity_id, role);
CREATE INDEX IF NOT EXISTS idx_translations_lookup ON entity_translations(entity_type, entity_id, locale_code, field_name);

CREATE INDEX IF NOT EXISTS idx_schedules_entity ON operating_schedules(entity_type, entity_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_exceptions_entity_dates ON operational_exceptions(entity_type, entity_id, start_date, end_date);

-- 11. ROW LEVEL SECURITY (RLS) POLICIES

ALTER TABLE locales ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE destination_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE attraction_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE attractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_offerings ENABLE ROW LEVEL SECURITY;
ALTER TABLE offering_pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE operating_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE operational_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_media ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public locales select" ON locales FOR SELECT USING (true);
CREATE POLICY "Public translations select" ON entity_translations FOR SELECT USING (true);
CREATE POLICY "Public zones select" ON destination_zones FOR SELECT USING (true);
CREATE POLICY "Public attraction_categories select" ON attraction_categories FOR SELECT USING (true);
CREATE POLICY "Public attractions select" ON attractions FOR SELECT USING (status IN ('published', 'coming_soon') AND website_visibility = true);
CREATE POLICY "Public activity_categories select" ON activity_categories FOR SELECT USING (true);
CREATE POLICY "Public activities select" ON activities FOR SELECT USING (status IN ('published', 'coming_soon'));
CREATE POLICY "Public activity_offerings select" ON activity_offerings FOR SELECT USING (is_active = true);
CREATE POLICY "Public offering_pricing_rules select" ON offering_pricing_rules FOR SELECT USING (is_active = true);
CREATE POLICY "Public operating_schedules select" ON operating_schedules FOR SELECT USING (true);
CREATE POLICY "Public operational_exceptions select" ON operational_exceptions FOR SELECT USING (true);
CREATE POLICY "Public activity_time_slots select" ON activity_time_slots FOR SELECT USING (true);
CREATE POLICY "Public media_assets select" ON media_assets FOR SELECT USING (true);
CREATE POLICY "Public media_variants select" ON media_variants FOR SELECT USING (true);
CREATE POLICY "Public entity_media select" ON entity_media FOR SELECT USING (true);

-- Admin Write Policies
CREATE POLICY "Admin locales full" ON locales FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin translations full" ON entity_translations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin zones full" ON destination_zones FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin attraction_categories full" ON attraction_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin attractions select all" ON attractions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin attractions insert" ON attractions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin attractions update" ON attractions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin attractions delete" ON attractions FOR DELETE TO authenticated USING (true);
CREATE POLICY "Admin activity_categories full" ON activity_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin activities select all" ON activities FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin activities insert" ON activities FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin activities update" ON activities FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin activities delete" ON activities FOR DELETE TO authenticated USING (true);
CREATE POLICY "Admin activity_offerings full" ON activity_offerings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin offering_pricing_rules full" ON offering_pricing_rules FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin operating_schedules full" ON operating_schedules FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin operational_exceptions full" ON operational_exceptions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin activity_time_slots full" ON activity_time_slots FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin media_assets full" ON media_assets FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin media_variants full" ON media_variants FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin entity_media full" ON entity_media FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 12. SEED INITIAL MASTER LOCALES, CATEGORIES & DATA

INSERT INTO locales (code, language_name, native_name, is_default) VALUES
('en-IN', 'English (India)', 'English', true),
('ta-IN', 'Tamil', 'தமிழ்', false),
('ml-IN', 'Malayalam', 'മലയാളം', false),
('kn-IN', 'Kannada', 'കന്നഡ', false),
('hi-IN', 'Hindi', 'हिन्दी', false)
ON CONFLICT (code) DO NOTHING;

INSERT INTO attraction_categories (id, name, slug, icon_name, description, display_order) VALUES
('66666666-6666-6666-6666-666666666601', 'Viewpoint & Cliff', 'viewpoint-cliff', 'Mountain', 'Panoramic mountain peaks, cliffs, and valley vistas.', 1),
('66666666-6666-6666-6666-666666666602', 'Lakes & Water Bodies', 'lakes-water-bodies', 'Waves', 'Natural and artificial lakes, boat clubs, and promenades.', 2),
('66666666-6666-6666-6666-666666666603', 'Parks & Gardens', 'parks-gardens', 'Flower2', 'Botanical gardens, flower gardens, and manicured lawns.', 3),
('66666666-6666-6666-6666-666666666604', 'Forests & Sanctuaries', 'forests-sanctuaries', 'Trees', 'Dense pine forests, wildlife reserves, and nature trails.', 4),
('66666666-6666-6666-6666-666666666605', 'Museums & Heritage', 'museums-heritage', 'Landmark', 'Tea factories, historic sites, and cultural museums.', 5)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO activity_categories (id, name, slug, icon_name, description, display_order) VALUES
('77777777-7777-7777-7777-777777777701', 'Water Sports & Boating', 'water-sports-boating', 'Anchor', 'Row boating, pedal boating, kayaking, and boat rides.', 1),
('77777777-7777-7777-7777-777777777702', 'Trekking & Hiking', 'trekking-hiking', 'Compass', 'Guided nature trails, mountain treks, and cliff walks.', 2),
('77777777-7777-7777-7777-777777777703', 'Safari & Wildlife Drives', 'safari-wildlife', 'Footprints', 'Jeep safaris, elephant watches, and forest drives.', 3),
('77777777-7777-7777-7777-777777777704', 'Cultural & Tasting', 'cultural-tasting', 'Utensils', 'Tea tasting, spice plantation tours, and culinary walks.', 4)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- Seed Micro-Zones for Kodaikanal
INSERT INTO destination_zones (id, destination_id, name, slug, description, display_order) VALUES
('88888888-8888-8888-8888-888888888801', '55555555-5555-5555-5555-555555555501', 'Lake District Zone', 'lake-district-zone', 'Central Kodai Lake, Bryant Park, and Coaker''s Walk.', 1),
('88888888-8888-8888-8888-888888888802', '55555555-5555-5555-5555-555555555501', 'Pillar Rocks Cliff Zone', 'pillar-rocks-cliff-zone', 'Pillar Rocks, Guna Caves, and Pine Forest corridor.', 2)
ON CONFLICT (destination_id, name) DO NOTHING;

-- Seed Sample Attraction: Kodai Lake
INSERT INTO attractions (
  id, name, slug, destination_id, zone_id, category_id,
  latitude, longitude, address_text,
  short_tagline, description, suggested_duration_mins,
  pet_allowed, wheelchair_accessible, parking_available, restrooms_available,
  ideal_for, entry_fee_type, adult_entry_fee, child_entry_fee,
  hero_banner_url, featured_image_url,
  meta_title, meta_description, status, is_featured, website_visibility
) VALUES (
  '99999999-9999-9999-9999-999999999901',
  'Kodai Lake',
  'kodai-lake',
  '55555555-5555-5555-5555-555555555501',
  '88888888-8888-8888-8888-888888888801',
  '66666666-6666-6666-6666-666666666602',
  10.2381000, 77.4892000,
  'Kodaikanal Town Center, Kodaikanal, Tamil Nadu 624101',
  'Star-shaped man-made lake with scenic perimeter cycling, row boating, and lakeside parks.',
  'Kodai Lake is the heart of Kodaikanal. Created in 1863 by Sir Vere Henry Levinge, this 60-acre star-shaped lake is surrounded by lush Palani hills and a 5-kilometer asphalt promenade ideal for cycling and leisurely walks.',
  90,
  true, true, true, true,
  ARRAY['Families', 'Couples', 'Friends', 'Photographers'],
  'free', 0.00, 0.00,
  '/images/kodaikanal/kodaikanal-lake.webp', '/images/kodaikanal/kodaikanal-lake.webp',
  'Kodai Lake Travel Guide & Boating | Friendli Tripz',
  'Explore Kodai Lake in Kodaikanal. Read opening hours, boating prices, and curated trip guides.',
  'published', true, true
) ON CONFLICT (slug) DO NOTHING;

-- Seed Master Activity: Row & Pedal Boating
INSERT INTO activities (
  id, name, slug, category_id,
  short_description, full_description,
  fitness_level, age_suitability, default_duration_mins,
  hero_image_url, icon_name, status, is_featured
) VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
  'Row & Pedal Boating',
  'row-pedal-boating',
  '77777777-7777-7777-7777-777777777701',
  'Relaxing boat ride across misty lake waters with mountain views.',
  'Enjoy a peaceful boat ride across serene lake waters. Choose between self-driven 2-seater or 4-seater pedal boats, or hire a traditional row boat with an experienced oarsman.',
  'light', 'all_ages', 45,
  '/images/kodaikanal/kodaikanal-lake.webp', 'Anchor', 'published', true
) ON CONFLICT (slug) DO NOTHING;

-- Seed Activity Offering: Kodai Lake Boating Session
INSERT INTO activity_offerings (
  id, master_activity_id, attraction_id, destination_id,
  title, capacity_type, max_capacity, duration_mins, vendor_name, is_active
) VALUES (
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
  '99999999-9999-9999-9999-999999999901',
  '55555555-5555-5555-5555-555555555501',
  'Kodai Lake 4-Seater Row Boat Ride',
  'per_vehicle', 4, 45, 'Kodaikanal Boat Club', true
) ON CONFLICT DO NOTHING;

-- Seed Offering Pricing Rules
INSERT INTO offering_pricing_rules (
  offering_id, participant_type, base_price, currency, is_active
) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'group_flat', 350.00, 'INR', true),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'adult', 100.00, 'INR', true)
ON CONFLICT DO NOTHING;

-- Seed Operating Schedule for Kodai Lake (Open 09:00 - 18:00 every day)
INSERT INTO operating_schedules (entity_type, entity_id, day_of_week, open_time, close_time, is_closed) VALUES
('attraction', '99999999-9999-9999-9999-999999999901', 0, '09:00', '18:00', false),
('attraction', '99999999-9999-9999-9999-999999999901', 1, '09:00', '18:00', false),
('attraction', '99999999-9999-9999-9999-999999999901', 2, '09:00', '18:00', false),
('attraction', '99999999-9999-9999-9999-999999999901', 3, '09:00', '18:00', false),
('attraction', '99999999-9999-9999-9999-999999999901', 4, '09:00', '18:00', false),
('attraction', '99999999-9999-9999-9999-999999999901', 5, '09:00', '18:00', false),
('attraction', '99999999-9999-9999-9999-999999999901', 6, '09:00', '18:00', false)
ON CONFLICT (entity_type, entity_id, day_of_week) DO NOTHING;
