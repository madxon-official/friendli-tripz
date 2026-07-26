'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, MessageCircle, Copy, Check, ShieldCheck, Loader2 } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ROUTES } from '@/lib/routes';
import { trackEvent } from '@/lib/analytics';

function EnquirySuccessContent() {
  const searchParams = useSearchParams();

  const [ref, setRef] = useState<string>('FT-KOD-DEMO01');
  const [name, setName] = useState<string>('Traveller');
  const [count, setCount] = useState<string>('2');
  const [date, setDate] = useState<string>('Flexible');
  const [city, setCity] = useState<string>('Not specified');
  const [copied, setCopied] = useState(false);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';

  useEffect(() => {
    const qRef = searchParams.get('ref');
    const qName = searchParams.get('name');
    const qCount = searchParams.get('count');
    const qDate = searchParams.get('date');
    const qCity = searchParams.get('city');

    if (qRef) setRef(qRef);

    if (qRef && typeof window !== 'undefined') {
      const cached = sessionStorage.getItem(`enquiry_${qRef}`);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed.name) setName(parsed.name);
          if (parsed.travellerCount) setCount(String(parsed.travellerCount));
          if (parsed.preferredDate) setDate(parsed.preferredDate);
          if (parsed.startingLocation) setCity(parsed.startingLocation);
        } catch {
          // fallback to searchParams
        }
      }
    }

    if (qName) setName(qName);
    if (qCount) setCount(qCount);
    if (qDate) setDate(qDate);
    if (qCity) setCity(qCity);
  }, [searchParams]);

  const rawMsg = `Hi Friendli Tripz! 👋\n\nI've submitted a Kodaikanal trip enquiry.\n\nReference: ${ref}\nName: ${name}\nTravellers: ${count}\nPreferred date: ${date}\nStarting from: ${city}\n\nI'd like to know the next steps.`;
  const encodedMsg = encodeURIComponent(rawMsg);
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/[\s\+]/g, '')}?text=${encodedMsg}`
    : '#';

  const handleWhatsAppClick = () => {
    trackEvent('whatsapp_continue_clicked', { reference: ref });
  };

  const copyRef = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(ref);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl p-6 sm:p-12 border border-brand-border/60 shadow-card text-center space-y-6 relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <Badge variant="orange" className="uppercase tracking-wider font-mono text-xs">
            ✓ Enquiry Received
          </Badge>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-brand-navy font-heading">
            Your Kodaikanal enquiry is in! 🎒
          </h1>

          <p className="text-brand-muted text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
            We&apos;ve received your trip preferences. Our Friendli team will review them and continue the conversation with you personally.
          </p>
        </div>

        <div className="bg-brand-soft-navy/80 rounded-2xl p-5 border border-brand-navy/10 max-w-md mx-auto text-left space-y-3">
          <div className="flex items-center justify-between border-b border-brand-navy/10 pb-2">
            <span className="text-xs font-bold text-brand-muted uppercase tracking-wider font-mono">
              Enquiry Reference
            </span>
            <button
              onClick={copyRef}
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-orange hover:underline"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="font-mono text-xl sm:text-2xl font-black text-brand-navy tracking-wider">
            {ref}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1 text-brand-navy/80">
            <div>
              <span className="text-brand-muted block">Traveller</span>
              <span className="font-semibold">{name} ({count})</span>
            </div>
            <div>
              <span className="text-brand-muted block">Preferred Date</span>
              <span className="font-semibold">{date}</span>
            </div>
          </div>
        </div>

        <div className="text-left pt-4 border-t border-brand-border/60 space-y-4">
          <h2 className="text-base font-bold text-brand-navy font-heading uppercase tracking-wider">
            What happens next?
          </h2>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-brand-warm border border-brand-border/40">
              <span className="w-6 h-6 rounded-full bg-brand-navy text-white font-bold flex items-center justify-center text-xs shrink-0 font-mono">
                01
              </span>
              <div>
                <span className="font-bold text-brand-navy block">We review your preferences</span>
                <span className="text-brand-muted">Our team checks stay and transport options for your dates.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-brand-warm border border-brand-border/40">
              <span className="w-6 h-6 rounded-full bg-brand-navy text-white font-bold flex items-center justify-center text-xs shrink-0 font-mono">
                02
              </span>
              <div>
                <span className="font-bold text-brand-navy block">We check the trip requirements</span>
                <span className="text-brand-muted">We confirm availability for your group size.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-brand-soft-orange border border-brand-orange/20">
              <span className="w-6 h-6 rounded-full bg-brand-orange text-white font-bold flex items-center justify-center text-xs shrink-0 font-mono">
                03
              </span>
              <div>
                <span className="font-bold text-brand-navy block">We continue with you personally</span>
                <span className="text-brand-muted">We connect over WhatsApp to finalize itinerary and pricing.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 space-y-3">
          {whatsappNumber ? (
            <Button
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
              variant="primary"
              size="lg"
              className="w-full justify-center text-base"
              icon={<MessageCircle className="w-5 h-5 fill-white/20" />}
            >
              Continue on WhatsApp →
            </Button>
          ) : (
            <div className="space-y-2">
              <button
                disabled
                className="w-full py-3.5 px-6 rounded-xl bg-gray-200 text-gray-500 font-semibold cursor-not-allowed text-center text-sm"
              >
                Continue on WhatsApp →
              </button>
              <p className="text-xs text-brand-muted italic">
                WhatsApp contact will be available shortly.
              </p>
            </div>
          )}

          <Button href={ROUTES.HOME} variant="ghost" size="md" className="w-full justify-center">
            Back to Home
          </Button>
        </div>

        <div className="pt-2 flex items-center justify-center gap-1.5 text-xs text-brand-muted">
          <ShieldCheck className="w-4 h-4 text-brand-orange shrink-0" />
          <span>No payment has been taken. Submitting an enquiry does not confirm a booking.</span>
        </div>
      </div>
    </div>
  );
}

export default function EnquirySuccessPage() {
  return (
    <main className="min-h-screen pb-16 pt-8 sm:pt-12">
      <Container>
        <Suspense
          fallback={
            <div className="py-20 text-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-brand-orange mx-auto" />
              <p className="text-sm text-brand-muted font-medium">Loading your enquiry status...</p>
            </div>
          }
        >
          <EnquirySuccessContent />
        </Suspense>
      </Container>
    </main>
  );
}
