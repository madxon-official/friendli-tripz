export interface FAQItem {
  id: string;
  category: 'booking' | 'cancellation' | 'payments' | 'general' | 'safety' | string;
  question: string;
  answer: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
}
