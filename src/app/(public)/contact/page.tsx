'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Clock, Instagram } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema, ContactFormValues } from '@/lib/validations/discovery';
import { Container } from '@/components/v3/ui/Container';
import { Badge } from '@/components/v3/ui/Badge';
import { Card } from '@/components/v3/ui/Card';
import { Input } from '@/components/v3/ui/Input';
import { Select } from '@/components/v3/ui/Select';
import { Button } from '@/components/v3/ui/Button';
import { BRAND_INFO } from '@/lib/data/trips';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema) as any,
    defaultValues: {
      travellerCount: 2,
      destination: 'Kodaikanal',
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 bg-gradient-brand overflow-hidden">
        <div className="absolute inset-0 bg-pattern-dots opacity-5" />
        <Container className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto space-y-4"
          >
            <Badge variant="brand" size="sm" icon={<Mail className="w-3.5 h-3.5" />}>
              We&apos;re Here to Help
            </Badge>
            <h1 className="text-display sm:text-display-lg font-heading font-extrabold text-white">
              Get in Touch
            </h1>
            <p className="text-body-lg text-white/70 max-w-xl mx-auto">
              Have a question, custom trip request, or group booking? Our travel planning desk is just a message away.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Contact Section */}
      <section className="py-section-sm sm:py-section bg-surface-50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info Cards */}
            <div className="space-y-5">
              {/* Quick Contact Card */}
              <Card variant="elevated" padding="lg" className="bg-brand-navy !text-white !border-brand-navy-dark">
                <h3 className="text-heading font-heading font-extrabold text-brand-orange mb-6">
                  Contact Info
                </h3>
                <div className="space-y-5">
                  {[
                    { icon: Phone, label: '+91 94301 87000', sub: 'Mon–Sun: 9 AM – 9 PM', href: 'tel:+919430187000' },
                    { icon: Mail, label: BRAND_INFO.contactEmail, sub: '24/7 Response', href: `mailto:${BRAND_INFO.contactEmail}` },
                    { icon: MapPin, label: 'Friendli Travel HQ', sub: 'Kodaikanal, Tamil Nadu' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-button bg-white/10 flex items-center justify-center shrink-0">
                        <item.icon className="w-4 h-4 text-brand-orange" />
                      </div>
                      <div>
                        {item.href ? (
                          <a href={item.href} className="text-body-sm font-bold text-white hover:text-brand-orange transition-colors">
                            {item.label}
                          </a>
                        ) : (
                          <span className="text-body-sm font-bold text-white">{item.label}</span>
                        )}
                        <span className="text-caption text-white/50 block">{item.sub}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social */}
                <div className="pt-6 mt-6 border-t border-white/10 flex items-center gap-3">
                  <a href={BRAND_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-button bg-emerald-500/20 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/30 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                  </a>
                  <a href={BRAND_INFO.instagramUrl} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-button bg-white/10 flex items-center justify-center text-white/70 hover:text-brand-orange transition-colors">
                    <Instagram className="w-4 h-4" />
                  </a>
                </div>
              </Card>

              {/* Response Time Card */}
              <Card variant="default" padding="md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-button bg-emerald-50 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <span className="text-body-sm font-bold text-brand-navy block">Average Response Time</span>
                    <span className="text-caption text-brand-muted">Under 30 minutes</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <Card variant="elevated" padding="lg">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16 space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h3 className="text-heading font-heading font-extrabold text-brand-navy">
                      Enquiry Submitted!
                    </h3>
                    <p className="text-body-sm text-brand-muted max-w-sm mx-auto">
                      Thank you! Our travel expert will contact you within 30 minutes with a personalised response.
                    </p>
                    <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                      Submit Another Enquiry
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Input
                        label="Full Name"
                        placeholder="Rahul Sharma"
                        error={errors.name?.message}
                        {...register('name')}
                      />
                      <Input
                        label="Email Address"
                        placeholder="rahul@example.com"
                        error={errors.email?.message}
                        {...register('email')}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Input
                        label="Phone Number"
                        placeholder="+91 98765 43210"
                        error={errors.phone?.message}
                        {...register('phone')}
                      />
                      <div className="space-y-1.5">
                        <label className="block text-overline text-brand-muted uppercase">Destination</label>
                        <select
                          {...register('destination')}
                          className="w-full bg-surface-50 border border-surface-200 px-4 py-3 text-body-sm rounded-card transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange focus:bg-white"
                        >
                          <option value="Kodaikanal">Kodaikanal</option>
                          <option value="Ooty">Ooty</option>
                          <option value="Wayanad">Wayanad</option>
                          <option value="Coorg">Coorg</option>
                          <option value="Munnar">Munnar</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-overline text-brand-muted uppercase">Special Requirements</label>
                      <textarea
                        {...register('notes')}
                        rows={4}
                        className="w-full bg-surface-50 border border-surface-200 px-4 py-3 text-body-sm rounded-card transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange focus:bg-white placeholder:text-brand-muted/60"
                        placeholder="Preferred dates, hotel choices, group size, or any special requests..."
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      loading={isSubmitting}
                      icon={<Send className="w-4 h-4" />}
                    >
                      Submit Travel Request
                    </Button>
                  </form>
                )}
              </Card>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
