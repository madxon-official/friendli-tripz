export interface DriverInfo {
  driverName: string;
  phone: string;
  vehicleModel: string;
  vehicleNumber: string;
  photoUrl?: string;
  rating: number;
}

export interface QRVoucher {
  id: string;
  voucherCode: string;
  title: string;
  vendorName: string;
  validDate: string;
  qrCodeUrl: string;
  isRedeemed: boolean;
}

export interface LiveTripExecutionDetails {
  bookingId: string;
  bookingCode: string;
  currentDayIndex: number;
  driver?: DriverInfo;
  hotelContactName: string;
  hotelPhone: string;
  emergencyContactPhone: string;
  vouchers: QRVoucher[];
}
