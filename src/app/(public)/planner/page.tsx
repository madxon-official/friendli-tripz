'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, ArrowRight, ArrowLeft, Loader2, CheckCircle2,
  MapPin, Calendar, Wallet, Heart, Users, Gauge, Home, Utensils,
  Compass,
} from 'lucide-react';
import { processAIPlannerPrompt } from '@/lib/actions/ai_planner';
import { AIPlannerResponse } from '@/lib/types/ai';
import { ItineraryTimeline } from '@/components/public/ItineraryTimeline';
import { AIExplainBadge } from '@/components/public/AIExplainBadge';
import Link from 'next/link';
import { Container } from '@/components/v3/ui/Container';
import { Badge } from '@/components/v3/ui/Badge';
import { Card } from '@/components/v3/ui/Card';
import { Button } from '@/components/v3/ui/Button';
import { GradientButton } from '@/components/v3/ui/GradientButton';

const STEPS = [
  {
    id: 'destination',
    label: 'Where',
    icon: MapPin,
    title: 'Where do you want to go?',
    options: ['Kodaikanal', 'Ooty', 'Coorg', 'Munnar', 'Wayanad', 'Surprise me!'],
  },
  {
    id: 'duration',
    label: 'When',
    icon: Calendar,
    title: 'How many days?',
    options: ['2 Days', '3 Days', '4 Days', '5 Days', '7 Days'],
  },
  {
    id: 'budget',
    label: 'Budget',
    icon: Wallet,
    title: "What's your budget per person?",
    options: ['Under ₹8,000', '₹8,000 – ₹12,000', '₹12,000 – ₹18,000', '₹18,000+', 'No limit'],
  },
  {
    id: 'interests',
    label: 'Interests',
    icon: Heart,
    title: 'What excites you?',
    options: ['Waterfalls', 'Trekking', 'Campfire', 'Photography', 'Café hopping', 'Wildlife', 'Local food', 'Relaxation'],
    multi: true,
  },
  {
    id: 'group',
    label: 'Group',
    icon: Users,
    title: 'Who are you travelling with?',
    options: ['Solo', 'Couple', 'Friends', 'Family', 'Corporate team'],
  },
  {
    id: 'pace',
    label: 'Pace',
    icon: Gauge,
    title: 'What pace do you prefer?',
    options: ['Relaxed — lots of free time', 'Moderate — balanced', 'Adventure — packed schedule'],
  },
  {
    id: 'accommodation',
    label: 'Stay',
    icon: Home,
    title: 'Accommodation style?',
    options: ['Budget-friendly', 'Boutique / Mid-range', 'Luxury / Premium', 'Camping / Glamping'],
  },
  {
    id: 'food',
    label: 'Food',
    icon: Utensils,
    title: 'Food preferences?',
    options: ['Vegetarian', 'Non-vegetarian', 'Both / No preference', 'Vegan'],
  },
];

