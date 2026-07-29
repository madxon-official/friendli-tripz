-- ============================================================================
-- FRIENDLI TRIPZ - SPRINT 1: DESTINATION MANAGEMENT MODULE (TRAVEL CATALOG)
-- Migration: 20260730000000_destination_management_module.sql
-- ============================================================================

-- 1. ENUM TYPES
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'destination_status') THEN
    CREATE TYPE destination_status AS ENUM ('draft', 'published', 'coming_soon', 'archived');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'travel_difficulty') THEN
    CREATE TYPE travel_difficulty AS ENUM ('easy', 'moderate', 'challenging', 'strenuous');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'adventure_level') THEN
    CREATE TYPE adventure_level AS ENUM ('low', 'moderate', 'high', 'extreme');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'budget_level') THEN
    CREATE TYPE budget_level AS ENUM ('budget', 'mid_range', 'luxury', 'ultra_luxury');
  END IF;
END $$;

-- 2. MASTER LOOKUP TABLES

-- Countries Table
CREATE TABLE IF NOT EXISTS countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  iso_code VARCHAR(10) UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- States Table
CREATE TABLE IF NOT EXISTS states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID NOT NULL REFERENCES countries(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  code VARCHAR(10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(country_id, name)
);

-- Destination Categories Table
CREATE TABLE IF NOT EXISTS destination_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon_name TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Master Tags Table
CREATE TABLE IF NOT EXISTS master_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  tag_type TEXT DEFAULT 'general', -- e.g. 'theme', 'vibe', 'budget', 'activity'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. MAIN DESTINATIONS TABLE

CREATE TABLE IF NOT EXISTS destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  country_id UUID NOT NULL REFERENCES countries(id) ON DELETE RESTRICT,
  state_id UUID NOT NULL REFERENCES states(id) ON DELETE RESTRICT,
  category_id UUID NOT NULL REFERENCES destination_categories(id) ON DELETE RESTRICT,
  
  -- Overview & Descriptions
  short_description TEXT,
  long_description TEXT,
  
  -- Geographic Coordinates
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  
  -- Quick Facts & Parameters
  ideal_duration TEXT,
  best_season TEXT,
  climate TEXT,
  travel_difficulty travel_difficulty DEFAULT 'easy',
  adventure_level adventure_level DEFAULT 'low',
  budget_level budget_level DEFAULT 'mid_range',
  family_friendly BOOLEAN DEFAULT true,
  pet_friendly BOOLEAN DEFAULT false,
  accessibility_notes TEXT,
  temperature_range TEXT,
  elevation TEXT,
  average_budget_per_day TEXT,
  view_count INTEGER DEFAULT 0,
  
  -- Media & Variant URLs
  hero_banner_url TEXT,
  featured_image_url TEXT,
  image_variants JSONB DEFAULT '{}'::jsonb, -- e.g. { "thumbnail": "...", "medium": "...", "large": "...", "hero": "..." }
  
  -- Travel Guide Information
  best_time_to_visit TEXT,
  how_to_reach TEXT,
  nearest_airport TEXT,
  nearest_railway_station TEXT,
  nearest_bus_stand TEXT,
  languages_spoken TEXT[] DEFAULT '{}',
  local_transport TEXT,
  
  -- Rich SEO & Guide Content Sections
  introduction TEXT,
  travel_tips TEXT,
  food_guide TEXT,
  shopping_guide TEXT,
  weather_guide TEXT,
  things_to_avoid TEXT,
  best_months TEXT[] DEFAULT '{}',
  ideal_for TEXT[] DEFAULT '{}',
  
  -- Meta & SEO
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[] DEFAULT '{}',
  og_image_url TEXT,
  canonical_url TEXT,
  
  -- Display & Visibility Controls
  status destination_status NOT NULL DEFAULT 'draft',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  homepage_order INTEGER NOT NULL DEFAULT 0,
  website_visibility BOOLEAN NOT NULL DEFAULT true,
  
  -- Audit Fields
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 4. CHILD & RELATION TABLES

-- Slug History (301 Permanent Redirect preservation)
CREATE TABLE IF NOT EXISTS destination_slug_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  old_slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Photo Gallery Table
CREATE TABLE IF NOT EXISTS destination_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  medium_url TEXT,
  alt_text TEXT,
  caption TEXT,
  photographer TEXT,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Repeatable Highlights Table
CREATE TABLE IF NOT EXISTS destination_highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  icon_name TEXT DEFAULT 'Sparkles',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Emergency Contacts Table
CREATE TABLE IF NOT EXISTS destination_emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL, -- e.g., 'Police', 'Hospital', 'Tourism Office', 'Forest Office', 'Rescue'
  title TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  alt_phone TEXT,
  address TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Frequently Asked Questions Table
CREATE TABLE IF NOT EXISTS destination_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Destination Master Tag Junction Table
CREATE TABLE IF NOT EXISTS destination_tag_relations (
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES master_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (destination_id, tag_id)
);

-- 5. INDEXES FOR HIGH-PERFORMANCE QUERYING

CREATE INDEX IF NOT EXISTS idx_destinations_slug ON destinations(slug);
CREATE INDEX IF NOT EXISTS idx_destinations_status ON destinations(status);
CREATE INDEX IF NOT EXISTS idx_destinations_category ON destinations(category_id);
CREATE INDEX IF NOT EXISTS idx_destinations_state ON destinations(state_id);
CREATE INDEX IF NOT EXISTS idx_destinations_country ON destinations(country_id);
CREATE INDEX IF NOT EXISTS idx_destinations_featured ON destinations(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_destinations_visibility ON destinations(website_visibility);
CREATE INDEX IF NOT EXISTS idx_slug_history_old_slug ON destination_slug_history(old_slug);
CREATE INDEX IF NOT EXISTS idx_gallery_destination ON destination_gallery(destination_id, display_order);
CREATE INDEX IF NOT EXISTS idx_highlights_destination ON destination_highlights(destination_id, display_order);

-- 6. ROW LEVEL SECURITY (RLS) POLICIES

ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE states ENABLE ROW LEVEL SECURITY;
ALTER TABLE destination_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE destination_slug_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE destination_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE destination_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE destination_emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE destination_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE destination_tag_relations ENABLE ROW LEVEL SECURITY;

-- Master Lookup Read Policies (Public read access)
CREATE POLICY "Public master countries select" ON countries FOR SELECT USING (true);
CREATE POLICY "Public master states select" ON states FOR SELECT USING (true);
CREATE POLICY "Public master categories select" ON destination_categories FOR SELECT USING (true);
CREATE POLICY "Public master tags select" ON master_tags FOR SELECT USING (true);

-- Admin Master Write Policies
CREATE POLICY "Admin master countries full" ON countries FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin master states full" ON states FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin master categories full" ON destination_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin master tags full" ON master_tags FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Destinations Read Policy (Public can view published & coming_soon with website_visibility = true)
CREATE POLICY "Public destinations select" ON destinations FOR SELECT USING (
  status IN ('published', 'coming_soon') AND website_visibility = true
);

-- Admin Destinations Full Access
CREATE POLICY "Admin destinations select all" ON destinations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin destinations insert" ON destinations FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin destinations update" ON destinations FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin destinations delete" ON destinations FOR DELETE TO authenticated USING (true);

-- Child Tables Policies
CREATE POLICY "Public destination_slug_history select" ON destination_slug_history FOR SELECT USING (true);
CREATE POLICY "Admin destination_slug_history full" ON destination_slug_history FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public destination_gallery select" ON destination_gallery FOR SELECT USING (true);
CREATE POLICY "Admin destination_gallery full" ON destination_gallery FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public destination_highlights select" ON destination_highlights FOR SELECT USING (true);
CREATE POLICY "Admin destination_highlights full" ON destination_highlights FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public destination_emergency_contacts select" ON destination_emergency_contacts FOR SELECT USING (true);
CREATE POLICY "Admin destination_emergency_contacts full" ON destination_emergency_contacts FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public destination_faqs select" ON destination_faqs FOR SELECT USING (true);
CREATE POLICY "Admin destination_faqs full" ON destination_faqs FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public destination_tag_relations select" ON destination_tag_relations FOR SELECT USING (true);
CREATE POLICY "Admin destination_tag_relations full" ON destination_tag_relations FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7. SEED INITIAL MASTER DATA & DESTINATIONS

INSERT INTO countries (id, name, iso_code) VALUES
('11111111-1111-1111-1111-111111111111', 'India', 'IN')
ON CONFLICT (name) DO UPDATE SET iso_code = EXCLUDED.iso_code;

INSERT INTO states (id, country_id, name, code) VALUES
('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111111', 'Tamil Nadu', 'TN'),
('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111111', 'Kerala', 'KL'),
('22222222-2222-2222-2222-222222222203', '11111111-1111-1111-1111-111111111111', 'Karnataka', 'KA'),
('22222222-2222-2222-2222-222222222204', '11111111-1111-1111-1111-111111111111', 'Goa', 'GA'),
('22222222-2222-2222-2222-222222222205', '11111111-1111-1111-1111-111111111111', 'Rajasthan', 'RJ')
ON CONFLICT (country_id, name) DO UPDATE SET code = EXCLUDED.code;

INSERT INTO destination_categories (id, name, slug, icon_name, description, display_order) VALUES
('33333333-3333-3333-3333-333333333301', 'Hill Station', 'hill-station', 'Mountain', 'Misty peaks, cool tea estates, and picturesque mountain trails.', 1),
('33333333-3333-3333-3333-333333333302', 'Beach & Coastal', 'beach-coastal', 'Waves', 'Golden sands, azure ocean waters, and relaxing coastal vibes.', 2),
('33333333-3333-3333-3333-333333333303', 'Wildlife & Nature', 'wildlife-nature', 'Trees', 'Dense forest sanctuaries, safari drives, and lush flora.', 3),
('33333333-3333-3333-3333-333333333304', 'Heritage & Cultural', 'heritage-cultural', 'Landmark', 'Historical forts, royal palaces, and vibrant cultural roots.', 4),
('33333333-3333-3333-3333-333333333305', 'Adventure & Trekking', 'adventure-trekking', 'Compass', 'High-altitude treks, water sports, and thrill-seeking escapes.', 5),
('33333333-3333-3333-3333-333333333306', 'Backwaters & Lakes', 'backwaters-lakes', 'Anchor', 'Tranquil houseboats, emerald canals, and serene lakefronts.', 6)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO master_tags (id, name, slug, tag_type) VALUES
('44444444-4444-4444-4444-444444444401', 'Romantic Getaway', 'romantic-getaway', 'vibe'),
('44444444-4444-4444-4444-444444444402', 'Weekend Escape', 'weekend-escape', 'theme'),
('44444444-4444-4444-4444-444444444403', 'Family Friendly', 'family-friendly', 'theme'),
('44444444-4444-4444-4444-444444444404', 'Luxury Retreat', 'luxury-retreat', 'budget'),
('44444444-4444-4444-4444-444444444405', 'Budget Travel', 'budget-travel', 'budget'),
('44444444-4444-4444-4444-444444444406', 'Nature Trail', 'nature-trail', 'vibe'),
('44444444-4444-4444-4444-444444444407', 'Photography Spot', 'photography-spot', 'activity')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

-- Seed Destinations (Ooty, Kodaikanal, Valparai - Published; Munnar, Coorg, Wayanad, Chikmagalur - Coming Soon)

INSERT INTO destinations (
  id, name, slug, country_id, state_id, category_id,
  short_description, long_description,
  latitude, longitude, ideal_duration, best_season, climate,
  travel_difficulty, adventure_level, budget_level,
  family_friendly, pet_friendly, accessibility_notes,
  temperature_range, elevation, average_budget_per_day,
  hero_banner_url, featured_image_url,
  best_time_to_visit, how_to_reach, nearest_airport, nearest_railway_station, nearest_bus_stand,
  languages_spoken, local_transport,
  introduction, travel_tips, food_guide, shopping_guide, weather_guide, things_to_avoid,
  best_months, ideal_for,
  meta_title, meta_description, meta_keywords,
  status, is_featured, homepage_order, website_visibility
) VALUES
(
  '55555555-5555-5555-5555-555555555501',
  'Kodaikanal',
  'kodaikanal',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222201',
  '33333333-3333-3333-3333-333333333301',
  'The Princess of Hill Stations featuring misty pine forests, serene lakes, and crisp mountain air.',
  'Kodaikanal is a serene hill station located in the Palani Hills of Tamil Nadu. Known for its star-shaped Kodai Lake, dense pine forests, cascading waterfalls, and cool year-round climate, it offers the perfect retreat for travelers seeking tranquility and good company.',
  10.2381000, 77.4892000,
  '3 - 4 Days', 'October to March', 'Cool & Mist-covered',
  'easy', 'moderate', 'mid_range',
  true, true, 'Wheelchair accessible around Kodai Lake and major parks.',
  '12°C - 20°C', '2,133 m', '₹3,500 - ₹6,000 per person',
  '/images/kodaikanal/kodaikanal-hero.webp', '/images/kodaikanal/kodaikanal-lake.webp',
  'October to March offers pleasant weather for sightseeing and boat rides.',
  'Accessible by road via scenic ghat sections from Madurai, Coimbatore, or Dindigul.',
  'Madurai Airport (IXM) - 120 km', 'Kodaikanal Road Railway Station (KZN) - 80 km', 'Kodaikanal Central Bus Stand - 1 km',
  ARRAY['Tamil', 'English', 'Malayalam'],
  'Taxis, rented cycles, auto-rickshaws, and leisurely walking tours.',
  'Welcome to Kodaikanal! Nestled amid the misty Nilgiri and Palani hill ranges, Kodaikanal is famous for its natural beauty and cool climate.',
  'Carry light thermals even during summer evenings. Book boat tickets at Kodai Lake early in the morning to beat the crowd.',
  'Don''t miss homemade Kodai chocolates, fresh hill plums, hot eucalyptus tea, and wood-fired artisanal pizzas.',
  'Shop for handmade soaps, pure essential oils, homemade dark chocolates, and wooden handicrafts in the local market.',
  'Mild summers (15°C - 24°C), misty monsoons (great for waterfall views), and crisp winter chills (8°C - 18°C).',
  'Avoid plastic littering in forest zones. Do not feed wild monkeys at viewpoints.',
  ARRAY['October', 'November', 'December', 'January', 'February', 'March'],
  ARRAY['Couples', 'Friends', 'Families', 'Nature Lovers'],
  'Kodaikanal Travel Guide | Friendli Tripz',
  'Plan your misty Kodaikanal escape with Friendli Tripz. Explore Kodai Lake, Pine Forests, and curated group trips.',
  ARRAY['Kodaikanal', 'Hill Station', 'Tamil Nadu Travel', 'Pine Forest', 'Kodai Lake'],
  'published', true, 1, true
),
(
  '55555555-5555-5555-5555-555555555502',
  'Ooty',
  'ooty',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222201',
  '33333333-3333-3333-3333-333333333301',
  'Queen of Hill Stations with rolling tea gardens, UNESCO Heritage Toy Train, and botanical blooms.',
  'Ooty (Udhagamandalam) is the quintessential hill retreat of South India. Celebrated for its sprawling tea estates, colonial architecture, botanical gardens, and the legendary Nilgiri Mountain Railway, Ooty offers timeless charm for group travel.',
  11.4102000, 76.6950000,
  '3 - 4 Days', 'October to June', 'Cool & Temperate',
  'easy', 'low', 'mid_range',
  true, false, 'Main gardens and lake promenade are wheelchair friendly.',
  '10°C - 22°C', '2,240 m', '₹4,000 - ₹7,000 per person',
  '/images/kodaikanal/kodaikanal-landscape.webp', '/images/kodaikanal/kodaikanal-viewpoint.webp',
  'September to May provides crisp mountain views and pleasant flower garden seasons.',
  'Well connected via Coimbatore highway and the scenic Mettupalayam ghat road.',
  'Coimbatore International Airport (CJB) - 88 km', 'Udhagamandalam Railway Station (UAM) / Mettupalayam (MTP) - 47 km', 'Ooty Main Bus Stand - 0.5 km',
  ARRAY['Tamil', 'English', 'Kannada', 'Malayalam'],
  'Taxis, local buses, auto-rickshaws, and rental scooters.',
  'Ooty welcomes you with emerald tea hills and pleasant mountain breeze!',
  'Reserve your Nilgiri Toy Train tickets weeks in advance. Carry warm layers for early morning walks.',
  'Indulge in classic Ooty varkey biscuits, freshly brewed Nilgiri black tea, and local bakery treats.',
  'Pick up authentic Nilgiri tea leaves, eucalyptus oils, Toddy embroidery crafts, and fresh spices.',
  'Pleasant summers with blooming botanical flowers; cool, refreshing winters.',
  'Do not pluck flowers in government botanical gardens. Avoid speeding on narrow ghat curves.',
  ARRAY['September', 'October', 'November', 'December', 'March', 'April', 'May'],
  ARRAY['Families', 'Corporate Groups', 'Couples', 'Tea Enthusiasts'],
  'Ooty Hill Station Escapes | Friendli Tripz',
  'Experience tea gardens, toy train rides, and curated Ooty group trips with Friendli Tripz.',
  ARRAY['Ooty', 'Nilgiris', 'Tea Gardens', 'Toy Train', 'Tamil Nadu Tourism'],
  'published', true, 2, true
),
(
  '55555555-5555-5555-5555-555555555503',
  'Valparai',
  'valparai',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222201',
  '33333333-3333-3333-3333-333333333303',
  'An offbeat paradise of lush tea plantations, lion-tailed macaques, and 40 hairpin curves.',
  'Valparai is a tranquil, offbeat hill station situated in the Anamalai Tiger Reserve. Blessed with vast private tea estates, rainforest corridors, wildlife spotting opportunities, and serene dams, it is South India''s best-kept eco-tourism secret.',
  10.3263000, 76.9554000,
  '2 - 3 Days', 'October to March', 'Tropical Highland',
  'moderate', 'moderate', 'budget',
  true, false, 'Natural terrain requires moderate walking ability.',
  '15°C - 25°C', '1,074 m', '₹3,000 - ₹5,000 per person',
  '/images/kodaikanal/kodaikanal-waterfall.webp', '/images/kodaikanal/kodaikanal-pines.webp',
  'October to March is ideal for wildlife sightings and tea estate strolls.',
  'Driven via 40 exhilarating hairpin bends from Pollachi.',
  'Coimbatore International Airport (CJB) - 120 km', 'Pollachi Junction Railway Station (POY) - 64 km', 'Valparai Bus Stand - 0.2 km',
  ARRAY['Tamil', 'Malayalam', 'English'],
  'Local private jeeps, taxis, and state buses.',
  'Valparai offers untouched natural beauty away from commercial tourist crowds.',
  'Drive cautiously around the 40 hairpin bends. Keep camera ready for Lion-tailed Macaques.',
  'Try local South Indian meals, fresh estate cardamom tea, and spicy fish curry.',
  'Buy organic spices, pure hill honey, and factory-fresh tea powders.',
  'Refreshing rains in monsoon (heavy rainfall); cool, misty winters.',
  'Do not drive through reserve forest after sunset. Strict no-plastic wildlife zone.',
  ARRAY['October', 'November', 'December', 'January', 'February', 'March'],
  ARRAY['Offbeat Explorers', 'Photographers', 'Wildlife Enthusiasts', 'Road Trippers'],
  'Valparai Eco Escapes & Wildlife | Friendli Tripz',
  'Discover Valparai offbeat tea estates and wildlife reserves with Friendli Tripz.',
  ARRAY['Valparai', 'Anamalai', 'Tea Estates', 'Offbeat Tamil Nadu', 'Friendli Tripz'],
  'published', true, 3, true
),
-- Coming Soon Destinations
(
  '55555555-5555-5555-5555-555555555504',
  'Munnar',
  'munnar',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222202',
  '33333333-3333-3333-3333-333333333301',
  'Rolling green tea valleys, misty mountain peaks, and rare Neelakurinji blooms.',
  'Munnar is Kerala''s premier hill station where three mountain streams meet. Renowned for carpeted tea plantations, Anamudi peak, and serene waterfalls.',
  10.0889000, 77.0595000,
  '3 - 4 Days', 'September to March', 'Cool & Misty',
  'easy', 'moderate', 'mid_range',
  true, false, 'Accessible hilltop resorts and viewpoints.',
  '12°C - 22°C', '1,532 m', '₹4,000 - ₹7,000 per person',
  '/images/kodaikanal/kodaikanal-landscape.webp', '/images/kodaikanal/kodaikanal-lake.webp',
  'September to March for crystal clear mountain vistas.',
  'Accessible via Kochi airport highway.',
  'Cochin International Airport (COK) - 110 km', 'Aluva Railway Station (AWY) - 110 km', 'Munnar Bus Station - 1 km',
  ARRAY['Malayalam', 'Tamil', 'English', 'Hindi'],
  'Jeeps, local taxis, and auto-rickshaws.',
  'Munnar trip packages coming soon on Friendli Tripz!',
  'Carry light jackets. Plan early visits to Eravikulam National Park.',
  'Enjoy traditional Kerala Sadya and spiced hill tea.',
  'Purchase spices, aromatic oils, and handmade soaps.',
  'Cool mountain climate throughout the year.',
  'Avoid night driving during heavy monsoons.',
  ARRAY['September', 'October', 'November', 'December', 'January', 'February'],
  ARRAY['Couples', 'Tea Lovers', 'Photographers'],
  'Munnar Hill Escapes | Friendli Tripz',
  'Munnar group travel and packages coming soon on Friendli Tripz.',
  ARRAY['Munnar', 'Kerala Tourism', 'Tea Valleys'],
  'coming_soon', false, 4, true
),
(
  '55555555-5555-5555-5555-555555555505',
  'Coorg',
  'coorg',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222203',
  '33333333-3333-3333-3333-333333333301',
  'Coffee capital of Karnataka with aromatic plantations, cascading falls, and Kodava culture.',
  'Coorg (Kodagu) is a picturesque hill region famed for coffee plantations, Abbey Falls, Raja''s Seat, and rich Kodava heritage.',
  12.3375000, 75.8069000,
  '3 Days', 'October to March', 'Cool Highland',
  'easy', 'moderate', 'mid_range',
  true, true, 'Accessible homestays and estate walks.',
  '15°C - 26°C', '1,170 m', '₹4,000 - ₹7,500 per person',
  '/images/kodaikanal/kodaikanal-hero.webp', '/images/kodaikanal/kodaikanal-viewpoint.webp',
  'October to March for lush coffee harvest season.',
  'Road drive from Bangalore or Mysore.',
  'Kannur International Airport (CNN) - 90 km', 'Mysore Junction (MYS) - 120 km', 'Madikeri Bus Stand - 1 km',
  ARRAY['Kodava', 'Kannada', 'English', 'Hindi'],
  'Rental cars, jeeps, and taxis.',
  'Coorg experience coming soon on Friendli Tripz!',
  'Taste authentic filter coffee at local homestays.',
  'Pandi Curry, Akki Oti, and freshly roasted Arabica coffee.',
  'Coorg Arabica coffee beans, homemade wines, and hill honey.',
  'Pleasant winter breeze and misty monsoon rains.',
  'Do not trespass into private estate lands without permission.',
  ARRAY['October', 'November', 'December', 'January', 'February'],
  ARRAY['Coffee Lovers', 'Families', 'Weekend Travelers'],
  'Coorg Coffee Escapes | Friendli Tripz',
  'Coorg coffee estate tours coming soon on Friendli Tripz.',
  ARRAY['Coorg', 'Karnataka Tourism', 'Coffee Plantations'],
  'coming_soon', false, 5, true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  long_description = EXCLUDED.long_description,
  status = EXCLUDED.status,
  is_featured = EXCLUDED.is_featured,
  homepage_order = EXCLUDED.homepage_order;

-- Seed Highlights for Published Destinations
INSERT INTO destination_highlights (destination_id, title, description, icon_name, display_order) VALUES
-- Kodaikanal Highlights
('55555555-5555-5555-5555-555555555501', 'Star Kodai Lake', 'Boating & cycling around the iconic star-shaped lake.', 'Anchor', 1),
('55555555-5555-5555-5555-555555555501', 'Pine Forest Strolls', 'Walk among tall, towering pine tree canopies.', 'Trees', 2),
('55555555-5555-5555-5555-555555555501', 'Coaker''s Walk Views', 'Pedestrian cliffside path offering panoramic valley vistas.', 'Mountain', 3),
('55555555-5555-5555-5555-555555555501', 'Pillar Rocks', 'Majestic 400ft vertical rock pillars shrouded in clouds.', 'Camera', 4),
-- Ooty Highlights
('55555555-5555-5555-5555-555555555502', 'Toy Train Ride', 'UNESCO World Heritage Nilgiri Mountain Railway.', 'Train', 1),
('55555555-5555-5555-5555-555555555502', 'Tea Estate Walks', 'Guided walks through lush Nilgiri tea plantations.', 'Leaf', 2),
('55555555-5555-5555-5555-555555555502', 'Botanical Gardens', '55-acre terraced garden with exotic flowers and trees.', 'Flower2', 3),
-- Valparai Highlights
('55555555-5555-5555-5555-555555555503', '40 Hairpin Curves', 'Thrilling ghat section drive with breathtaking drop-offs.', 'Compass', 1),
('55555555-5555-5555-5555-555555555503', 'Wildlife Spotting', 'Rare Lion-tailed Macaques and Nilgiri Tahr sightings.', 'Footprints', 2),
('55555555-5555-5555-5555-555555555503', 'Sholayar Dam', 'Second deepest dam in Asia surrounded by rainforests.', 'Waves', 3)
ON CONFLICT DO NOTHING;

-- Seed Emergency Contacts
INSERT INTO destination_emergency_contacts (destination_id, service_type, title, phone_number, address, display_order) VALUES
('55555555-5555-5555-5555-555555555501', 'Police', 'Kodaikanal Town Police Station', '04542-248100', 'Law''s Ghat Road, Kodaikanal', 1),
('55555555-5555-5555-5555-555555555501', 'Hospital', 'Government Hospital Kodaikanal', '04542-241253', 'Fern Hill, Kodaikanal', 2),
('55555555-5555-5555-5555-555555555501', 'Tourism Office', 'Tamil Nadu Tourism Development Office', '04542-241675', 'Bus Stand Complex, Kodaikanal', 3),
('55555555-5555-5555-5555-555555555502', 'Police', 'Ooty Town Police Station', '0423-2442200', 'Commercial Road, Ooty', 1),
('55555555-5555-5555-5555-555555555502', 'Hospital', 'Government Headquarters Hospital', '0423-2442212', 'Hospital Road, Ooty', 2),
('55555555-5555-5555-5555-555555555503', 'Forest Office', 'Valparai Forest Range Office', '04253-222235', 'Main Road, Valparai', 1)
ON CONFLICT DO NOTHING;

-- Seed FAQs
INSERT INTO destination_faqs (destination_id, question, answer, display_order) VALUES
('55555555-5555-5555-5555-555555555501', 'Is Kodaikanal suitable for family travel?', 'Yes! Kodaikanal is very family-friendly with gentle lake walks, parks, and comfortable homestays.', 1),
('55555555-5555-5555-5555-555555555501', 'How many days are recommended for Kodaikanal?', '3 to 4 days are ideal to explore Kodai Lake, Pine Forests, viewpoints, and neighboring waterfalls at a relaxed pace.', 2),
('55555555-5555-5555-5555-555555555502', 'How do I book the Ooty Toy Train?', 'Tickets can be booked online via IRCTC (station code UAM to MTP) or purchased at the station ticket counter early in the morning.', 1),
('55555555-5555-5555-5555-555555555503', 'Are there wild animal encounters in Valparai?', 'Valparai is in a forest tiger reserve corridor. While macaque sightings are common, drive carefully and avoid walking alone after dark.', 1)
ON CONFLICT DO NOTHING;

-- Seed Destination Tag Relations
INSERT INTO destination_tag_relations (destination_id, tag_id) VALUES
('55555555-5555-5555-5555-555555555501', '44444444-4444-4444-4444-444444444401'), -- Romantic
('55555555-5555-5555-5555-555555555501', '44444444-4444-4444-4444-444444444402'), -- Weekend
('55555555-5555-5555-5555-555555555501', '44444444-4444-4444-4444-444444444403'), -- Family
('55555555-5555-5555-5555-555555555502', '44444444-4444-4444-4444-444444444403'), -- Family
('55555555-5555-5555-5555-555555555502', '44444444-4444-4444-4444-444444444406'), -- Nature
('55555555-5555-5555-5555-555555555503', '44444444-4444-4444-4444-444444444406'), -- Nature
('55555555-5555-5555-5555-555555555503', '44444444-4444-4444-4444-444444444407')  -- Photography
ON CONFLICT DO NOTHING;
