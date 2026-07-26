import React from 'react';
import Image from 'next/image';
import { ArrowRight, MapPin, CheckCircle2 } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { KODAIKANAL_TRIP } from '@/lib/data/trips';
import { ROUTES } from '@/lib/routes';

export const KodaikanalPreviewSection: React.FC = () => {
  const highlights = [
    'Misty mornings and pine-covered roads',
    'Iconic Kodaikanal sights & mountain viewpoints',
    'Time to actually enjoy the hills',
    'A trip designed around shared memories',
  ];

  return (
    <Section variant="white" id="kodaikanal-preview">
      <Container>
        <div className="bg-brand-soft-navy/40 rounded-3xl p-6 sm:p-10 lg:p-12 border border-brand-navy/10 overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-2">
                <Badge variant="navy">THE FIRST FRIENDLI ESCAPE</Badge>
                <Badge variant="outline" className="gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                  Kodaikanal
                </Badge>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-brand-navy tracking-tight font-heading">
                {KODAIKANAL_TRIP.name}
              </h2>

              <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
                {KODAIKANAL_TRIP.tagline}
              </p>

              {/* Highlights List */}
              <div className="space-y-3 pt-2">
                {highlights.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base font-semibold text-brand-navy">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Button
                  href={ROUTES.CUSTOMIZE}
                  variant="primary"
                  size="md"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Join the Trip
                </Button>
                <Button
                  href={ROUTES.CUSTOMIZE}
                  variant="outline"
                  size="md"
                >
                  Customize My Trip
                </Button>
              </div>
            </div>

            {/* Right Gallery Grid (Local supplied Kodaikanal photos) */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              {KODAIKANAL_TRIP.galleryImages.slice(0, 3).map((img, idx) => (
                <div
                  key={idx}
                  className={`relative rounded-2xl overflow-hidden shadow-card aspect-[4/3] ${
                    idx === 0 ? 'col-span-2 aspect-[16/9]' : ''
                  }`}
                >
                  <Image
                    src={img}
                    alt="Authentic Kodaikanal landscape imagery"
                    fill
                    sizes="(max-width: 768px) 100vw, 30vw"
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};
