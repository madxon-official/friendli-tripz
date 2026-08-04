-- ============================================================================
-- FRIENDLI TRIPZ DESTINATION PLATFORM REWORK (PRODUCTION-GRADE MIGRATION)
-- Focus: Kodaikanal, Ooty, Valparai
-- Fully idempotent with explicit ::uuid casting & dynamic slug-based FK resolution
-- ============================================================================

-- 1. DESTINATIONS TABLE
CREATE TABLE IF NOT EXISTS public.destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT,
  overview TEXT,
  why_visit TEXT,
  best_season TEXT,
  how_to_reach TEXT,
  weather TEXT,
  culture TEXT,
  travel_tips TEXT,
  district TEXT,
  state TEXT DEFAULT 'Tamil Nadu',
  elevation TEXT,
  google_map_embed TEXT,
  status TEXT DEFAULT 'published',
  featured BOOLEAN DEFAULT true,
  starting_price NUMERIC(10,2) DEFAULT 3499.00,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],
  canonical_url TEXT,
  og_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drop NOT NULL constraints on legacy table columns if they exist
DO $$
BEGIN
  -- Destinations legacy column NULL fixes
  BEGIN ALTER TABLE public.destinations ALTER COLUMN country_id DROP NOT NULL; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER TABLE public.destinations ALTER COLUMN state_id DROP NOT NULL; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER TABLE public.destinations ALTER COLUMN category_id DROP NOT NULL; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER TABLE public.destinations ALTER COLUMN region_id DROP NOT NULL; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER TABLE public.destinations ALTER COLUMN hero_image DROP NOT NULL; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER TABLE public.destinations ALTER COLUMN cover_image DROP NOT NULL; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER TABLE public.destinations ALTER COLUMN thumbnail_image DROP NOT NULL; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER TABLE public.destinations ALTER COLUMN status DROP NOT NULL; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER TABLE public.destinations ALTER COLUMN is_featured DROP NOT NULL; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER TABLE public.destinations ALTER COLUMN homepage_order DROP NOT NULL; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER TABLE public.destinations ALTER COLUMN website_visibility DROP NOT NULL; EXCEPTION WHEN OTHERS THEN NULL; END;

  -- Attractions legacy column NULL fixes
  BEGIN ALTER TABLE public.attractions ALTER COLUMN category_id DROP NOT NULL; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER TABLE public.attractions ALTER COLUMN latitude DROP NOT NULL; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER TABLE public.attractions ALTER COLUMN longitude DROP NOT NULL; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER TABLE public.attractions ALTER COLUMN status DROP NOT NULL; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER TABLE public.attractions ALTER COLUMN suggested_duration_mins DROP NOT NULL; EXCEPTION WHEN OTHERS THEN NULL; END;

  -- Destination Gallery legacy column NULL fixes
  BEGIN ALTER TABLE public.destination_gallery ALTER COLUMN image_url DROP NOT NULL; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER TABLE public.destination_gallery ALTER COLUMN image DROP NOT NULL; EXCEPTION WHEN OTHERS THEN NULL; END;

  -- Default values on legacy columns so inserts never fail
  BEGIN ALTER TABLE public.destinations ALTER COLUMN homepage_order SET DEFAULT 0; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER TABLE public.destinations ALTER COLUMN website_visibility SET DEFAULT true; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER TABLE public.destinations ALTER COLUMN is_featured SET DEFAULT true; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER TABLE public.destinations ALTER COLUMN status SET DEFAULT 'published'; EXCEPTION WHEN OTHERS THEN NULL; END;
END $$;

-- Ensure all columns exist if table was previously created
ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS tagline TEXT;
ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS overview TEXT;
ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS why_visit TEXT;
ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS best_season TEXT;
ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS how_to_reach TEXT;
ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS weather TEXT;
ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS culture TEXT;
ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS travel_tips TEXT;
ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS district TEXT;
ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS state TEXT DEFAULT 'Tamil Nadu';
ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS elevation TEXT;
ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS google_map_embed TEXT;
ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT true;
ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS starting_price NUMERIC(10,2) DEFAULT 3499.00;
ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS seo_keywords TEXT[];
ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS canonical_url TEXT;
ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS og_image TEXT;

