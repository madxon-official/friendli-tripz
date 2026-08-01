'use client';

import React from 'react';
import { Container } from '@/components/v3/ui/Container';
import { SectionHeading } from '@/components/v3/ui/SectionHeading';
import { Accordion } from '@/components/v3/ui/Accordion';
import { FAQ_ITEMS } from '@/lib/data/trips';

export function FAQSection() {
  const accordionItems = FAQ_ITEMS.map((faq) => ({
    id: faq.id,
    title: faq.question,
    content: faq.answer,
  }));

  return (
    <section className="py-section-sm sm:py-section bg-white border-b border-surface-200/40">
      <Container size="narrow">
        <SectionHeading
          badge="GOT QUESTIONS?"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about joining a Friendli Trip."
          centered
        />

        <Accordion
          items={accordionItems}
          defaultOpen="faq-1"
          variant="card"
        />
      </Container>
    </section>
  );
}
