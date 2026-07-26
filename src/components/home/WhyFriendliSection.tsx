import React from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { WHY_FRIENDLI_PRINCIPLES } from '@/lib/data/trips';

export const WhyFriendliSection: React.FC = () => {
  return (
    <Section variant="soft-navy" id="why-friendli" className="scroll-mt-16 sm:scroll-mt-20">
      <Container>
        <SectionHeading
          eyebrow="Our Principles"
          title="Why travel Friendli?"
          subtitle="We designed Friendli Tripz to eliminate travel friction, awkward group dynamics, and rushed itineraries."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_FRIENDLI_PRINCIPLES.map((principle) => (
            <FeatureCard key={principle.id} principle={principle} />
          ))}
        </div>
      </Container>
    </Section>
  );
};