export default function AIPlannerPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string | string[]>>({});
  const [loading, setLoading] = useState(false);
  const [plannerResult, setPlannerResult] = useState<AIPlannerResponse | null>(null);

  const step = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const handleSelect = (value: string) => {
    if (step.multi) {
      const current = (selections[step.id] as string[]) || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      setSelections({ ...selections, [step.id]: updated });
    } else {
      setSelections({ ...selections, [step.id]: value });
      // Auto-advance for single-select
      if (!isLastStep) {
        setTimeout(() => setCurrentStep((s) => s + 1), 300);
      }
    }
  };

  const isSelected = (value: string) => {
    const sel = selections[step.id];
    if (Array.isArray(sel)) return sel.includes(value);
    return sel === value;
  };

  const handleGenerate = async () => {
    setLoading(true);
    // Build a natural language prompt from selections
    const parts = Object.entries(selections)
      .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
      .join('. ');
    const prompt = `Plan a trip with these preferences: ${parts}`;
    const result = await processAIPlannerPrompt(prompt, 2);
    setPlannerResult(result);
    setLoading(false);
  };

  return (
    <main className="min-h-screen">
      {/* Hero Header */}
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 bg-gradient-brand overflow-hidden">
        <div className="absolute inset-0 bg-pattern-dots opacity-5" />
        <Container className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto space-y-4"
          >
            <Badge variant="brand" size="sm" icon={<Sparkles className="w-3.5 h-3.5 animate-pulse" />}>
              AI Trip Planner
            </Badge>
            <h1 className="text-display sm:text-display-lg font-heading font-extrabold text-white">
              Plan Your{' '}
              <span className="text-gradient-warm inline-block">Dream Trip</span>
            </h1>
            <p className="text-body-lg text-white/70 max-w-xl mx-auto">
              Answer 8 quick questions and we&apos;ll build a personalised itinerary just for you.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Planner Flow */}
      <section className="py-section-sm sm:py-section bg-surface-50">
        <Container size="narrow">
          {!plannerResult ? (
            <Card variant="elevated" padding="none" className="overflow-hidden">
              {/* Progress Bar */}
              <div className="h-1.5 bg-surface-100">
                <motion.div
                  className="h-full bg-gradient-to-r from-brand-orange to-[#FF8533] rounded-r-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>

              {/* Step Indicator */}
              <div className="px-6 pt-6 pb-4 border-b border-surface-200/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-button bg-brand-orange text-white flex items-center justify-center">
                      <step.icon className="w-4 h-4" />
                    </div>
                    <span className="text-overline text-brand-muted">
                      STEP {currentStep + 1} OF {STEPS.length}
                    </span>
                  </div>
                  <span className="text-caption text-brand-muted font-bold">
                    {step.label}
                  </span>
                </div>
              </div>

              {/* Step Content */}
              <div className="p-6 sm:p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h2 className="text-heading font-heading font-extrabold text-brand-navy">
                      {step.title}
                    </h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {step.options.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleSelect(option)}
                          className={`p-4 rounded-card border-2 text-left transition-all duration-200 ${
                            isSelected(option)
                              ? 'border-brand-orange bg-brand-soft-orange text-brand-navy shadow-sm'
                              : 'border-surface-200 bg-white text-brand-text hover:border-brand-orange/40 hover:bg-surface-50'
                          }`}
                        >
                          <span className="text-body-sm font-bold block">{option}</span>
                          {isSelected(option) && (
                            <CheckCircle2 className="w-4 h-4 text-brand-orange mt-1" />
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation */}
              <div className="px-6 sm:px-8 pb-6 sm:pb-8 flex items-center justify-between gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
                  disabled={currentStep === 0}
                  icon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>

                {step.multi && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      if (isLastStep) {
                        handleGenerate();
                      } else {
                        setCurrentStep((s) => s + 1);
                      }
                    }}
                    disabled={!selections[step.id] || (Array.isArray(selections[step.id]) && (selections[step.id] as string[]).length === 0)}
                    iconRight={<ArrowRight className="w-4 h-4" />}
                  >
                    {isLastStep ? 'Generate Itinerary' : 'Next'}
                  </Button>
                )}

                {!step.multi && isLastStep && selections[step.id] && (
                  <GradientButton
                    onClick={handleGenerate}
                    variant="orange"
                    size="md"
                    icon={<Sparkles className="w-4 h-4" />}
                  >
                    Generate Itinerary
                  </GradientButton>
                )}
              </div>

              {/* Loading Overlay */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-20 rounded-card-lg"
                >
                  <Loader2 className="w-10 h-10 text-brand-orange animate-spin mb-4" />
                  <p className="text-heading-sm font-heading font-bold text-brand-navy">
                    Building your perfect trip...
                  </p>
                  <p className="text-body-sm text-brand-muted mt-1">
                    Analyzing preferences and matching packages
                  </p>
                </motion.div>
              )}
            </Card>
          ) : (
            /* Result */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Result Header */}
              <Card variant="elevated" padding="lg">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="success" size="sm" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                        Itinerary Ready
                      </Badge>
                      <AIExplainBadge explanations={plannerResult.explanations} />
                    </div>
                    <h2 className="text-heading font-heading font-extrabold text-brand-navy">
                      Your Custom {plannerResult.constraints.durationDays}-Day Itinerary
                    </h2>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-caption text-brand-muted block">Total Cost</span>
                      <span className="text-heading font-heading font-extrabold text-brand-navy">
                        ₹{plannerResult.totalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <GradientButton
                      href={`/checkout/${plannerResult.instanceId}`}
                      variant="orange"
                      size="md"
                    >
                      Book This Plan
                    </GradientButton>
                  </div>
                </div>
              </Card>

              {/* Itinerary Timeline */}
              <ItineraryTimeline itinerary={plannerResult.itinerary} />

              {/* Actions */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setPlannerResult(null);
                    setCurrentStep(0);
                    setSelections({});
                  }}
                  icon={<ArrowLeft className="w-4 h-4" />}
                >
                  Start Over
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  href="/contact"
                >
                  Talk to an Expert
                </Button>
              </div>
            </motion.div>
          )}
        </Container>
      </section>
    </main>
  );
}
