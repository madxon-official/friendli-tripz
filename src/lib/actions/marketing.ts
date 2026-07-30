'use server';

import { createClient } from '@/lib/supabase/server';
import { MarketingCampaignItem } from '@/lib/types/marketing';

export async function getMarketingCampaigns(): Promise<MarketingCampaignItem[]> {
  return [
    {
      id: 'camp-1',
      campaignName: 'Diwali Special Kodai Hilltop Early Bird Broadcast',
      channel: 'WhatsApp',
      targetSegment: 'High Value Repeat Travellers',
      sentCount: 1450,
      conversionCount: 182,
      status: 'completed',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'camp-2',
      campaignName: 'Weekend Escapes Ooty Toy Train Discount Alert',
      channel: 'Email',
      targetSegment: 'All Registered Leads',
      sentCount: 3200,
      conversionCount: 94,
      status: 'sent',
      createdAt: new Date().toISOString(),
    }
  ];
}
