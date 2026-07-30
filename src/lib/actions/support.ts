'use server';

import { createClient } from '@/lib/supabase/server';
import { SupportTicketItem, KnowledgeBaseItem } from '@/lib/types/support';

export async function createSupportTicket(subject: string, category: string, priority: string, messageText: string): Promise<{ success: boolean; ticketNumber: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const ticketNumber = `TICK-${Math.floor(10000 + Math.random() * 90000)}`;

  const { data: ticket, error } = await supabase
    .from('support_tickets')
    .insert({
      ticket_number: ticketNumber,
      user_id: user?.id || null,
      subject,
      category,
      priority,
      status: 'open',
    })
    .select('id')
    .single();

  if (ticket) {
    await supabase.from('ticket_messages').insert({
      ticket_id: ticket.id,
      sender_type: 'customer',
      sender_name: user?.email || 'Customer',
      message_text: messageText,
    });
  }

  return { success: true, ticketNumber };
}

export async function getKnowledgeBaseArticles(searchQuery?: string): Promise<KnowledgeBaseItem[]> {
  const supabase = await createClient();

  let query = supabase.from('knowledge_base_articles').select('*').eq('is_published', true);
  if (searchQuery) {
    query = query.ilike('title', `%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error || !data || data.length === 0) {
    return [
      {
        id: 'kb-1',
        slug: 'how-to-customize-stays-and-activities',
        title: 'How to Customize Stays & Activities',
        category: 'Booking & Customization',
        summary: 'Learn how our Incremental Replanner updates hotel room categories and activity offerings.',
        contentMarkdown: '# Customizing Stays\n\nWhen exploring any package, click "Customize Trip" to open the node editor...',
      },
      {
        id: 'kb-2',
        slug: 'deposit-and-cancellation-policy-guide',
        title: 'Deposit Payment & Cancellation Policy',
        category: 'Payments & Refunds',
        summary: 'Understand the 25% minimum deposit rules and refund timelines.',
        contentMarkdown: '# Payments & Refunds\n\nYou can lock any departure date by paying a 25% deposit via Razorpay...',
      }
    ];
  }

  return data.map((item: any) => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    category: item.category,
    summary: item.summary || '',
    contentMarkdown: item.content_markdown,
  }));
}
