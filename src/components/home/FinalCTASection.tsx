import React from 'react';
import { ArrowRight, Mountain } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/lib/routes';

export const FinalCTASection: React.FC = () => {
  return (
    <Section variant="warm" className="py-16 sm:py-24">
      <Container>
        <div className="bg-gradient-to-br from-brand-navy to-brand-navy-dark rounded-3xl p-8 sm:p-14 text-center text-white relative overflow-hidden shadow-card">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-brand-orange/20 text-brand-orange mx-auto flex items-center justify-center border border-brand-orange/30">
              <Mountain className="w-7 h-7" />
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-heading">
              Ready for the hills?
            </h2>

            <p className="text-base sm:text-xl text-slate-200 leading-relaxed">
              Kodaikanal is calling. Bring your backpack — we&apos;ll help with the rest.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                href={ROUTES.CUSTOMIZE}
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
              >
                Join the Trip
              </Button>
              <Button
                href={ROUTES.CUSTOMIZE}
                variant="white"
                size="lg"
              >
                Customize My Trip
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};
