-- ============================================================================
-- FRIENDLI TRIPZ - SPRINT 5.5: CRM & MARKETING PLATFORM
-- Migration: 20260814000000_sprint5_crm_marketing.sql
-- ============================================================================

-- 1. CUSTOMER PROFILES & SEGMENTATION
CREATE TABLE IF NOT EXISTS customer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL UNIQUE,
  full_name TEXT NOT NULL,
  email CITEXT NOT NULL,
  phone TEXT NOT NULL,
  total_trips_completed INTEGER DEFAULT 0,
  lifetime_value NUMERIC(12,2) DEFAULT 0.00,
  segment_tier TEXT DEFAULT 'High Value', -- 'High Value', 'Repeat Traveller', 'New Lead', 'Inactive'
  preferred_travel_style TEXT DEFAULT 'Family',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. MARKETING CAMPAIGNS & BROADCAST LOGS
CREATE TABLE IF NOT EXISTS marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_name TEXT NOT NULL,
  channel TEXT NOT NULL, -- 'WhatsApp', 'Email', 'SMS', 'Push'
  target_segment TEXT NOT NULL,
  content_template TEXT NOT NULL,
  sent_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'sent', -- 'draft', 'scheduled', 'sent', 'completed'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. RLS POLICIES
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin crm full" ON customer_profiles;
CREATE POLICY "Admin crm full" ON customer_profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin marketing full" ON marketing_campaigns;
CREATE POLICY "Admin marketing full" ON marketing_campaigns FOR ALL TO authenticated USING (true) WITH CHECK (true);
