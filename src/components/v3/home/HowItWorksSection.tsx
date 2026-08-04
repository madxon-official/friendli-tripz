import React from 'react';
import { Sparkles, Compass, CheckCircle2, HeartHandshake } from 'lucide-react';
import { Container } from '@/components/v3/ui/Container';
import { SectionHeading } from '@/components/v3/ui/SectionHeading';
import { HOW_IT_WORKS_V2 } from '@/lib/data/trips';

const iconMap: Record<string, React.ElementType> = {
  Sparkles, Compass, CheckCircle2, HeartHandshake,
};

export function HowItWorksSection() {
  return (
    <section className="py-section-sm sm:py-section bg-white border-b border-surface-200/40">
      <Container size="narrow">
        <SectionHeading
          badge="FOUR SIMPLE STEPS"
          title="How It Works"
          subtitle="Simple steps to your next escape."
          centered
        />

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-px bg-surface-200/60 -translate-x-1/2" />

          <div className="space-y-8 sm:space-y-12">
            {HOW_IT_WORKS_V2.map((step, index) => {
              const IconComp = iconMap[step.icon] || Sparkles;
              const isEven = index % 2 === 0;

              return (
                <div key={step.step} className="relative">
                  {/* Mobile layout (stacked) */}
                  <div className="flex items-start gap-5 sm:hidden">
                    <div className="relative shrink-0">
                      <div className="w-14 h-14 rounded-card bg-brand-navy flex items-center justify-center text-white shadow-card">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-brand-orange text-white text-[10px] font-extrabold flex items-center justify-center">
                        {step.step}
                      </div>
                    </div>
                    <div className="pt-1">
                      <h3 className="text-heading-sm font-heading font-extrabold text-brand-navy">
                        {step.title}
                      </h3>
                      <p className="text-body-sm text-brand-muted mt-1 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Desktop layout (alternating) */}
                  <div className="hidden sm:grid grid-cols-2 gap-12 items-center">
                    {/* Left side */}
                    <div className={`text-right ${!isEven ? 'order-2 text-left' : ''}`}>
                      <h3 className="text-heading font-heading font-extrabold text-brand-navy">
                        {step.title}
                      </h3>
                      <p className="text-body-sm text-brand-muted mt-2 leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Center dot */}
                    <div className={`relative flex ${isEven ? 'justify-start' : 'justify-end order-1'}`}>
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-card bg-brand-navy flex items-center justify-center text-white shadow-elevated z-10">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 -mt-8 -ml-8 rounded-full bg-brand-orange text-white text-caption font-extrabold flex items-center justify-center z-20">
                        {step.step}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}

