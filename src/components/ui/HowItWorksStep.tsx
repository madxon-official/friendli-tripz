import React from 'react';
import { HowItWorksStep as StepType } from '@/lib/types';

interface HowItWorksStepProps {
  step: StepType;
  isLast?: boolean;
}

export const HowItWorksStep: React.FC<HowItWorksStepProps> = ({ step, isLast = false }) => {
  return (
    <div className="relative flex flex-col items-center text-center group">
      {/* Route connector line for desktop */}
      {!isLast && (
        <div className="hidden lg:block absolute top-7 left-[55%] right-[-45%] h-0.5 border-t-2 border-dashed border-brand-orange/30 z-0" />
      )}

      {/* Step Circle */}
      <div className="relative z-10 w-14 h-14 rounded-2xl bg-white border-2 border-brand-orange text-brand-orange font-heading font-extrabold text-xl flex items-center justify-center shadow-card group-hover:bg-brand-orange group-hover:text-white transition-all duration-300 mb-5">
        {step.stepNumber}
      </div>

      {/* Content */}
      <h3 className="text-lg font-bold text-brand-navy mb-2">
        {step.title}
      </h3>
      <p className="text-sm text-brand-muted max-w-xs leading-relaxed">
        {step.description}
      </p>
    </div>
  );
};
