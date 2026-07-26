'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SlidersHorizontal, Send, User, Phone, Mail, MapPin, Calendar, Users, AlertCircle, Loader2, Lock } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { trackEvent } from '@/lib/analytics';

export default function CustomizePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    destination: 'Kodaikanal, Tamil Nadu',
    travellerCount: '2',
    preferredDate: '',
    startingLocation: '',
    tripType: 'Join Friendli Group Trip',
    stayPreference: 'Comfortable',
    notes: '',
    website: '', // Honeypot field
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hasStartedForm, setHasStartedForm] = useState(false);

  useEffect(() => {
    trackEvent('enquiry_form_view');
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (!hasStartedForm) {
      setHasStartedForm(true);
      trackEvent('enquiry_form_started');
    }

    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'WhatsApp phone number is required.';
    } else {
      const cleaned = formData.phone.replace(/[\s\-\(\)]/g, '');
      const phoneRegex = /^(?:\+?91)?\d{10}$/;
      if (!phoneRegex.test(cleaned)) {
        newErrors.phone = 'Please enter a valid 10-digit mobile number.';
      }
    }

    const num = parseInt(formData.travellerCount, 10);
    if (isNaN(num) || num < 1) {
      newErrors.travellerCount = 'Number of travellers must be at least 1.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Submission failed. Please try again.');
      }

      trackEvent('enquiry_submitted', { reference: data.enquiry.reference });

      if (typeof window !== 'undefined') {
        sessionStorage.setItem(`enquiry_${data.enquiry.reference}`, JSON.stringify(data.enquiry));
      }

      const query = new URLSearchParams({
        ref: data.enquiry.reference,
        name: data.enquiry.name,
        count: String(data.enquiry.travellerCount),
        date: data.enquiry.preferredDate || 'Flexible',
        city: data.enquiry.startingLocation || 'Not specified',
      });

      router.push(`/enquiry/success?${query.toString()}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setSubmitError(message);
      trackEvent('enquiry_submission_failed', { error: message });
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen pb-16">
      <section className="bg-brand-navy text-white pt-10 pb-14 sm:pt-14 sm:pb-16 relative overflow-hidden">
        <Container>
          <div className="max-w-2xl space-y-3">
            <Badge variant="orange" className="gap-1.5">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Enquiry & Customization Flow</span>
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
              Customize Your Kodaikanal Escape
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Share your trip details below. Our Friendli team will review your enquiry and connect with you personally on WhatsApp to confirm options and details.
            </p>
          </div>
        </Container>
      </section>

      <Section variant="warm" className="pt-8 sm:pt-12">
        <Container>
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-brand-border/60 shadow-card">
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="space-y-4">
                <h3 className="font-heading font-bold text-lg text-brand-navy border-b border-brand-border/60 pb-2">
                  1. Traveller Details
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-brand-navy mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Alex Sharma"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                        errors.name ? 'border-red-500 bg-red-50/20' : 'border-brand-border'
                      } focus:border-brand-orange focus:ring-1 focus:ring-brand-orange text-sm font-medium text-brand-navy outline-none`}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{errors.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-brand-navy mb-1.5">
                      WhatsApp Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-5 h-5 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                          errors.phone ? 'border-red-500 bg-red-50/20' : 'border-brand-border'
                        } focus:border-brand-orange focus:ring-1 focus:ring-brand-orange text-sm font-medium text-brand-navy outline-none`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-600 font-medium">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-brand-navy mb-1.5">
                      Email Address <span className="text-brand-muted font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-5 h-5 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        name="email"
                        placeholder="alex@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-brand-border focus:border-brand-orange focus:ring-1 focus:ring-brand-orange text-sm font-medium text-brand-navy outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h3 className="font-heading font-bold text-lg text-brand-navy border-b border-brand-border/60 pb-2">
                  2. Trip Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-brand-navy mb-1.5">
                      Destination
                    </label>
                    <div className="relative">
                      <MapPin className="w-5 h-5 text-brand-orange absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        readOnly
                        value={formData.destination}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-brand-border bg-brand-soft-navy text-sm font-bold text-brand-navy outline-none cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-brand-navy mb-1.5">
                      Number of Travellers *
                    </label>
                    <div className="relative">
                      <Users className="w-5 h-5 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        name="travellerCount"
                        min={1}
                        required
                        value={formData.travellerCount}
                        onChange={handleInputChange}
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                          errors.travellerCount ? 'border-red-500 bg-red-50/20' : 'border-brand-border'
                        } focus:border-brand-orange focus:ring-1 focus:ring-brand-orange text-sm font-medium text-brand-navy outline-none`}
                      />
                    </div>
                    {errors.travellerCount && (
                      <p className="mt-1 text-xs text-red-600 font-medium">{errors.travellerCount}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-brand-navy mb-1.5">
                      Preferred Travel Date
                    </label>
                    <div className="relative">
                      <Calendar className="w-5 h-5 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        name="preferredDate"
                        placeholder="e.g. Next Weekend / Aug 15"
                        value={formData.preferredDate}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-brand-border focus:border-brand-orange focus:ring-1 focus:ring-brand-orange text-sm font-medium text-brand-navy outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-brand-navy mb-1.5">
                      Starting City / Pickup Location
                    </label>
                    <input
                      type="text"
                      name="startingLocation"
                      placeholder="e.g. Bengaluru / Chennai"
                      value={formData.startingLocation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-brand-border focus:border-brand-orange focus:ring-1 focus:ring-brand-orange text-sm font-medium text-brand-navy outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brand-navy mb-1.5">
                    Trip Type
                  </label>
                  <select
                    name="tripType"
                    value={formData.tripType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-brand-border focus:border-brand-orange text-sm font-medium text-brand-navy outline-none bg-white"
                  >
                    <option value="Join Friendli Group Trip">Join Friendli Group Trip</option>
                    <option value="Private Group">Private Group</option>
                    <option value="Custom Trip">Custom Trip</option>
                    <option value="Not Sure Yet">Not Sure Yet</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h3 className="font-heading font-bold text-lg text-brand-navy border-b border-brand-border/60 pb-2">
                  3. Preferences & Special Requests
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-brand-navy mb-1.5">
                    Stay Preference
                  </label>
                  <select
                    name="stayPreference"
                    value={formData.stayPreference}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-brand-border focus:border-brand-orange text-sm font-medium text-brand-navy outline-none bg-white"
                  >
                    <option value="Comfortable">Comfortable (Standard)</option>
                    <option value="Budget">Budget Friendly</option>
                    <option value="Premium">Premium / Resort</option>
                    <option value="No preference">No preference</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brand-navy mb-1.5">
                    Special Requests or Notes
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    placeholder="Tell us about room choices, food requirements, or custom questions..."
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full p-4 rounded-xl border border-brand-border focus:border-brand-orange text-sm font-medium text-brand-navy outline-none"
                  />
                </div>
              </div>

              {submitError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Submission Error</span>
                    <span>{submitError}</span>
                  </div>
                </div>
              )}

              <div className="pt-2 text-xs text-brand-muted space-y-1.5">
                <p className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                  <span>
                    By submitting, you agree that Friendli Tripz may contact you regarding this trip enquiry. Read our{' '}
                    <Link href="#" className="underline text-brand-navy font-semibold hover:text-brand-orange">
                      Privacy Policy
                    </Link>.
                  </span>
                </p>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full justify-center"
                  icon={
                    isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )
                  }
                >
                  {isSubmitting ? 'Sending your enquiry...' : 'Submit Enquiry →'}
                </Button>
              </div>
            </form>
          </div>
        </Container>
      </Section>
    </main>
  );
}
