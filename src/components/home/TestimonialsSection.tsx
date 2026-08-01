import React from 'react';
import Image from 'next/image';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  tripName: string;
  comment: string;
  rating: number;
  avatarUrl: string;
  verifiedCohort: boolean;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Ananya Krishnan',
    role: 'Software Engineer',
    location: 'Bangalore',
    tripName: 'Misty Kodaikanal Escape',
    comment:
      'I was hesitant to join a group trip solo, but Friendli Tripz made it completely seamless! The bungalow stay in Kodai was stunning, and our cohort bonded over bonfires and morning hikes. Unforgettable weekend!',
    rating: 5,
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    verifiedCohort: true,
  },
  {
    id: '2',
    name: 'Rahul & Friends',
    role: 'College Cohort',
    location: 'Chennai',
    tripName: 'Kodaikanal Private Group',
    comment:
      'Zero drama, no hidden cab fares, and instant WhatsApp support throughout the trip. The driver was super polite and our Tour Captain handled every entry ticket smoothly.',
    rating: 5,
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    verifiedCohort: true,
  },
  {
    id: '3',
    name: 'Priya & Karthik',
    role: 'Product Designer',
    location: 'Hyderabad',
    tripName: 'Hill Bungalow Getaway',
    comment:
      'The offline pass saved us when network dropped near Pillar Rocks. Everything was cryptographically verified and our hotel check-in took 30 seconds. Truly a modern travel experience.',
    rating: 5,
    avatarUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    verifiedCohort: true,
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-brand-soft-navy/30 relative overflow-hidden border-y border-brand-border/40">
      <Container>
        <SectionHeading
          eyebrow="Pilot Cohort Stories · Early Member Feedback"
          title="Loved by Social Travellers"
          subtitle="Hear sample feedback from our pilot weekend departures and early community members."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-12">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border/60 shadow-card hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-brand-orange/15 group-hover:text-brand-orange/30 transition-colors" />

              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-sm sm:text-base text-brand-navy/90 leading-relaxed italic mb-6">
                  "{t.comment}"
                </p>
              </div>

              {/* Author Lockup */}
              <div className="pt-4 border-t border-brand-border/50 flex items-center gap-3.5">
                <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border-2 border-brand-orange/40">
                  <Image
                    src={t.avatarUrl}
                    alt={t.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-heading font-extrabold text-sm text-brand-navy">
                      {t.name}
                    </h4>
                    {t.verifiedCohort && (
                      <span title="Verified Traveller">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-brand-muted">
                    {t.role} · {t.location}
                  </p>
                  <span className="text-[10px] font-bold text-brand-orange uppercase tracking-wider block font-mono mt-0.5">
                    {t.tripName}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
