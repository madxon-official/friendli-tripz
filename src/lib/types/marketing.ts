export interface MarketingCampaignItem {
  id: string;
  campaignName: string;
  channel: 'WhatsApp' | 'Email' | 'SMS' | 'Push';
  targetSegment: string;
  sentCount: number;
  conversionCount: number;
  status: string;
  createdAt: string;
}
