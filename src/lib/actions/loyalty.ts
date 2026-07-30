'use server';

import { createClient } from '@/lib/supabase/server';
import { LoyaltyAccountInfo } from '@/lib/types/loyalty';

export async function getUserLoyaltyAccount(): Promise<LoyaltyAccountInfo> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      pointsBalance: 500,
      tier: 'Gold',
      referralCode: 'FRIENDLI-SHARMA2026',
      transactions: [
        { id: 'tx-1', type: 'welcome_bonus', points: 200, description: 'Welcome signup reward points', createdAt: new Date().toISOString() },
        { id: 'tx-2', type: 'earn_booking', points: 300, description: 'Points earned from Booking FT-2026-9001', createdAt: new Date().toISOString() }
      ]
    };
  }

  const { data: account } = await supabase
    .from('loyalty_accounts')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!account) {
    return {
      pointsBalance: 500,
      tier: 'Gold',
      referralCode: `FRIENDLI-${user.id.substring(0, 6).toUpperCase()}`,
      transactions: [
        { id: 'tx-1', type: 'welcome_bonus', points: 500, description: 'Welcome Signup Bonus', createdAt: new Date().toISOString() }
      ]
    };
  }

  return {
    pointsBalance: account.points_balance,
    tier: account.tier as any,
    referralCode: account.referral_code,
    transactions: []
  };
}
