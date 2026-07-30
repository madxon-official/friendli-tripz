export interface UniversalSearchResultItem {
  id: string;
  category: 'booking' | 'customer' | 'package' | 'vendor' | 'hotel' | 'activity' | 'invoice' | 'kb' | 'destination';
  title: string;
  subtitle: string;
  linkUrl: string;
  relevanceScore: number;
}
