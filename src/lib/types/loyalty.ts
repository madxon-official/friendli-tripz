export interface LoyaltyAccountInfo {
  pointsBalance: number;
  tier: 'Silver' | 'Gold' | 'Platinum' | 'Titanium';
  referralCode: string;
  transactions: {
    id: string;
    type: string;
    points: number;
    description: string;
    createdAt: string;
  }[];
}

export interface CouponItem {
  id: string;
  code: string;
  discountType: 'flat' | 'percentage';
  discountValue: number;
  minOrderAmount?: number;
  validUntil?: string;
  isActive: boolean;
}