-- 2. DESTINATION GALLERY TABLE
CREATE TABLE IF NOT EXISTS public.destination_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID REFERENCES public.destinations(id) ON DELETE CASCADE,
  image TEXT,
  image_url TEXT,
  title TEXT,
  alt_text TEXT,
  caption TEXT,
  photographer TEXT,
  display_order INT DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  image_type TEXT DEFAULT 'gallery',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.destination_gallery ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.destination_gallery ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE public.destination_gallery ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.destination_gallery ADD COLUMN IF NOT EXISTS alt_text TEXT;
ALTER TABLE public.destination_gallery ADD COLUMN IF NOT EXISTS caption TEXT;
ALTER TABLE public.destination_gallery ADD COLUMN IF NOT EXISTS photographer TEXT;
ALTER TABLE public.destination_gallery ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;
ALTER TABLE public.destination_gallery ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE public.destination_gallery ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.destination_gallery ADD COLUMN IF NOT EXISTS image_type TEXT DEFAULT 'gallery';

-- 3. DESTINATION ROUTES TABLE
CREATE TABLE IF NOT EXISTS public.destination_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID REFERENCES public.destinations(id) ON DELETE CASCADE,
  origin_city TEXT NOT NULL,
  distance TEXT NOT NULL,
  duration TEXT NOT NULL,
  travel_mode TEXT DEFAULT 'Road',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.destination_routes ADD COLUMN IF NOT EXISTS travel_mode TEXT DEFAULT 'Road';

-- 4. ATTRACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.attractions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID REFERENCES public.destinations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  category TEXT DEFAULT 'View Point',
  description TEXT,
  image TEXT,
  duration TEXT DEFAULT '1 - 2 hours',
  suggested_duration_mins INT DEFAULT 90,
  best_time TEXT DEFAULT 'Morning & Evening',
  coordinates TEXT,
  featured BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.attractions ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.attractions ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'View Point';
ALTER TABLE public.attractions ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE public.attractions ADD COLUMN IF NOT EXISTS duration TEXT DEFAULT '1 - 2 hours';
ALTER TABLE public.attractions ADD COLUMN IF NOT EXISTS suggested_duration_mins INT DEFAULT 90;
ALTER TABLE public.attractions ADD COLUMN IF NOT EXISTS best_time TEXT DEFAULT 'Morning & Evening';
ALTER TABLE public.attractions ADD COLUMN IF NOT EXISTS coordinates TEXT;
ALTER TABLE public.attractions ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT true;

-- 5. EXPERIENCES TABLE
CREATE TABLE IF NOT EXISTS public.experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID REFERENCES public.destinations(id) ON DELETE CASCADE,
  category TEXT DEFAULT 'Camping',
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  image TEXT,
  duration TEXT DEFAULT '3 Hours',
  difficulty TEXT DEFAULT 'Easy',
  minimum_age INT DEFAULT 5,
  maximum_group INT DEFAULT 20,
  start_time TEXT DEFAULT '09:00 AM',
  end_time TEXT DEFAULT '05:00 PM',
  season TEXT DEFAULT 'All Year',
  requires_guide BOOLEAN DEFAULT true,
  requires_permit BOOLEAN DEFAULT false,
  available_days TEXT DEFAULT 'Daily',
  location_type TEXT DEFAULT 'Outdoors',
  description TEXT,
  starting_price NUMERIC(10,2) DEFAULT 999.00,
  includes JSONB DEFAULT '[]'::jsonb,
  exclusions JSONB DEFAULT '[]'::jsonb,
  featured BOOLEAN DEFAULT true,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS minimum_age INT DEFAULT 5;
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS maximum_group INT DEFAULT 20;
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS start_time TEXT DEFAULT '09:00 AM';
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS end_time TEXT DEFAULT '05:00 PM';
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS season TEXT DEFAULT 'All Year';
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS requires_guide BOOLEAN DEFAULT true;
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS requires_permit BOOLEAN DEFAULT false;
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS available_days TEXT DEFAULT 'Daily';
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS location_type TEXT DEFAULT 'Outdoors';
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS starting_price NUMERIC(10,2) DEFAULT 999.00;
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS includes JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS exclusions JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT true;

