-- ============================================================================
-- FRIENDLI TRIPZ - SPRINT 4: CUSTOMER PLATFORM & DOMAIN TABLES
-- Migration: 20260809000000_sprint4_customer_platform.sql
-- ============================================================================

-- 1. BLOG POSTS & CONTENT MANAGEMENT
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug CITEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content_markdown TEXT NOT NULL,
  featured_image_url TEXT,
  author_name TEXT NOT NULL DEFAULT 'Friendli Travel Team',
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT true,
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. FREQUENTLY ASKED QUESTIONS (FAQS)
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL DEFAULT 'general', -- 'booking', 'cancellation', 'payments', 'general', 'safety'
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. WISHLIST & SAVED SEARCHES
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  package_family_id UUID REFERENCES package_families(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, package_family_id)
);

CREATE TABLE IF NOT EXISTS saved_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  search_title TEXT NOT NULL,
  query_params_json JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS recently_viewed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  package_family_id UUID REFERENCES package_families(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT now()
);

-- 4. TRIP REVIEWS & RATINGS (MODULE 9)
CREATE TABLE IF NOT EXISTS trip_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  package_family_id UUID NOT NULL REFERENCES package_families(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  review_text TEXT NOT NULL,
  photo_urls TEXT[] DEFAULT '{}',
  hotel_rating INTEGER CHECK (hotel_rating >= 1 AND hotel_rating <= 5),
  activity_rating INTEGER CHECK (activity_rating >= 1 AND activity_rating <= 5),
  guide_rating INTEGER CHECK (guide_rating >= 1 AND guide_rating <= 5),
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. LOYALTY & REWARDS (MODULE 10)
CREATE TABLE IF NOT EXISTS loyalty_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  points_balance INTEGER NOT NULL DEFAULT 100,
  tier TEXT NOT NULL DEFAULT 'Silver', -- 'Silver', 'Gold', 'Platinum', 'Titanium'
  referral_code VARCHAR(20) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS loyalty_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loyalty_account_id UUID NOT NULL REFERENCES loyalty_accounts(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL, -- 'earn_booking', 'referral_bonus', 'redeem_coupon', 'welcome_bonus'
  points INTEGER NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code CITEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL DEFAULT 'flat', -- 'flat', 'percentage'
  discount_value NUMERIC(10,2) NOT NULL,
  min_order_amount NUMERIC(10,2) DEFAULT 0.00,
  max_discount_amount NUMERIC(10,2),
  valid_until DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. CUSTOMER SUPPORT & TICKETS (MODULE 12)
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number VARCHAR(20) NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general', -- 'booking', 'payment', 'refund', 'itinerary', 'general'
  priority TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  status TEXT NOT NULL DEFAULT 'open', -- 'open', 'in_progress', 'resolved', 'closed'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL, -- 'customer', 'support_agent', 'ai_assistant'
  sender_name TEXT NOT NULL,
  message_text TEXT NOT NULL,
  attachment_urls TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS knowledge_base_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug CITEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  summary TEXT,
  content_markdown TEXT NOT NULL,
  view_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);
CREATE INDEX IF NOT EXISTS idx_wishlists_user ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_trip_reviews_family ON trip_reviews(package_family_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_user ON loyalty_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_booking ON support_tickets(booking_id);

-- 8. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE recently_viewed ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base_articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public select blogs" ON blogs;
CREATE POLICY "Public select blogs" ON blogs FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Public select faqs" ON faqs;
CREATE POLICY "Public select faqs" ON faqs FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Public select reviews" ON trip_reviews;
CREATE POLICY "Public select reviews" ON trip_reviews FOR SELECT USING (is_approved = true);

DROP POLICY IF EXISTS "Public select coupons" ON coupons;
CREATE POLICY "Public select coupons" ON coupons FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public select kb" ON knowledge_base_articles;
CREATE POLICY "Public select kb" ON knowledge_base_articles FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Public manage wishlists" ON wishlists;
CREATE POLICY "Public manage wishlists" ON wishlists FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public manage saved_searches" ON saved_searches;
CREATE POLICY "Public manage saved_searches" ON saved_searches FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public manage recently_viewed" ON recently_viewed;
CREATE POLICY "Public manage recently_viewed" ON recently_viewed FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public manage reviews" ON trip_reviews;
CREATE POLICY "Public manage reviews" ON trip_reviews FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public manage support_tickets" ON support_tickets;
CREATE POLICY "Public manage support_tickets" ON support_tickets FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public manage ticket_messages" ON ticket_messages;
CREATE POLICY "Public manage ticket_messages" ON ticket_messages FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public manage loyalty_accounts" ON loyalty_accounts;
CREATE POLICY "Public manage loyalty_accounts" ON loyalty_accounts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public manage loyalty_transactions" ON loyalty_transactions;
CREATE POLICY "Public manage loyalty_transactions" ON loyalty_transactions FOR ALL USING (true) WITH CHECK (true);

-- 9. SEED FAQS & BLOGS DATA
INSERT INTO faqs (category, question, answer, display_order) VALUES
('booking', 'How do I confirm a trip booking on Friendli Tripz?', 'Select your preferred destination package, customize your accommodation or dates if needed, click Book Now, enter passenger details, and pay the minimum deposit via Razorpay to instantly secure your booking.', 1),
('cancellation', 'What is the cancellation policy for tour packages?', 'Cancellations made 15 days or more prior to departure receive a 90% refund. Cancellations between 7-14 days receive 50% refund. Cancellations under 7 days are non-refundable but can be converted into travel credit.', 2),
('payments', 'Can I pay a partial deposit and clear the balance later?', 'Yes! Friendli Tripz allows you to confirm your booking with a 25% deposit. The remaining balance can be cleared 3 days before trip start.', 3),
('safety', 'Are transport vehicles and drivers verified?', 'All drivers are background-checked commercial license holders, and vehicles undergo mandatory 40-point safety audits before every departure.', 4)
ON CONFLICT DO NOTHING;

INSERT INTO blogs (slug, title, excerpt, content_markdown, featured_image_url, author_name, tags) VALUES
('ultimate-kodaikanal-travel-guide-2026', 'The Ultimate Kodaikanal Travel Guide 2026', 'Discover hidden waterfalls, pine forests, organic cafes, and misty viewpoints in the Princess of Hill Stations.', '# Kodaikanal: The Misty Escape\n\nNested at 2,133 meters in the Palani Hills of Tamil Nadu, Kodaikanal is renowned for its tranquil lakes, dense pine forests, and breathtaking valleys...', 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0', 'Friendli Travel Team', ARRAY['Kodaikanal', 'Hill Station', 'Guide']),
('top-5-activities-in-ooty-for-couples', 'Top 5 Romantic Activities in Ooty for Couples', 'From Nilgiri Mountain Railway rides to lakeside picnics, here is your romantic itinerary for Ooty.', '# Romance in Ooty\n\nExperience the serene charm of Ooty with your loved one. Explore botanical gardens, tea factory tours, and private lakeside dinners under the stars...', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62', 'Friendli Travel Team', ARRAY['Ooty', 'Honeymoon', 'Romantic'])
ON CONFLICT DO NOTHING;
