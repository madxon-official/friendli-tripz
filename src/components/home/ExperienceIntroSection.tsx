import React from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ExperienceCard } from '@/components/ui/ExperienceCard';
import { EXPERIENCE_FEATURES } from '@/lib/data/trips';

export const ExperienceIntroSection: React.FC = () => {
  return (
    <Section variant="white" id="experience">
      <Container>
        <SectionHeading
          eyebrow="The Experience"
          title="Not just another Kodaikanal package."
          subtitle="The best trips aren't remembered because of how many places you checked off a list. They're remembered because of the roads, conversations, unexpected moments and people you shared them with."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {EXPERIENCE_FEATURES.map((feature) => (
            <ExperienceCard key={feature.id} feature={feature} />
          ))}
        </div>
      </Container>
    </Section>
  );
};
