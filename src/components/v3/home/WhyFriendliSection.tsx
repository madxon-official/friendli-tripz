import React from 'react';
import { ShieldCheck, Compass, UserCheck, Car, Users, Smile, Headphones, Calendar, Receipt } from 'lucide-react';
import { Container } from '@/components/v3/ui/Container';
import { SectionHeading } from '@/components/v3/ui/SectionHeading';
import { Card } from '@/components/v3/ui/Card';
import { WHY_FRIENDLI_V2 } from '@/lib/data/trips';

const iconMap: Record<string, React.ElementType> = {
  ShieldCheck, Compass, UserCheck, Car, Users, Smile, Headphones, Calendar, Receipt,
};

function TrustCard({
  title,
  description,
  iconName,
}: {
  title: string;
  description: string;
  iconName: string;
}) {
  const IconComp = iconMap[iconName] || ShieldCheck;

  return (
    <div>
      <Card variant="interactive" padding="lg" className="h-full group">
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-card bg-brand-soft-orange flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-300">
            <IconComp className="w-5 h-5" />
          </div>
          <h3 className="text-heading-sm font-heading font-extrabold text-brand-navy">
            {title}
          </h3>
          <p className="text-body-sm text-brand-muted leading-relaxed">
            {description}
          </p>
        </div>
      </Card>
    </div>
  );
}

export function WhyFriendliSection() {
  return (
    <section className="py-section-sm sm:py-section bg-surface-50 border-b border-surface-200/40">
      <Container>
        <SectionHeading
          badge="THE FRIENDLI DIFFERENCE"
          title="Why Travel Friendli?"
          subtitle="We handle the details. You collect the moments."
          centered
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_FRIENDLI_V2.map((item) => (
            <TrustCard
              key={item.id}
              title={item.title}
              description={item.description}
              iconName={item.iconName}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

