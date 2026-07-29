-- ============================================================================
-- FRIENDLI TRIPZ - SPRINT 3.7: PRIVACY, IDENTITY & COMMUNICATION PLATFORM
-- Migration: 20260807000000_sprint3_7_privacy_and_communication.sql
-- ============================================================================

-- 1. TRAVELLER DOCUMENT VAULT (AES-256 ENCRYPTED SENSITIVE PII)
CREATE TABLE IF NOT EXISTS traveller_document_vault (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  passenger_name TEXT NOT NULL,
  document_type TEXT NOT NULL,
  encrypted_document_number TEXT NOT NULL,
  private_storage_path TEXT NOT NULL,
  retention_purge_date DATE NOT NULL,
  is_purged BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. CONSENT RECORDS (INDIAN DPDP ACT 2023 / GDPR COMPLIANCE)
CREATE TABLE IF NOT EXISTS consent_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  consent_purpose TEXT NOT NULL,
  is_granted BOOLEAN DEFAULT true,
  granted_at TIMESTAMPTZ DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT
);

-- 3. GUARDIAN RELATIONSHIP ENGINE FOR MINOR TRAVELLERS
CREATE TABLE IF NOT EXISTS guardian_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  minor_passenger_name TEXT NOT NULL,
  minor_age INTEGER NOT NULL CHECK (minor_age < 18),
  guardian_name TEXT NOT NULL,
  guardian_phone TEXT NOT NULL,
  guardian_relationship_type TEXT NOT NULL,
  waiver_signed BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. UNIFIED TRAVELLER COMMUNICATION TIMELINE
CREATE TABLE IF NOT EXISTS communication_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  direction TEXT NOT NULL DEFAULT 'outbound',
  template_id TEXT,
  content_preview TEXT NOT NULL,
  delivery_status TEXT DEFAULT 'sent',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. INDEXES
CREATE INDEX IF NOT EXISTS idx_doc_vault_booking ON traveller_document_vault(booking_id);
CREATE INDEX IF NOT EXISTS idx_doc_vault_purge ON traveller_document_vault(retention_purge_date, is_purged);
CREATE INDEX IF NOT EXISTS idx_comm_timeline_booking ON communication_timeline(booking_id);

-- 6. ROW LEVEL SECURITY (RLS) POLICIES (IDEMPOTENT)
ALTER TABLE traveller_document_vault ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardian_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_timeline ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin vault select" ON traveller_document_vault;
CREATE POLICY "Admin vault select" ON traveller_document_vault FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admin vault insert" ON traveller_document_vault;
CREATE POLICY "Admin vault insert" ON traveller_document_vault FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admin consent full" ON consent_records;
CREATE POLICY "Admin consent full" ON consent_records FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin guardian full" ON guardian_relationships;
CREATE POLICY "Admin guardian full" ON guardian_relationships FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin comm timeline full" ON communication_timeline;
CREATE POLICY "Admin comm timeline full" ON communication_timeline FOR ALL TO authenticated USING (true) WITH CHECK (true);
