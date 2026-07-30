export interface VendorServiceOrder {
  id: string;
  orderCode: string;
  serviceTitle: string;
  eventDate: string;
  passengerCount: number;
  grossAmount: number;
  netPayable: number;
  qrVoucherCode: string;
  isValidated: boolean;
}

export interface VendorSettlementSummary {
  period: string;
  totalOrders: number;
  grossPayout: number;
  taxDeducted: number;
  netPayable: number;
  status: 'pending' | 'approved' | 'paid';
}
