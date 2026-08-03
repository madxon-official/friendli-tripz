import React from 'react';
import Image from 'next/image';
import { ShieldCheck, HeartHandshake, Sparkles, Compass, Users, Mountain, Heart, Target } from 'lucide-react';
import { Container } from '@/components/v3/ui/Container';
import { Badge } from '@/components/v3/ui/Badge';
import { Card } from '@/components/v3/ui/Card';
import { GradientButton } from '@/components/v3/ui/GradientButton';
import { AnimatedCounter } from '@/components/v3/ui/AnimatedCounter';
import { ROUTES } from '@/lib/routes';

export const metadata = {
  title: 'About Us',
  description: 'Learn about Friendli Tripz — a travel lifestyle platform built around curated trips, great company, and unforgettable experiences.',
};

const VALUES = [
  { icon: Heart, title: 'Authenticity', description: 'No fake reviews, no hidden charges. Every stay and route is physically verified by our team.' },
  { icon: ShieldCheck, title: 'Radical Transparency', description: 'Clear per-person pricing, explicit inclusion manifests, and real-time trip status.' },
  { icon: Users, title: 'Community First', description: 'We build trips around people, not just places. Every group is curated for a great social experience.' },
  { icon: Target, title: 'Operational Excellence', description: 'Frictionless logistics from pickup to drop — verified vehicles, local guides, and 24/7 support.' },
  { icon: Mountain, title: 'Empathy for Travellers', description: 'Technology exists to serve human joy, not to create digital barriers between you and your next adventure.' },
  { icon: HeartHandshake, title: 'Human Support', description: 'When you need help, you talk to real people — not chatbots or support ticket mazes.' },
];

const STATS = [
  { value: 2400, suffix: '+', label: 'Happy Travellers' },
  { value: 12, suffix: '+', label: 'Destinations' },
  { value: 120, suffix: '+', label: 'Trips Completed' },
  { value: 4.9, suffix: '', label: 'Average Rating', isDecimal: true },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 bg-gradient-brand overflow-hidden">
        <div className="absolute inset-0 bg-pattern-dots opacity-5" />
        <Container className="relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <Badge variant="brand" size="sm" icon={<Sparkles className="w-3.5 h-3.5" />}>
              Our Story
            </Badge>
            <h1 className="text-display sm:text-display-lg font-heading font-extrabold text-white">
              Travel is better{' '}
              <span className="text-gradient-warm inline-block">together</span>
            </h1>
            <p className="text-body-lg text-white/70 max-w-xl mx-auto">
              We exist to restore joy, safety, and effortless connection to group travel. No more planning stress. Just show up and vibe.
            </p>
          </div>
        </Container>
      </section>

      {/* Stats Bar */}
      <section className="py-10 bg-white border-b border-surface-200/40">
        <Container>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-display font-heading font-extrabold text-brand-navy">
                  {stat.isDecimal ? (
                    <span>{stat.value}{stat.suffix}</span>
                  ) : (
                    <AnimatedCounter end={stat.value as number} suffix={stat.suffix} />
                  )}
                </div>
                <div className="text-caption text-brand-muted font-bold uppercase tracking-wider mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Our Story */}
      <section className="py-section-sm sm:py-section bg-surface-50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="brand" size="xs">WHY WE STARTED</Badge>
              <h2 className="text-heading-xl sm:text-display font-heading font-extrabold text-brand-navy">
                Born from a trip gone wrong
              </h2>
              <div className="space-y-4 text-body text-brand-muted leading-relaxed">
                <p>
                  The spark for Friendli Tripz came during a trip to Kodaikanal. A group of friends faced misleading hotel photos, uncommunicative driver services, and surprise hidden charges for basic sightseeing routes.
                </p>
                <p>
                  We realised millions of young professionals and friend groups face the exact same frustration every weekend. So we set out to build a platform that handles every moving piece — from curated itineraries to live driver dispatch — so travellers can simply show up and bond.
                </p>
                <p>
                  Today, Friendli Tripz is a full-stack travel lifestyle platform serving thousands of travellers across South India, with a mission to make group travel simpler, safer, and more social.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-card-lg overflow-hidden shadow-elevated">
              <Image
                src="/destinations/kodaikanal/kodaikanal-landscape.webp"
                alt="Team at Kodaikanal"
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-section-sm sm:py-section bg-white">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="brand" size="xs">OUR VALUES</Badge>
            <h2 className="text-heading-xl sm:text-display font-heading font-extrabold text-brand-navy mt-3">
              What we stand for
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map((value) => (
              <Card key={value.title} variant="interactive" padding="lg" className="group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-card bg-brand-soft-orange flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-300">
                    <value.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-heading-sm font-heading font-extrabold text-brand-navy">
                    {value.title}
                  </h3>
                  <p className="text-body-sm text-brand-muted leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-section sm:py-section-lg bg-gradient-brand relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-dots opacity-5" />
        <Container className="relative z-10 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-display font-heading font-extrabold text-white">
              Ready to travel differently?
            </h2>
            <p className="text-body-lg text-white/70">
              Join thousands who chose memorable experiences over endless planning.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <GradientButton href={ROUTES.PACKAGES} variant="orange" size="lg" glow>
                Explore Trips
              </GradientButton>
              <GradientButton href={ROUTES.CONTACT} variant="glass" size="lg">
                Get in Touch
              </GradientButton>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
