'use server';

import { createClient } from '@/lib/supabase/server';
import { FAQItem } from '@/lib/types/faq';

export async function getPublishedFAQs(): Promise<FAQItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true });

  if (error || !data || data.length === 0) {
    return [
      {
        id: '1',
        category: 'booking',
        question: 'How do I confirm a trip booking on Friendli Tripz?',
        answer: 'Select your preferred destination package, customize accommodation or dates if needed, click Book Now, enter passenger details, and pay the minimum deposit via Razorpay.',
        display_order: 1,
        is_published: true,
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        category: 'cancellation',
        question: 'What is the cancellation policy for tour packages?',
        answer: 'Cancellations made 15 days or more prior to departure receive a 90% refund. Cancellations between 7-14 days receive 50% refund.',
        display_order: 2,
        is_published: true,
        created_at: new Date().toISOString(),
      },
      {
        id: '3',
        category: 'payments',
        question: 'Can I pay a partial deposit and clear the balance later?',
        answer: 'Yes! Friendli Tripz allows you to confirm your booking with a 25% deposit. The remaining balance can be cleared 3 days before trip start.',
        display_order: 3,
        is_published: true,
        created_at: new Date().toISOString(),
      },
      {
        id: '4',
        category: 'safety',
        question: 'Are transport vehicles and drivers verified?',
        answer: 'All drivers are background-checked commercial license holders, and vehicles undergo mandatory 40-point safety audits before every departure.',
        display_order: 4,
        is_published: true,
        created_at: new Date().toISOString(),
      }
    ];
  }

  return data as FAQItem[];
}
