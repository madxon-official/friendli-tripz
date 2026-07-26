import React from 'react';
import { Container } from '@/components/ui/Container';
import { TripQuickInfo } from '@/components/ui/TripQuickInfo';
import { KODAIKANAL_TRIP } from '@/lib/data/trips';

export const QuickTripInfoSection: React.FC = () => {
  return (
    <div className="relative -mt-4 sm:-mt-8 mb-12 sm:mb-16 z-20">
      <Container>
        <TripQuickInfo trip={KODAIKANAL_TRIP} />
      </Container>
    </div>
  );
};
