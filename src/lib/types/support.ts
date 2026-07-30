export interface SupportTicketItem {
  id: string;
  ticketNumber: string;
  subject: string;
  category: 'booking' | 'payment' | 'refund' | 'itinerary' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  messages: {
    id: string;
    senderType: 'customer' | 'support_agent' | 'ai_assistant';
    senderName: string;
    messageText: string;
    createdAt: string;
  }[];
}

export interface KnowledgeBaseItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  contentMarkdown: string;
}
