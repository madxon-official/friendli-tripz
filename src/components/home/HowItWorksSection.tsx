import React from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { HowItWorksStep } from '@/components/ui/HowItWorksStep';
import { HOW_IT_WORKS_STEPS } from '@/lib/data/trips';

export const HowItWorksSection: React.FC = () => {
  return (
    <Section variant="warm" id="how-it-works">
      <Container>
        <SectionHeading
          eyebrow="Simple Process"
          title="How it works"
          subtitle="From your first tap to arriving in the mist — here is how your Friendli trip comes together."
        />

        <div className="relative py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {HOW_IT_WORKS_STEPS.map((step, idx) => (
              <HowItWorksStep
                key={step.stepNumber}
                step={step}
                isLast={idx === HOW_IT_WORKS_STEPS.length - 1}
              />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
};
