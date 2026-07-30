export interface PassengerDetail {
  firstName: string;
  lastName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  dietaryPreference: 'vegetarian' | 'non_vegetarian' | 'vegan' | 'jain';
  specialAssistanceNotes?: string;
  idDocumentNumber?: string;
  idDocumentType?: 'aadhaar' | 'passport' | 'voter_id' | 'driving_license';
}

export interface BookingCheckoutState {
  instanceId: string;
  leadBookerName: string;
  leadBookerEmail: string;
  leadBookerPhone: string;
  startDate: string;
  endDate: string;
  passengerCount: number;
  passengers: PassengerDetail[];
  couponCode?: string;
  gstNumber?: string;
  specialRequests?: string;
  depositPercentage: number;
}

export interface BookingCheckoutResult {
  bookingId: string;
  bookingCode: string;
  totalGrossAmount: number;
  totalTaxAmount: number;
  depositAmount: number;
  balanceAmount: number;
  currency: string;
  razorpayOrderId?: string;
  status: 'draft' | 'pending_payment' | 'confirmed';
}
