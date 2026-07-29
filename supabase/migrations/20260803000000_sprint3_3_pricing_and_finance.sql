-- ============================================================================
-- FRIENDLI TRIPZ - SPRINT 3.3: PRICING & FINANCE DOMAIN
-- Migration: 20260803000000_sprint3_3_pricing_and_finance.sql
-- ============================================================================

-- 1. ENUMS
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_milestone_type') THEN
    CREATE TYPE payment_milestone_type AS ENUM ('deposit', 'balance', 'installment', 'custom');
  END IF;
END $$;

-- 2. PAYMENT MILESTONE SCHEDULES
CREATE TABLE IF NOT EXISTS payment_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  milestone_type payment_milestone_type NOT NULL DEFAULT 'deposit',
  due_date DATE NOT NULL,
  amount_due NUMERIC(10, 2) NOT NULL,
  amount_paid NUMERIC(10, 2) DEFAULT 0.00,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

DROP TRIGGER IF EXISTS update_payment_schedules_updated_at ON payment_schedules;
CREATE TRIGGER update_payment_schedules_updated_at
BEFORE UPDATE ON payment_schedules
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. PAYMENT TRANSACTIONS (GATEWAY INTERACTIONS & WEBHOOK IDEMPOTENCY)
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  schedule_id UUID REFERENCES payment_schedules(id) ON DELETE SET NULL,
  gateway_provider TEXT NOT NULL DEFAULT 'razorpay',
  gateway_transaction_id TEXT NOT NULL UNIQUE,
  idempotency_key TEXT UNIQUE,
  amount NUMERIC(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  payment_method TEXT,
  gateway_fee NUMERIC(10, 2) DEFAULT 0.00,
  status TEXT NOT NULL DEFAULT 'success',
  payload_json JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. DOUBLE-ENTRY FINANCIAL LEDGER & REPLAYABLE EVENT STORE
CREATE TABLE IF NOT EXISTS financial_ledger_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_ref TEXT NOT NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  debit_account TEXT NOT NULL,
  credit_account TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  entry_type TEXT NOT NULL,
  entry_hash TEXT NOT NULL,
  previous_entry_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. SETTLEMENT OBLIGATIONS (SUPPLIER & TAX LIABILITIES)
CREATE TABLE IF NOT EXISTS settlement_obligations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  payee_name TEXT NOT NULL,
  gross_liability NUMERIC(10, 2) NOT NULL,
  tax_deduction NUMERIC(10, 2) DEFAULT 0.00,
  net_payable NUMERIC(10, 2) NOT NULL,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. INDEXES
CREATE INDEX IF NOT EXISTS idx_payment_schedules_booking ON payment_schedules(booking_id);
CREATE INDEX IF NOT EXISTS idx_payment_schedules_status ON payment_schedules(status, due_date);
CREATE INDEX IF NOT EXISTS idx_payment_tx_booking ON payment_transactions(booking_id);
CREATE INDEX IF NOT EXISTS idx_payment_tx_gateway ON payment_transactions(gateway_transaction_id);
CREATE INDEX IF NOT EXISTS idx_ledger_booking ON financial_ledger_entries(booking_id);
CREATE INDEX IF NOT EXISTS idx_settlement_booking ON settlement_obligations(booking_id);

-- 7. ROW LEVEL SECURITY (RLS) POLICIES (IDEMPOTENT)
ALTER TABLE payment_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlement_obligations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public payment_schedules select" ON payment_schedules;
CREATE POLICY "Public payment_schedules select" ON payment_schedules FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public payment_transactions select" ON payment_transactions;
CREATE POLICY "Public payment_transactions select" ON payment_transactions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin payment_schedules full" ON payment_schedules;
CREATE POLICY "Admin payment_schedules full" ON payment_schedules FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin payment_transactions full" ON payment_transactions;
CREATE POLICY "Admin payment_transactions full" ON payment_transactions FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin financial_ledger_entries full" ON financial_ledger_entries;
CREATE POLICY "Admin financial_ledger_entries full" ON financial_ledger_entries FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin settlement_obligations full" ON settlement_obligations;
CREATE POLICY "Admin settlement_obligations full" ON settlement_obligations FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 8. SEED INITIAL LEDGER & PAYMENT SCHEDULE
INSERT INTO payment_schedules (
  id, booking_id, milestone_type, due_date, amount_due, amount_paid, status
) VALUES
('66666666-6666-6666-6666-666666666601', '55555555-5555-5555-5555-555555555502', 'deposit', '2026-10-01', 5800.00, 5800.00, 'paid'),
('66666666-6666-6666-6666-666666666602', '55555555-5555-5555-5555-555555555502', 'balance', '2026-10-10', 23200.00, 0.00, 'pending')
ON CONFLICT DO NOTHING;

INSERT INTO payment_transactions (
  booking_id, schedule_id, gateway_provider, gateway_transaction_id, amount, currency, payment_method, status
) VALUES (
  '55555555-5555-5555-5555-555555555502',
  '66666666-6666-6666-6666-666666666601',
  'razorpay', 'pay_N8x2kL901Z', 5800.00, 'INR', 'upi', 'success'
) ON CONFLICT (gateway_transaction_id) DO NOTHING;

INSERT INTO financial_ledger_entries (
  transaction_ref, booking_id, debit_account, credit_account, amount, currency, entry_type, entry_hash
) VALUES (
  'TX-RAZORPAY-pay_N8x2kL901Z',
  '55555555-5555-5555-5555-555555555502',
  'bank_razorpay', 'customer_receivable', 5800.00, 'INR', 'customer_payment',
  'f7c3bc1d808e04732adf679965ccc34ca7ae3441'
) ON CONFLICT DO NOTHING;