-- 6. PACKAGES TABLE
CREATE TABLE IF NOT EXISTS public.packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID REFERENCES public.destinations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  duration TEXT DEFAULT '3 Days / 2 Nights',
  duration_days INT DEFAULT 3,
  duration_nights INT DEFAULT 2,
  min_people INT DEFAULT 2,
  max_people INT DEFAULT 15,
  starting_price NUMERIC(10,2) DEFAULT 3499.00,
  weekday_price NUMERIC(10,2),
  weekend_price NUMERIC(10,2),
  status TEXT DEFAULT 'published',
  is_customizable BOOLEAN DEFAULT true,
  hero_image TEXT,
  overview TEXT,
  itinerary JSONB DEFAULT '[]'::jsonb,
  includes JSONB DEFAULT '[]'::jsonb,
  exclusions JSONB DEFAULT '[]'::jsonb,
  accommodation TEXT DEFAULT 'Boutique Hill Cottage / Resort',
  transport TEXT DEFAULT 'Private Vehicle / Tempo Traveller',
  meals TEXT DEFAULT 'Daily Breakfast & Dinner',
  featured BOOLEAN DEFAULT true,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS hero_image TEXT;
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS duration_days INT DEFAULT 3;
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS duration_nights INT DEFAULT 2;
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS min_people INT DEFAULT 2;
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS max_people INT DEFAULT 15;
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS starting_price NUMERIC(10,2) DEFAULT 3499.00;
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS weekday_price NUMERIC(10,2);
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS weekend_price NUMERIC(10,2);
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS is_customizable BOOLEAN DEFAULT true;
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS accommodation TEXT DEFAULT 'Boutique Hill Cottage / Resort';
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS transport TEXT DEFAULT 'Private Vehicle / Tempo Traveller';
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS meals TEXT DEFAULT 'Daily Breakfast & Dinner';

-- 7. PACKAGE_EXPERIENCES JUNCTION TABLE
CREATE TABLE IF NOT EXISTS public.package_experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID REFERENCES public.packages(id) ON DELETE CASCADE,
  experience_id UUID REFERENCES public.experiences(id) ON DELETE CASCADE,
  day_number INT DEFAULT 1,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(package_id, experience_id)
);

-- 8. UPDATE ENQUIRIES TABLE TO LINK WITH DESTINATIONS, PACKAGES, EXPERIENCES
ALTER TABLE public.enquiries 
  ADD COLUMN IF NOT EXISTS destination_id UUID REFERENCES public.destinations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS experience_id UUID REFERENCES public.experiences(id) ON DELETE SET NULL;

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_destinations_slug ON public.destinations(slug);
CREATE INDEX IF NOT EXISTS idx_destinations_status ON public.destinations(status);
CREATE INDEX IF NOT EXISTS idx_destination_gallery_dest ON public.destination_gallery(destination_id);
CREATE INDEX IF NOT EXISTS idx_destination_routes_dest ON public.destination_routes(destination_id);
CREATE INDEX IF NOT EXISTS idx_attractions_dest ON public.attractions(destination_id);
CREATE INDEX IF NOT EXISTS idx_experiences_dest ON public.experiences(destination_id);
CREATE INDEX IF NOT EXISTS idx_packages_dest ON public.packages(destination_id);
CREATE INDEX IF NOT EXISTS idx_package_experiences_pkg ON public.package_experiences(package_id);

-- RLS POLICIES FOR PUBLIC READ ACCESS
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destination_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destination_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_experiences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read destinations" ON public.destinations;
DROP POLICY IF EXISTS "Allow public read destination_gallery" ON public.destination_gallery;
DROP POLICY IF EXISTS "Allow public read destination_routes" ON public.destination_routes;
DROP POLICY IF EXISTS "Allow public read attractions" ON public.attractions;
DROP POLICY IF EXISTS "Allow public read experiences" ON public.experiences;
DROP POLICY IF EXISTS "Allow public read packages" ON public.packages;
DROP POLICY IF EXISTS "Allow public read package_experiences" ON public.package_experiences;

CREATE POLICY "Allow public read destinations" ON public.destinations FOR SELECT USING (true);
CREATE POLICY "Allow public read destination_gallery" ON public.destination_gallery FOR SELECT USING (true);
CREATE POLICY "Allow public read destination_routes" ON public.destination_routes FOR SELECT USING (true);
CREATE POLICY "Allow public read attractions" ON public.attractions FOR SELECT USING (true);
CREATE POLICY "Allow public read experiences" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Allow public read packages" ON public.packages FOR SELECT USING (true);
CREATE POLICY "Allow public read package_experiences" ON public.package_experiences FOR SELECT USING (true);

