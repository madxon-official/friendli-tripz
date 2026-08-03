'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, CheckCircle2 } from 'lucide-react';
import { contactFormSchema, ContactFormValues } from '@/lib/validations/discovery';
import { Card } from '@/components/v3/ui/Card';
import { Input } from '@/components/v3/ui/Input';
import { Select } from '@/components/v3/ui/Select';
import { Button } from '@/components/v3/ui/Button';

export function ContactFormWidget() {
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

  if (submitted) {
    return (
      <Card variant="outline" padding="lg" className="bg-surface-50 border border-brand-orange/20 text-center py-12 space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-heading-md font-heading font-bold text-surface-900">
          Message Received!
        </h3>
        <p className="text-body-md text-surface-600 max-w-md mx-auto">
          Our travel team will get back to you on WhatsApp within 2 hours.
        </p>
      </Card>
    );
  }

  return (
    <Card variant="elevated" padding="lg" className="bg-white border border-surface-200 space-y-6">
      <h3 className="text-heading-md font-heading font-bold text-surface-900">
        Send Us a Message
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="e.g. Rahul Sharma"
          {...register('name')}
          error={errors.name?.message}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="WhatsApp Number"
            placeholder="+91 98765 43210"
            {...register('phone')}
            error={errors.phone?.message}
          />
          <Input
            label="Email Address"
            placeholder="rahul@example.com"
            {...register('email')}
            error={errors.email?.message}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Preferred Destination"
            options={[
              { value: 'Kodaikanal', label: 'Kodaikanal' },
              { value: 'Ooty', label: 'Ooty' },
              { value: 'Coorg', label: 'Coorg' },
              { value: 'Munnar', label: 'Munnar' },
              { value: 'Custom', label: 'Custom / Other' },
            ]}
            {...register('destination')}
          />
          <Input
            label="Travellers Count"
            type="number"
            {...register('travellerCount', { valueAsNumber: true })}
            error={errors.travellerCount?.message}
          />
        </div>

        <Input
          label="Trip Notes / Special Requests"
          placeholder="Tell us about preferred dates, budget, or group preferences..."
          {...register('notes')}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
          icon={<Send className="w-4 h-4" />}
        >
          {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
        </Button>
      </form>
    </Card>
  );
}
