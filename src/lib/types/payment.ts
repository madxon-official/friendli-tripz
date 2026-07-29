export type MilestoneType = 'deposit' | 'balance' | 'installment' | 'custom';
export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'waived';
export type GatewayProvider = 'razorpay' | 'stripe' | 'phonepe';

export interface PaymentSchedule {
  id: string;
  booking_id: string;
  milestone_type: MilestoneType;
  due_date: string;
  amount_due: number;
  amount_paid: number;
  status: PaymentStatus;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentTransaction {
  id: string;
  booking_id: string;
  schedule_id?: string | null;
  gateway_provider: GatewayProvider;
  gateway_transaction_id: string;
  idempotency_key?: string | null;
  amount: number;
  currency: string;
  payment_method?: string | null;
  gateway_fee?: number;
  status: 'success' | 'pending' | 'failed';
  payload_json?: any;
  created_at?: string;
}

export interface FinancialLedgerEntry {
  id: string;
  transaction_ref: string;
  booking_id?: string | null;
  debit_account: string;
  credit_account: string;
  amount: number;
  currency: string;
  entry_type: 'customer_payment' | 'vendor_payout' | 'tax_liability' | 'refund';
  entry_hash: string;
  previous_entry_hash?: string | null;
  created_at?: string;
}

export interface SettlementObligation {
  id: string;
  booking_id: string;
  entity_type: 'vendor' | 'tax_authority';
  entity_id?: string | null;
  payee_name: string;
  gross_liability: number;
  tax_deduction: number;
  net_payable: number;
  due_date: string;
  status: 'pending' | 'authorized' | 'settled';
  created_at?: string;
}