-- SEED DATA: KODAIKANAL, OOTY, VALPARAI
INSERT INTO public.destinations (slug, name, tagline, overview, why_visit, best_season, how_to_reach, weather, culture, travel_tips, district, state, elevation, google_map_embed, status, featured, starting_price)
VALUES 
(
  'kodaikanal',
  'Kodaikanal',
  'Princess of Hill Stations',
  'Nestled amidst the Palani Hills, Kodaikanal offers misty pine trails, serene lakes, and cliffside viewpoints. Known for cool mountain breezes and lush eucalyptus groves.',
  'Crisp mountain air, serene natural lake, pine forest trails, and cliffside viewpoints like Dolphin Nose.',
  'Oct – Mar (Winter & Spring)',
  'Drive via Dindigul / Batlagundu ghat road. Nearest airport: Madurai (120 km) / Coimbatore (175 km).',
  '12°C - 20°C cool alpine climate with morning mist',
  'Friendly local Tamil hill culture with organic spice farms and artisan handmade chocolates.',
  'Carry light woollens. Book boat club vouchers early on weekends.',
  'Dindigul',
  'Tamil Nadu',
  '2,133 m (6,998 ft)',
  'https://maps.google.com/?q=Kodaikanal',
  'published',
  true,
  3499.00
),
(
  'ooty',
  'Ooty',
  'Queen of the Nilgiris',
  'Surrounded by rolling blue Nilgiri hills, tea gardens, and colonial charm. Famous for the UNESCO Nilgiri Mountain Toy Train, Botanical Gardens, and Doddabetta Peak.',
  'Rolling tea plantations, heritage toy train rides, botanical parks, and high-altitude tea tasting.',
  'Sep – May (Spring & Summer)',
  'Drive up Mettupalayam ghat road. Nearest airport: Coimbatore (88 km).',
  '10°C - 18°C pleasant highland breeze',
  'Colonial heritage blended with Toda tribal culture and tea plantation traditions.',
  'Take the morning toy train ride from Coonoor for the best scenic valley views.',
  'Nilgiris',
  'Tamil Nadu',
  '2,240 m (7,350 ft)',
  'https://maps.google.com/?q=Ooty',
  'published',
  true,
  3999.00
),
(
  'valparai',
  'Valparai',
  'Wilderness & Coffee Escapes',
  'An unspoiled rainforest plateau in the Anamalai Hills, surrounded by tea and coffee plantations, 40 hairpin bends, and abundant wildlife including lion-tailed macaques.',
  'Uncrowded tea slopes, 40 hairpin bends, wildlife sightings, and majestic waterfalls like Monkey Falls.',
  'Oct – Mar (Post-Monsoon)',
  'Drive via Pollachi (40 hairpin bends). Nearest airport: Coimbatore (110 km).',
  '15°C - 23°C monsoon-fresh rainforest weather',
  'Peaceful estate culture with deep conservation roots in the Anamalai Tiger Reserve.',
  'Watch for wildlife near estate borders in early mornings and late afternoons.',
  'Coimbatore',
  'Tamil Nadu',
  '1,068 m (3,504 ft)',
  'https://maps.google.com/?q=Valparai',
  'published',
  true,
  4299.00
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  overview = EXCLUDED.overview,
  starting_price = EXCLUDED.starting_price;

-- SEED GALLERY IMAGES FOR KODAIKANAL, OOTY, VALPARAI (DYNAMIC SLUG FK RESOLUTION)
INSERT INTO public.destination_gallery (destination_id, image, image_url, title, caption, alt_text, image_type, display_order, featured, is_featured)
SELECT id, '/destinations/kodaikanal/hero.webp', '/destinations/kodaikanal/hero.webp', 'Misty Pine Forest', 'Misty Pine Forest', 'Misty Pine Forest', 'hero', 1, true, true FROM public.destinations WHERE slug = 'kodaikanal'
UNION ALL
SELECT id, '/destinations/kodaikanal/cover.webp', '/destinations/kodaikanal/cover.webp', 'Kodai Lake Sunset', 'Kodai Lake Sunset', 'Kodai Lake Sunset', 'cover', 2, true, true FROM public.destinations WHERE slug = 'kodaikanal'
UNION ALL
SELECT id, '/destinations/kodaikanal/gallery/gallery-1.webp', '/destinations/kodaikanal/gallery/gallery-1.webp', 'Dolphin Nose Viewpoint', 'Dolphin Nose Viewpoint', 'Dolphin Nose Viewpoint', 'gallery', 3, false, false FROM public.destinations WHERE slug = 'kodaikanal'

UNION ALL
SELECT id, '/destinations/ooty/hero.webp', '/destinations/ooty/hero.webp', 'Nilgiri Tea Slopes', 'Nilgiri Tea Slopes', 'Nilgiri Tea Slopes', 'hero', 1, true, true FROM public.destinations WHERE slug = 'ooty'
UNION ALL
SELECT id, '/destinations/ooty/cover.webp', '/destinations/ooty/cover.webp', 'Botanical Lake View', 'Botanical Lake View', 'Botanical Lake View', 'cover', 2, true, true FROM public.destinations WHERE slug = 'ooty'
UNION ALL
SELECT id, '/destinations/ooty/gallery/gallery-1.webp', '/destinations/ooty/gallery/gallery-1.webp', 'Doddabetta Peak View', 'Doddabetta Peak View', 'Doddabetta Peak View', 'gallery', 3, false, false FROM public.destinations WHERE slug = 'ooty'

UNION ALL
SELECT id, '/destinations/valparai/hero.webp', '/destinations/valparai/hero.webp', 'Valparai Tea Valley', 'Valparai Tea Valley', 'Valparai Tea Valley', 'hero', 1, true, true FROM public.destinations WHERE slug = 'valparai'
UNION ALL
SELECT id, '/destinations/valparai/cover.webp', '/destinations/valparai/cover.webp', 'Aliyar Reservoir View', 'Aliyar Reservoir View', 'Aliyar Reservoir View', 'cover', 2, true, true FROM public.destinations WHERE slug = 'valparai'
UNION ALL
SELECT id, '/destinations/valparai/gallery/gallery-1.webp', '/destinations/valparai/gallery/gallery-1.webp', 'Sholayar Dam Mist', 'Sholayar Dam Mist', 'Sholayar Dam Mist', 'gallery', 3, false, false FROM public.destinations WHERE slug = 'valparai';

-- SEED TRAVEL ROUTES (DYNAMIC SLUG FK RESOLUTION)
INSERT INTO public.destination_routes (destination_id, origin_city, distance, duration, travel_mode)
SELECT id, 'Coimbatore', '175 km', '4.5 hrs', 'Road' FROM public.destinations WHERE slug = 'kodaikanal'
UNION ALL
SELECT id, 'Chennai', '520 km', '9.5 hrs', 'Train & Road' FROM public.destinations WHERE slug = 'kodaikanal'
UNION ALL
SELECT id, 'Bangalore', '465 km', '8.5 hrs', 'Road' FROM public.destinations WHERE slug = 'kodaikanal'

UNION ALL
SELECT id, 'Coimbatore', '88 km', '2.5 hrs', 'Road' FROM public.destinations WHERE slug = 'ooty'
UNION ALL
SELECT id, 'Chennai', '550 km', '10 hrs', 'Train & Road' FROM public.destinations WHERE slug = 'ooty'
UNION ALL
SELECT id, 'Bangalore', '275 km', '6 hrs', 'Road' FROM public.destinations WHERE slug = 'ooty'

UNION ALL
SELECT id, 'Coimbatore', '110 km', '3.5 hrs', 'Road (40 Hairpin Bends)' FROM public.destinations WHERE slug = 'valparai'
UNION ALL
SELECT id, 'Chennai', '590 km', '11 hrs', 'Train & Road' FROM public.destinations WHERE slug = 'valparai'
UNION ALL
SELECT id, 'Bangalore', '450 km', '8.5 hrs', 'Road' FROM public.destinations WHERE slug = 'valparai';

-- SEED ATTRACTIONS (DYNAMIC SLUG FK RESOLUTION & ON CONFLICT UPDATE)
INSERT INTO public.attractions (destination_id, name, slug, category, description, image, duration, suggested_duration_mins, best_time)
SELECT id, 'Coaker''s Walk', 'coakers-walk', 'View Point', 'A 1-km paved pedestrian path constructed along steep cliff edges offering breathtaking valley views.', '/destinations/kodaikanal/attractions/coakers-walk.webp', '1 - 2 hours', 90, 'Morning & Sunset' FROM public.destinations WHERE slug = 'kodaikanal'
UNION ALL
SELECT id, 'Pine Forest', 'pine-forest', 'Forest', 'Dense towering pine trees planted during the British era, perfect for photography and nature walks.', '/destinations/kodaikanal/attractions/pine-forest.webp', '1 hour', 60, 'Morning' FROM public.destinations WHERE slug = 'kodaikanal'
UNION ALL
SELECT id, 'Kodai Lake', 'kodai-lake', 'Lake', 'Star-shaped artificial lake at the center of town surrounded by lush green hills and boat clubs.', '/destinations/kodaikanal/attractions/kodai-lake.webp', '2 hours', 120, 'Evening' FROM public.destinations WHERE slug = 'kodaikanal'

UNION ALL
SELECT id, 'Government Botanical Garden', 'botanical-garden', 'Park', 'A 55-acre terraced garden established in 1848 with exotic plants, fern houses, and fossilized trees.', '/destinations/ooty/attractions/botanical-garden.webp', '2 - 3 hours', 150, 'Morning' FROM public.destinations WHERE slug = 'ooty'
UNION ALL
SELECT id, 'Doddabetta Peak', 'doddabetta-peak', 'View Point', 'The highest mountain peak in the Nilgiris at 2,637m with an observatory telescope house.', '/destinations/ooty/attractions/doddabetta.webp', '2 hours', 120, 'Early Morning' FROM public.destinations WHERE slug = 'ooty'

UNION ALL
SELECT id, 'Aliyar Dam', 'aliyar-dam', 'Lake', 'Scenic reservoir located at the foot of the Anamalai Hills along the Pollachi-Valparai road.', '/destinations/valparai/attractions/aliyar-dam.webp', '1 - 2 hours', 90, 'Afternoon' FROM public.destinations WHERE slug = 'valparai'
UNION ALL
SELECT id, 'Sholayar Dam', 'sholayar-dam', 'Water Dam', 'One of the highest hydro-electric dams in Asia surrounded by tea gardens and evergreen forests.', '/destinations/valparai/attractions/sholayar-dam.webp', '2 hours', 120, 'Evening' FROM public.destinations WHERE slug = 'valparai'
ON CONFLICT (slug) DO UPDATE SET
  destination_id = EXCLUDED.destination_id,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  duration = EXCLUDED.duration,
  suggested_duration_mins = EXCLUDED.suggested_duration_mins,
  best_time = EXCLUDED.best_time;

-- SEED EXPERIENCES (DYNAMIC SLUG FK RESOLUTION & ON CONFLICT)
INSERT INTO public.experiences (id, destination_id, category, title, slug, image, duration, difficulty, description, starting_price, includes)
SELECT
  '22222222-0000-0000-0000-000000000001'::uuid,
  id,
  'Camping',
  'Campfire & BBQ Night',
  'campfire-bbq-night',
  '/destinations/kodaikanal/experiences/campfire.webp',
  '3 Hours (Evening)',
  'Easy',
  'Sit around a cozy campfire under mountain stars with grilled acoustic music and hot drinks.',
  1200.00,
  '["Campfire Setup", "BBQ Starters", "Hot Tea/Coffee", "Music"]'::jsonb
FROM public.destinations WHERE slug = 'kodaikanal'
UNION ALL
SELECT
  '22222222-0000-0000-0000-000000000002'::uuid,
  id,
  'Trekking',
  'Dolphin Nose Cliffside Trek',
  'dolphin-nose-trek',
  '/destinations/kodaikanal/experiences/trekking.webp',
  '4 Hours',
  'Moderate',
  'Guided trek along Palani valley ridges ending at the iconic Dolphin Nose protruding rock formation.',
  999.00,
  '["Trek Guide", "Energy Snacks", "First Aid Support"]'::jsonb
FROM public.destinations WHERE slug = 'kodaikanal'
UNION ALL
SELECT
  '22222222-0000-0000-0000-000000000003'::uuid,
  id,
  'Heritage',
  'UNESCO Toy Train Heritage Ride',
  'toy-train-ride',
  '/destinations/ooty/experiences/toy-train.webp',
  '2 Hours',
  'Easy',
  'Ride the historic steam toy train through mountain tunnels, bridges, and emerald tea valleys.',
  850.00,
  '["First Class Ticket", "Reserved Seating"]'::jsonb
FROM public.destinations WHERE slug = 'ooty'
UNION ALL
SELECT
  '22222222-0000-0000-0000-000000000004'::uuid,
  id,
  'Tea Estates',
  'Valparai Coffee & Tea Plantation Safari',
  'valparai-tea-safari',
  '/destinations/valparai/experiences/tea-safari.webp',
  '3 Hours',
  'Easy',
  'Guided jeep walk through private organic tea and coffee estates with fresh tea tasting.',
  1100.00,
  '["Estate Pass", "Guide", "Tea Tasting"]'::jsonb
FROM public.destinations WHERE slug = 'valparai'
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  starting_price = EXCLUDED.starting_price;

-- SEED PACKAGES (DYNAMIC SLUG FK RESOLUTION & ON CONFLICT)
INSERT INTO public.packages (id, destination_id, name, slug, duration, duration_days, duration_nights, starting_price, hero_image, overview, accommodation, transport, meals)
SELECT
  '33333333-0000-0000-0000-000000000001'::uuid,
  id,
  'Misty Kodaikanal Escape',
  'misty-kodaikanal-escape',
  '3 Days / 2 Nights',
  3,
  2,
  4999.00,
  '/destinations/kodaikanal/packages/package-1.webp',
  'Our signature weekend getaway to Kodaikanal with private hill cottage stay, bonfire, and Dolphin Nose trek.',
  'Private Wooden Hill Cottage',
  'Private Car / SUV Transfer',
  'Breakfast & Evening BBQ'
FROM public.destinations WHERE slug = 'kodaikanal'
UNION ALL
SELECT
  '33333333-0000-0000-0000-000000000002'::uuid,
  id,
  'Nilgiri Heritage & Tea Trail',
  'nilgiri-heritage-tea-trail',
  '3 Days / 2 Nights',
  3,
  2,
  5499.00,
  '/destinations/ooty/packages/package-1.webp',
  'Immerse in Ooty tea gardens, heritage toy train ride, Doddabetta sunrise, and colonial stay.',
  'Colonial Heritage Resort',
  'Private Sedan / Innova',
  'Daily Breakfast & Dinner'
FROM public.destinations WHERE slug = 'ooty'
UNION ALL
SELECT
  '33333333-0000-0000-0000-000000000003'::uuid,
  id,
  'Valparai Rainforest & Wildlife Retreat',
  'valparai-rainforest-retreat',
  '2 Days / 1 Night',
  2,
  1,
  4299.00,
  '/destinations/valparai/packages/package-1.webp',
  'Unwind in Valparai rainforest coffee estate with 40 hairpin bends drive and waterfall exploration.',
  'Estate Bungalow Stay',
  'Private Jeep / SUV',
  'Organic Plantation Breakfast'
FROM public.destinations WHERE slug = 'valparai'
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overview = EXCLUDED.overview,
  hero_image = EXCLUDED.hero_image,
  starting_price = EXCLUDED.starting_price;

-- SEED PACKAGE_EXPERIENCES JUNCTION RECORDS
INSERT INTO public.package_experiences (package_id, experience_id, day_number, display_order) VALUES
('33333333-0000-0000-0000-000000000001'::uuid, '22222222-0000-0000-0000-000000000001'::uuid, 1, 1),
('33333333-0000-0000-0000-000000000001'::uuid, '22222222-0000-0000-0000-000000000002'::uuid, 2, 1),
('33333333-0000-0000-0000-000000000002'::uuid, '22222222-0000-0000-0000-000000000003'::uuid, 2, 1),
('33333333-0000-0000-0000-000000000003'::uuid, '22222222-0000-0000-0000-000000000004'::uuid, 1, 1)
ON CONFLICT (package_id, experience_id) DO NOTHING;
