export interface LedgerEntryItem {
  id: string;
  entryCode: string;
  bookingCode?: string;
  accountType: string;
  debitAmount: number;
  creditAmount: number;
  description: string;
  createdAt: string;
}

export interface FinanceSummaryMetrics {
  totalRevenue: number;
  totalNetCost: number;
  grossMargin: number;
  marginPercentage: number;
  customerReceivables: number;
  vendorPayables: number;
  gstCollected: number;
  tdsDeducted: number;
}
