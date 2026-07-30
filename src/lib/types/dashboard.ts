export interface CustomerBookingSummary {
  id: string;
  bookingCode: string;
  title: string;
  destinationName: string;
  startDate: string;
  endDate: string;
  passengerCount: number;
  totalGrossAmount: number;
  depositPaid: number;
  balanceDue: number;
  status: 'draft' | 'pending_payment' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface CustomerInvoiceItem {
  id: string;
  invoiceNumber: string;
  bookingCode: string;
  amount: number;
  taxAmount: number;
  paidAt: string;
  downloadUrl: string;
}
