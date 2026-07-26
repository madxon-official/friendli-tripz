import { HeroSection } from '@/components/home/HeroSection';
import { QuickTripInfoSection } from '@/components/home/QuickTripInfoSection';
import { ExperienceIntroSection } from '@/components/home/ExperienceIntroSection';
import { WhyFriendliSection } from '@/components/home/WhyFriendliSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { KodaikanalPreviewSection } from '@/components/home/KodaikanalPreviewSection';
import { CustomizationTeaserSection } from '@/components/home/CustomizationTeaserSection';
import { FutureJourneySection } from '@/components/home/FutureJourneySection';
import { FinalCTASection } from '@/components/home/FinalCTASection';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <QuickTripInfoSection />
      <ExperienceIntroSection />
      <WhyFriendliSection />
      <HowItWorksSection />
      <KodaikanalPreviewSection />
      <CustomizationTeaserSection />
      <FutureJourneySection />
      <FinalCTASection />
    </main>
  );
}
