export interface DriverPickupTask {
  id: string;
  bookingCode: string;
  passengerName: string;
  passengerPhone: string;
  pickupLocation: string;
  pickupTime: string;
  destination: string;
  boardingStatus: 'pending' | 'boarded' | 'no_show';
}

export interface VehicleInspectionValues {
  odometerReading: number;
  tyreCondition: string;
  brakeCondition: string;
  firstAidKitPresent: boolean;
  notes?: string;
}

export interface FuelLogValues {
  litresFilled: number;
  totalCost: number;
}
