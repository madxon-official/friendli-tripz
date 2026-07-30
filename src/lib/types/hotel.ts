export interface HotelArrivalItem {
  id: string;
  bookingCode: string;
  leadGuestName: string;
  roomCategory: string;
  roomsCount: number;
  checkInDate: string;
  checkOutDate: string;
  mealPlan: string;
  specialRequests?: string;
  checkInStatus: 'pending' | 'checked_in' | 'checked_out';
}
